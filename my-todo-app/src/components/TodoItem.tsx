import { useState } from 'react';
import { useDebounce } from '../hooks/useDebounce';
import type { TodoItem as TodoItemType } from '../types/todo';

export interface TodoItemProps {
  todo: TodoItemType;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  const [isToggling, setIsToggling] = useState(false);
  const debouncedIsToggling = useDebounce(isToggling, 300);

  const handleToggle = () => {
    if (!debouncedIsToggling) {
      setIsToggling(true);
      onToggle(todo.id);
    }
  };

  return (
    <li
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '16px',
        marginBottom: '8px',
        backgroundColor: '#fff',
        border: '2px solid #e0e0e0',
        borderRadius: '8px',
        transition: 'all 0.2s',
      }}
    >
      <button
        type="button"
        onClick={handleToggle}
        aria-pressed={todo.completed}
        aria-label={`Mark "${todo.description}" as ${todo.completed ? 'incomplete' : 'complete'}`}
        style={{
          minWidth: '28px',
          height: '28px',
          borderRadius: '50%',
          border: '2px solid #007bff',
          backgroundColor: todo.completed ? '#007bff' : 'transparent',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 0,
        }}
      >
        {todo.completed && (
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="white"
            style={{ display: 'block' }}
          >
            <path d="M13.485 3.515a.5.5 0 0 1 0 .707L6.064 11.643a.5.5 0 0 1-.707 0l-3.843-3.843a.5.5 0 1 1 .707-.707L5.71 10.586l7.143-7.143a.5.5 0 0 1 .632-.062z" />
          </svg>
        )}
      </button>

      <span
        style={{
          flex: 1,
          fontSize: '16px',
          textDecoration: todo.completed ? 'line-through' : 'none',
          color: todo.completed ? '#6c757d' : '#212529',
          wordBreak: 'break-word',
        }}
      >
        {todo.description}
      </span>

      <button
        type="button"
        onClick={() => onDelete(todo.id)}
        aria-label={`Delete todo: ${todo.description}`}
        style={{
          minWidth: '36px',
          height: '36px',
          borderRadius: '6px',
          border: 'none',
          backgroundColor: 'transparent',
          cursor: 'pointer',
          color: '#dc3545',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '4px',
          transition: 'background-color 0.2s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#f8d7da';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
        }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 16 16"
          fill="currentColor"
          style={{ display: 'block' }}
        >
          <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z" />
          <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z" />
        </svg>
      </button>
    </li>
  );
}
