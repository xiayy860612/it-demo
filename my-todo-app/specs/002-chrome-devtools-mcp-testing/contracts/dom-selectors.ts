/**
 * DOM Selectors Contract
 *
 * Defines the selectors for interacting with the Todo App's DOM elements.
 * These selectors map to the actual implementation in src/components/.
 */

import type { ElementSelector } from './types';

/**
 * Selectors for the Todo App DOM elements
 *
 * Maps to the component structure in src/components/:
 * - TodoApp.tsx (main container)
 * - TodoInput.tsx (form and input)
 * - TodoList.tsx (list container)
 * - TodoItem.tsx (individual items)
 */
export const TodoAppSelectors = {
  /**
   * Main page heading
   * Maps to: <h1>My Todo App</h1> in TodoApp.tsx
   */
  pageHeading: { type: 'text', text: 'My Todo App' } as const,

  /**
   * Remaining items count
   * Maps to: "X items remaining" in TodoApp.tsx
   */
  itemCount: { type: 'css', selector: 'header p' } as const,

  /**
   * Todo input field
   * Maps to: <input id="todo-input" aria-label="New todo description" />
   */
  todoInput: { type: 'id', value: 'todo-input' } as const,

  /**
   * Submit/Add button
   * Maps to: <button type="submit">Add</button>
   */
  submitButton: { type: 'css', selector: 'button[type="submit"]' } as const,

  /**
   * Todo list container
   * Maps to: <ul role="list"> in TodoList.tsx
   */
  todoList: { type: 'css', selector: 'ul[role="list"]' } as const,

  /**
   * Empty state message container
   * Maps to: <div role="status"> in TodoList.tsx
   */
  emptyState: { type: 'css', selector: 'div[role="status"]' } as const,

  /**
   * Empty state text content
   * Maps to: "No todos yet!" text
   */
  emptyStateText: { type: 'text', text: 'No todos yet!' } as const,

  /**
   * Create a selector for a todo item by its description text
   *
   * @param description - The todo description to search for
   * @returns Selector that finds the <span> containing the description
   *
   * Maps to: <span>{todo.description}</span> in TodoItem.tsx
   */
  todoItemByDescription: (description: string): ElementSelector => ({
    type: 'text',
    text: description,
  }),

  /**
   * Create a selector for a complete button by todo description
   *
   * @param description - The todo description
   * @returns Selector for the complete toggle button
   *
   * Maps to: <button aria-pressed="..." aria-label="Mark X as complete/incomplete">
   */
  completeButtonByDescription: (description: string): ElementSelector => ({
    type: 'aria',
    label: `Mark "${description}" as ${'incomplete'}`, // Will match either state
  }),

  /**
   * Create a selector for a delete button by todo description
   *
   * @param description - The todo description
   * @returns Selector for the delete button
   *
   * Maps to: <button aria-label="Delete todo: X">
   */
  deleteButtonByDescription: (description: string): ElementSelector => ({
    type: 'aria',
    label: `Delete todo: ${description}`,
  }),

  /**
   * Generic selector for any checkbox button
   * Used for finding completed items
   *
   * Maps to: <button aria-pressed="true">
   */
  completedCheckbox: { type: 'css', selector: 'button[aria-pressed="true"]' } as const,

  /**
   * Generic selector for any uncompleted checkbox
   *
   * Maps to: <button aria-pressed="false">
   */
  uncompletedCheckbox: { type: 'css', selector: 'button[aria-pressed="false"]' } as const,

  /**
   * Error message container
   * Maps to: <div role="alert"> in TodoInput.tsx
   */
  errorMessage: { type: 'css', selector: 'div[role="alert"]' } as const,

  /**
   * Validation error text for empty input
   */
  emptyInputError: { type: 'text', text: 'Please enter a todo description' } as const,

  /**
   * Validation error text for too-long input
   */
  tooLongError: { type: 'text', text: 'Description must be 500 characters or less' } as const,
} as const;

/**
 * Selector helper functions
 */

/**
 * Find the uid of an element from a snapshot by selector type
 *
 * This is a helper for converting our ElementSelector types to
 * the uid format used by Chrome DevTools MCP take_snapshot.
 */
export interface SnapshotElement {
  uid: string;
  role?: string;
  name?: string;
  value?: string;
  children?: SnapshotElement[];
}

/**
 * Find an element in a snapshot by our selector types
 */
export function findElementInSnapshot(
  snapshot: SnapshotElement,
  selector: ElementSelector
): string | null {
  // Search current node
  if (matchesSelector(snapshot, selector)) {
    return snapshot.uid;
  }

  // Search children recursively
  if (snapshot.children) {
    for (const child of snapshot.children) {
      const found = findElementInSnapshot(child, selector);
      if (found) return found;
    }
  }

  return null;
}

/**
 * Check if a snapshot element matches our selector
 */
function matchesSelector(element: SnapshotElement, selector: ElementSelector): boolean {
  switch (selector.type) {
    case 'text':
      // Match if name or value contains the text
      return (
        (element.name?.toLowerCase().includes(selector.text.toLowerCase()) ?? false) ||
        (element.value?.toLowerCase().includes(selector.text.toLowerCase()) ?? false)
      );

    case 'aria':
      // Match if name equals the aria label
      return element.name?.toLowerCase() === selector.label.toLowerCase();

    case 'id':
      // For id selectors, we'd need to parse the uid or check attributes
      // This is a simplified check - actual implementation may need refinement
      return element.name?.includes(selector.value) ?? false;

    case 'css':
      // CSS selectors would require more complex parsing
      // For now, this is a placeholder
      return false;
  }
}

/**
 * Get all todo item descriptions from a snapshot
 *
 * Useful for verifying list contents
 */
export function getTodoDescriptions(snapshot: SnapshotElement): string[] {
  const descriptions: string[] = [];

  function traverse(node: SnapshotElement) {
    // Todo items are typically spans with text content
    if (node.role === 'text' && node.name && !isControlElement(node)) {
      descriptions.push(node.name);
    }

    if (node.children) {
      for (const child of node.children) {
        traverse(child);
      }
    }
  }

  traverse(snapshot);
  return descriptions;
}

/**
 * Check if an element is a control (button, input, etc.)
 */
function isControlElement(node: SnapshotElement): boolean {
  const controlRoles = ['button', 'textbox', 'checkbox', 'combobox'];
  return controlRoles.includes(node.role ?? '');
}
