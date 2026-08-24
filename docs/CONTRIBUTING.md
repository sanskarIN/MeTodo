# Contributing to MeTodo

## =============================================================================
## (c) Copyright Sanskar Yadav. All rights reserved.
## Made by Sanskar Yadav.
## =============================================================================

## FILE PURPOSE
This document provides comprehensive guidelines for contributing to MeTodo. It covers how to report bugs, suggest features, submit code contributions, and maintain code quality standards.

---

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Development Setup](#development-setup)
4. [Making Changes](#making-changes)
5. [Submitting Changes](#submitting-changes)
6. [Coding Standards](#coding-standards)
7. [Testing](#testing)
8. [Documentation](#documentation)
9. [Support & Contact](#support--contact)

---

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inspiring community for all. We pledge to make participation in our community a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience, nationality, personal appearance, race, religion, sexual identity and orientation, or socioeconomic status.

### Expected Behavior

- Use welcoming and inclusive language
- Be respectful of differing opinions and experiences
- Accept constructive criticism gracefully
- Focus on what is best for the community
- Show empathy towards other community members

### Unacceptable Behavior

- Harassment or discrimination
- Trolling or insulting/derogatory comments
- Public or private attacks
- Publishing others' private information
- Other conduct which could reasonably be considered inappropriate

### Enforcement

Instances of abusive, harassing, or otherwise unacceptable behavior may be reported by contacting the project team at supportramsandesh@gmail.com. All complaints will be reviewed and investigated.

---

## Getting Started

### Prerequisites

- Node.js 18.0.0 or higher
- npm 8.0.0 or higher
- Git 2.0.0 or higher
- Familiarity with React Native and TypeScript

### Fork & Clone

```bash
# 1. Fork the repository on GitHub
# Visit: https://github.com/Sanskar-in/MeTodo
# Click "Fork" button

# 2. Clone your fork
git clone https://github.com/YOUR-USERNAME/MeTodo.git
cd metodo

# 3. Add upstream remote
git remote add upstream https://github.com/Sanskar-in/MeTodo.git

# 4. Verify remotes
git remote -v
# origin    https://github.com/YOUR-USERNAME/MeTodo.git (fetch)
# origin    https://github.com/YOUR-USERNAME/MeTodo.git (push)
# upstream  https://github.com/Sanskar-in/MeTodo.git (fetch)
# upstream  https://github.com/Sanskar-in/MeTodo.git (push)
```

### Install Dependencies

```bash
# Install pnpm globally
npm install -g pnpm

# Install project dependencies
pnpm install

# Verify installation
pnpm list
```

---

## Development Setup

### Start Development Server

```bash
# Start full development server
pnpm dev

# Or start only Metro bundler
pnpm dev:metro

# Or start only backend server
pnpm dev:server
```

### Running on Different Platforms

```bash
# iOS Simulator (macOS only)
pnpm ios

# Android Emulator
pnpm android

# Web Browser
# Open http://localhost:8081 in your browser
```

### Code Quality Tools

```bash
# Type checking
pnpm check

# Linting
pnpm lint

# Code formatting
pnpm format

# Run tests
pnpm test

# Run tests in watch mode
pnpm test --watch
```

---

## Making Changes

### Create Feature Branch

```bash
# Update main branch
git fetch upstream
git checkout main
git merge upstream/main

# Create feature branch
git checkout -b feature/your-feature-name

# Or for bug fixes
git checkout -b fix/bug-description

# Or for documentation
git checkout -b docs/documentation-update
```

### Branch Naming Conventions

| Type | Format | Example |
|------|--------|---------|
| Feature | `feature/feature-name` | `feature/push-notifications` |
| Bug Fix | `fix/bug-description` | `fix/task-not-saving` |
| Documentation | `docs/doc-update` | `docs/api-documentation` |
| Refactor | `refactor/component-name` | `refactor/task-context` |
| Test | `test/test-name` | `test/task-creation` |
| Chore | `chore/task-name` | `chore/update-dependencies` |

### Commit Messages

Follow the Conventional Commits specification:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat:` A new feature
- `fix:` A bug fix
- `docs:` Documentation only changes
- `style:` Changes that don't affect code meaning
- `refactor:` Code change that neither fixes a bug nor adds a feature
- `perf:` Code change that improves performance
- `test:` Adding missing tests or correcting existing tests
- `chore:` Changes to build process or dependencies

**Examples:**

```bash
# Feature
git commit -m "feat(tasks): add push notification reminders"

# Bug fix
git commit -m "fix(avatar): prevent avatar preview crash on large images"

# Documentation
git commit -m "docs(api): add task creation examples"

# With body and footer
git commit -m "feat(sync): implement cloud synchronization

- Add sync service layer
- Implement conflict resolution
- Add offline queue management

Closes #123"
```

---

## Submitting Changes

### Before Submitting

**1. Sync with Upstream**
```bash
git fetch upstream
git rebase upstream/main
```

**2. Run Tests**
```bash
pnpm test
```

**3. Check Code Quality**
```bash
pnpm check
pnpm lint
pnpm format
```

**4. Update Documentation**
- Update README if needed
- Add code comments
- Create user guide if needed

### Create Pull Request

**1. Push to Your Fork**
```bash
git push origin feature/your-feature-name
```

**2. Create PR on GitHub**
- Go to your fork on GitHub
- Click "Compare & pull request"
- Fill in the PR template
- Submit PR

**3. PR Template**
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Related Issue
Closes #123

## Changes Made
- Change 1
- Change 2
- Change 3

## Testing
- [ ] Unit tests added
- [ ] Integration tests added
- [ ] Manual testing completed

## Screenshots (if applicable)
Add screenshots or GIFs

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex logic
- [ ] Documentation updated
- [ ] Tests pass locally
- [ ] No new warnings generated
```

### Review Process

1. **Automated Checks**
   - Tests must pass
   - Linting must pass
   - TypeScript must compile

2. **Code Review**
   - Maintainers review code
   - Feedback provided
   - Changes requested if needed

3. **Approval & Merge**
   - After approval, PR is merged
   - Branch is deleted
   - Changes are deployed

---

## Coding Standards

### TypeScript

**Strict Mode:**
```typescript
// ✅ Good - Explicit types
interface Task {
  id: string;
  title: string;
  completed: boolean;
}

const createTask = (title: string): Task => ({
  id: generateId(),
  title,
  completed: false,
});

// ❌ Bad - Using any
const createTask = (title: any): any => {
  return { id: generateId(), title, completed: false };
};
```

**Type Definitions:**
```typescript
// ✅ Good - Use interfaces for objects
interface User {
  id: string;
  name: string;
  email: string;
}

// ✅ Good - Use types for unions
type Status = 'pending' | 'completed' | 'overdue';

// ❌ Bad - Avoid any
const user: any = { id: '1', name: 'John' };
```

### React

**Functional Components:**
```typescript
// ✅ Good - Functional component with hooks
interface TaskItemProps {
  task: Task;
  onPress: () => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onPress }) => {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <Pressable onPress={onPress}>
      <Text>{task.title}</Text>
    </Pressable>
  );
};

export default memo(TaskItem);

// ❌ Bad - Class component
class TaskItem extends React.Component {
  render() {
    return <Text>{this.props.task.title}</Text>;
  }
}
```

**Hooks:**
```typescript
// ✅ Good - Use hooks for state
const [tasks, setTasks] = useState<Task[]>([]);
const memoizedValue = useMemo(() => expensiveComputation(), [deps]);
const memoizedCallback = useCallback(() => { /* ... */ }, [deps]);

// ❌ Bad - Mixing hooks and class components
```

### Styling

**Tailwind Classes:**
```typescript
// ✅ Good - Use Tailwind classes
<View className="flex-1 items-center justify-center p-4 bg-background">
  <Text className="text-2xl font-bold text-foreground">Hello</Text>
</View>

// ✅ Good - Use cn() for conditional classes
<View className={cn(
  "p-4 rounded-lg",
  isActive && "bg-primary",
  disabled && "opacity-50"
)}>
  <Text>Content</Text>
</View>

// ❌ Bad - Inline styles
<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
  <Text>Hello</Text>
</View>
```

### File Organization

**Directory Structure:**
```
src/
├── components/
│   ├── TaskItem.tsx
│   ├── AvatarPreview.tsx
│   └── ThemeSelector.tsx
├── hooks/
│   ├── useTasks.ts
│   ├── useAvatars.ts
│   └── useThemes.ts
├── lib/
│   ├── task-utils.ts
│   ├── avatar-utils.ts
│   └── theme-utils.ts
├── types/
│   ├── task.ts
│   ├── avatar.ts
│   └── theme.ts
└── screens/
    ├── HomeScreen.tsx
    ├── TasksScreen.tsx
    └── SettingsScreen.tsx
```

**File Naming:**
- Components: PascalCase (TaskItem.tsx)
- Utilities: camelCase (taskUtils.ts)
- Types: camelCase (task.ts)
- Hooks: camelCase (useTasks.ts)

---

## Testing

### Unit Tests

```typescript
import { describe, it, expect } from 'vitest';
import { createTask, completeTask } from '@/lib/task-utils';

describe('Task Utils', () => {
  it('should create a task', () => {
    const task = createTask('Test Task');
    expect(task.title).toBe('Test Task');
    expect(task.completed).toBe(false);
  });

  it('should complete a task', () => {
    const task = createTask('Test Task');
    const completed = completeTask(task);
    expect(completed.completed).toBe(true);
  });
});
```

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test --watch

# Run tests with coverage
pnpm test --coverage

# Run specific test file
pnpm test task-utils.test.ts
```

### Test Coverage

- Aim for 80%+ coverage
- Test happy paths
- Test error cases
- Test edge cases

---

## Documentation

### Code Comments

```typescript
// ✅ Good - Explain why, not what
// Use debouncing to prevent excessive API calls
const debouncedSearch = useMemo(
  () => debounce(handleSearch, 300),
  []
);

// ❌ Bad - Obvious comments
// Set isLoading to true
setIsLoading(true);
```

### JSDoc Comments

```typescript
/**
 * Creates a new task with the given title and options.
 *
 * @param title - The task title
 * @param options - Optional task configuration
 * @param options.priority - Task priority (low, medium, high)
 * @param options.dueDate - Task due date
 * @returns The created task
 *
 * @example
 * const task = await createTask('Buy groceries', {
 *   priority: 'high',
 *   dueDate: new Date('2026-07-01'),
 * });
 */
async function createTask(
  title: string,
  options?: {
    priority?: TaskPriority;
    dueDate?: Date;
  }
): Promise<Task> {
  // Implementation
}
```

### README Updates

Update README.md if your changes:
- Add new features
- Change how to use the app
- Add new dependencies
- Change setup instructions

### Documentation Files

Create documentation for:
- New features
- API changes
- Architecture changes
- Breaking changes

---

## Support & Contact

### Getting Help

**Questions about Contributing:**
- Email: supportramsandesh@gmail.com
- GitHub Discussions: https://github.com/Sanskar-in/MeTodo/discussions

**Found a Bug?**
- GitHub Issues: https://github.com/Sanskar-in/MeTodo/issues
- Email: supportramsandesh@gmail.com

**Feature Suggestions?**
- GitHub Discussions: https://github.com/Sanskar-in/MeTodo/discussions
- GitHub Issues: https://github.com/Sanskar-in/MeTodo/issues

### Contact Information

**Creator:**
- **Email:** sanskaryadavfrom2012to2026@gmail.com
- **GitHub:** https://github.com/Sanskar-in
- **LinkedIn:** https://linkedin.com/in/sanskar-in
- **Twitter:** https://x.com/SanskarCode

**Support:**
- **Email:** supportramsandesh@gmail.com
- **Response Time:** 24-48 hours
- **Available:** Monday-Friday, 9 AM - 6 PM IST

---

## Recognition

Contributors will be recognized in:
- README.md
- CONTRIBUTORS.md
- Release notes
- GitHub contributors page

---

## License

By contributing to MeTodo, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for contributing to MeTodo! 🎉**

Made with ❤️ by Sanskar Yadav

---

**Last Updated:** June 29, 2026  
**Version:** 1.0.0
