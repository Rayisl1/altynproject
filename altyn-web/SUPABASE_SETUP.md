# Настройка Supabase для ALTYN

## 1. Переменные окружения

Скопируйте `.env.example` в `.env.local` и укажите:

- `NEXT_PUBLIC_SUPABASE_URL` — URL проекта (Settings → API)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — anon/public key

## 2. Storage: бакет для домашних заданий

В Supabase Dashboard: **Storage** → **New bucket**:

- Name: `homework-files`
- Public: включить (чтобы по ссылке можно было открыть файл) или выключить и использовать signed URLs
- В **Policies** добавьте политику на вставку для авторизованных пользователей, например:

```sql
-- Разрешить загрузку авторизованным пользователям
CREATE POLICY "Users can upload homework"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'homework-files');
```

## 3. Таблица profiles

Нужна для хранения профиля пользователя после регистрации. В **SQL Editor** выполните:

```sql
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Пользователь может читать и обновлять только свой профиль
CREATE POLICY "Users can read own profile"
ON public.profiles FOR SELECT TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
ON public.profiles FOR INSERT TO authenticated
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE TO authenticated
USING (auth.uid() = id);
```

При регистрации приложение создаёт запись в `profiles` с `id` и `email`. Колонки `full_name`, `created_at`, `updated_at` опциональны (можно добавить по желанию).

## 4. Таблица homeworks

В **SQL Editor** выполните:

```sql
CREATE TABLE IF NOT EXISTS public.homeworks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id TEXT NOT NULL,
  file_url TEXT NOT NULL,
  task_text TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS: пользователь видит только свои записи
ALTER TABLE public.homeworks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert own homeworks"
ON public.homeworks FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own homeworks"
ON public.homeworks FOR SELECT
TO authenticated
USING (auth.uid() = user_id);
```

После этого регистрация/вход, редирект на `/dashboard`, видеоплеер по урокам и загрузка файлов в «Тапсырма» будут работать.
