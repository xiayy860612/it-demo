import type { TodoList as TodoListType } from '../types/todo';

interface TodoListProps {
  todos: TodoListType;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

// Lazy import TodoItem to avoid circular dependency
export function TodoList({ todos, onToggle, onDelete }: TodoListProps) {
  if (todos.length === 0) {
    return (
      <div
        role="status"
        aria-live="polite"
        style={{
          textAlign: 'center',
          padding: '60px 20px',
          color: '#6c757d',
        }}
      >
        <p style={{ fontSize: '18px', marginBottom: '10px' }}>No todos yet!</p>
        <p style={{ fontSize: '14px' }}>Add your first todo item to get started.</p>
      </div>
    );
  }

  return (
    <ul
      role="list"
      style={{
        listStyle: 'none',
        padding: 0,
        margin: 0,
        maxWidth: '800px',
        marginInline: 'auto',
      }}
    >
      {todos.map((todo) => (
        <li key={todo.id}>
          <TodoItem todo={todo} onToggle={onToggle} onDelete={onDelete} />
        </li>
      ))}
    </ul>
  );
}

// Import at the bottom to avoid circular dependency
import { TodoItem } from './TodoItem';
