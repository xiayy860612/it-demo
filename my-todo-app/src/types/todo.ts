export interface TodoItem {
  id: string;
  description: string;
  completed: boolean;
  createdAt: number;
  order: number;
}

export type TodoList = TodoItem[];

export type TodoAction =
  | { type: 'ADD_TODO'; description: string }
  | { type: 'TOGGLE_TODO'; id: string }
  | { type: 'DELETE_TODO'; id: string }
  | { type: 'LOAD_TODOS'; todos: TodoList };

export interface TodoState {
  todos: TodoList;
  isLoaded: boolean;
  error: Error | null;
}
