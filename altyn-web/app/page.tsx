"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronDown, Eye, EyeOff } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const GOLD = "#D4AF37";
const GOLD_GRADIENT =
  "linear-gradient(135deg, #D4AF37 0%, #F4E4BC 50%, #C9A227 100%)";

export default function Home() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [envReady, setEnvReady] = useState(true);

  useEffect(() => {
    setEnvReady(
      Boolean(
        process.env.NEXT_PUBLIC_SUPABASE_URL &&
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      )
    );
  }, []);

  async function signIn(e: React.FormEvent) {
    e.preventDefault();
    if (!envReady) {
      setError(
        "Supabase не настроен. Проверьте .env.local и перезапустите сервер."
      );
      return;
    }
    setError(null);
    setMessage(null);
    setLoading(true);
    const supabase = createClient();
    const { data, error: err } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (err) {
      setLoading(false);
      setError(err.message);
      return;
    }
    setLoading(false);
    router.replace("/dashboard");
    router.refresh();
  }

  async function signUp(e: React.FormEvent) {
    e.preventDefault();
    if (!envReady) {
      setError("Supabase не настроен. Проверьте .env.local и перезапустите сервер.");
      return;
    }
    setError(null);
    setMessage(null);
    setLoading(true);
    const supabase = createClient();
    const { data: authData, error: err } = await supabase.auth.signUp({
      email,
      password,
    });
    if (err) {
      setLoading(false);
      setError(err.message);
      return;
    }
    const user = authData?.user;
    if (user) {
      const { error: profileErr } = await supabase.from("profiles").insert({
        id: user.id,
        email: user.email ?? email,
      });
      if (profileErr) {
        setLoading(false);
        setError(
          profileErr.message.includes("duplicate") || profileErr.message.includes("unique")
            ? "Бұл пошта тіркелген. Кіру батырмасын басыңыз."
            : `Профиль: ${profileErr.message}`
        );
        return;
      }
    }
    setLoading(false);
    setMessage(
      "Тіркелу сәтті! Поштаңызды растаңыз немесе кіру батырмасын басыңыз."
    );
    router.refresh();
  }

  const handleSubmit = (e: React.FormEvent) => {
    if (isSignUp) signUp(e);
    else signIn(e);
  };

  return (
    <div className="relative min-h-screen bg-[#0a0a0a] font-sans antialiased">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `repeating-linear-gradient(
            -45deg,
            transparent,
            transparent 8px,
            ${GOLD} 8px,
            ${GOLD} 9px
          )`,
        }}
      />

      <header className="relative z-10 flex items-center justify-between px-8 pt-10 md:px-12 lg:px-16">
        <div className="flex flex-col">
          <span
            className="text-2xl font-bold tracking-tight md:text-3xl"
            style={{
              background: GOLD_GRADIENT,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            ALTYN
          </span>
          <span className="mt-0.5 text-xs font-normal tracking-wide text-white/60 md:text-sm">
            ONLINE . KZ
          </span>
        </div>
        <button
          type="button"
          className={cn(
            "flex items-center gap-1.5 rounded-full border border-white/20 bg-white/5 px-4 py-2.5 text-sm font-medium text-white/90"
          )}
        >
          KZ
          <ChevronDown className="h-4 w-4 text-white/60" />
        </button>
      </header>

      <main className="relative z-10 flex flex-col items-center px-6 pt-16 pb-20 md:pt-20">
        <div className="w-full max-w-[400px]">
          <h1 className="text-2xl font-bold text-white md:text-3xl">
            {isSignUp ? "Тіркелу" : "Авторизация"}
          </h1>
          <p className="mt-2 text-base font-normal text-white/70">
            {isSignUp ? "Жаңа аккаунт жасаңыз" : "Қош келдіңіз!"}
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            {!envReady && (
              <p className="rounded-lg bg-amber-500/20 px-4 py-2 text-sm text-amber-400">
                Добавьте NEXT_PUBLIC_SUPABASE_URL и NEXT_PUBLIC_SUPABASE_ANON_KEY в .env.local и перезапустите <code className="rounded bg-white/10 px-1">npm run dev</code>.
              </p>
            )}
            {error && (
              <p className="rounded-lg bg-red-500/20 px-4 py-2 text-sm text-red-400">
                {error}
              </p>
            )}
            {message && (
              <p className="rounded-lg bg-green-500/20 px-4 py-2 text-sm text-green-400">
                {message}
              </p>
            )}

            <div>
              <label className="mb-2 block text-sm font-semibold text-white/90">
                Пошта <span className="text-red-400">*</span>
              </label>
              <input
                type="email"
                placeholder="Электрондық пошта"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={cn(
                  "w-full rounded-full border border-white/20 bg-white/10 px-5 py-3.5 text-white",
                  "placeholder:text-white/40",
                  "focus:border-[#D4AF37] focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                )}
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-white/90">
                Пароль <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Парольді еңгізіңіз"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className={cn(
                    "w-full rounded-full border border-white/20 bg-white/10 pr-12 pl-5 py-3.5 text-white",
                    "placeholder:text-white/40",
                    "focus:border-[#D4AF37] focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-[#D4AF37]"
                  aria-label={
                    showPassword ? "Скрыть пароль" : "Показать пароль"
                  }
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={cn(
                "w-full rounded-full py-3.5 text-base font-semibold text-[#0a0a0a] transition-opacity disabled:opacity-70",
                "flex items-center justify-center"
              )}
              style={{
                background: GOLD_GRADIENT,
                boxShadow: "0 4px 14px rgba(212, 175, 55, 0.4)",
              }}
            >
              {loading
                ? "Жүктелуде..."
                : isSignUp
                  ? "Тіркелу"
                  : "Кіру"}
            </button>
          </form>

          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError(null);
              setMessage(null);
            }}
            className="mt-4 w-full text-center text-sm font-medium text-[#D4AF37] hover:underline"
          >
            {isSignUp
              ? "Аккаунтыңыз бар ма? Кіру"
              : "Аккаунтыңыз жоқ па? Тіркелу"}
          </button>

          <div className="mt-6 flex flex-col gap-2 text-center">
            <Link
              href="#"
              className="text-sm font-medium text-[#D4AF37] hover:underline"
            >
              Құпия сөзді ұмыттыңыз ба?
            </Link>
            <Link
              href="#"
              className="text-sm font-medium text-[#D4AF37] hover:underline"
            >
              Басты бетке өту
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
