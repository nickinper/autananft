const STORAGE_NAMESPACE = 'autana';

interface StorageAdapter {
  getItem<T>(key: string): T | null;
  setItem<T>(key: string, value: T): void;
  removeItem(key: string): void;
  clear(): void;
}

class LocalStorageAdapter implements StorageAdapter {
  private getNamespacedKey(key: string): string {
    return `${STORAGE_NAMESPACE}:${key}`;
  }

  getItem<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(this.getNamespacedKey(key));
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return null;
    }
  }

  setItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(this.getNamespacedKey(key), JSON.stringify(value));
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  }

  removeItem(key: string): void {
    try {
      localStorage.removeItem(this.getNamespacedKey(key));
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  }

  clear(): void {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach((key) => {
        if (key.startsWith(`${STORAGE_NAMESPACE}:`)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }
}

export const storage = new LocalStorageAdapter();