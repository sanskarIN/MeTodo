# MeTodo - Installation Guide

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [iOS Installation](#ios-installation)
3. [Android Installation](#android-installation)
4. [Web Installation](#web-installation)
5. [Desktop Installation](#desktop-installation)
6. [Post-Installation](#post-installation)

---

## Prerequisites

### System Requirements

Before installing MeTodo, ensure your system meets the requirements:

- **iOS:** iOS 13.0 or higher
- **Android:** Android 7.0 (API 24) or higher
- **Web:** Modern browser (Chrome, Firefox, Safari, Edge)
- **Desktop:** Windows 10+, macOS 11+, or Linux

### Required Software

- **For Development:** Node.js 16+, pnpm 9.12+
- **For iOS:** Xcode 13.0+ (macOS only)
- **For Android:** Android SDK, Java JDK 11+
- **For Web:** Any modern browser

See [SYSTEM_REQUIREMENTS.md](../requirements/SYSTEM_REQUIREMENTS.md) for detailed requirements.

---

## iOS Installation

### Option 1: Install from App Store

**Coming Soon!** MeTodo will be available on the App Store.

1. Open App Store on your iPhone/iPad
2. Search for "MeTodo"
3. Tap **Get**
4. Authenticate with Face ID/Touch ID
5. Wait for installation to complete
6. Tap **Open** to launch

### Option 2: Install via TestFlight (Beta)

1. Open TestFlight app on your device
2. Tap **Apps**
3. Search for "MeTodo"
4. Tap **Install**
5. Accept terms
6. Wait for installation

### Option 3: Install from Development Build

**Requirements:**
- Xcode 13.0+
- Apple Developer Account
- Connected iPhone/iPad

**Steps:**

```bash
# Clone repository
git clone https://github.com/Sanskar-in/MeTodo.git
cd MeTodo

# Install dependencies
pnpm install

# Build for iOS
eas build --platform ios

# Download and install
# Follow Expo's instructions to install on device
```

### Option 4: Direct Installation (.ipa)

1. Download MeTodo.ipa file
2. Connect iPhone via USB
3. Open Xcode
4. Go to Window > Devices and Simulators
5. Select your device
6. Drag .ipa file to the app list
7. Wait for installation

---

## Android Installation

### Option 1: Install from Google Play Store

**Coming Soon!** MeTodo will be available on Google Play.

1. Open Google Play Store on your Android device
2. Search for "MeTodo"
3. Tap **Install**
4. Accept permissions
5. Wait for installation
6. Tap **Open** to launch

### Option 2: Install via APK File

**Requirements:**
- Android 7.0+
- Unknown sources enabled

**Steps:**

1. Download MeTodo.apk file
2. Open file manager
3. Navigate to Downloads folder
4. Tap MeTodo.apk
5. Tap **Install**
6. Accept permissions
7. Wait for installation
8. Tap **Open** to launch

**Enable Unknown Sources (if needed):**
1. Settings > Security
2. Enable "Unknown Sources"
3. Try installation again

### Option 3: Install from Development Build

**Requirements:**
- Android SDK installed
- Android device or emulator
- USB debugging enabled (for physical device)

**Steps:**

```bash
# Clone repository
git clone https://github.com/Sanskar-in/MeTodo.git
cd MeTodo

# Install dependencies
pnpm install

# Build APK
eas build --platform android

# Download APK
# Install on device
adb install metodo.apk
```

### Option 4: Install via Android App Bundle (AAB)

1. Download MeTodo.aab file
2. Upload to Google Play Console
3. Google Play generates optimized APK for your device
4. Install via Play Store

---

## Web Installation

### Option 1: Access Online Version

1. Open web browser
2. Visit: https://metodo.app (or your hosting URL)
3. App loads automatically
4. No installation needed
5. Bookmark for quick access

### Option 2: Install as Progressive Web App (PWA)

**Chrome/Edge:**
1. Open MeTodo web app
2. Click address bar icon (install icon)
3. Click **Install**
4. App installs to your computer
5. Launch from applications menu

**Firefox:**
1. Open MeTodo web app
2. Click menu (☰)
3. Select **Install App**
4. Confirm installation
5. Launch from applications menu

**Safari:**
1. Open MeTodo web app
2. Tap Share icon
3. Select **Add to Home Screen**
4. Enter app name
5. Tap **Add**
6. App appears on home screen

### Option 3: Self-Hosted Installation

**Requirements:**
- Web server (Nginx, Apache, etc.)
- Domain name (optional)
- SSL certificate (recommended)

**Steps:**

```bash
# Build web version
pnpm build

# Copy dist/ to web server
scp -r dist/ user@server:/var/www/metodo

# Configure web server
# Ensure all routes redirect to index.html
```

**Nginx Configuration:**
```nginx
server {
    listen 80;
    server_name metodo.example.com;

    root /var/www/metodo;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Enable gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript;
}
```

---

## Desktop Installation

### Windows Installation

**Requirements:**
- Windows 10 or higher
- 100MB free disk space

**Steps:**

1. Download MeTodo-Setup.exe
2. Double-click to run installer
3. Accept license agreement
4. Choose installation location
5. Click **Install**
6. Wait for installation
7. Check "Launch MeTodo" checkbox
8. Click **Finish**

**Manual Installation:**
```bash
# Download portable version
# Extract to desired location
# Run MeTodo.exe
```

### macOS Installation

**Requirements:**
- macOS 11 or higher
- 100MB free disk space

**Steps:**

1. Download MeTodo.dmg
2. Double-click to mount
3. Drag MeTodo.app to Applications folder
4. Wait for copy to complete
5. Open Applications folder
6. Double-click MeTodo.app
7. Click **Open** if prompted

**Via Homebrew:**
```bash
# Install via Homebrew (if available)
brew install metodo

# Launch
metodo
```

### Linux Installation

**Requirements:**
- Ubuntu 18.04+ or equivalent
- 100MB free disk space

**Debian/Ubuntu:**
```bash
# Download .deb file
wget metodo_1.0.0_amd64.deb

# Install
sudo dpkg -i metodo_1.0.0_amd64.deb

# Launch
metodo
```

**Fedora/RHEL:**
```bash
# Download .rpm file
wget metodo-1.0.0-1.x86_64.rpm

# Install
sudo rpm -i metodo-1.0.0-1.x86_64.rpm

# Launch
metodo
```

**Snap:**
```bash
# Install via Snap
sudo snap install metodo

# Launch
metodo
```

---

## Post-Installation

### Initial Setup

After installation, follow these steps:

1. **Launch the App**
   - Click/tap the MeTodo icon
   - App opens to welcome screen

2. **Create Your Avatar**
   - Customize your avatar
   - Choose hair, eyes, accessories, skin tone
   - Save when satisfied

3. **Choose a Theme**
   - Browse 50+ themes
   - Select your favorite
   - Or create a custom theme

4. **Create Your First Task**
   - Tap "Create New Task"
   - Enter task details
   - Save to get started

### Verify Installation

**Check if app works correctly:**

1. Create a test task
2. Mark it as complete
3. Delete the test task
4. Change theme
5. Customize avatar
6. Access settings

All features should work smoothly.

### Enable Notifications (Optional)

1. Go to Settings
2. Enable Notifications
3. Grant app permission to send notifications
4. Notifications will alert you about due tasks

### Backup Your Data

1. Go to Settings
2. Tap "Export Data"
3. Save backup file to safe location
4. You can restore from this backup later

---

## Troubleshooting Installation

### Installation Fails

**iOS:**
```
Error: "Unable to Install"
Solution: 
- Check device storage space
- Restart device
- Try again
```

**Android:**
```
Error: "Installation Blocked"
Solution:
- Enable "Unknown Sources" in Settings
- Disable antivirus temporarily
- Try again
```

**Web:**
```
Error: "Page Not Loading"
Solution:
- Clear browser cache
- Try different browser
- Check internet connection
```

### App Won't Launch

**Solution:**
1. Force close the app
2. Clear app cache
3. Restart device
4. Reinstall app

### Permissions Issues

**iOS:**
1. Settings > MeTodo
2. Enable required permissions
3. Restart app

**Android:**
1. Settings > Apps > MeTodo
2. Permissions
3. Enable required permissions
4. Restart app

### Storage Issues

**Solution:**
1. Check available storage space
2. Delete unnecessary files
3. Clear app cache
4. Reinstall if needed

---

## Uninstallation

### iOS

1. Long press MeTodo icon
2. Tap "Remove App"
3. Tap "Remove from Home Screen"
4. Confirm

### Android

1. Settings > Apps
2. Find MeTodo
3. Tap "Uninstall"
4. Confirm

### Web (PWA)

**Chrome:**
1. Settings > Apps
2. Find MeTodo
3. Click menu (⋮)
4. Select "Remove from Chrome"

**Firefox:**
1. about:addons
2. Find MeTodo
3. Click "Remove"

### Desktop

**Windows:**
1. Settings > Apps
2. Find MeTodo
3. Click "Uninstall"
4. Follow wizard

**macOS:**
1. Open Applications folder
2. Find MeTodo
3. Drag to Trash
4. Empty Trash

**Linux:**
```bash
# Ubuntu/Debian
sudo apt-get remove metodo

# Fedora
sudo dnf remove metodo

# Snap
sudo snap remove metodo
```

---

## Getting Help

### Installation Support

- **Email:** sanskaryadavfrom2012to2026@gmail.com
- **GitHub Issues:** https://github.com/Sanskar-in/MeTodo/issues
- **Twitter:** https://x.com/SanskarCode

### Documentation

- [System Requirements](../requirements/SYSTEM_REQUIREMENTS.md)
- [Development Setup](./DEVELOPMENT_SETUP.md)
- [Getting Started](../guides/GETTING_STARTED.md)

---

**Last Updated:** June 29, 2026  
**Version:** 1.0.0

Made with ❤️ by Sanskar Yadav
