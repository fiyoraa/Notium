import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useHotkeys } from 'react-hotkeys-hook';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { useTheme } from './hooks/useTheme';
import { useNotes } from './hooks/useNotes';
import { Login } from './components/Login';
import { Sidebar } from './components/Sidebar';
import { NoteList } from './components/NoteList';
import { Editor } from './components/Editor';
import { SearchBar } from './components/SearchBar';
import { ThemeToggle } from './components/ThemeToggle';

function AppContent() {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const { notes, createNote, updateNote, deleteNote } = useNotes();
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const selectedNote = notes.find(note => note.id === selectedNoteId);

  const handleCreateNote = async () => {
    const newNote = await createNote({
      title: '',
      content: '',
      tags: [],
      is_favorite: false
    });
    setSelectedNoteId(newNote.id);
  };

  useHotkeys('ctrl+k', (e) => {
    e.preventDefault();
    setSearchOpen(true);
  }, [searchOpen]);

  useHotkeys('ctrl+n', (e) => {
    e.preventDefault();
    handleCreateNote();
  });

  useHotkeys('escape', () => {
    setSearchOpen(false);
  }, [searchOpen]);

  if (!user) {
    return <Login />;
  }

  return (
    <div className={`h-screen bg-gray-50 dark:bg-gray-900 ${theme} flex flex-col`}>
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-2 z-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <svg className="w-4 h-4 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-br from-indigo-500 to-blue-600 rounded flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h1 className="text-base font-semibold text-gray-900 dark:text-white">Notium</h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden relative">
        <AnimatePresence>
          {searchOpen && (
            <SearchBar
              notes={notes}
              onSelectNote={(id) => {
                setSelectedNoteId(id);
                setSearchOpen(false);
              }}
              onClose={() => setSearchOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* Sidebar */}
        <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:relative z-40 w-72 h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-transform duration-300`}>
          <Sidebar
            notes={notes}
            selectedNoteId={selectedNoteId}
            onSelectNote={setSelectedNoteId}
            onCreateNote={handleCreateNote}
            onLogout={logout}
            onCloseMobile={() => setSidebarOpen(false)}
            username={user?.username || 'User'}
          />
        </div>

        {/* Mobile Overlay */}
        {sidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Editor */}
          <div className="flex-1">
            <Editor
              note={selectedNote || null}
              onUpdateNote={updateNote}
              onDeleteNote={deleteNote}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
