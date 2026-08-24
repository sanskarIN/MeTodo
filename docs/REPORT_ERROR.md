# MeTodo - Error & Bug Reporting Guide

## =============================================================================
## (c) Copyright Sanskar Yadav. All rights reserved.
## Made by Sanskar Yadav.
## =============================================================================

## FILE PURPOSE
This document provides comprehensive guidelines for reporting errors, bugs, and issues in MeTodo. It helps users and developers report problems in a structured way that enables quick resolution.

---

## Table of Contents

1. [Before Reporting](#before-reporting)
2. [How to Report](#how-to-report)
3. [Error Report Template](#error-report-template)
4. [Bug Report Template](#bug-report-template)
5. [Crash Report Template](#crash-report-template)
6. [Performance Issue Template](#performance-issue-template)
7. [Security Issue Template](#security-issue-template)
8. [Data Loss Report Template](#data-loss-report-template)
9. [UI/UX Issue Template](#uiux-issue-template)
10. [Documentation Error Template](#documentation-error-template)
11. [Report Examples](#report-examples)
12. [Support & Follow-up](#support--follow-up)

---

## Before Reporting

### Check Existing Issues

Before reporting a new issue, please check if it has already been reported:

**1. Search GitHub Issues**
- Visit: https://github.com/Sanskar-in/MeTodo/issues
- Use search bar to find similar issues
- Filter by labels (bug, crash, performance, etc.)

**2. Check FAQ & Troubleshooting**
- Read: [FAQ & Troubleshooting](./FAQ_AND_TROUBLESHOOTING.md)
- Many common issues have solutions

**3. Check Documentation**
- Read: [Complete Documentation](./README.md)
- Check feature-specific guides
- Review technical documentation

### Try Basic Troubleshooting

Before reporting, try these steps:

**1. Restart the App**
```
Close MeTodo completely
Wait 5 seconds
Reopen MeTodo
Test if issue persists
```

**2. Restart Device**
```
Power off device
Wait 10 seconds
Power on device
Test if issue persists
```

**3. Clear Cache**
```
Go to Settings
Tap Developer Options (unlock first)
Tap "Clear Cache"
Test if issue persists
```

**4. Check Internet Connection**
```
Ensure stable internet (if needed)
Try on different network
Test if issue persists
```

**5. Update App**
```
Check for app updates
Install latest version
Test if issue persists
```

**6. Check Device Storage**
```
Ensure device has free storage (at least 500MB)
Delete unnecessary files
Test if issue persists
```

---

## How to Report

### Reporting Methods

**Method 1: GitHub Issues (Recommended)**
- Best for detailed bug reports
- Allows tracking and discussion
- Visible to entire community
- Link: https://github.com/Sanskar-in/MeTodo/issues

**Method 2: Email**
- For sensitive issues
- For security vulnerabilities
- Email: supportramsandesh@gmail.com
- Response time: 24-48 hours

**Method 3: GitHub Discussions**
- For questions and discussions
- For general feedback
- Link: https://github.com/Sanskar-in/MeTodo/discussions

### Report Priority

Determine the severity of your issue:

| Priority | Description | Example | Response Time |
|----------|-------------|---------|----------------|
| Critical | App crashes, data loss, security | App won't start, data deleted | 24 hours |
| High | Major feature broken, severe performance | Tasks not saving, app freezing | 48 hours |
| Medium | Feature partially broken, minor performance | Theme not applying, slow scrolling | 72 hours |
| Low | Minor issues, cosmetic problems | Typo, small UI issue | 1 week |

---

## Error Report Template

### Basic Error Report

Use this template for general errors and exceptions:

```markdown
## Error Report: [Brief Title]

### Error Priority
[ ] Critical  [ ] High  [ ] Medium  [ ] Low

### Device Information
- **Device:** [iPhone 14 Pro / Samsung Galaxy S23 / Other]
- **OS Version:** [iOS 17.1 / Android 14 / Other]
- **App Version:** [1.0.0 / Other]
- **Installation Method:** [App Store / Google Play / Expo Go / Built from Source]

### Error Details
**Error Message:**
```
[Paste exact error message here]
```

**Error Code (if any):**
[Error code or error ID]

**When Did It Occur:**
[Date and time when error occurred]

### Steps to Reproduce
1. [First step]
2. [Second step]
3. [Third step]
4. [Continue as needed]

### Expected Behavior
[What should happen]

### Actual Behavior
[What actually happened]

### Screenshots/Videos
[Attach screenshots or video of the error]

### Additional Information
[Any other relevant information]

### Error Logs
```
[Paste error logs here if available]
```

### Have You Tried
- [ ] Restarting the app
- [ ] Restarting the device
- [ ] Clearing cache
- [ ] Updating the app
- [ ] Checking internet connection
- [ ] Checking device storage
```

---

## Bug Report Template

### Detailed Bug Report

Use this template for bug reports:

```markdown
## Bug Report: [Brief Title]

### Bug Priority
[ ] Critical  [ ] High  [ ] Medium  [ ] Low

### Device Information
- **Device:** [Device model]
- **OS Version:** [OS version]
- **App Version:** [App version]
- **Installation Method:** [Installation method]

### Bug Description
[Clear and concise description of the bug]

### Steps to Reproduce
1. [First step]
2. [Second step]
3. [Third step]
4. [Continue as needed]

### Expected Behavior
[What should happen]

### Actual Behavior
[What actually happens]

### Screenshots
[Attach screenshots showing the bug]

### Video
[Attach video if helpful]

### Affected Features
- [ ] Task Management
- [ ] Avatar Creator
- [ ] Themes
- [ ] Settings
- [ ] Developer Options
- [ ] Other: [Specify]

### Related Issues
[Link to related issues if any]

### Possible Cause
[If you have any idea about the cause]

### Suggested Fix
[If you have a suggested fix]

### Additional Context
[Any other relevant information]
```

---

## Crash Report Template

### App Crash Report

Use this template when the app crashes:

```markdown
## Crash Report: [Brief Title]

### Crash Priority
[ ] Critical  [ ] High  [ ] Medium  [ ] Low

### Device Information
- **Device:** [Device model]
- **OS Version:** [OS version]
- **App Version:** [App version]
- **Installation Method:** [Installation method]

### What Were You Doing
[Describe what you were doing when the crash occurred]

### Steps to Reproduce
1. [First step]
2. [Second step]
3. [Third step]
4. [Continue as needed]

### Crash Logs
```
[Paste crash logs here]
```

### Stack Trace
```
[Paste stack trace here if available]
```

### Error Message
[Exact error message displayed]

### Screenshots
[Screenshot of crash screen if available]

### Console Output
```
[Paste console output here]
```

### Frequency
- [ ] Always crashes
- [ ] Crashes sometimes
- [ ] Crashed once
- [ ] Other: [Specify]

### Last Working Version
[Last version where this worked, if known]

### Additional Information
[Any other relevant information]
```

---

## Performance Issue Template

### Performance Problem Report

Use this template for performance issues:

```markdown
## Performance Issue: [Brief Title]

### Performance Priority
[ ] Critical  [ ] High  [ ] Medium  [ ] Low

### Device Information
- **Device:** [Device model]
- **OS Version:** [OS version]
- **App Version:** [App version]
- **Available RAM:** [Amount of RAM]
- **Available Storage:** [Amount of free storage]

### Performance Problem Description
[Clear description of the performance issue]

### Type of Performance Issue
- [ ] App startup slow
- [ ] Scrolling/animation stuttering
- [ ] Task operations slow
- [ ] Avatar preview slow
- [ ] Theme switching slow
- [ ] Memory leak
- [ ] Battery drain
- [ ] Other: [Specify]

### Steps to Reproduce
1. [First step]
2. [Second step]
3. [Third step]
4. [Continue as needed]

### Performance Metrics
- **Expected Time:** [How long it should take]
- **Actual Time:** [How long it actually takes]
- **FPS:** [Frames per second if known]
- **Memory Usage:** [Memory usage if known]

### Screenshots/Videos
[Attach screenshots or video showing the performance issue]

### Performance Monitor Data
```
[Paste performance monitor data if available]
```

### What Affects It
- [ ] Number of tasks
- [ ] Number of avatars
- [ ] Number of themes
- [ ] Device storage
- [ ] Device RAM
- [ ] Network connection
- [ ] Other: [Specify]

### Workaround
[If you found a workaround]

### Additional Information
[Any other relevant information]
```

---

## Security Issue Template

### Security Vulnerability Report

Use this template for security issues:

```markdown
## Security Issue: [Brief Title]

### Severity
[ ] Critical  [ ] High  [ ] Medium  [ ] Low

### Issue Type
- [ ] Data exposure
- [ ] Authentication bypass
- [ ] Encryption weakness
- [ ] Input validation
- [ ] Access control
- [ ] Other: [Specify]

### Description
[Clear description of the security issue]

### Affected Component
[Which part of the app is affected]

### Steps to Reproduce
1. [First step]
2. [Second step]
3. [Third step]
4. [Continue as needed]

### Impact
[What is the impact of this vulnerability]

### Proof of Concept
[If you have a proof of concept]

### Suggested Fix
[If you have a suggested fix]

### Disclosure Timeline
[When do you plan to disclose this publicly]

### Contact Information
[Your contact information for follow-up]

**IMPORTANT:** Please report security issues via email to supportramsandesh@gmail.com instead of GitHub Issues to avoid public disclosure.
```

---

## Data Loss Report Template

### Data Loss Issue Report

Use this template when data is lost:

```markdown
## Data Loss Report: [Brief Title]

### Severity
[ ] Critical  [ ] High  [ ] Medium  [ ] Low

### Device Information
- **Device:** [Device model]
- **OS Version:** [OS version]
- **App Version:** [App version]

### Data Lost
- [ ] Tasks
- [ ] Avatar
- [ ] Themes
- [ ] Settings
- [ ] Other: [Specify]

### Amount of Data Lost
[How much data was lost]

### When Was It Lost
[When did you notice the data was lost]

### Last Backup
[When was the last backup]

### What Happened
[Describe what happened before the data loss]

### Steps Before Data Loss
1. [First step]
2. [Second step]
3. [Third step]
4. [Continue as needed]

### Recovery Attempted
- [ ] Tried to restore from backup
- [ ] Tried to recover from trash
- [ ] Tried to undo
- [ ] Other: [Specify]

### Screenshots
[Screenshots showing the data loss]

### Backup Available
- [ ] Yes, I have a backup
- [ ] No, I don't have a backup

### Additional Information
[Any other relevant information]
```

---

## UI/UX Issue Template

### User Interface Problem Report

Use this template for UI/UX issues:

```markdown
## UI/UX Issue: [Brief Title]

### Issue Priority
[ ] Critical  [ ] High  [ ] Medium  [ ] Low

### Device Information
- **Device:** [Device model]
- **OS Version:** [OS version]
- **App Version:** [App version]

### Issue Type
- [ ] Button not working
- [ ] Text not visible
- [ ] Layout broken
- [ ] Navigation issue
- [ ] Accessibility problem
- [ ] Design inconsistency
- [ ] Other: [Specify]

### Issue Description
[Clear description of the UI/UX issue]

### Affected Screen
[Which screen is affected]

### Steps to Reproduce
1. [First step]
2. [Second step]
3. [Third step]
4. [Continue as needed]

### Screenshots
[Screenshot of the issue]

### Expected Behavior
[What should happen]

### Actual Behavior
[What actually happens]

### Device Orientation
- [ ] Portrait
- [ ] Landscape
- [ ] Both

### Theme
[Which theme are you using]

### Suggested Improvement
[Your suggestion for improvement]

### Additional Information
[Any other relevant information]
```

---

## Documentation Error Template

### Documentation Issue Report

Use this template for documentation errors:

```markdown
## Documentation Error: [Brief Title]

### Error Priority
[ ] Critical  [ ] High  [ ] Medium  [ ] Low

### Documentation File
[Which documentation file has the error]

### Error Type
- [ ] Typo
- [ ] Incorrect information
- [ ] Missing information
- [ ] Outdated information
- [ ] Broken link
- [ ] Code example error
- [ ] Other: [Specify]

### Error Description
[Clear description of the error]

### Location
[Where in the documentation is the error]

### Current Content
```
[Paste the current incorrect content]
```

### Correct Content
```
[Paste what the correct content should be]
```

### Impact
[How does this error affect users]

### Suggested Fix
[Your suggestion for fixing this error]

### Additional Information
[Any other relevant information]
```

---

## Report Examples

### Example 1: Task Not Saving

```markdown
## Bug Report: Tasks Not Saving

### Bug Priority
[x] Critical  [ ] High  [ ] Medium  [ ] Low

### Device Information
- **Device:** iPhone 14 Pro
- **OS Version:** iOS 17.1
- **App Version:** 1.0.0
- **Installation Method:** App Store

### Bug Description
When I create a new task and tap save, the task appears briefly but then disappears. The task is not actually saved.

### Steps to Reproduce
1. Open MeTodo app
2. Go to Home tab
3. Tap "+ Create New Task"
4. Enter task title "Test Task"
5. Tap "Save"
6. Close app
7. Reopen app
8. Task is gone

### Expected Behavior
Task should be saved and appear in the task list even after closing and reopening the app.

### Actual Behavior
Task appears briefly then disappears. Task is not saved.

### Screenshots
[Screenshot of the issue]

### Affected Features
[x] Task Management
[ ] Avatar Creator
[ ] Themes
[ ] Settings
[ ] Developer Options
[ ] Other

### Possible Cause
Might be an issue with AsyncStorage or data persistence.

### Additional Context
This happens consistently every time I try to create a task.
```

### Example 2: App Crash on Avatar Creation

```markdown
## Crash Report: App Crashes When Creating Avatar

### Crash Priority
[x] Critical  [ ] High  [ ] Medium  [ ] Low

### Device Information
- **Device:** Samsung Galaxy S23
- **OS Version:** Android 14
- **App Version:** 1.0.0
- **Installation Method:** Google Play

### What Were You Doing
I was trying to create a new avatar with custom colors.

### Steps to Reproduce
1. Go to Avatar tab
2. Tap "+ Create New Avatar"
3. Enter avatar name "My Avatar"
4. Select hair style "long"
5. Select hair color (red)
6. Select eye shape "round"
7. Tap "Save"
8. App crashes

### Crash Logs
```
E/AndroidRuntime: FATAL EXCEPTION: main
Process: space.manus.metodo, PID: 12345
java.lang.NullPointerException: Attempt to invoke virtual method 'getColor()' on a null object reference
```

### Stack Trace
```
at com.metodo.avatar.AvatarPreview.render(AvatarPreview.tsx:45)
at com.metodo.screens.AvatarScreen.onSave(AvatarScreen.tsx:78)
```

### Frequency
[x] Always crashes
[ ] Crashes sometimes
[ ] Crashed once
[ ] Other

### Additional Information
This happens every time I try to save an avatar with custom colors.
```

---

## Support & Follow-up

### After Reporting

**1. Monitor Your Report**
- Check GitHub Issues for updates
- Subscribe to notifications
- Respond to follow-up questions

**2. Provide Additional Information**
- If asked, provide more details
- Share additional logs or screenshots
- Test suggested fixes

**3. Verify Fix**
- When fix is released, test it
- Confirm if issue is resolved
- Report if issue persists

### Communication

**GitHub Issues**
- Maintainers will respond within 48-72 hours
- Updates posted on the issue
- Close issue when resolved

**Email**
- Response within 24-48 hours
- Direct communication with support team
- Confidential for sensitive issues

### Escalation

If your issue is not resolved:

1. **Follow up on GitHub Issue**
   - Add comment with additional information
   - Ask for status update

2. **Email Support**
   - Email: supportramsandesh@gmail.com
   - Reference GitHub issue number
   - Explain why issue is critical

3. **Social Media**
   - Contact on Twitter/X: @SanskarCode
   - LinkedIn: linkedin.com/in/sanskar-in
   - GitHub: github.com/Sanskar-in

---

## Contact Information

### Support Channels

**Email:** supportramsandesh@gmail.com

**GitHub Issues:** https://github.com/Sanskar-in/MeTodo/issues

**GitHub Discussions:** https://github.com/Sanskar-in/MeTodo/discussions

**Creator Email:** sanskaryadavfrom2012to2026@gmail.com

### Response Times

| Channel | Response Time | Availability |
|---------|---------------|--------------|
| GitHub Issues | 48-72 hours | Always |
| Email | 24-48 hours | Monday-Friday |
| Discussions | 72 hours | Always |
| Social Media | 2-3 days | Varies |

---

## Best Practices for Reporting

**DO:**
- ✅ Be clear and concise
- ✅ Provide all requested information
- ✅ Include screenshots/videos
- ✅ Test before reporting
- ✅ Search for existing issues
- ✅ Be respectful and professional
- ✅ Follow the template
- ✅ Provide reproducible steps

**DON'T:**
- ❌ Report without testing
- ❌ Use vague descriptions
- ❌ Report duplicates
- ❌ Be rude or aggressive
- ❌ Share sensitive information
- ❌ Report on wrong channel
- ❌ Ignore follow-up questions
- ❌ Spam or create multiple reports

---

**Last Updated:** June 29, 2026  
**Version:** 1.0.0

Made with ❤️ by Sanskar Yadav

---

**Thank you for helping us improve MeTodo! 🙏**
