import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // 1. Сначала создаем ответ
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // 2. БЕЗОПАСНОЕ извлечение переменных
  // Используем значения напрямую. Next.js сам подставит их при сборке.
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

  // Если переменных нет, просто пропускаем (чтобы билд не падал)
  if (!supabaseUrl || !supabaseAnonKey) {
    return response;
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(
        cookiesToSet: {
          name: string;
          value: string;
          options?: Record<string, unknown>;
        }[]
      ) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
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
  });

  // Важно: оборачиваем в try-catch, чтобы Middleware никогда не выдавало 500
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user && request.nextUrl.pathname.startsWith("/dashboard")) {
      const url = request.nextUrl.clone();
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
  } catch (e) {
    // Если что-то пошло не так с Supabase, просто идем дальше
    console.error("Middleware error:", e);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};