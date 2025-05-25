# Sculptr Project Rules

This document outlines the core rules, guidelines, and standards for the Sculptr project. All contributors should follow these rules to maintain consistency and quality across the codebase.

## 1. Styling Guidelines

### Colors
- Use CSS variables for all colors defined in `src/app/globals.css`
- Primary color palette:
  - Primary Blue: `--primary` (#0073CE) - buttons, links, highlights
  - Dark Navy: `--primary-dark` (#003D73) - headings, logos, emphasis
  - Accent Green: `--accent` (#00C389) - success messages, accents
  - Light Background: `--background` (#F4F7FB) - app background
  - Surface White: `--surface` (#FFFFFF) - cards, input fields
  - Border Grey: `--border` (#DCE6F2) - dividers, borders
  - Primary Text: `--foreground` (#0A1A2F) - main body text
  - Secondary Text: `--text-secondary` (#4A637A) - subtext, placeholders

### Form Elements
- Form inputs must have visible borders (2px width)
- Text in input fields must be dark and clearly visible (#0A1A2F)
- Password fields require special attention for text visibility
- Use consistent padding (px-3 py-2.5) across all form elements
- Always include focus states with the primary color
- Provide clear visual feedback for validation errors

### Components
- Maintain consistent spacing between components
- Use shadows sparingly and consistently
- Animations should be subtle and purposeful
- Ensure proper contrast for accessibility

## 2. Code Structure

### File Organization
- Keep related components in the same directory
- Use the App Router pattern (src/app/...)
- Place shared components in `src/components`
- Place utilities and services in `src/lib`
- Organize styles in `src/app/globals.css` with clear comments

### Naming Conventions
- Use PascalCase for component files (e.g., `Button.tsx`)
- Use camelCase for utility functions and variables
- Use kebab-case for CSS classes
- Prefix private functions with underscore

### TypeScript
- Define explicit types for all props
- Avoid using `any` type
- Use interfaces for object structures
- Use type for unions and simple types

## 3. Component Guidelines

### State Management
- Use React hooks for local state
- Keep component state minimal and focused
- Lift state up when needed for sharing between components
- Use context for global state (auth, theme, etc.)

### Performance
- Memoize expensive calculations
- Use proper React keys for lists
- Avoid unnecessary re-renders
- Lazy load components and routes when appropriate

### Accessibility
- All form elements must have associated labels
- Include proper ARIA attributes
- Ensure keyboard navigation works
- Maintain sufficient color contrast
- Support screen readers

## 4. Authentication and Security

### User Data
- Never store sensitive information in local storage
- Sanitize all user inputs
- Implement proper validation on both client and server

### Authentication Flow
- Implement proper error handling for auth failures
- Provide clear feedback on authentication status
- Use secure methods for token storage

## 5. Testing

### Component Testing
- Write tests for core components
- Test both success and failure scenarios
- Mock external dependencies

### E2E Testing
- Test critical user flows (authentication, main features)
- Ensure responsive design works across breakpoints

## 6. Build and Deployment

### Dependencies
- Keep dependencies up to date
- Minimize bundle size
- Document the purpose of each dependency

### Environment
- Use environment variables for configuration
- Never commit sensitive information
- Document required environment variables

---

*This document should be updated as the project evolves. All team members should review and adhere to these guidelines.*
