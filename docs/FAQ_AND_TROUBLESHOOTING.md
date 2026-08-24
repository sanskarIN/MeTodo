# MeTodo - FAQ & Troubleshooting Guide

## =============================================================================
## (c) Copyright Sanskar Yadav. All rights reserved.
## Made by Sanskar Yadav.
## =============================================================================

## FILE PURPOSE
Comprehensive FAQ and troubleshooting guide for MeTodo, covering common issues, solutions, and frequently asked questions from users and developers.

---

## Table of Contents

1. [General Questions](#general-questions)
2. [Installation & Setup](#installation--setup)
3. [Usage Issues](#usage-issues)
4. [Performance Issues](#performance-issues)
5. [Data & Storage](#data--storage)
6. [Themes & Customization](#themes--customization)
7. [Avatar Creator](#avatar-creator)
8. [Developer Options](#developer-options)
9. [Technical Issues](#technical-issues)
10. [Support & Contact](#support--contact)

---

## General Questions

### Q: What is MeTodo?

**A:** MeTodo is a comprehensive, feature-rich task management mobile application built with React Native and Expo. It helps users organize, track, and complete their daily tasks and goals while maintaining complete control over their data through offline-first architecture.

### Q: Is MeTodo free?

**A:** Yes, MeTodo is completely free and open source. There are no hidden charges or premium features. All functionality is available to all users.

### Q: Is my data private?

**A:** Yes, your data is completely private. All data is stored locally on your device by default. No data is sent to servers unless you explicitly enable cloud sync (planned for future versions).

### Q: Can I use MeTodo offline?

**A:** Yes, MeTodo works completely offline. All features are available without internet connection. Data is stored locally on your device.

### Q: Does MeTodo sync across devices?

**A:** Currently, data is stored locally on each device. Cloud sync is planned for future versions (v1.2.0). You can manually export and import data between devices.

### Q: What platforms does MeTodo support?

**A:** MeTodo is available on:
- iOS (iPhone, iPad)
- Android (phones and tablets)
- Web (browsers)
- macOS (planned)
- Windows (planned)

### Q: Can I contribute to MeTodo?

**A:** Yes! MeTodo is open source and welcomes contributions. See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

### Q: How can I report bugs?

**A:** Report bugs on GitHub Issues: https://github.com/Sanskar-in/MeTodo/issues

Or email: supportramsandesh@gmail.com

### Q: How can I suggest features?

**A:** Suggest features on GitHub Discussions: https://github.com/Sanskar-in/MeTodo/discussions

Or email: supportramsandesh@gmail.com

---

## Installation & Setup

### Q: How do I install MeTodo?

**A:** 

**Option 1: From App Store**
- iOS: Download from Apple App Store
- Android: Download from Google Play Store

**Option 2: From Expo Go**
1. Install Expo Go app
2. Scan QR code from MeTodo website
3. App opens in Expo Go

**Option 3: Build from Source**
```bash
git clone https://github.com/Sanskar-in/MeTodo.git
cd metodo
pnpm install
pnpm dev
```

### Q: What are the system requirements?

**A:** See [System Requirements](./requirements/SYSTEM_REQUIREMENTS.md) for detailed information.

**Minimum:**
- Node.js 18.0.0+
- 2GB free disk space
- 4GB RAM

### Q: How do I set up development environment?

**A:** See [Development Setup](./how-to-run/DEVELOPMENT_SETUP.md) for detailed instructions.

### Q: I'm getting installation errors. What should I do?

**A:**

**Clear cache and reinstall:**
```bash
rm -rf node_modules
rm pnpm-lock.yaml
pnpm install
```

**Update Node.js:**
```bash
# Check version
node --version

# Update if needed
# Visit https://nodejs.org
```

**Check internet connection:**
- Ensure stable internet connection
- Try again after few minutes

**Still having issues?**
- Email: supportramsandesh@gmail.com
- GitHub Issues: https://github.com/Sanskar-in/MeTodo/issues

---

## Usage Issues

### Q: How do I create a task?

**A:**
1. Go to Home tab
2. Tap "+ Create New Task"
3. Enter task title
4. Add details (priority, due date, category, tags, notes)
5. Tap "Save"

### Q: How do I edit a task?

**A:**
1. Go to Home or Tasks tab
2. Tap the task
3. Modify details
4. Tap "Save"

### Q: How do I delete a task?

**A:**
1. Go to Home or Tasks tab
2. Swipe left on task (iOS) or long-press (Android)
3. Tap "Delete"
4. Confirm deletion

### Q: How do I mark a task as complete?

**A:**
1. Go to Home or Tasks tab
2. Tap the checkbox next to task
3. Task is marked as complete

### Q: How do I create subtasks?

**A:**
1. Open a task
2. Scroll to "Subtasks" section
3. Tap "+ Add Subtask"
4. Enter subtask title
5. Tap "Add"

### Q: How do I set task reminders?

**A:**
1. Open a task
2. Scroll to "Reminders" section
3. Tap "+ Add Reminder"
4. Set reminder time
5. Tap "Save"

### Q: How do I create recurring tasks?

**A:**
1. Create a task
2. Scroll to "Recurrence" section
3. Select recurrence type (Daily, Weekly, Monthly, Yearly)
4. Set recurrence pattern
5. Tap "Save"

### Q: How do I search for tasks?

**A:**
1. Go to Tasks tab
2. Tap search icon
3. Enter search query
4. Results appear in real-time

### Q: How do I filter tasks?

**A:**
1. Go to Tasks tab
2. Tap filter icon
3. Select filters:
   - Status (Completed, Pending, Overdue)
   - Priority (Low, Medium, High)
   - Category
   - Tags
   - Due date range
4. Results update automatically

### Q: How do I sort tasks?

**A:**
1. Go to Tasks tab
2. Tap sort icon
3. Select sort option:
   - Priority
   - Due date
   - Created date
   - Alphabetically
4. Tasks are sorted

---

## Performance Issues

### Q: App is running slowly. What can I do?

**A:**

**1. Clear cache:**
- Go to Settings
- Tap "Developer Options" (unlock first)
- Tap "Clear Cache"

**2. Close other apps:**
- Close unnecessary background apps
- Free up device memory

**3. Restart app:**
- Close MeTodo completely
- Reopen MeTodo

**4. Restart device:**
- Restart your phone
- Clear memory

**5. Update app:**
- Check for app updates
- Install latest version

### Q: Task list scrolling is stuttering. How do I fix it?

**A:**

**1. Reduce number of tasks displayed:**
- Use filters to show fewer tasks
- Archive completed tasks

**2. Clear cache:**
- Go to Settings
- Developer Options
- Clear Cache

**3. Disable animations:**
- Go to Settings
- Developer Options
- Toggle "Animations" OFF

**4. Close other apps:**
- Free up device memory
- Restart device

### Q: Avatar preview is slow. What should I do?

**A:**

**1. Reduce avatar complexity:**
- Use fewer accessories
- Simpler hair style

**2. Close other apps:**
- Free up device memory
- Restart device

**3. Clear cache:**
- Go to Settings
- Developer Options
- Clear Cache

### Q: App crashes. How do I fix it?

**A:**

**1. Restart app:**
- Close MeTodo completely
- Reopen MeTodo

**2. Restart device:**
- Restart your phone
- Clear memory

**3. Update app:**
- Check for app updates
- Install latest version

**4. Reinstall app:**
- Delete MeTodo
- Reinstall from app store

**5. Report crash:**
- Go to Settings
- Developer Options
- Tap "Crash Reporter"
- Share crash report
- Email: supportramsandesh@gmail.com

---

## Data & Storage

### Q: Where is my data stored?

**A:** All data is stored locally on your device in AsyncStorage. No data is sent to servers unless you enable cloud sync.

### Q: How much storage does MeTodo use?

**A:**

**Check storage usage:**
1. Go to Settings
2. Developer Options (unlock first)
3. Tap "Storage Stats"
4. View detailed breakdown

**Typical usage:**
- App: 50-100 MB
- Data: 1-10 MB (depending on tasks)
- Cache: 5-20 MB

### Q: How do I export my data?

**A:**

**Export all data:**
1. Go to Settings
2. Developer Options (unlock first)
3. Tap "Export Data"
4. Select format (JSON, CSV, XML)
5. File is created
6. Share or save file

### Q: How do I import data?

**A:**

**Import data:**
1. Go to Settings
2. Developer Options (unlock first)
3. Tap "Import Data"
4. Select data file
5. Choose merge or replace
6. Data is imported

### Q: How do I backup my data?

**A:**

**Manual backup:**
1. Export data (see above)
2. Save file to cloud storage (Google Drive, Dropbox, etc.)
3. Or email to yourself

**Automatic backup (planned):**
- Cloud sync feature coming in v1.2.0

### Q: How do I restore data?

**A:**

**Restore from backup:**
1. Get backup file
2. Go to Settings
3. Developer Options (unlock first)
4. Tap "Import Data"
5. Select backup file
6. Choose "Replace existing"
7. Data is restored

### Q: I accidentally deleted a task. Can I recover it?

**A:** Currently, deleted tasks cannot be recovered. In future versions, we'll add:
- Trash/recycle bin
- Undo functionality
- Automatic backups

**For now:**
- Use exported backup if available
- Recreate task manually

---

## Themes & Customization

### Q: How do I change the theme?

**A:**
1. Go to Settings tab
2. Tap "Themes"
3. Select a theme from the list
4. Theme changes immediately

### Q: How do I create a custom theme?

**A:**
1. Go to Settings tab
2. Tap "Themes"
3. Tap "+ Create Custom Theme"
4. Enter theme name
5. Customize colors:
   - Primary color
   - Secondary color
   - Background color
   - Text color
   - And more
6. Preview theme
7. Tap "Save"

### Q: How do I delete a custom theme?

**A:**
1. Go to Settings tab
2. Tap "Themes"
3. Long-press custom theme
4. Tap "Delete"
5. Confirm deletion

### Q: How do I switch between light and dark mode?

**A:**
1. Go to Settings tab
2. Tap "Appearance"
3. Select:
   - Light mode
   - Dark mode
   - System (follows device setting)

### Q: Can I schedule theme changes?

**A:** Planned for future versions. Currently, you can manually switch themes.

### Q: How many themes can I create?

**A:** You can create unlimited custom themes. Storage depends on device capacity.

---

## Avatar Creator

### Q: How do I create an avatar?

**A:**
1. Go to Avatar tab
2. Tap "+ Create New Avatar"
3. Enter avatar name
4. Customize:
   - Hair (style and color)
   - Eyes (shape and color)
   - Accessories
   - Skin tone
5. Preview avatar
6. Tap "Save"

### Q: How do I edit an avatar?

**A:**
1. Go to Avatar tab
2. Tap the avatar
3. Modify customization
4. Tap "Save"

### Q: How do I delete an avatar?

**A:**
1. Go to Avatar tab
2. Swipe left on avatar (iOS) or long-press (Android)
3. Tap "Delete"
4. Confirm deletion

### Q: How do I set an avatar as active?

**A:**
1. Go to Avatar tab
2. Tap the avatar
3. Tap "Set as Active"
4. Avatar is now displayed in home screen

### Q: Can I have multiple avatars?

**A:** Yes, you can create and manage multiple avatars. Only one is active at a time.

### Q: How many avatars can I create?

**A:** You can create unlimited avatars. Storage depends on device capacity.

---

## Developer Options

### Q: How do I unlock Developer Options?

**A:**
1. Go to Settings tab
2. Tap "About"
3. Tap "App Version" 10 times
4. "Developer Options Unlocked" message appears
5. Developer Options now available in Settings

### Q: What are Developer Options?

**A:** Developer Options are 30+ debugging and development tools for developers and power users. See [Developer Options Documentation](./features/DEVELOPER_OPTIONS_DETAILED.md) for details.

### Q: How do I disable Developer Options?

**A:**
1. Go to Settings tab
2. Tap "Developer Options"
3. Tap "Disable Developer Options"
4. Confirm action
5. Developer Options hidden

### Q: What is Performance Overlay?

**A:** Shows real-time performance metrics:
- FPS (Frames Per Second)
- Memory usage
- CPU usage
- Render time

### Q: What is Show Layout Bounds?

**A:** Visualizes component boundaries with colored borders. Helps debug layout issues.

### Q: What is Network Monitor?

**A:** Monitors all network requests:
- Request URL
- HTTP method
- Status code
- Response time
- Request/response data

---

## Technical Issues

### Q: App won't start. What should I do?

**A:**

**1. Force close app:**
- iOS: Swipe up from bottom
- Android: Tap back button multiple times

**2. Restart device:**
- Restart your phone
- Clear memory

**3. Clear app data:**
- iOS: Settings > General > iPhone Storage > MeTodo > Delete App
- Android: Settings > Apps > MeTodo > Storage > Clear Data

**4. Reinstall app:**
- Delete MeTodo
- Reinstall from app store

**5. Report issue:**
- Email: supportramsandesh@gmail.com
- GitHub: https://github.com/Sanskar-in/MeTodo/issues

### Q: Notifications not working. How do I fix it?

**A:**

**1. Check notification settings:**
- Go to Settings
- Tap "Notifications"
- Ensure notifications are enabled

**2. Check device settings:**
- iOS: Settings > Notifications > MeTodo > Allow Notifications
- Android: Settings > Apps > MeTodo > Notifications > Allow

**3. Restart app:**
- Close and reopen MeTodo

**4. Restart device:**
- Restart your phone

### Q: Data not saving. What should I do?

**A:**

**1. Check storage space:**
- Ensure device has free storage
- Delete unnecessary files

**2. Restart app:**
- Close and reopen MeTodo

**3. Restart device:**
- Restart your phone

**4. Check permissions:**
- iOS: Settings > Privacy > Storage
- Android: Settings > Apps > MeTodo > Permissions

### Q: Theme not applying. How do I fix it?

**A:**

**1. Restart app:**
- Close and reopen MeTodo

**2. Clear cache:**
- Go to Settings
- Developer Options
- Clear Cache

**3. Restart device:**
- Restart your phone

### Q: Avatar not displaying. What should I do?

**A:**

**1. Restart app:**
- Close and reopen MeTodo

**2. Set avatar again:**
- Go to Avatar tab
- Select avatar
- Tap "Set as Active"

**3. Clear cache:**
- Go to Settings
- Developer Options
- Clear Cache

---

## Support & Contact

### Getting Help

**Documentation:**
- [Complete Documentation](./README.md)
- [Getting Started](./guides/GETTING_STARTED.md)
- [API Documentation](./technical/API_DOCUMENTATION.md)
- [Feature Guides](./features/)

**Community:**
- [GitHub Issues](https://github.com/Sanskar-in/MeTodo/issues)
- [GitHub Discussions](https://github.com/Sanskar-in/MeTodo/discussions)

**Direct Support:**
- Email: supportramsandesh@gmail.com
- Response time: 24-48 hours

### Contact Information

**Creator:**
- **Email:** sanskaryadavfrom2012to2026@gmail.com
- **GitHub:** https://github.com/Sanskar-in
- **Twitter:** https://x.com/SanskarCode
- **LinkedIn:** https://linkedin.com/in/sanskar-in

**Support:**
- **Email:** supportramsandesh@gmail.com
- **Available:** Monday-Friday, 9 AM - 6 PM IST

### Reporting Issues

**Report Bug:**
1. Check existing issues
2. Create new issue on GitHub
3. Include:
   - Device and OS
   - App version
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots/logs

**Request Feature:**
1. Check existing requests
2. Create feature request on GitHub
3. Describe use case
4. Explain benefits
5. Provide examples

---

**Last Updated:** June 29, 2026  
**Version:** 1.0.0

Made with ❤️ by Sanskar Yadav
