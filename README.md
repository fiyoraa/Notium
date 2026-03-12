# Notium - Aplikasi Notebook oleh Fiyora

Aplikasi web note-taking premium minimalis dengan React + TypeScript + Tailwind CSS.

## Fitur

- ✨ Editor Markdown dengan live preview
- 🔍 Pencarian global dengan keyboard shortcuts (Ctrl+K)
- 🏷️ Sistem tag untuk mengorganisir notes
- ⭐ Favorites untuk notes penting
- 🌙 Dark mode & light mode
- ⚡ Autosave otomatis
- 🎨 Desain minimalis & premium
- ⌨️ Keyboard shortcuts (Ctrl+N untuk note baru)

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Backend**: Supabase
- **Icons**: SVG inline
- **Markdown**: React Markdown

## Setup Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Setup Supabase:
   - Buat project baru di [Supabase](https://supabase.com)
   - Copy `.env.example` ke `.env`
   - Isi environment variables:
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

4. Jalankan development server:
   ```bash
   npm run dev
   ```

## Keyboard Shortcuts

- `Ctrl+K` (atau `Cmd+K`) - Buka search
- `Ctrl+N` (atau `Cmd+N`) - Note baru
- `ESC` - Tutup search

## Author

Dikembangkan oleh **Fiyora** sebagai proyek portfolio.
