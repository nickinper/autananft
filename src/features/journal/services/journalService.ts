import { v4 as uuidv4 } from 'uuid';
import { JournalEntry } from '../../../types';
import { storage } from '../../../services/storage';

const JOURNAL_STORAGE_KEY = 'journal_entries';

export class JournalService {
  static getAll(): JournalEntry[] {
    return storage.getItem<JournalEntry[]>(JOURNAL_STORAGE_KEY) || [];
  }

  static getById(id: string): JournalEntry | null {
    const entries = this.getAll();
    return entries.find((entry) => entry.id === id) || null;
  }

  static create(entry: Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt'>): JournalEntry {
    const entries = this.getAll();
    const now = new Date().toISOString();
    
    const newEntry: JournalEntry = {
      ...entry,
      id: uuidv4(),
      createdAt: now,
      updatedAt: now,
      consciousnessLevel: this.calculateConsciousnessLevel(entry),
    };

    entries.push(newEntry);
    storage.setItem(JOURNAL_STORAGE_KEY, entries);
    
    return newEntry;
  }

  static update(id: string, updates: Partial<JournalEntry>): JournalEntry | null {
    const entries = this.getAll();
    const index = entries.findIndex((entry) => entry.id === id);
    
    if (index === -1) return null;

    const updatedEntry = {
      ...entries[index],
      ...updates,
      id: entries[index].id,
      createdAt: entries[index].createdAt,
      updatedAt: new Date().toISOString(),
      consciousnessLevel: this.calculateConsciousnessLevel({
        ...entries[index],
        ...updates,
      }),
    };

    entries[index] = updatedEntry;
    storage.setItem(JOURNAL_STORAGE_KEY, entries);
    
    return updatedEntry;
  }

  static delete(id: string): boolean {
    const entries = this.getAll();
    const filteredEntries = entries.filter((entry) => entry.id !== id);
    
    if (entries.length === filteredEntries.length) return false;
    
    storage.setItem(JOURNAL_STORAGE_KEY, filteredEntries);
    return true;
  }

  static search(query: string): JournalEntry[] {
    const entries = this.getAll();
    const lowercaseQuery = query.toLowerCase();
    
    return entries.filter((entry) => {
      const searchableText = JSON.stringify(entry.sections).toLowerCase();
      return searchableText.includes(lowercaseQuery) || 
             entry.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery));
    });
  }

  static getByDateRange(startDate: string, endDate: string): JournalEntry[] {
    const entries = this.getAll();
    return entries.filter((entry) => {
      const entryDate = new Date(entry.date);
      return entryDate >= new Date(startDate) && entryDate <= new Date(endDate);
    });
  }

  static getByTags(tags: string[]): JournalEntry[] {
    const entries = this.getAll();
    return entries.filter((entry) => 
      tags.some(tag => entry.tags.includes(tag))
    );
  }

  private static calculateConsciousnessLevel(entry: Partial<JournalEntry>): number {
    if (!entry.sections) return 1;

    const sections = entry.sections;
    let score = 0;
    let totalSections = 0;

    const calculateSectionScore = (section: any): number => {
      const text = Object.values(section).join(' ');
      const wordCount = text.split(/\s+/).filter(word => word.length > 0).length;
      const uniqueWords = new Set(text.toLowerCase().split(/\s+/));
      const complexity = uniqueWords.size / Math.max(wordCount, 1);
      
      return Math.min(wordCount / 50 + complexity * 2, 3);
    };

    Object.values(sections).forEach((section) => {
      if (section && typeof section === 'object') {
        score += calculateSectionScore(section);
        totalSections++;
      }
    });

    const baseLevel = Math.min(Math.floor(score / Math.max(totalSections, 1)) + 1, 7);
    return baseLevel;
  }
}