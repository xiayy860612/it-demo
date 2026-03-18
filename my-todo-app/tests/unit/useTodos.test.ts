import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useTodos } from '../../src/hooks/useTodos';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

describe('useTodos', () => {
  beforeEach(() => {
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    localStorageMock.removeItem.mockClear();
    localStorageMock.clear.mockClear();
  });

  it('should load todos from localStorage on mount', async () => {
    const mockTodos = [
      { id: '1', description: 'Test todo', completed: false, createdAt: Date.now(), order: 0 },
    ];
    localStorageMock.getItem.mockReturnValue(JSON.stringify(mockTodos));

    const { result } = renderHook(() => useTodos());

    await waitFor(() => {
      expect(result.current.isLoaded).toBe(true);
    });
    expect(result.current.todos).toEqual(mockTodos);
  });

  it('should add a new todo', async () => {
    localStorageMock.getItem.mockReturnValue('[]');

    const { result } = renderHook(() => useTodos());

    await waitFor(() => {
      expect(result.current.isLoaded).toBe(true);
    });

    act(() => {
      result.current.addTodo('New todo');
    });

    expect(result.current.todos).toHaveLength(1);
    expect(result.current.todos[0].description).toBe('New todo');
    expect(result.current.todos[0].completed).toBe(false);
    expect(localStorageMock.setItem).toHaveBeenCalled();
  });

  it('should reject empty todo descriptions', async () => {
    localStorageMock.getItem.mockReturnValue('[]');

    const { result } = renderHook(() => useTodos());

    await waitFor(() => {
      expect(result.current.isLoaded).toBe(true);
    });

    act(() => {
      result.current.addTodo('   ');
    });

    expect(result.current.todos).toHaveLength(0);
    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe('Description cannot be empty');
  });

  it('should reject todos over 500 characters', async () => {
    localStorageMock.getItem.mockReturnValue('[]');

    const { result } = renderHook(() => useTodos());

    await waitFor(() => {
      expect(result.current.isLoaded).toBe(true);
    });

    const longDescription = 'a'.repeat(501);

    act(() => {
      result.current.addTodo(longDescription);
    });

    expect(result.current.todos).toHaveLength(0);
    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe('Description must be 500 characters or less');
  });

  it('should toggle todo completion status', async () => {
    const mockTodos = [
      { id: '1', description: 'Test todo', completed: false, createdAt: Date.now(), order: 0 },
    ];
    localStorageMock.getItem.mockReturnValue(JSON.stringify(mockTodos));
    localStorageMock.setItem.mockReturnValue(undefined);

    const { result } = renderHook(() => useTodos());

    await waitFor(() => {
      expect(result.current.isLoaded).toBe(true);
    });

    act(() => {
      result.current.toggleTodo('1');
    });

    expect(result.current.todos[0].completed).toBe(true);
    expect(localStorageMock.setItem).toHaveBeenCalled();

    act(() => {
      result.current.toggleTodo('1');
    });

    expect(result.current.todos[0].completed).toBe(false);
  });

  it('should delete a todo', async () => {
    const mockTodos = [
      { id: '1', description: 'Test todo', completed: false, createdAt: Date.now(), order: 0 },
      { id: '2', description: 'Another todo', completed: false, createdAt: Date.now(), order: 1 },
    ];
    localStorageMock.getItem.mockReturnValue(JSON.stringify(mockTodos));
    localStorageMock.setItem.mockReturnValue(undefined);

    const { result } = renderHook(() => useTodos());

    await waitFor(() => {
      expect(result.current.isLoaded).toBe(true);
    });

    act(() => {
      result.current.deleteTodo('1');
    });

    expect(result.current.todos).toHaveLength(1);
    expect(result.current.todos[0].id).toBe('2');
    expect(localStorageMock.setItem).toHaveBeenCalled();
  });
});
