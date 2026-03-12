import { useState, useMemo } from 'react';
import type { Note } from '../types/note';

export function useSearch(notes: Note[]) {
  const [query, setQuery] = useState('');

  const filteredNotes = useMemo(() => {
    if (!query.trim()) return notes;

    const lowercaseQuery = query.toLowerCase();
    return notes.filter(note => 
      note.title.toLowerCase().includes(lowercaseQuery) ||
      note.content.toLowerCase().includes(lowercaseQuery) ||
      note.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
  }, [notes, query]);

  return { query, setQuery, filteredNotes };
}
