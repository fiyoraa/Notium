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
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 ${theme}`}>
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

      <div className="flex h-screen overflow-hidden">
        {/* Mobile Menu Button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700"
        >
          <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Theme Toggle - Fixed Position */}
        <div className="fixed top-4 right-4 z-40">
          <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
        </div>

        {/* Sidebar */}
        <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:relative z-40 w-80 h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-transform duration-300`}>
          <Sidebar
            notes={notes}
            selectedNoteId={selectedNoteId}
            onSelectNote={setSelectedNoteId}
            onCreateNote={handleCreateNote}
            onLogout={logout}
            onCloseMobile={() => setSidebarOpen(false)}
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
          {/* Note List - Hidden on Mobile */}
          <div className="hidden md:block w-80 bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
            <NoteList
              notes={notes}
              onSelectNote={setSelectedNoteId}
              selectedNoteId={selectedNoteId}
            />
          </div>

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
