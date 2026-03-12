import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // 1. Создаем начальный ответ
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // 2. Инициализируем клиент Supabase
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
          // Синхронизируем объект ответа
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

  // 3. Получаем пользователя (это также обновляет сессию, если она истекла)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 4. Логика защиты роутов
  // Если пользователь не авторизован и пытается зайти в /dashboard
  if (!user && request.nextUrl.pathname.startsWith("/dashboard")) {
    const url = request.nextUrl.clone();
    url.pathname = "/"; // Перенаправляем на главную
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images/svg/etc (common image formats)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};