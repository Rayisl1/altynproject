import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // 1. Создаем начальный ответ
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // 2. Инициализируем Supabase
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // Обновляем куки в запросе, чтобы серверные компоненты их видели
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          // Синхронизируем куки в ответе
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // ВАЖНО: Используем getUser() вместо getSession() для безопасности
  const { data: { user } } = await supabase.auth.getUser();

  // 3. Логика защиты роутов
  // Если пользователя нет и он пытается зайти в /dashboard
  if (!user && request.nextUrl.pathname.startsWith("/dashboard")) {
    const url = request.nextUrl.clone();
    url.pathname = "/"; // или /login
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Стандартный фильтр, чтобы не проверять Middleware для статики
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};