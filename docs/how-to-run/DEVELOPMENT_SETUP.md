# MeTodo - Development Setup Guide

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation Steps](#installation-steps)
3. [Running the App](#running-the-app)
4. [Development Workflow](#development-workflow)
5. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before starting, ensure you have:

- Node.js 16.x or higher
- pnpm 9.12.0 or higher
- Expo CLI 54.x or higher
- Git installed
- A code editor (VS Code recommended)
- Platform-specific tools (Xcode for macOS, Android Studio for Android)

See [SYSTEM_REQUIREMENTS.md](../requirements/SYSTEM_REQUIREMENTS.md) for detailed requirements.

---

## Installation Steps

### Step 1: Clone the Repository

```bash
# Clone MeTodo repository
git clone https://github.com/Sanskar-in/MeTodo.git

# Navigate to project directory
cd MeTodo
```

### Step 2: Install Dependencies

```bash
# Install all project dependencies using pnpm
pnpm install

# If using npm instead
npm install

# If using yarn instead
yarn install
```

**Expected Output:**
```
✓ Packages in scope: app-template
✓ Lockfile is up-to-date
✓ Linking workspace packages
✓ All dependencies resolved
```

### Step 3: Verify Installation

```bash
# Check TypeScript compilation
pnpm check

# Run linting
pnpm lint

# Verify all tools are installed
expo --version
node --version
pnpm --version
```

---

## Running the App

### Option 1: Web Development (Recommended for Quick Testing)

```bash
# Start development server
pnpm dev

# Or start only Metro bundler
pnpm dev:metro
```

**Expected Output:**
```
Metro Bundler ready at http://localhost:8081
Expo web server ready at http://localhost:8081
Press 'w' to open web, 'a' for Android, 'i' for iOS
```

**Access the app:**
- Open browser to `http://localhost:8081`
- Or press 'w' in terminal

### Option 2: iOS Development

#### Prerequisites
- macOS with Xcode installed
- iPhone simulator or physical device
- Apple Developer Account (for physical device)

#### Running on iOS Simulator

```bash
# Start development server
pnpm dev

# Press 'i' in terminal to open iOS simulator
# Or use this command directly
pnpm ios
```

#### Running on Physical iPhone

```bash
# Start development server
pnpm dev

# Connect iPhone via USB
# Press 'i' in terminal
# Select your device from the list
```

### Option 3: Android Development

#### Prerequisites
- Android SDK installed
- Android emulator or physical device
- Android Developer Tools

#### Running on Android Emulator

```bash
# Start Android emulator first
# Open Android Studio > Device Manager > Start Emulator

# Start development server
pnpm dev

# Press 'a' in terminal to open Android emulator
# Or use this command directly
pnpm android
```

#### Running on Physical Android Device

```bash
# Enable USB Debugging on your Android device
# Settings > Developer Options > USB Debugging

# Connect device via USB
# Start development server
pnpm dev

# Press 'a' in terminal
# Select your device from the list
```

---

## Development Workflow

### Hot Reload

The app supports hot reload for instant updates:

1. Make changes to your code
2. Save the file
3. Changes appear automatically on connected devices

### Debugging

#### Using React DevTools

```bash
# Install React DevTools browser extension
# Chrome: https://chrome.google.com/webstore/detail/react-developer-tools/...
# Firefox: https://addons.mozilla.org/en-US/firefox/addon/react-devtools/

# Open DevTools in browser (F12)
# React tab appears automatically
```

#### Using Expo DevTools

```bash
# Press 'd' in terminal while app is running
# Select "Open Debugger in Browser"
# Or visit: http://localhost:19000/debug
```

#### Using Console Logs

```typescript
// Add console logs for debugging
console.log('Debug message:', variable);
console.warn('Warning message');
console.error('Error message');

// View logs in terminal or browser console
```

### Building for Testing

```bash
# Build for web
pnpm build

# Build for production
expo build:web

# Output in dist/ directory
```

---

## Common Development Tasks

### Adding a New Screen

1. Create file in `app/` or `app/(tabs)/`
2. Add route to `app/_layout.tsx`
3. Import and use in navigation

```typescript
// Example: app/my-screen.tsx
import { ScreenContainer } from "@/components/screen-container";
import { Text } from "react-native";

export default function MyScreen() {
  return (
    <ScreenContainer>
      <Text>My New Screen</Text>
    </ScreenContainer>
  );
}
```

### Adding a New Component

1. Create file in `components/`
2. Export component as default
3. Import in screens where needed

```typescript
// Example: components/my-component.tsx
import { View, Text } from "react-native";

export function MyComponent() {
  return (
    <View>
      <Text>My Component</Text>
    </View>
  );
}
```

### Adding a New Hook

1. Create file in `hooks/`
2. Export hook function
3. Use in components

```typescript
// Example: hooks/use-my-hook.ts
import { useState } from "react";

export function useMyHook() {
  const [state, setState] = useState(null);
  
  return { state, setState };
}
```

### Modifying Styles

```typescript
// Using Tailwind classes
<View className="flex-1 bg-background p-4">
  <Text className="text-lg font-bold text-foreground">
    Styled Text
  </Text>
</View>

// Using inline styles
<View style={{ flex: 1, padding: 16 }}>
  <Text style={{ fontSize: 18, fontWeight: "bold" }}>
    Styled Text
  </Text>
</View>
```

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run specific test file
pnpm test auth.logout.test.ts
```

---

## Environment Variables

### Setting Up Environment Variables

1. Create `.env` file in project root
2. Add variables as needed

```bash
# .env
EXPO_PUBLIC_API_URL=http://localhost:3000
EXPO_PUBLIC_APP_NAME=MeTodo
```

### Accessing Environment Variables

```typescript
// In code
import { EXPO_PUBLIC_API_URL } from "@env";

console.log(EXPO_PUBLIC_API_URL);
```

---

## Troubleshooting

### Issue: Dependencies not installing

**Solution:**
```bash
# Clear pnpm cache
pnpm store prune

# Remove node_modules
rm -rf node_modules

# Reinstall
pnpm install
```

### Issue: Metro bundler not starting

**Solution:**
```bash
# Kill existing Metro process
lsof -i :8081
kill -9 <PID>

# Start fresh
pnpm dev:metro
```

### Issue: Simulator/Emulator not appearing

**Solution:**
```bash
# For iOS
xcrun simctl list devices

# For Android
adb devices

# Restart simulator/emulator
```

### Issue: Port 8081 already in use

**Solution:**
```bash
# Kill process using port 8081
lsof -i :8081
kill -9 <PID>

# Or use different port
EXPO_PORT=8082 pnpm dev
```

### Issue: TypeScript errors

**Solution:**
```bash
# Check TypeScript
pnpm check

# Fix TypeScript errors
# Review error messages and update code accordingly
```

### Issue: Hot reload not working

**Solution:**
```bash
# Restart development server
# Press Ctrl+C to stop
# Run pnpm dev again

# Clear Metro cache
rm -rf .metro-cache
pnpm dev
```

---

## Performance Tips

### Optimize Development Speed

1. **Use Web for UI Development** - Fastest feedback loop
2. **Close Unnecessary Apps** - Free up system resources
3. **Use SSD** - Faster file operations
4. **Enable Hardware Acceleration** - Faster rendering

### Monitor Performance

```bash
# Check app performance
pnpm dev

# Press 'p' to toggle performance overlay
# Shows frame rate and memory usage
```

---

## Next Steps

After setting up development:

1. Read [ARCHITECTURE.md](../technical/architecture.md) to understand code structure
2. Check [COMPONENTS.md](../technical/components.md) for available components
3. Review [TASK_MANAGEMENT.md](../features/task-management.md) for feature details
4. Explore [DEVELOPER_OPTIONS.md](../features/developer-options.md) for debugging tools

---

## Getting Help

### Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [Project Repository](https://github.com/Sanskar-in/MeTodo)

### Contact

- Email: sanskaryadavfrom2012to2026@gmail.com
- Twitter: https://x.com/SanskarCode
- GitHub: https://github.com/Sanskar-in

---

**Last Updated:** June 29, 2026  
**Version:** 1.0.0

Made with ❤️ by Sanskar Yadav
