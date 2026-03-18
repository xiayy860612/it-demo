import { useReducer, useEffect } from 'react';
import type { TodoState, TodoAction as Action, TodoList } from '../types/todo';
import { get, set } from '../utils/storage';

const STORAGE_KEY = 'todo-app-todos';

function todoReducer(state: TodoState, action: Action): TodoState {
  switch (action.type) {
    case 'LOAD_TODOS':
      return { ...state, todos: action.todos, isLoaded: true };

    case 'ADD_TODO': {
      const trimmed = action.description.trim();
      if (trimmed.length === 0) {
        return { ...state, error: new Error('Description cannot be empty') };
      }
      if (trimmed.length > 500) {
        return { ...state, error: new Error('Description must be 500 characters or less') };
      }

      const newOrder = Math.max(...state.todos.map((t) => t.order), -1) + 1;
      const newTodo = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        description: trimmed,
        completed: false,
        createdAt: Date.now(),
        order: newOrder,
      };

      const updatedTodos = [...state.todos, newTodo];
      set(STORAGE_KEY, updatedTodos);
      return { ...state, todos: updatedTodos, error: null };
    }

    case 'TOGGLE_TODO': {
      const updatedTodos = state.todos.map((todo) =>
        todo.id === action.id ? { ...todo, completed: !todo.completed } : todo
      );
      set(STORAGE_KEY, updatedTodos);
      return { ...state, todos: updatedTodos, error: null };
    }

    case 'DELETE_TODO': {
      const updatedTodos = state.todos.filter((todo) => todo.id !== action.id);
      set(STORAGE_KEY, updatedTodos);
      return { ...state, todos: updatedTodos, error: null };
    }

    default:
      return state;
  }
}

const initialState: TodoState = {
  todos: [],
  isLoaded: false,
  error: null,
};

export function useTodos() {
  const [state, dispatch] = useReducer(todoReducer, initialState);

  // Load todos from localStorage on mount
  useEffect(() => {
    try {
      const stored = get<TodoList>(STORAGE_KEY);
      if (stored) {
        dispatch({ type: 'LOAD_TODOS', todos: stored });
      } else {
        dispatch({ type: 'LOAD_TODOS', todos: [] });
      }
    } catch (error) {
      console.error('Error loading todos from storage:', error);
      dispatch({ type: 'LOAD_TODOS', todos: [] });
    }
  }, []);

  const addTodo = (description: string) => {
    dispatch({ type: 'ADD_TODO', description });
  };

  const toggleTodo = (id: string) => {
    dispatch({ type: 'TOGGLE_TODO', id });
  };

  const deleteTodo = (id: string) => {
    dispatch({ type: 'DELETE_TODO', id });
  };

  return {
    todos: state.todos,
    addTodo,
    toggleTodo,
    deleteTodo,
    isLoaded: state.isLoaded,
    error: state.error,
  };
}
