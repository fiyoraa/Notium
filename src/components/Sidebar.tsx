import { motion } from 'framer-motion';
import { useState } from 'react';
import { useNotes } from '../hooks/useNotes';
import { useSearch } from '../hooks/useSearch';

interface SidebarProps {
  onNewNote: () => void;
  onSelectNote: (id: string) => void;
  selectedNoteId: string | null;
}

export function Sidebar({ onNewNote, onSelectNote, selectedNoteId }: SidebarProps) {
  const { notes } = useNotes();
  const { query, setQuery, filteredNotes } = useSearch(notes);
  const [activeFilter, setActiveFilter] = useState<'all' | 'favorites'>('all');

  const displayNotes = filteredNotes.filter(note => 
    activeFilter === 'all' || note.is_favorite
  );

  const allTags = Array.from(new Set(notes.flatMap(note => note.tags)));

  return (
    <motion.div
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col h-screen"
    >
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onNewNote}
          className="w-full btn-primary flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Note
        </motion.button>
      </div>

      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="relative">
          <input
            type="text"
            placeholder="Search notes..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="input-field pl-10"
          />
          <svg className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto">
        <div className="p-2">
          <button
            onClick={() => setActiveFilter('all')}
            className={`w-full text-left px-3 py-2 rounded-lg transition-colors duration-200 ${
              activeFilter === 'all' 
                ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white' 
                : 'hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400'
            }`}
          >
            All Notes ({notes.length})
          </button>
          <button
            onClick={() => setActiveFilter('favorites')}
            className={`w-full text-left px-3 py-2 rounded-lg transition-colors duration-200 ${
              activeFilter === 'favorites' 
                ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white' 
                : 'hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400'
            }`}
          >
            Favorites ({notes.filter(n => n.is_favorite).length})
          </button>
        </div>

        {allTags.length > 0 && (
          <div className="p-2 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 px-3">
              Tags
            </h3>
            {allTags.map(tag => (
              <button
                key={tag}
                className="w-full text-left px-3 py-1 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200"
              >
                #{tag}
              </button>
            ))}
          </div>
        )}

        <div className="p-2 border-t border-gray-200 dark:border-gray-700">
          {displayNotes.map(note => (
            <motion.button
              key={note.id}
              whileHover={{ backgroundColor: 'rgba(0,0,0,0.05)' }}
              onClick={() => onSelectNote(note.id)}
              className={`w-full text-left p-3 rounded-lg mb-1 transition-colors duration-200 ${
                selectedNoteId === note.id 
                  ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white' 
                  : 'hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400'
              }`}
            >
              <div className="font-medium text-sm truncate">{note.title}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {new Date(note.updated_at).toLocaleDateString()}
              </div>
            </motion.button>
          ))}
        </div>
      </nav>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="text-xs text-gray-500 dark:text-gray-400">
          Notium by Fiyora
        </div>
      </div>
    </motion.div>
  );
}
