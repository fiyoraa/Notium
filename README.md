# Notium

Note Web pake React + TypeScript + Tailwind CSS.

## Fitur

- 🔍 Bisa search
- 🏷️ Bisa pake tag buat sortir
- ⭐ Favorit catatan pake bintang
- 🌙 Ada mode gelap sama terang
- ⚡ Udah autosave per kata
- 🎨 Desain bagus sih tapi ntar di update (klo g mls)
- ⌨️ Ad shortcut sih (Ctrl + K)

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Backend**: Supabase
- **Icons**: SVG inline
- **Markdown**: React Markdown

## Kalo mau setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Setup Supabase (ini database ny)
   - Buat project baru di [Supabase](https://supabase.com)
   - Copy `.env.example` ke `.env`
   - Isi nih pake:
     ```
     VITE_SUPABASE_URL=your_supabase_url
     VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```

3. Buat table `notes` di Supabase:
   ```sql
   CREATE TABLE notes (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     title TEXT,
     content TEXT,
     tags TEXT[],
     is_favorite BOOLEAN DEFAULT false,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   ```

4. Tnggl run
   ```bash
   npm run dev
   ```

## Shortcut buat yg blum tau

- `Ctrl+K` (atau `Cmd+K`) - Buka search
- `Ctrl+N` (atau `Cmd+N`) - Note baru
- `ESC` - Tutup search

## Author

gtw sp yg bkin, kknya **Fiyora** yg bikin
