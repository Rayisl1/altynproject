// 1. Заглушки для Edge Runtime (если какая-то библиотека их просит)
// @ts-ignore
globalThis.__dirname = "/";
// @ts-ignore
globalThis.__filename = "/middleware.ts";

import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // Инициализируем базовый ответ
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

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
          // Пересоздаем ответ с новыми заголовками
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          // Устанавливаем куки в ответ для браузера
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Важно: getUser() обновляет сессию, если она протухла
  const { data: { user } } = await supabase.auth.getUser();

  // Защита роутов: если нет юзера и путь начинается с /dashboard
  if (!user && request.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Пропускаем все статические файлы и системные пути Next.js
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};