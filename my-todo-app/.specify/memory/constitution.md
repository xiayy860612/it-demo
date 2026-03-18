<!--
Sync Impact Report
==================
Version change: (template) → 1.0.0
Modified principles: N/A (initial version)
Added sections:
  - Core Principles (5 principles defined)
  - Development Standards
  - Quality Gates
  - Governance
Removed sections: N/A (initial version)
Templates requiring updates:
  ✅ .specify/templates/plan-template.md (reviewed - constitution check section compatible)
  ✅ .specify/templates/spec-template.md (reviewed - UX focus aligns with user story requirements)
  ✅ .specify/templates/tasks-template.md (reviewed - compatible with simplicity principle)
Follow-up TODOs: None
-->

# My Todo App Constitution

## Core Principles

### I. User Experience First

All features MUST prioritize user experience and simplicity. The application should be intuitive, responsive, and delightful to use. Every interaction must feel natural and provide immediate feedback.

**Rationale**: A todo application lives or dies by its daily usability. Friction in task management directly impacts user productivity and satisfaction.

### II. Simplicity & YAGNI

You Aren't Gonna Need It. Implement ONLY what is explicitly required. Avoid premature abstraction, over-engineering, and building "for the future." Start with the simplest solution that works.

**Rationale**: Todo applications easily become bloated. Simplicity maintains code clarity, reduces bugs, and keeps the user interface focused on core functionality.

### III. React Best Practices

Follow modern React patterns and conventions. Components MUST be functional with hooks. State management should be as local as possible - only lift state when absolutely necessary. Prefer composition over inheritance.

**Rationale**: Consistent React patterns ensure maintainability, performance, and leverage the ecosystem's collective wisdom.

### IV. Test When Valuable

Write tests for complex logic, user workflows, and critical paths. Simple presentational components MAY skip tests. Focus testing effort on areas where bugs would most impact user experience.

**Rationale**: Not all code needs exhaustive testing. Smart test coverage focuses on high-risk, high-value areas rather than achieving arbitrary coverage metrics.

### V. Performance & Accessibility

The app MUST load quickly and respond instantly to user interactions. All features MUST be accessible (keyboard navigation, screen reader support, proper ARIA labels). Lazy load routes and code-split where beneficial.

**Rationale**: A slow or inaccessible todo app defeats its purpose. Performance and accessibility are not optional features - they are fundamental to user experience.

## Development Standards

### Code Style

- Use Prettier for consistent formatting (enforced via pre-commit hook)
- ESLint for code quality with React-specific rules
- Functional components with hooks - NO class components
- TypeScript for type safety (catch errors at compile time, not runtime)

### Component Structure

- Components should be small and focused (single responsibility)
- Prefer presentational components (receive props, render UI) over complex logic
- Extract reusable UI patterns into shared components
- File naming: PascalCase for components (e.g., `TodoItem.tsx`)

### State Management

- Start with React built-in state (useState, useReducer)
- Only introduce external state management (Context, Redux, Zustand) when clearly needed
- Keep state as local as possible - don't lift prematurely
- Server state vs. client state: use appropriate tools (React Query, SWR) for server data

## Quality Gates

### Before Commit

- All TypeScript errors MUST be resolved
- ESLint warnings MUST be addressed or explicitly suppressed with rationale
- New features MUST add or update relevant tests (per Test When Valuable principle)
- Manual smoke test of the changed functionality

### Before Merge

- At least one self-review of the changes
- Verify the feature works end-to-end in the actual application
- Check for performance regressions (lazy loading, bundle size impact)
- Validate accessibility (keyboard navigation, screen reader)

## Governance

### Amendment Process

1. Propose constitution changes with rationale
2. Update version following semantic versioning:
   - MAJOR: Remove or redefine core principles
   - MINOR: Add new principle or significantly expand guidance
   - PATCH: Clarifications, wording improvements, non-semantic changes
3. Update dependent templates to reflect new principles
4. Document changes in sync impact report

### Compliance

- All features MUST be traceable to user stories in the spec
- Complex solutions MUST be justified against Simplicity principle
- Performance regressions MUST be addressed before merging
- Accessibility violations are blocking issues

### Living Document

This constitution SHOULD evolve as the project matures. Team consensus required for MAJOR changes. MINOR and PATCH changes may be made by any contributor with review.

**Version**: 1.0.0 | **Ratified**: 2026-01-13 | **Last Amended**: 2026-01-13
