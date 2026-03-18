import { useState, useEffect } from 'react';
import { useTodos } from '../hooks/useTodos';
import { TodoInput } from './TodoInput';
import { TodoList } from './TodoList';
import { CelebrationAnimation } from './CelebrationAnimation';
import './TodoApp.css';

export function TodoApp() {
  const { todos, addTodo, toggleTodo, deleteTodo, error } = useTodos();
  const [celebrateTrigger, setCelebrateTrigger] = useState(false);
  const [lastCompletedCount, setLastCompletedCount] = useState(0);

  // Track completion count to trigger celebration
  useEffect(() => {
    const completedCount = todos.filter((t) => t.completed).length;
    if (completedCount > lastCompletedCount) {
      // A todo was just completed!
      setCelebrateTrigger(true);
      // Reset trigger after animation
      setTimeout(() => setCelebrateTrigger(false), 100);
    }
    setLastCompletedCount(completedCount);
  }, [todos, lastCompletedCount]);

  const handleToggle = (id: string) => {
    toggleTodo(id);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <header style={{ marginBottom: '30px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '32px', marginBottom: '8px', color: '#212529' }}>My Todo App</h1>
        <p style={{ fontSize: '16px', color: '#6c757d', margin: 0 }}>
          {todos.filter((t) => !t.completed).length} item{todos.filter((t) => !t.completed).length !== 1 ? 's' : ''} remaining
        </p>
      </header>

      {error && (
        <div
          role="alert"
          style={{
            padding: '12px',
            marginBottom: '20px',
            backgroundColor: '#f8d7da',
            border: '1px solid #f5c6cb',
            borderRadius: '4px',
            color: '#721c24',
          }}
        >
          Error: {error.message}
        </div>
      )}

      <TodoInput onSubmit={addTodo} />
      <TodoList todos={todos} onToggle={handleToggle} onDelete={deleteTodo} />
      <CelebrationAnimation trigger={celebrateTrigger} duration={2000} />
    </div>
  );
}
