import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useHotkeys } from 'react-hotkeys-hook';
import { Sidebar } from './components/Sidebar';
import { NoteList } from './components/NoteList';
import { Editor } from './components/Editor';
import { SearchBar } from './components/SearchBar';
import { ThemeToggle } from './components/ThemeToggle';
import { useNotes } from './hooks/useNotes';
import { useTheme } from './hooks/useTheme';
import type { Note } from './types/note';

function App() {
  const { notes, createNote, updateNote, deleteNote } = useNotes();
  const { theme } = useTheme();
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const selectedNote = notes.find(note => note.id === selectedNoteId);

  useHotkeys('ctrl+k, cmd/k', (e) => {
    e.preventDefault();
    setIsSearchOpen(true);
  });

  useHotkeys('ctrl+n, cmd+n', (e) => {
    e.preventDefault();
    handleNewNote();
  });

  const handleNewNote = async () => {
    try {
      const newNote = await createNote({
        title: 'Untitled Note',
        content: '',
        tags: [],
        is_favorite: false,
      });
      setSelectedNoteId(newNote.id);
    } catch (error) {
      console.error('Failed to create note:', error);
    }
  };

  const handleSelectNote = (id: string) => {
    setSelectedNoteId(id);
  };

  const handleUpdateNote = async (id: string, updates: Partial<Note>) => {
    try {
      await updateNote(id, updates);
    } catch (error) {
      console.error('Failed to update note:', error);
    }
  };

  const handleDeleteNote = async (id: string) => {
    try {
      await deleteNote(id);
      if (selectedNoteId === id) {
        setSelectedNoteId(null);
      }
    } catch (error) {
      console.error('Failed to delete note:', error);
    }
  };

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 ${theme}`}>
      <div className="flex h-screen">
        <Sidebar
          onNewNote={handleNewNote}
          onSelectNote={handleSelectNote}
          selectedNoteId={selectedNoteId}
        />
        
        <NoteList
          notes={notes}
          onSelectNote={handleSelectNote}
          selectedNoteId={selectedNoteId}
        />
        
        <Editor
          note={selectedNote || null}
          onUpdateNote={handleUpdateNote}
          onDeleteNote={handleDeleteNote}
        />
        
        <div className="fixed top-4 right-4 z-40">
          <ThemeToggle />
        </div>
      </div>

      <AnimatePresence>
        {isSearchOpen && (
          <SearchBar
            notes={notes}
            onSelectNote={handleSelectNote}
            onClose={() => setIsSearchOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
