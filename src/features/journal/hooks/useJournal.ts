import { useState, useEffect, useCallback } from 'react';
import { JournalEntry } from '../../../types';
import { JournalService } from '../services/journalService';

export const useJournal = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadEntries = useCallback(() => {
    try {
      setLoading(true);
      const allEntries = JournalService.getAll();
      setEntries(allEntries);
      setError(null);
    } catch (err) {
      setError('Failed to load journal entries');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEntries();
  }, [loadEntries]);

  const createEntry = useCallback(async (entry: Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newEntry = JournalService.create(entry);
      setEntries((prev) => [...prev, newEntry]);
      return newEntry;
    } catch (err) {
      setError('Failed to create journal entry');
      throw err;
    }
  }, []);

  const updateEntry = useCallback(async (id: string, updates: Partial<JournalEntry>) => {
    try {
      const updatedEntry = JournalService.update(id, updates);
      if (updatedEntry) {
        setEntries((prev) => 
          prev.map((entry) => entry.id === id ? updatedEntry : entry)
        );
      }
      return updatedEntry;
    } catch (err) {
      setError('Failed to update journal entry');
      throw err;
    }
  }, []);

  const deleteEntry = useCallback(async (id: string) => {
    try {
      const success = JournalService.delete(id);
      if (success) {
        setEntries((prev) => prev.filter((entry) => entry.id !== id));
      }
      return success;
    } catch (err) {
      setError('Failed to delete journal entry');
      throw err;
    }
  }, []);

  const searchEntries = useCallback((query: string) => {
    try {
      return JournalService.search(query);
    } catch (err) {
      setError('Failed to search journal entries');
      return [];
    }
  }, []);

  const getByDateRange = useCallback((startDate: string, endDate: string) => {
    try {
      return JournalService.getByDateRange(startDate, endDate);
    } catch (err) {
      setError('Failed to filter by date range');
      return [];
    }
  }, []);

  const getByTags = useCallback((tags: string[]) => {
    try {
      return JournalService.getByTags(tags);
    } catch (err) {
      setError('Failed to filter by tags');
      return [];
    }
  }, []);

  return {
    entries,
    loading,
    error,
    createEntry,
    updateEntry,
    deleteEntry,
    searchEntries,
    getByDateRange,
    getByTags,
    refresh: loadEntries,
  };
};