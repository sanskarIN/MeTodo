// =============================================================================
// (c) Copyright Sanskar Yadav. All rights reserved.
// Made by Sanskar Yadav.
// =============================================================================

# Voice Task Creation Documentation

## Overview

Voice Task Creation is a hands-free feature that allows users to create tasks by speaking naturally. The system uses advanced natural language processing to extract task details from voice input, including title, priority, category, due date, and tags.

---

## Features

### Core Features

- **Natural Language Processing:** Understands task details from conversational speech
- **Intelligent Extraction:** Automatically identifies priority, category, and due date
- **Flexible Input:** Accepts various ways of expressing the same task
- **Confidence Scoring:** Provides confidence levels for accuracy
- **Validation:** Ensures extracted tasks are valid before creation

### Supported Extraction

- Task title and description
- Priority levels (high, medium, low)
- Categories (work, personal, shopping, health, finance, education, home, travel)
- Due dates (today, tomorrow, this week, next week, in X days)
- Tags (via hashtags and @mentions)

---

## Usage Guide

### Basic Usage

1. **Open Voice Creation Screen**
   - Tap microphone icon in app
   - Or say "Hey MeTodo, create a task"

2. **Speak Your Task**
   - Speak naturally and clearly
   - Example: "Create a high priority work task to finish the project report by tomorrow"

3. **Review Extraction**
   - System shows extracted task details
   - Verify all information is correct
   - Edit if needed

4. **Confirm Creation**
   - Tap "Create Task" button
   - Task is added to your list

### Voice Command Examples

#### Simple Tasks
- "Add buy groceries"
- "Create a task: call mom"
- "New task: send email to john"

#### Tasks with Priority
- "Create a high priority task: fix critical bug"
- "Add urgent: prepare presentation"
- "New low priority task: organize files"

#### Tasks with Due Dates
- "Create a task to finish report by tomorrow"
- "Add task: meeting with team this week"
- "New task: project deadline in 3 days"

#### Tasks with Categories
- "Create a work task: attend meeting"
- "Add personal task: exercise"
- "New shopping task: buy milk and eggs"

#### Tasks with Tags
- "Create task #urgent #work: review code"
- "Add task @john: discuss project"
- "New task #health: take vitamins"

#### Complex Tasks
- "Create a high priority work task to finish the quarterly report by Friday #important @manager"
- "Add urgent personal task: call dentist for appointment this week"
- "New task: prepare presentation for tomorrow's meeting #work @team"

---

## Natural Language Processing

### Priority Detection

The system recognizes priority keywords:

**High Priority:**
- "urgent"
- "asap"
- "high priority"
- "critical"
- "important"

**Low Priority:**
- "low priority"
- "whenever"
- "optional"
- "nice to have"

**Medium Priority:**
- "medium"
- "normal"
- "regular"

### Category Detection

Recognized categories:

| Category | Keywords |
|----------|----------|
| Work | work, job, project, meeting, report, email |
| Personal | personal, self, me, myself |
| Shopping | shopping, buy, purchase, store, shop |
| Health | health, doctor, medicine, exercise, fitness |
| Finance | finance, money, bill, payment, expense |
| Education | education, study, learn, course, school |
| Home | home, house, apartment, cleaning, repair |
| Travel | travel, trip, vacation, flight, hotel |

### Due Date Detection

**Relative Dates:**
- "today" → Same day
- "tomorrow" → Next day
- "this week" → End of current week
- "next week" → Next week
- "this month" → End of current month
- "next month" → End of next month

**Specific Durations:**
- "in X days" → X days from now
- "in X weeks" → X weeks from now

### Tag Extraction

**Hashtags:**
- Format: `#tagname`
- Example: "#urgent", "#work", "#important"

**@Mentions:**
- Format: `@username`
- Example: "@john", "@team", "@manager"

---

## API Reference

### VoiceTaskService

#### Methods

```typescript
// Start listening for voice input
startListening(): Promise<void>

// Stop listening
stopListening(): void

// Process voice input
processVoiceInput(text: string, confidence: number): VoiceTaskInput

// Extract task from voice input
extractTaskFromVoice(voiceInput: VoiceTaskInput): ExtractedTask

// Validate extracted task
validateTask(task: ExtractedTask): { valid: boolean; errors: string[] }

// Get voice input suggestions
getSuggestions(): string[]

// Check if currently listening
isCurrentlyListening(): boolean

// Get recognition text
getRecognitionText(): string

// Get confidence level
getConfidence(): number

// Clear recognition data
clearRecognition(): void
```

#### Usage Example

```typescript
import VoiceTaskService from '@/lib/voice-task-service';

const voiceService = new VoiceTaskService();

// Start listening
await voiceService.startListening();

// Process voice input
const voiceInput = voiceService.processVoiceInput(
  "Create a high priority work task to finish the report by tomorrow",
  0.95
);

// Extract task details
const extractedTask = voiceService.extractTaskFromVoice(voiceInput);

// Validate task
const validation = voiceService.validateTask(extractedTask);

if (validation.valid) {
  // Create task
  console.log('Task created:', extractedTask);
} else {
  // Show errors
  console.log('Validation errors:', validation.errors);
}
```

---

## Best Practices

### Speaking Tips

1. **Speak Clearly**
   - Enunciate words clearly
   - Avoid mumbling
   - Speak at normal pace

2. **Use Natural Language**
   - Speak as you would normally
   - No need for special commands
   - System understands conversational speech

3. **Be Specific**
   - Include relevant details
   - Mention priority if important
   - Specify due date if needed

4. **Keep It Concise**
   - Avoid very long sentences
   - Break complex tasks into multiple steps
   - Focus on key information

### Optimization Tips

1. **Batch Create Tasks**
   - Create multiple related tasks together
   - More efficient than individual creation
   - Helps establish patterns

2. **Use Consistent Language**
   - Use same keywords for categories
   - Consistent priority terminology
   - Helps system learn your patterns

3. **Review Before Confirming**
   - Always check extracted details
   - Correct any misunderstandings
   - Ensures task accuracy

4. **Provide Feedback**
   - Report incorrect extractions
   - Help system improve
   - Share suggestions for improvement

---

## Troubleshooting

### Voice Not Recognized

**Problem:** System doesn't recognize voice input

**Solutions:**
1. Check microphone is working
2. Speak more clearly
3. Reduce background noise
4. Try again with different phrasing

### Incorrect Task Extraction

**Problem:** System extracts wrong details

**Solutions:**
1. Be more specific in speech
2. Use standard keywords for priority/category
3. Manually edit extracted task
4. Report issue for improvement

### Low Confidence Score

**Problem:** Confidence level is below 50%

**Solutions:**
1. Repeat the task creation
2. Speak more clearly
3. Reduce background noise
4. Use simpler language

### Microphone Permission Denied

**Problem:** App can't access microphone

**Solutions:**
1. Check app permissions in settings
2. Grant microphone permission
3. Restart app
4. Restart device if needed

---

## Advanced Features

### Batch Voice Creation

Create multiple tasks in one session:

```typescript
const tasks = [
  "Create a work task: finish report",
  "Add personal task: buy groceries",
  "New task: call mom tomorrow"
];

for (const taskDescription of tasks) {
  const voiceInput = voiceService.processVoiceInput(taskDescription);
  const extracted = voiceService.extractTaskFromVoice(voiceInput);
  // Create task...
}
```

### Custom Category Training

Train system to recognize custom categories:

```typescript
// Add custom category keywords
const customCategories = {
  'project': ['project', 'development', 'coding'],
  'meeting': ['meeting', 'standup', 'sync'],
  'review': ['review', 'feedback', 'approval']
};
```

### Confidence Threshold

Set minimum confidence for auto-creation:

```typescript
const MIN_CONFIDENCE = 0.85;

if (extractedTask.confidence >= MIN_CONFIDENCE) {
  // Auto-create task
} else {
  // Show for review
}
```

---

## Limitations

### Current Limitations

1. **Language Support:** Currently supports English (en-US)
2. **Accuracy:** ~90% accuracy for standard task descriptions
3. **Complexity:** Best for simple to moderate task descriptions
4. **Background Noise:** Performs better in quiet environments

### Planned Improvements

- Multi-language support
- Custom category training
- Improved accuracy with ML
- Noise filtering
- Accent adaptation

---

## Support

For issues or questions about Voice Task Creation:

**Email:** supportramsandesh@gmail.com

**Response Time:** 24-48 hours

**Include in Report:**
- Device type and OS
- MeTodo version
- Example voice input
- Extracted task details
- Expected vs actual results

---

## Related Documentation

- [Task Management Guide](./user-guides/TASK_CREATION_GUIDE.md)
- [API Documentation](./technical/API_DOCUMENTATION.md)
- [Advanced Services](./technical/ADVANCED_SERVICES.md)

---

**Last Updated:** June 29, 2026  
**Version:** 1.0.0

Made with ❤️ by Sanskar Yadav
