/**
 * localStorage wrapper utility with error handling
 * Falls back to in-memory storage if localStorage is unavailable
 */

const inMemoryStorage = new Map<string, string>();

let isLocalStorageAvailable = true;

// Test localStorage availability
try {
  const testKey = '__storage_test__';
  localStorage.setItem(testKey, 'test');
  localStorage.removeItem(testKey);
} catch {
  isLocalStorageAvailable = false;
  console.warn('localStorage unavailable, falling back to in-memory storage');
}

export function get<T>(key: string): T | null {
  try {
    if (isLocalStorageAvailable) {
      const item = localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : null;
    }
    const item = inMemoryStorage.get(key);
    return item ? (JSON.parse(item) as T) : null;
  } catch (error) {
    console.error(`Error reading from storage for key "${key}":`, error);
    return null;
  }
}

export function set<T>(key: string, value: T): boolean {
  try {
    const serialized = JSON.stringify(value);
    if (isLocalStorageAvailable) {
      localStorage.setItem(key, serialized);
    } else {
      inMemoryStorage.set(key, serialized);
    }
    return true;
  } catch (error) {
    if (error instanceof Error && error.name === 'QuotaExceededError') {
      console.error('Storage quota exceeded');
    } else {
      console.error(`Error writing to storage for key "${key}":`, error);
    }
    return false;
  }
}

export function remove(key: string): boolean {
  try {
    if (isLocalStorageAvailable) {
      localStorage.removeItem(key);
    } else {
      inMemoryStorage.delete(key);
    }
    return true;
  } catch (error) {
    console.error(`Error removing from storage for key "${key}":`, error);
    return false;
  }
}
