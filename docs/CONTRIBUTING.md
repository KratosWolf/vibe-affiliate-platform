# Contributing Guide

Thank you for considering contributing to our project! This document provides guidelines and instructions for contributing.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Process](#development-process)
- [Pull Request Process](#pull-request-process)
- [Style Guidelines](#style-guidelines)
- [Testing Guidelines](#testing-guidelines)
- [Documentation](#documentation)

## Code of Conduct

Please note that this project is released with a Contributor Code of Conduct. By participating in this project you agree to abide by its terms.

## Getting Started

1. **Fork the repository**
   ```bash
   gh repo fork username/my-nextjs-app --clone
   ```

2. **Set up your development environment**
   ```bash
   cd my-nextjs-app
   ./scripts/setup.sh
   ```

3. **Create a branch for your feature**
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Process

### 1. Branch Naming Convention

- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation changes
- `refactor/` - Code refactoring
- `test/` - Test additions or fixes
- `chore/` - Maintenance tasks

### 2. Commit Message Format

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

<footer>
```

Types:
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that don't affect code meaning
- `refactor`: Code change that neither fixes a bug nor adds a feature
- `perf`: Code change that improves performance
- `test`: Adding missing tests or correcting existing tests
- `chore`: Changes to the build process or auxiliary tools

Examples:
```bash
feat(auth): add social login with Google
fix(api): handle null response in user endpoint
docs(readme): update installation instructions
```

### 3. Code Review Process

1. All code must be reviewed before merging
2. At least one approval is required
3. All CI checks must pass
4. No merge conflicts allowed

## Pull Request Process

### 1. Before Submitting

- [ ] Update documentation if needed
- [ ] Add tests for new functionality
- [ ] Ensure all tests pass locally
- [ ] Run linting and fix any issues
- [ ] Update the CHANGELOG.md if applicable

### 2. Submitting a Pull Request

1. **Push your branch**
   ```bash
   git push origin feature/your-feature-name
   ```

2. **Create the PR**
   ```bash
   gh pr create --title "feat: your feature" --body "Description of changes"
   ```

3. **Fill out the PR template**
   - Provide a clear description
   - Link related issues
   - Check all applicable boxes

### 3. After Submission

- Respond to review comments promptly
- Make requested changes in new commits
- Once approved, the PR will be merged

## Style Guidelines

### TypeScript/JavaScript

- Use TypeScript for all new files
- Follow ESLint configuration
- Use functional components for React
- Prefer async/await over promises

### CSS/Styling

- Use Tailwind CSS classes
- Follow mobile-first responsive design
- Use CSS modules for component-specific styles
- Maintain consistent spacing and sizing

### File Organization

```
src/
├── app/              # Next.js app directory
├── components/       # Reusable components
│   ├── ui/          # UI components
│   └── features/    # Feature-specific components
├── lib/             # Utility functions
├── hooks/           # Custom React hooks
├── types/           # TypeScript type definitions
└── styles/          # Global styles
```

## Testing Guidelines

### Unit Tests

- Write tests for all new functions
- Maintain at least 80% code coverage
- Use descriptive test names

```typescript
describe('UserService', () => {
  it('should create a new user with valid data', async () => {
    // Test implementation
  });
});
```

### Integration Tests

- Test API endpoints
- Test database operations
- Test third-party integrations

### E2E Tests

- Test critical user flows
- Test across different browsers
- Test responsive design

## Documentation

### Code Documentation

- Add JSDoc comments for complex functions
- Document component props with TypeScript
- Include examples in documentation

```typescript
/**
 * Calculates the discount price for a product
 * @param price - Original price
 * @param discount - Discount percentage (0-100)
 * @returns Discounted price
 * @example
 * calculateDiscount(100, 20) // Returns 80
 */
function calculateDiscount(price: number, discount: number): number {
  return price * (1 - discount / 100);
}
```

### README Updates

Update the README when:
- Adding new features
- Changing installation process
- Modifying configuration
- Adding new dependencies

### API Documentation

- Document all endpoints
- Include request/response examples
- Document error responses
- Keep OpenAPI spec updated

## Questions?

If you have questions, please:
1. Check existing issues and discussions
2. Ask in our Discord community
3. Open a new discussion on GitHub

Thank you for contributing! 🎉