import { useState, FormEvent } from 'react';

interface TodoInputProps {
  onSubmit: (description: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function TodoInput({ onSubmit, disabled = false, placeholder = 'Add a new todo' }: TodoInputProps) {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmed = input.trim();

    // Validation
    if (trimmed.length === 0) {
      setError('Please enter a todo description');
      return;
    }

    if (trimmed.length > 500) {
      setError('Description must be 500 characters or less');
      return;
    }

    onSubmit(trimmed);
    setInput('');
    setError('');
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
      <div style={{ display: 'flex', gap: '10px' }}>
        <input
          type="text"
          id="todo-input"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            if (error) setError('');
          }}
          disabled={disabled}
          placeholder={placeholder}
          maxLength={500}
          aria-label="New todo description"
          style={{
            flex: 1,
            padding: '12px',
            fontSize: '16px',
            border: '2px solid #ccc',
            borderRadius: '4px',
            fontFamily: 'inherit',
          }}
        />
        <button
          type="submit"
          disabled={disabled}
          style={{
            padding: '12px 24px',
            fontSize: '16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: disabled ? 'not-allowed' : 'pointer',
            opacity: disabled ? 0.6 : 1,
            minWidth: '80px',
          }}
        >
          Add
        </button>
      </div>
      {error && (
        <div role="alert" aria-live="polite" style={{ color: '#dc3545', marginTop: '8px', fontSize: '14px' }}>
          {error}
        </div>
      )}
    </form>
  );
}
