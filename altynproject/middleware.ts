import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // 1. Создаем начальный ответ. 
  // Мы используем объект response, который будем мутировать (менять) для синхронизации кук.
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // 2. Инициализируем клиент Supabase без использования внешних конфиг-файлов,
  // чтобы избежать скрытых импортов Node.js API (path, fs, __dirname).
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // Обновляем куки в запросе
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          // Пересоздаем ответ для синхронизации заголовков
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          // Устанавливаем куки в финальный ответ для браузера
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // 3. Запрашиваем пользователя. Это критически важный шаг для обновления сессии.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 4. Логика защиты роутов. 
  // Если пользователь не авторизован и пытается зайти на любую страницу /dashboard/...
  if (!user && request.nextUrl.pathname.startsWith("/dashboard")) {
    const url = request.nextUrl.clone();
    url.pathname = "/"; // Перенаправляем на главную (или /login)
    return NextResponse.redirect(url);
  }

  return response;
}

// Конфигурация матчера — определяет, где именно будет запускаться middleware
export const config = {
  matcher: [
    /*
     * Исключаем все пути, которые не должны обрабатываться middleware:
     * - _next/static (статические файлы)
     * - _next/image (оптимизация изображений)
     * - favicon.ico, изображения (svg, png и т.д.)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};