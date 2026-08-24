# MeTodo - Mobile App Design Specification

## Design Philosophy

MeTodo follows **Apple Human Interface Guidelines (HIG)** to feel like a first-party iOS app. The design emphasizes clarity, efficiency, and delight through modern design principles including glassmorphism, dynamic colors, fluid micro-animations, premium typography, and responsive layouts.

**Target Orientation:** Portrait (9:16)  
**Interaction Model:** One-handed usage optimized  
**Brand Identity:** Modern, premium, productivity-focused

---

## Color Palette

### Primary Colors
- **Primary Accent:** `#0a7ea4` (Teal Blue) - Used for interactive elements, buttons, and highlights
- **Secondary Accent:** `#6366f1` (Indigo) - Used for secondary actions and accents
- **Tertiary Accent:** `#ec4899` (Pink) - Used for completion states and positive feedback

### Semantic Colors
- **Background:** `#ffffff` (Light), `#151718` (Dark)
- **Surface:** `#f5f5f5` (Light), `#1e2022` (Dark)
- **Foreground:** `#11181C` (Light), `#ECEDEE` (Dark)
- **Muted:** `#687076` (Light), `#9BA1A6` (Dark)
- **Border:** `#E5E7EB` (Light), `#334155` (Dark)
- **Success:** `#22C55E` (Light), `#4ADE80` (Dark)
- **Warning:** `#F59E0B` (Light), `#FBBF24` (Dark)
- **Error:** `#EF4444` (Light), `#F87171` (Dark)

### Theme Support
- 50+ pre-installed themes including AMOLED dark, pastel, neon, high-contrast, and minimalist options
- Custom theme creator allowing users to pick primary, secondary, and background colors

---

## Screen List

### 1. Splash Screen
**Purpose:** App launch animation with logo  
**Content:** 
- Animated MeTodo logo with fade-in effect
- App name with subtle scale animation
- Loading indicator (optional)

**Functionality:**
- Auto-dismiss after 2-3 seconds
- Smooth transition to home screen

---

### 2. Home Screen (Task List)
**Purpose:** Main task management hub  
**Content:**
- Welcome header with user's avatar
- Search bar for task filtering
- Task list with categories/tags
- Floating action button (FAB) for new tasks
- Statistics widget (tasks completed, pending, overdue)

**Functionality:**
- Swipe-to-delete tasks
- Tap to view task details
- Long-press for quick actions (edit, delete, mark complete)
- Pull-to-refresh
- Filter by category/tag
- Sort by priority, due date, or creation date

---

### 3. Task Detail Screen
**Purpose:** View and edit individual tasks  
**Content:**
- Task title and description
- Due date and time picker
- Priority selector (Low, Medium, High)
- Category/tag selector
- Subtasks list with add button
- Recurring options
- Reminders configuration
- Rich text notes editor
- Completion checkbox
- Delete button

**Functionality:**
- Edit all task properties
- Add/remove subtasks
- Set reminders
- Configure recurring patterns
- Mark task as complete
- Archive or delete task

---

### 4. Create/Edit Task Screen
**Purpose:** Create new or modify existing tasks  
**Content:**
- Task title input field
- Description textarea with rich text formatting
- Date/time picker
- Priority selector
- Category/tag selector
- Recurring options dropdown
- Reminder time selector
- Subtask input area

**Functionality:**
- Auto-save drafts
- Rich text formatting (bold, italic, underline, lists)
- Date/time picker with calendar
- Multiple reminder options
- Recurring task patterns (daily, weekly, monthly, custom)

---

### 5. Avatar Creator Screen
**Purpose:** Customize user avatar  
**Content:**
- Avatar preview (large, centered)
- Hair options (style, color)
- Eyes options (shape, color)
- Accessories options (glasses, hats, etc.)
- Skin tone selector
- Save and cancel buttons

**Functionality:**
- Real-time preview updates
- Swipe through options for each feature
- Save avatar locally
- Use avatar in home screen header

---

### 6. Settings Screen
**Purpose:** App configuration and information  
**Content:**
- Theme selector with 50+ options
- Custom theme creator button
- App version display (tap 10x to unlock Developer Options)
- Creator social links section:
  - GitHub link
  - LinkedIn link
  - X (Twitter) link
- Contact/Hire Me section with email
- Open Source Info with GitHub link
- About section
- Feedback/Support options

**Functionality:**
- Theme switching with instant preview
- Custom theme creation and saving
- Open social links in browser
- Copy email to clipboard
- Version tap counter for developer options

---

### 7. Custom Theme Creator Screen
**Purpose:** Create and save custom themes  
**Content:**
- Theme name input
- Primary color picker
- Secondary color picker
- Background color picker
- Preview of theme applied to sample UI
- Save and cancel buttons
- List of saved custom themes

**Functionality:**
- Color picker with hex/RGB input
- Real-time preview
- Save custom themes
- Delete custom themes
- Apply custom themes
- Export/import themes

---

### 8. Developer Options Screen
**Purpose:** Advanced debugging and development tools  
**Content:**
- Normal Developer Tools section:
  - Layout bounds toggle
  - Performance overlay toggle
  - Clear cache button
  - Export logs button
  - Force dark mode toggle
  - Network delay simulator
  - Storage stats viewer
  - Animation speed adjuster
  - Touch targets display toggle
  - Frame rate monitor toggle
  - Memory monitor toggle
  - Font size adjuster
  - Accessibility inspector
  - Color contrast checker
  - Device info display
  - Network activity monitor
  - Crash reporter
  - Debug console

- Advanced Developer Tools section:
  - Database query inspector
  - Memory allocation tracker
  - UI jank monitor
  - API endpoint override
  - Deep link tester
  - State reset button
  - Performance profiler
  - Network throttler
  - Redux DevTools toggle
  - Error boundary tester

**Functionality:**
- Toggle various debugging features
- Export logs to file
- Clear app cache
- Simulate network conditions
- View system information
- Test error boundaries
- Monitor performance metrics

---

## Key User Flows

### Flow 1: Create a New Task
1. User taps FAB on home screen
2. Create Task screen opens
3. User enters title, description, date, priority, category
4. User can add subtasks
5. User sets reminders and recurring options
6. User taps "Save"
7. Task appears in home screen list
8. Confirmation haptic feedback

### Flow 2: Complete a Task
1. User sees task in home screen list
2. User taps task to open detail screen
3. User taps completion checkbox
4. Task marked as complete with visual feedback
5. Task moves to completed section or hides based on settings
6. Success haptic feedback

### Flow 3: Customize Avatar
1. User navigates to Settings
2. User taps "Avatar" or avatar preview
3. Avatar Creator screen opens
4. User swipes through hair, eyes, accessories options
5. User selects colors and customizations
6. User taps "Save"
7. Avatar updates in home screen header
8. Avatar saved locally

### Flow 4: Create Custom Theme
1. User navigates to Settings
2. User taps "Create Custom Theme"
3. Custom Theme Creator screen opens
4. User picks primary, secondary, background colors
5. User sees real-time preview
6. User enters theme name
7. User taps "Save"
8. Theme added to theme list
9. User can apply theme immediately

### Flow 5: Access Developer Options
1. User navigates to Settings
2. User taps app version 10 times
3. Developer Options screen unlocks
4. User can access all 30+ developer tools
5. Tools can be toggled on/off
6. Changes apply in real-time

---

## Typography

- **Heading 1 (Hero):** 34pt, Bold, Line height 1.2
- **Heading 2 (Section):** 28pt, Semibold, Line height 1.3
- **Heading 3 (Subsection):** 22pt, Semibold, Line height 1.3
- **Body (Regular):** 17pt, Regular, Line height 1.5
- **Body (Small):** 15pt, Regular, Line height 1.4
- **Caption:** 13pt, Regular, Line height 1.4
- **Monospace (Code):** 13pt, Regular, Line height 1.5

---

## Spacing & Layout

- **Padding:** 16pt standard, 12pt compact, 20pt spacious
- **Margin:** 16pt between sections, 8pt between items
- **Corner Radius:** 12pt for cards, 8pt for buttons, 16pt for modals
- **Safe Area:** Respected on all edges with ScreenContainer

---

## Interaction Patterns

### Press Feedback
- **Primary Buttons:** Scale 0.97 + haptic light impact
- **List Items/Cards:** Opacity 0.7 on press
- **Icons/Minor Actions:** Opacity 0.6 on press

### Animations
- **Transitions:** 250-300ms with easing
- **Micro-interactions:** 80-150ms for immediate feedback
- **Entrance Animations:** Subtle fade-in (250ms)
- **All animations:** Respect reduced motion preferences

---

## Accessibility

- **Color Contrast:** WCAG AA minimum (4.5:1 for text)
- **Touch Targets:** Minimum 44x44pt
- **Text Sizing:** Respects system font size settings
- **Haptics:** Used for critical feedback, respects haptics toggle
- **VoiceOver:** Full support with proper labels and hints

---

## Offline Functionality

- All core features work offline using local AsyncStorage
- Tasks, avatars, themes stored locally
- Sync to cloud when available (future feature)
- Offline indicator in status bar (when applicable)

---

## Performance Targets

- **App Launch:** < 2 seconds
- **Task List Scroll:** 60 FPS smooth
- **Theme Switch:** < 300ms
- **Avatar Creator:** Real-time preview without lag
- **Memory Usage:** < 150MB on typical device

