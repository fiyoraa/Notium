import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSearch } from '../hooks/useSearch';
import { formatDate, extractExcerpt } from '../utils/markdown';
import type { Note } from '../types/note';

interface SearchBarProps {
  notes: Note[];
  onSelectNote: (id: string) => void;
  onClose: () => void;
}

export function SearchBar({ notes, onSelectNote, onClose }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const { filteredNotes } = useSearch(notes);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const searchResults = query.trim() 
    ? filteredNotes.filter(note => 
        note.title.toLowerCase().includes(query.toLowerCase()) ||
        note.content.toLowerCase().includes(query.toLowerCase()) ||
        note.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      )
    : [];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, searchResults.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter' && searchResults[selectedIndex]) {
        onSelectNote(searchResults[selectedIndex].id);
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchResults, selectedIndex, onSelectNote, onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center pt-20 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl mx-4"
      >
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-4">
            <div className="relative">
              <svg className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search notes..."
                className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg outline-none focus:border-gray-500 dark:focus:border-gray-400 text-gray-900 dark:text-white placeholder-gray-500"
                autoFocus
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex gap-1">
                <kbd className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">ESC</kbd>
                <kbd className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">↑↓</kbd>
                <kbd className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">Enter</kbd>
              </div>
            </div>
          </div>

          {searchResults.length > 0 && (
            <div className="max-h-96 overflow-y-auto border-t border-gray-200 dark:border-gray-700">
              {searchResults.map((note, index) => (
                <motion.button
                  key={note.id}
                  whileHover={{ backgroundColor: 'rgba(0,0,0,0.05)' }}
                  onClick={() => {
                    onSelectNote(note.id);
                    onClose();
                  }}
                  className={`w-full text-left p-4 border-b border-gray-100 dark:border-gray-800 transition-colors ${
                    index === selectedIndex ? 'bg-gray-50 dark:bg-gray-800' : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="font-medium text-gray-900 dark:text-white truncate flex-1">
                      {note.title || 'Untitled'}
                    </h3>
                    {note.is_favorite && (
                      <svg className="w-4 h-4 text-yellow-500 flex-shrink-0 ml-2" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
                    {extractExcerpt(note.content || 'No content')}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>{formatDate(note.updated_at)}</span>
                    {note.tags.length > 0 && (
                      <div className="flex gap-1">
                        {note.tags.slice(0, 3).map(tag => (
                          <span key={tag} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.button>
              ))}
            </div>
          )}

          {query && searchResults.length === 0 && (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              No notes found matching "{query}"
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
