"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Upload,
  Menu,
  Home,
  FileText,
  ChevronRight,
  ChevronDown,
  List,
  Video,
  Loader2,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const GOLD = "#D4AF37";
const GOLD_GRADIENT =
  "linear-gradient(135deg, #D4AF37 0%, #F4E4BC 50%, #C9A227 100%)";

const BUCKET = "homework-files";

// YouTube video IDs по lesson_id (при клике на урок в плеере меняется видео)
const YOUTUBE_VIDEO_IDS: Record<string, string> = {
  "1.1": "dQw4w9WgXcQ",
  "1.2": "9bZkp7q19f0",
  "1.3": "kJQP7kiw5Fk",
  "2.1": "RgKAFK5djSk",
  "2.2": "fJ9rUzIMcZQ",
  "2.3": "OPf0YbXqDm0",
  "3.1": "hT_nvWreIhg",
  "3.2": "CevxZvSJLk8",
  "3.3": "JGwWNGJdvx8",
  "4.1": "9E6bSw3nBRg",
  "4.2": "SlPhMPnQ58A",
  "4.3": "3AtDnEC4zak",
  "5.1": "YQHsXMglC9A",
  "5.2": "e-ORhEE9VVg",
  "5.3": "2Vv-BfVoq4g",
  "6.1": "ptPXx0AdQpc",
  "6.2": "LP4SoW1O6mY",
  "6.3": "y6120QOlsfU",
  "7.1": "3nQNiTdeW44",
  "7.2": "Y8H4CxTtN6E",
  "7.3": "kXYuUjw9zBk",
};

const WEEKS = [
  { title: "1 апта", lessons: ["1.1 сабақ", "1.2 сабақ", "1.3 сабақ"] },
  { title: "2 апта", lessons: ["2.1 сабақ", "2.2 сабақ", "2.3 сабақ"] },
  { title: "3 апта", lessons: ["3.1 сабақ", "3.2 сабақ", "3.3 сабақ"] },
  { title: "4 апта", lessons: ["4.1 сабақ", "4.2 сабақ", "4.3 сабақ"] },
  { title: "5 апта", lessons: ["5.1 сабақ", "5.2 сабақ", "5.3 сабақ"] },
  { title: "6 апта", lessons: ["6.1 сабақ", "6.2 сабақ", "6.3 сабақ"] },
  { title: "7 апта", lessons: ["7.1 сабақ", "7.2 сабақ", "7.3 сабақ"] },
];

function getLessonId(lessonTitle: string): string {
  return lessonTitle.replace(/\s*сабақ\s*$/, "").trim();
}

export default function DashboardPage() {
  const router = useRouter();
  const supabase = createClient();
  const [expandedWeek, setExpandedWeek] = useState<number | null>(0);
  const [activeLesson, setActiveLesson] = useState<string>("1.1 сабақ");
  const [isDragging, setIsDragging] = useState(false);
  const [taskText, setTaskText] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const lessonId = getLessonId(activeLesson);
  const youtubeId = YOUTUBE_VIDEO_IDS[lessonId] ?? YOUTUBE_VIDEO_IDS["1.1"];
  const embedUrl = `https://www.youtube.com/embed/${youtubeId}?rel=0`;

  // Редирект на логин, если сессии нет (дополнительно к middleware)
  useEffect(() => {
    let cancelled = false;
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!cancelled && !user) router.replace("/");
    });
    return () => { cancelled = true; };
  }, [supabase.auth, router]);

  useEffect(() => {
    if (!uploadSuccess) return;
    const t = setTimeout(() => setUploadSuccess(false), 4000);
    return () => clearTimeout(t);
  }, [uploadSuccess]);

  const handleSignOut = useCallback(async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }, [supabase.auth, router]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files?.length) {
      setSelectedFiles(Array.from(files));
      setUploadError(null);
    }
  }, []);

  async function uploadFiles(files: File[]) {
    setUploadError(null);
    setUploadSuccess(false);
    setUploading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setUploadError("Кіру керек.");
      setUploading(false);
      return;
    }

    const uploadedUrls: string[] = [];

    for (const file of files) {
      const ext = file.name.split(".").pop() || "bin";
      const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}.${ext}`;
      const path = `${user.id}/${lessonId}/${safeName}`;

      const { error: uploadErr } = await supabase.storage
        .from(BUCKET)
        .upload(path, file, { upsert: true });

      if (uploadErr) {
        const msg =
          uploadErr.message.includes("Bucket") ||
          uploadErr.message.includes("bucket")
            ? `Storage: бакет "${BUCKET}" не найден или нет доступа. Создайте бакет в Supabase → Storage.`
            : uploadErr.message;
        setUploadError(msg);
        setUploading(false);
        return;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from(BUCKET).getPublicUrl(path);
      uploadedUrls.push(publicUrl);
    }

    for (const fileUrl of uploadedUrls) {
      const { error: insertErr } = await supabase.from("homeworks").insert({
        user_id: user.id,
        lesson_id: lessonId,
        file_url: fileUrl,
        task_text: taskText || null,
      });

      if (insertErr) {
        const msg = insertErr.message.includes("relation")
          ? `Таблица "homeworks" не найдена. Выполните SQL из SUPABASE_SETUP.md в SQL Editor.`
          : insertErr.message;
        setUploadError(msg);
        setUploading(false);
        return;
      }
    }

    setUploadSuccess(true);
    setUploading(false);
    setTaskText("");
    setSelectedFiles([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files?.length) {
      setSelectedFiles(Array.from(files));
      setUploadError(null);
    }
  };

  const handleSubmitHomework = () => {
    if (selectedFiles.length) void uploadFiles(selectedFiles);
    else setUploadError("Файл таңдаңыз.");
  };

  return (
    <div className="flex min-h-screen bg-[#f8f9fa] font-sans antialiased">
      <aside className="flex w-64 flex-shrink-0 flex-col bg-[#0a0a0a]">
        <div className="flex h-16 items-center border-b border-white/10 px-5">
          <span
            className="text-xl font-bold tracking-tight"
            style={{
              background: GOLD_GRADIENT,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            ALTYN
          </span>
        </div>
        <nav className="flex-1 overflow-y-auto py-4">
          {WEEKS.map((week, weekIndex) => {
            const isExpanded = expandedWeek === weekIndex;
            return (
              <div key={week.title} className="border-b border-white/5">
                <button
                  type="button"
                  onClick={() =>
                    setExpandedWeek(isExpanded ? null : weekIndex)
                  }
                  className={cn(
                    "flex w-full items-center gap-2 px-4 py-3 text-left text-sm font-semibold transition-colors",
                    "text-white hover:bg-white/5"
                  )}
                >
                  <List className="h-4 w-4 shrink-0" style={{ color: GOLD }} />
                  <span className="flex-1">{week.title}</span>
                  {isExpanded ? (
                    <ChevronDown
                      className="h-4 w-4 shrink-0"
                      style={{ color: GOLD }}
                    />
                  ) : (
                    <ChevronRight
                      className="h-4 w-4 shrink-0"
                      style={{ color: GOLD }}
                    />
                  )}
                </button>
                {isExpanded && (
                  <div className="bg-black/30 pb-2 pl-4 pr-2 pt-0">
                    {week.lessons.map((lesson) => (
                      <button
                        key={lesson}
                        type="button"
                        onClick={() => setActiveLesson(lesson)}
                        className={cn(
                          "flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-normal transition-colors",
                          activeLesson === lesson
                            ? "bg-white/10 text-[#D4AF37]"
                            : "text-white/80 hover:bg-white/5 hover:text-white"
                        )}
                      >
                        <Video
                          className="h-3.5 w-3.5 shrink-0"
                          style={{
                            color: activeLesson === lesson ? GOLD : undefined,
                          }}
                        />
                        <span>{lesson}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </aside>

      <div className="flex flex-1 flex-col min-w-0 bg-white">
        <header className="flex h-16 items-center justify-between border-b border-[#E5E7EB] bg-white px-6">
          <button
            type="button"
            className="rounded-xl p-2 text-[#374151] hover:bg-[#F3F4F6] hover:text-[#111827]"
            aria-label="Меню"
          >
            <Menu className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={handleSignOut}
            className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-[#374151] hover:bg-[#F3F4F6] hover:text-[#D4AF37]"
          >
            <Home className="h-4 w-4" />
            Шығу
          </button>
        </header>

        <main className="flex-1 overflow-auto bg-[#f8f9fa] p-6">
          <div className="mx-auto max-w-4xl space-y-6">
            <section className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-[#E5E7EB]">
              <div className="relative aspect-video w-full bg-[#0d0d0d]">
                <iframe
                  key={lessonId}
                  src={embedUrl}
                  title={`${activeLesson} — видео`}
                  className="absolute inset-0 h-full w-full rounded-t-2xl"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <div className="border-t border-[#E5E7EB] bg-white px-5 py-4">
                <p className="text-sm font-semibold text-[#111827]">
                  {activeLesson} — видеоматериал
                </p>
              </div>
            </section>

            <section className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-[#111827]">
                <FileText className="h-5 w-5" style={{ color: GOLD }} />
                Тапсырма
              </h2>

              <div className="space-y-4">
                {uploadError && (
                  <p className="rounded-lg bg-red-500/10 px-4 py-2 text-sm text-red-600">
                    {uploadError}
                  </p>
                )}
                {uploadSuccess && (
                  <p className="rounded-lg bg-green-500/10 px-4 py-2 text-sm text-green-600">
                    Файл жүктелді.
                  </p>
                )}

                <div>
                  <label
                    className="mb-2 block text-sm font-semibold text-[#374151]"
                    htmlFor="task-text"
                  >
                    Мәтініңіз
                  </label>
                  <textarea
                    id="task-text"
                    placeholder="Тапсырма мәтінін еңгізіңіз..."
                    rows={4}
                    value={taskText}
                    onChange={(e) => setTaskText(e.target.value)}
                    className={cn(
                      "w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 text-[#111827]",
                      "placeholder:text-[#9CA3AF]",
                      "focus:border-[#D4AF37] focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                    )}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#374151]">
                    Файл жүктеу
                  </label>
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={cn(
                      "flex flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-10 transition-colors",
                      isDragging
                        ? "border-[#D4AF37] bg-[#FEF9E7]"
                        : "border-[#E5E7EB] bg-[#F9FAFB] hover:border-[#D4AF37]/50 hover:bg-[#FEF9E7]/50"
                    )}
                  >
                    {uploading ? (
                      <Loader2
                        className="mb-3 h-10 w-10 animate-spin text-[#D4AF37]"
                        style={{ color: GOLD }}
                      />
                    ) : (
                      <Upload className="mb-3 h-10 w-10 text-[#9CA3AF]" />
                    )}
                    <p className="mb-1 text-sm font-medium text-[#6B7280]">
                      Файлды осында сүйреңіз немесе
                    </p>
                    <label className="cursor-pointer">
                      <span
                        className="text-sm font-semibold"
                        style={{ color: GOLD }}
                      >
                        файлды таңдаңыз
                      </span>
                      <input
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        multiple
                        disabled={uploading}
                        onChange={onFileChange}
                      />
                    </label>
                    {selectedFiles.length > 0 && (
                      <p className="mt-2 text-xs text-[#6B7280]">
                        {selectedFiles.length} файл таңдалды:{" "}
                        {selectedFiles.map((f) => f.name).join(", ")}
                      </p>
                    )}
                    <button
                      type="button"
                      onClick={handleSubmitHomework}
                      disabled={uploading || selectedFiles.length === 0}
                      className="mt-4 rounded-xl px-4 py-2.5 text-sm font-semibold text-[#0a0a0a] disabled:opacity-50"
                      style={{
                        background: GOLD_GRADIENT,
                        boxShadow: "0 2px 8px rgba(212, 175, 55, 0.3)",
                      }}
                    >
                      {uploading ? "Жүктелуде..." : "Жіберу"}
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
