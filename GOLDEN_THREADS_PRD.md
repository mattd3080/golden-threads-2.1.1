# Golden Threads - Complete Product Requirements Document
*Version 2.0 - Simplified Architecture*

---

## 📱 Product Overview

### Vision
A daily spiritual companion app that provides users with spiritual quotes and journal prompts to begin their day with intention and mindfulness.

### Core Features
- ✅ **Daily Spiritual Content**: Curated quotes from various spiritual traditions
- ✅ **Journal Prompts**: Thoughtful prompts for daily reflection
- ✅ **Daily Intentions**: Personal intention setting with optional reminders
- ✅ **Tradition Filtering**: Choose from 12 spiritual traditions
- ✅ **Local Storage**: All data stored locally for privacy
- ⏳ **Notifications**: Optional daily reminders

### Target Platforms
- ✅ iOS (Primary)
- ✅ Android (Secondary)


---

## 🛠 Technology Stack

### **Enhanced Core Stack for Scalability & Reliability**
```typescript
// Core Framework
- ✅ React Native 0.79+
- ✅ Expo SDK 53+
- ✅ TypeScript 5.8+

// Navigation
- ⏳ React Navigation 7 (simplified usage)
- ⏳ React Navigation Stack
- ⏳ React Navigation Bottom Tabs

// State Management (Domain-Separated)
- ⏳ Zustand (multiple domain-specific stores)
- ⏳ React Query/TanStack Query (data fetching)

// Form Handling & Validation
- ⏳ React Hook Form
- ✅ Zod (runtime validation)

// UI & Styling
- ✅ React Native built-in components
- ✅ Expo Linear Gradient
- ✅ React Native Animatable (minimal)

// Storage & Security
- ✅ Expo Secure Store (sensitive settings)
- ✅ AsyncStorage (journal entries with encryption)
- ✅ Expo Crypto (data integrity)
- ✅ //   Journal entries are encrypted using AES-256 via Expo Crypto.
- ✅ //   Encryption keys are unique per installation, generated, and stored securely using Expo Secure Store.

// Notifications & Permissions
- ⏳ Expo Notifications
- ⏳ Expo Device (device info)

// Network & Connectivity
- ⏳ @react-native-community/netinfo
- ⏳ React Native Device Info

// Error Handling & Monitoring
- ✅ React Error Boundary
- ✅ Custom error logging service

// Testing & Quality Assurance
- ✅ Jest + React Native Testing Library (unit tests)
- ✅ Detox (E2E testing)
- ✅ ESLint + Prettier (code quality)
- ✅ TypeScript strict mode

// Performance & Accessibility
- ✅ React Native Performance Monitor
- ✅ React Native Accessibility APIs
- ✅ Memory leak detection tools
```
!

---

## 🗄 Data Architecture

### **Data Models**

#### User Settings (Enhanced with Validation)
```typescript
interface UserSettings {
  notificationTime: string; // "08:00" - ISO time format
  notificationsEnabled: boolean;
  selectedTraditions: string[]; // ['buddhism', 'taoism'] - min 1 required
  hasCompletedOnboarding: boolean;
  timezone: string; // IANA timezone identifier
  lastUpdated: string; // ISO timestamp
  dataVersion: string; // For migration purposes
  
  // Privacy & Security
  dataEncryptionEnabled: boolean;
  biometricAuthEnabled?: boolean; // Optional future feature
  
  // Accessibility
  accessibilityPreferences: {
    reduceMotion: boolean;
    highContrast: boolean;
    fontSize: 'small' | 'medium' | 'large';
  };
}

// Validation Schema (using Zod)
const UserSettingsSchema = z.object({
  notificationTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  notificationsEnabled: z.boolean(),
  selectedTraditions: z.array(z.string()).min(1, "At least one tradition required"),
  hasCompletedOnboarding: z.boolean(),
  timezone: z.string().min(1),
  lastUpdated: z.string().datetime(),
  dataVersion: z.string(),
  dataEncryptionEnabled: z.boolean(),
  accessibilityPreferences: z.object({
    reduceMotion: z.boolean(),
    highContrast: z.boolean(),
    fontSize: z.enum(['small', 'medium', 'large']),
  }),
});
```

#### Spiritual Tradition
```typescript
interface SpiritualTradition {
  id: string; // 'buddhism'
  name: string; // 'Buddhism'
  enabled: boolean;
  color: {
    primary: string;
    light: string;
    bg: string;
    border: string;
  };
}
```

#### Daily Content (Enhanced with Performance Optimization)
```typescript
interface DailyContent {
  contentId: string; // From CSV, primary key for content
  date: string; // "2024-01-15" - Date this content is assigned for display
  tradition: string; // From CSV
  today_wisdom: string; // From CSV (This is the main quote text)
  source: string; // From CSV (e.g., "Matthew 22:37, 39 (Bible, New International Version)" - may include author)
  author?: string; // Optional: To be extracted from 'source' if possible, or managed separately if CSV changes
  go_deeper: string; // From CSV
  golden_thread: string; // From CSV
  about_the_source: string; // From CSV
  reflection_prompt: string; // From CSV (This is the journal prompt text)
  
  // Performance & Caching
  cached: boolean; // True for V1 as content is bundled. Relevant for future API-driven content.
  lastUpdated: string; // ISO timestamp of when this content was last processed/updated into the bundle.
  preProcessed: boolean; // True if content has been optimized at build time
  searchKeywords: string[]; // Pre-generated search keywords for fast lookup
  
  // Content Optimization
  estimatedReadingTime: number; // Pre-calculated reading time in minutes
  contentHash: string; // Hash for integrity verification
  chunkIndex?: number; // Index for chunked content loading
}

// Content Bundle Structure for Performance
interface ContentBundle {
  version: string;
  generatedAt: string;
  totalItems: number;
  
  // Optimized data structures
  contentByDate: Record<string, string>; // date -> contentId mapping
  contentByTradition: Record<string, string[]>; // tradition -> contentId[] mapping
  searchIndex: Record<string, string[]>; // keyword -> contentId[] mapping
  
  // Chunked content for memory efficiency
  contentChunks: Record<string, DailyContent[]>; // chunkId -> content[] mapping
  chunkManifest: {
    [chunkId: string]: {
      startDate: string;
      endDate: string;
      traditions: string[];
      itemCount: number;
    };
  };
}
```

#### Journal Entry (Enhanced with Security & Validation)
```typescript
interface JournalEntry {
  id: string; // "entry-1234567890" - UUID format
  date: string; // "2024-01-15" - ISO date
  intention: string; // Max 500 characters
  journal: string; // Max 10,000 characters
  promptId: string;
  timestamp: string; // ISO timestamp
  lastModified: string; // ISO timestamp
  
  // Security & Integrity
  dataHash?: string; // For data integrity verification
  encrypted: boolean; // True if content is encrypted using AES-256 (key managed by Expo Secure Store)
  
  // Metadata
  wordCount: number;
  characterCount: number;
  estimatedReadingTime: number; // in minutes
  
  // User Experience
  mood?: 'peaceful' | 'grateful' | 'contemplative' | 'joyful' | 'reflective';
  tags?: string[]; // User-defined tags for organization
}

// Validation Schema
const JournalEntrySchema = z.object({
  id: z.string().uuid(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  intention: z.string().max(500, "Intention too long"),
  journal: z.string().max(10000, "Journal entry too long"),
  promptId: z.string(),
  timestamp: z.string().datetime(),
  lastModified: z.string().datetime(),
  dataHash: z.string().optional(),
  encrypted: z.boolean(),
  wordCount: z.number().min(0),
  characterCount: z.number().min(0),
  estimatedReadingTime: z.number().min(0),
  mood: z.enum(['peaceful', 'grateful', 'contemplative', 'joyful', 'reflective']).optional(),
  tags: z.array(z.string()).optional(),
});
```

### **Enhanced Storage Strategy with Security & Data Integrity**

#### Enhanced Secure Store (Expo Secure Store) - Sensitive Data
```typescript
// User preferences and sensitive settings
const SECURE_KEYS = {
  USER_SETTINGS: 'user_settings_v2',
  NOTIFICATION_PREFERENCES: 'notification_preferences_v2',
  SELECTED_TRADITIONS: 'selected_traditions_v2',
  ENCRYPTION_KEYS: 'encryption_keys_v2',
  BIOMETRIC_SETTINGS: 'biometric_settings_v2',
  DEVICE_FINGERPRINT: 'device_fingerprint_v2',
  INSTALLATION_ID: 'installation_id_v2',
  KEY_DERIVATION_SALT: 'key_derivation_salt_v2',
} as const;

// Enhanced Security Configuration
const SECURE_STORE_OPTIONS = {
  requireAuthentication: false, // Can be enabled for biometric auth
  authenticationPrompt: 'Authenticate to access your spiritual practice data',
  keychainService: 'golden-threads-keychain',
  touchID: true,
  showModal: true,
  
  // Enhanced Security Options
  accessControl: 'BiometryCurrentSet', // Require biometric authentication when available
  authenticatePrompt: 'Access your spiritual practice data',
  cancelPrompt: 'Cancel',
  fallbackPrompt: 'Use Passcode',
  disableBackup: true, // Prevent keychain backup
};

// Key Management Service
interface KeyManagementConfig {
  keyRotationEnabled: boolean;
  keyRotationIntervalDays: number;
  masterKeyDerivation: 'PBKDF2' | 'scrypt' | 'argon2';
  saltLength: number;
  iterationCount: number;
  keyStrengthBits: 256;
  deviceBinding: boolean; // Bind keys to device hardware
}

const KEY_MANAGEMENT_CONFIG: KeyManagementConfig = {
  keyRotationEnabled: true,
  keyRotationIntervalDays: 90,
  masterKeyDerivation: 'PBKDF2',
  saltLength: 32,
  iterationCount: 100000,
  keyStrengthBits: 256,
  deviceBinding: true,
};
```

#### Async Storage (Regular Storage) - Journal Data with Encryption
```typescript
// Journal entries and cached content with versioning
const STORAGE_KEYS = {
  JOURNAL_ENTRIES: 'journal_entries_v2',
  DAILY_INTENTIONS: 'daily_intentions_v2', 
  CACHED_CONTENT: 'cached_content_v2',
  ONBOARDING_STATE: 'onboarding_state_v2',
  DATA_VERSION: 'data_version',
  LAST_BACKUP: 'last_backup_timestamp',
  ERROR_LOGS: 'error_logs_v2',
} as const;

// Data Integrity & Migration
interface StorageMetadata {
  version: string;
  lastModified: string;
  checksum: string;
  encrypted: boolean;
  migrationRequired: boolean;
}

// Enhanced Storage Service Configuration
const STORAGE_CONFIG = {
  MAX_RETRY_ATTEMPTS: 3,
  RETRY_DELAY_MS: 1000,
  
  // Performance Optimizations
  ENTRIES_PER_CHUNK: 50,        // Store entries in chunks to prevent memory issues
  MAX_MEMORY_ENTRIES: 100,      // Keep only recent entries in memory
  LAZY_LOAD_MONTHS: true,       // Load journal entries by month on demand
  INDEX_STORAGE: true,          // Separate index for quick lookups
  
  // Data Management
  MAX_JOURNAL_ENTRIES: 1000,    // Total entries before archiving
  MAX_ERROR_LOGS: 100,
  ARCHIVE_THRESHOLD: 500,       // Archive older entries when threshold reached
  
  // Security & Performance
  ENCRYPTION_ENABLED: true,
  BACKGROUND_PROCESSING: true,  // Process heavy operations in background
  BACKUP_FREQUENCY_DAYS: 7,
  
  // Content Optimization
  PREPROCESS_CONTENT: true,     // Process content at build time
  CACHE_DAILY_CONTENT: 365,     // Pre-calculate daily content for a year
  SEARCH_INDEX_ENABLED: true,   // Enable content search indexing
};
```

#### Enhanced Error Handling & Recovery Strategy
```typescript
interface StorageError {
  operation: string;
  timestamp: string;
  error: string;
  recoveryAction: 'retry' | 'fallback' | 'user_intervention';
  resolved: boolean;
  attemptCount: number;
  stackTrace?: string;
  context?: Record<string, unknown>;
}

// Enhanced Storage Health Monitoring
interface StorageHealth {
  lastSuccessfulRead: string;
  lastSuccessfulWrite: string;
  errorCount: number;
  corruptionDetected: boolean;
  migrationStatus: 'pending' | 'in_progress' | 'completed' | 'failed';
  
  // Performance Metrics
  averageReadTime: number;
  averageWriteTime: number;
  memoryUsage: number;
  cacheHitRate: number;
  
  // Background Processing
  backgroundTasksRunning: number;
  lastBackgroundProcessing: string;
  processingQueueSize: number;
}

// Resilient Operation Service
interface ResilientOperationConfig {
  maxRetries: number;
  initialDelay: number;
  maxDelay: number;
  backoffMultiplier: number;
  jitterEnabled: boolean;
  circuitBreakerEnabled: boolean;
  fallbackStrategy: 'cache' | 'offline' | 'minimal';
}

// Background Processing Queue
interface BackgroundTask {
  id: string;
  operation: string;
  priority: 'low' | 'medium' | 'high';
  payload: unknown;
  createdAt: string;
  retryCount: number;
  maxRetries: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
}
```

---

## 🗺 User Flow & Navigation

### **Primary Navigation Stack**
```typescript
type RootStackParamList = {
  Onboarding: undefined;
  Main: undefined;
  JournalReview: undefined;
  Menu: { currentScreen?: string };
  SpiritualTraditions: undefined;
  Notifications: undefined;
  ReflectionComplete: {
    initialIntention: string;
    initialReflection: string;
    quote: string;
    author: string;
  };
};
```

### **User Journey Flow**
```
App Launch → Check Onboarding → Main Screen → Daily Practice
     ↓              ↓                ↓            ↓
First Time    →  Onboarding    →  Main Screen    Menu Options:
Users            Flow (4 steps)     (Home)       - Journal Review
                                               - Notifications
Returning    →   Main Screen   →  Remember     - Traditions
Users            (Home)           Complete      - Settings
```

### **Navigation Principles**
- **Default React Navigation Transitions**: No custom animation system
- **Modal-based Menu**: Bottom sheet style menu
- **Simple Stack Navigation**: Linear navigation between main screens

---

## 📱 Screen Specifications

### **1. Onboarding Flow**

#### **Page 1: Welcome**
**Purpose**: Welcome users and introduce the app concept

**Layout**:
```
┌─────────────────────────┐
│                         │
│ Welcome to Golden       │
│        Threads          │
│                         │
│ Discover wisdom that    │
│ transcends traditions   │
│ and integrate it into   │
│ your life.              │
│                         │
│       [Begin]           │
│                         │
└─────────────────────────┘
```

**Copy**:
- **Title**: "Welcome to Golden Threads"
- **Subtitle**: "Discover wisdom that transcends traditions and integrate it into your life."
- **Button**: "Begin"

**Components Used**:
- `OnboardingContainer`
- `HeadingText`
- `BodyText` 
- `PrimaryButton`

#### **Page 2: Traditions Selection**
**Purpose**: Let users select spiritual traditions they resonate with

**Layout**:
```
┌─────────────────────────┐
│   Choose Your Path      │
│                         │
│ Select traditions that  │
│ speak to your heart     │
│                         │
│ □ Buddhism             │
│ □ Taoism               │
│ □ Christianity         │
│ □ Hinduism             │
│ □ Sufism               │
│ □ Islam                │
│ + 6 more traditions    │
│                         │
│      [Continue]         │
└─────────────────────────┘
```

**Copy**:
- **Title**: "Choose Your Path"
- **Subtitle**: "Select traditions that speak to your heart"
- **Description**: "You can always change these later in settings"
- **Button**: "Continue" (enabled when ≥1 selected)

**Available Traditions**:
1. Buddhism
2. Taoism  
3. Christianity
4. Hinduism
5. Sufism
6. Islam
7. Kabbalah
8. Indigenous Wisdom
9. Jainism
10. Gnosticism
11. Stoicism
12. Hermeticism

**Validation**: Must select at least 1 tradition

#### **Page 3: Features Overview**
**Purpose**: Showcase app features and build excitement

**Layout**:
```
┌─────────────────────────┐
│    Your Daily Practice  │
│                         │
│ Daily Intentions        │
│ Set meaningful goals    │
│                         │
│ Spiritual Quotes        │
│ Ancient wisdom daily    │
│                         │
│ Journal Prompts         │
│ Reflect and grow        │
│                         │
│ Gentle Reminders        │
│ Stay connected          │
│                         │
│       [Onward]          │
└─────────────────────────┘
```

**Copy**:
- **Title**: "Your Daily Practice"
- **Features**:
  - **Daily Intentions**: "Set meaningful goals for each day"
  - **Spiritual Quotes**: "Ancient wisdom to inspire your journey" 
  - **Journal Prompts**: "Reflect and grow through writing"
  - **Gentle Reminders**: "Optional notifications to stay connected"
- **Button**: "Onward"

#### **Page 4: Notifications**
**Purpose**: Request notification permissions and set preferences

**Layout**:
```
┌─────────────────────────┐
│  Stay Connected         │
│                         │
│ Receive gentle daily    │
│ reminders to practice   │
│                         │
│ Daily Quote Time        │
│    [08:00 AM] ⌄         │
│                         │
│ □ Enable Notifications  │
│                         │
│ You can change this     │
│ anytime in settings     │
│                         │
│   [Start the Practice]  │
└─────────────────────────┘
```

**Copy**:
- **Title**: "Stay Connected"
- **Description**: "Receive gentle daily reminders to practice mindfulness and reflection"
- **Time Picker**: Default 8:00 AM
- **Checkbox**: "Enable Notifications"
- **Note**: "You can change this anytime in settings"
- **Button**: "Start the Practice"

**Behavior**:
- Requests notification permissions when checkbox enabled
- Saves notification preferences
- Completes onboarding → Navigate to Main Screen

### **2. Main Screen (Home)**

#### **Purpose**: Daily practice hub - set intentions, read quotes, journal

**Layout** (Scrollable):
```
┌─────────────────────────┐
│ ☰                      │ ← Header
│                         │
│ ╭─────────────────────╮ │
│ │    Today's Quote    │ │ ← Quote Card
│ │                     │ │
│ │ "The present moment │ │
│ │ is the only time... │ │
│ │                     │ │
│ │ — Thích Nhất Hạnh   │ │
│ │        Buddhism     │ │
│ ╰─────────────────────╯ │
│                         │
│ ╭─────────────────────╮ │
│ │  Today's Intention  │ │ ← Intention Section
│ │ ┌─────────────────┐ │ │
│ │ │ What do you...  │ │ │
│ │ └─────────────────┘ │ │
│ ╰─────────────────────╯ │
│                         │
│ ╭─────────────────────╮ │
│ │    Reflection       │ │ ← Journal Section  
│ │                     │ │
│ │ What moment today   │ │
│ │ filled you with...  │ │
│ │                     │ │
│ │ ┌─────────────────┐ │ │
│ │ │ Write here...   │ │ │
│ │ │                 │ │ │
│ │ │                 │ │ │
│ │ └─────────────────┘ │ │
│ ╰─────────────────────╯ │
│                         │
│       [Remember]        │ ← Action Button
│                         │
└─────────────────────────┘
```

**Components**:
1. **Header**: Menu button using PageLayout component
2. **Quote Card**: Daily spiritual quote with author and tradition
3. **Intention Section**: Text input for daily intention
4. **Journal Section**: Prompt + large text area for reflection
5. **Remember Button**: Saves entry and navigates to completion

**Copy**:
- **Page Title**: "Home" (in header)
- **Quote Card**: 
  - Quote text (auto-rotated daily)
  - Author attribution
  - Tradition tag
- **Intention Section**: 
  - **Title**: "Today's Intention"
  - **Placeholder**: "What do you want to focus on today?"
- **Journal Section**:
  - **Title**: "Reflection" 
  - **Prompt**: Auto-generated daily (e.g., "What moment today filled you with gratitude?")
  - **Placeholder**: "Write your thoughts here..."
- **Action Button**: "Remember"

**Behavior**:
- Auto-loads today's quote and prompt
- Saves text as user types (auto-save)
- Remember button → Save entry → Navigate to ReflectionComplete
- Menu button → Open MenuScreen modal



---

## 🚦 User-Facing Error Message Guidance

To ensure a consistent and supportive user experience, the application should provide clear, non-technical error messages. Examples include:

- **Storage Full:** "Unable to save. Your device storage might be full. Please free up some space and try again."
- **Save Failed (Generic):** "Oops! Something went wrong while saving. Please try again."
- **Content Load Failed (CSV Parsing Issue / Bundle Issue):** "There was an issue loading today's wisdom. Please try restarting the app. If the problem persists, check for app updates."
- **Invalid Input (e.g., too long, handled by Zod):** "Your text is a bit too long. Please shorten it and try again." (Zod will provide specific messages for schema violations).
- **Notification Permission Denied:** "To receive reminders, please enable notifications for Golden Threads in your device settings."

Consider providing a simple, non-technical "Error Code" (e.g., "Error ID: SAVE_001") that users can report if they contact support, mapping to more detailed internal logs.

---

### **3. Menu Screen**

#### **Purpose**: Navigate between main app sections

**Layout** (Modal from bottom):
```
┌─────────────────────────┐
│ ×               Golden  │ ← Header
│                Threads │
│ ──────────────────────  │
│                         │
│  Home                   │ ← Menu Items
│                         │
│  Journal Review         │
│                         │
│  Notifications          │
│                         │
│  Select Traditions      │
│                         │
│                         │
│                         │
└─────────────────────────┘
```

**Menu Options**:
1. **Home** → Navigate to MainScreen
2. **Journal Review** → Navigate to JournalReviewScreen  
3. **Notifications** → Navigate to NotificationsScreen
4. **Select Traditions** → Navigate to SpiritualTraditionsScreen

**Copy**:
- **Title**: "Golden Threads"
- **Menu Items**: Clean icon + text labels
- **Active State**: Highlight current screen

**Behavior**:
- Modal presentation from bottom
- Tap outside or X → Close menu
- Tap menu item → Navigate + close menu
- Show active screen indicator

### **4. Journal Review Screen**

#### **Purpose**: View and manage historical journal entries

**Layout** (Scrollable):
```
┌─────────────────────────┐
│ ☰    Journal Review   ⟲ │ ← Header
│                         │
│ ← December 2024 →       │ ← Month Navigation
│                         │
│ ╭─────────────────────╮ │
│ │ Dec 15 • Sunday     │ │ ← Entry Card
│ │ ▼ Intention         │ │
│ │   Focus on gratitude│ │
│ │ ▼ Reflection        │ │
│ │   Today I felt...   │ │
│ │                     │ │
│ │ □ □ □               │ │ ← Actions
│ ╰─────────────────────╯ │
│                         │
│ ╭─────────────────────╮ │
│ │ Dec 14 • Saturday   │ │
│ │ ▼ Intention         │ │
│ │   Be present...     │ │
│ │ ...                 │ │
│ ╰─────────────────────╯ │
│                         │
└─────────────────────────┘
```

**Features**:
- **Month Navigation**: Previous/Next month arrows
- **Entry Cards**: Collapsible sections for Intention + Reflection
- **Entry Actions**: Edit, Delete, Continue Writing
- **Empty States**: Gentle encouragement for days without entries
- **Data Integrity**: Shows only most recent entry per day

**Copy**:
- **Title**: "Journal Review"
- **Month Format**: "December 2024"
- **Entry Headers**: "Dec 15 • Sunday"
- **Section Labels**: "Intention", "Reflection"
- **Empty State**: "No entries yet this month. Start your practice on the Home screen."

**Behavior**:
- Load entries for current month
- Tap entry card → Expand/collapse
- Tap "Continue Writing" → Return to MainScreen with populated fields
- Swipe to delete entry (with confirmation)
- Pull to refresh

### **5. Spiritual Traditions Screen**

#### **Purpose**: Modify selected spiritual traditions

**Layout**:
```
┌─────────────────────────┐
│ ☰  Select Traditions  ✓ │ ← Header
│                         │
│ Choose traditions that  │ ← Description
│ inspire your practice   │
│                         │
│ ☑ Buddhism             │ ← Tradition List
│ □ Taoism               │
│ ☑ Christianity         │
│ □ Hinduism             │
│ ☑ Sufism               │
│ □ Islam                │
│ □ Kabbalah             │
│ □ Indigenous Wisdom    │
│ □ Jainism              │
│ □ Gnosticism           │
│ □ Stoicism             │
│ □ Hermeticism          │
│                         │
└─────────────────────────┘
```

**Features**:
- **Tradition List**: All 12 spiritual traditions with checkboxes
- **Visual Feedback**: Selected traditions highlighted
- **Auto-save**: Changes saved immediately
- **Validation**: Must keep at least 1 tradition selected

**Copy**:
- **Title**: "Select Traditions"
- **Description**: "Choose traditions that inspire your practice"
- **Save Confirmation**: Auto-saved indicator
- **Validation Message**: "Please select at least one tradition"

**Behavior**:
- Load current selections
- Toggle tradition → Update immediately
- Prevent deselecting all traditions
- Show save confirmation

### **6. Notifications Screen**

#### **Purpose**: Manage notification preferences and permissions

**Layout**:
```
┌─────────────────────────┐
│ ☰    Notifications      │ ← Header
│                         │
│ ╭─────────────────────╮ │
│ │ Daily Wisdom        │ │ ← Settings Card
│ │ Receive daily       │ │
│ │ spiritual quotes    │ │
│ │ ☑ Enable            │ │
│ │ ⏰ [08:00 AM] ⌄     │ │
│ ╰─────────────────────╯ │
│                         │
│ ╭─────────────────────╮ │
│ │ Intention Reminder  │ │ ← Settings Card
│ │ Remember to set     │ │
│ │ daily intentions    │ │
│ │ ☑ Enable            │ │
│ │ ⏰ [07:00 AM] ⌄     │ │
│ ╰─────────────────────╯ │
│                         │
│ ╭─────────────────────╮ │
│ │ Reflection Reminder │ │ ← Settings Card
│ │ End your day with   │ │
│ │ mindful reflection  │ │
│ │ ☑ Enable            │ │
│ │ ⏰ [09:00 PM] ⌄     │ │
│ ╰─────────────────────╯ │
│                         │
└─────────────────────────┘
```

**Features**:
- **Daily Wisdom**: Toggle and time picker for daily spiritual quotes
- **Intention Reminder**: Toggle and time picker for morning intention setting
- **Reflection Reminder**: Toggle and time picker for evening reflection
- **Individual Time Controls**: Each notification type has its own time setting
- **iOS-Style Time Picker**: Wheel picker interface for time selection

**Copy**:
- **Title**: "Notifications"
- **Daily Wisdom Section**:
  - **Title**: "Daily Wisdom"
  - **Description**: "Receive daily spiritual quotes"
- **Intention Reminder Section**:
  - **Title**: "Intention Reminder"
  - **Description**: "Remember to set daily intentions"
- **Reflection Reminder Section**:
  - **Title**: "Reflection Reminder"
  - **Description**: "End your day with mindful reflection"

**Behavior**:
- Each toggle independently controls notification type
- Time pickers open iOS-style wheel selector
- Changes save automatically
- Request notification permissions when any toggle is enabled
- Haptic feedback on interactions

### **7. Reflection Complete Screen**

#### **Purpose**: Celebration and reflection summary after "Remember" action

**Layout**:
```
┌─────────────────────────┐
│                         │
│      Beautifully        │ ← Title
│      Remembered         │
│                         │
│ Your intention and      │ ← Summary
│ reflection have been    │
│ woven into your         │
│ practice.               │
│                         │
│ ╭─────────────────────╮ │
│ │ "The present moment │ │ ← Quote Reminder
│ │ is the only time... │ │
│ │                     │ │
│ │ — Thích Nhất Hạnh   │ │
│ ╰─────────────────────╯ │
│                         │
│ [Continue Practice]     │ ← Action Button
│ [Review Entries]        │
│                         │
└─────────────────────────┘
```

**Features**:
- **Success Animation**: Gentle fade-in celebration
- **Entry Summary**: Brief confirmation of what was saved
- **Quote Display**: Repeat today's quote for reinforcement
- **Navigation Options**: Return to main practice or review entries

**Copy**:
- **Title**: "Beautifully Remembered"
- **Message**: "Your intention and reflection have been woven into your practice."
- **Buttons**: 
  - "Continue Practice" (return to MainScreen)
  - "Review Entries" (go to JournalReviewScreen)

**Behavior**:
- Auto-fade in animation
- Display for minimum 2 seconds
- Clear any temporary drafts
- Update last practice date

---

## 🧩 Pre-Built Template Integration System

### **Template-Based Development Approach**
The Golden Threads rebuild uses **pre-existing templates and design system components** rather than building from scratch. All UI components and page layouts have been pre-designed and exist in the `/templates` directory.

### **Available Page Templates**
```typescript
// Main Application Pages
const PAGE_TEMPLATES = {
  // Core Application
  mainPage: '/templates/examples/MainPagePreview.tsx',
  reflectionComplete: '/templates/examples/ReflectionCompletePreview.tsx',
  notificationsPage: '/templates/examples/NotificationsTemplate.tsx',
  spiritualTraditions: '/templates/examples/SpiritualTraditionsRebuilt.tsx',
  
  // Onboarding Flow (4 pages)
  onboardingWelcome: '/templates/examples/OnboardingWelcomeRebuilt.tsx',      // Page 1
  onboardingTraditions: '/templates/examples/OnboardingTraditionsRebuilt.tsx', // Page 2  
  onboardingFeatures: '/templates/examples/OnboardingFeaturesRebuilt.tsx',     // Page 3
  onboardingNotifications: '/templates/examples/OnboardingNotificationsRebuilt.tsx', // Page 4
} as const;
```

### **Template Integration Requirements**
1. **Preserve Existing Design**: Maintain exact visual design, styling, and component hierarchy
2. **Extract Reusable Components**: Identify and extract common components from templates
3. **Add Functionality**: Integrate state management, navigation, and data persistence
4. **Maintain Performance**: Ensure templates are optimized and accessible
5. **Error Handling**: Add comprehensive error boundaries and validation

### **Pre-Built Design System Components**
The templates utilize a comprehensive design system with:
- **Glass Morphism Components**: Pre-styled cards, buttons, and containers
- **Typography System**: Responsive text components with proper hierarchy
- **Layout Components**: PageLayout, HeaderCard, background gradients
- **Form Components**: Inputs, checkboxes, time pickers with validation
- **Interactive Elements**: Buttons, toggles, selection lists
- **Accessibility Features**: Screen reader support, keyboard navigation, proper contrast

### **Template Adaptation Strategy**
```typescript
// Template Integration Process
interface TemplateIntegration {
  // 1. Analysis Phase
  analyzeTemplate: {
    extractComponents: string[];
    identifyProps: ComponentProps[];
    mapStateRequirements: StateMapping[];
    documentDependencies: string[];
  };
  
  // 2. Integration Phase  
  integrateTemplate: {
    addNavigation: NavigationProps;
    connectStateManagement: StoreConnection[];
    addDataPersistence: StorageConfig;
    implementErrorHandling: ErrorBoundaryConfig;
  };
  
  // 3. Validation Phase
  validateIntegration: {
    preserveDesign: boolean;
    maintainAccessibility: boolean;
    ensurePerformance: boolean;
    testFunctionality: boolean;
  };
}
```

### **Component Extraction Guidelines**
From the existing templates, extract and enhance:
- **Shared UI Components**: Buttons, cards, inputs, headers
- **Layout Wrappers**: Page containers, section dividers, spacing systems  
- **Interactive Elements**: Form controls, selection interfaces, navigation
- **Content Display**: Quote cards, journal displays, progress indicators

---

## 🔌 API & Data Management

### **Data Services**
- **StorageService**: AsyncStorage wrapper for journal entries and settings
- **ContentService**: Daily quote and prompt generation with deterministic selection
- **NotificationService**: Cross-platform notification scheduling and permissions
- **Zustand Stores**: Simple state management for user settings and app state

---

## 🎨 Design System

### **Glass Morphism Design Language**
All pages in Golden Threads use a consistent glass morphism design language with frosted glass effects, subtle gradients, and layered transparency to create a serene, spiritual aesthetic.

### **Universal Background System**
Every screen uses the same sophisticated gradient background system:

```typescript
// Background Gradient (used on all screens)
export const BACKGROUND_GRADIENT = {
  colors: ['#FDF2F8', '#FFFBEB', '#EDE9FE', '#F0F9FF'],
  locations: [0, 0.35, 0.65, 1],
  description: 'Four-color spiritual gradient',
  details: {
    topColor: '#FDF2F8',    // rose-50 - Gentle pink warmth
    midTopColor: '#FFFBEB', // amber-50 - Golden wisdom
    midBottomColor: '#EDE9FE', // violet-50 - Spiritual depth  
    bottomColor: '#F0F9FF'   // sky-50 - Peaceful clarity
  }
};
```

### **Consistent Header Structure**
All screens use the PageLayout component with HeaderCard for consistency:

```typescript
// Every screen follows this pattern
<PageLayout
  title="Screen Title"
  onMenuPress={() => navigation.navigate('Menu')}
  showMenuButton={true}
>
  <ScreenContent />
</PageLayout>
```

### **Typography System with Responsive Scaling**
The app uses device-specific typography optimization:

```typescript
// Responsive typography scales from 28px (iPhone SE) to 52px (iPad)
// Font weights range from 200-300 for elegant, readable text
// Letter spacing increases with screen size for optimal readability
```

### **Glass Morphism Color Palette**
```typescript
export const COLORS = {
  // Primary warm spiritual palette
  primary: '#F59E0B', // amber-500
  primaryLight: '#FEF3C7', // amber-100  
  primaryDark: '#D97706', // amber-600
  
  // Glass morphism system (used on ALL components)
  glass: 'rgba(255, 255, 255, 0.5)',     // Light transparency
  glassStrong: 'rgba(255, 255, 255, 0.8)', // Strong transparency
  glassBorder: 'rgba(255, 255, 255, 0.3)', // Border transparency
  
  // Text hierarchy
  text: {
    primary: '#111827',   // gray-900 - Main headings
    secondary: '#4B5563', // gray-600 - Body text
    tertiary: '#9CA3AF',  // gray-400 - Subtle text
    white: '#FFFFFF',     // Button text
  },
  
  // Spiritual tradition colors
  traditions: {
    buddhism: { primary: '#D97706', light: '#FEF3C7' },
    taoism: { primary: '#059669', light: '#D1FAE5' },
    christianity: { primary: '#0284C7', light: '#E0F2FE' },
    hinduism: { primary: '#DC2626', light: '#FEE2E2' },
    sufism: { primary: '#7C3AED', light: '#EDE9FE' },
    islam: { primary: '#059669', light: '#D1FAE5' },
    kabbalah: { primary: '#7C3AED', light: '#EDE9FE' },
    'indigenous-wisdom': { primary: '#92400E', light: '#FEF3C7' },
    jainism: { primary: '#059669', light: '#D1FAE5' },
    gnosticism: { primary: '#7C3AED', light: '#EDE9FE' },
    stoicism: { primary: '#374151', light: '#F3F4F6' },
    hermeticism: { primary: '#7C3AED', light: '#EDE9FE' },
  },
};
```

### **Typography Scale**
```typescript
export const FONTS = {
  size: {
    xs: 12,
    sm: 14, 
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    '5xl': 48,
  },
  weight: {
    extralight: '200',
    light: '300',
    normal: '400', 
    medium: '500',
    semibold: '600',
    bold: '700',
  },
};
```

### **Spacing System**
```typescript
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
};
```

### **Glass Morphism Component Styling**
All cards, buttons, and containers use consistent glass morphism effects:

```typescript
// Standard glass morphism card style (used throughout app)
const glassCardStyle = {
  backgroundColor: COLORS.glassStrong,
  borderRadius: BORDER_RADIUS.xl,
  borderWidth: 1,
  borderColor: COLORS.glassBorder,
  shadowColor: COLORS.shadow,
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.1,
  shadowRadius: 8,
  elevation: 4,
};

// Glass morphism button style
const glassButtonStyle = {
  backgroundColor: COLORS.glass,
  borderRadius: BORDER_RADIUS.lg,
  borderWidth: 1,
  borderColor: COLORS.glassBorder,
  shadowColor: COLORS.shadow,
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.08,
  shadowRadius: 6,
  elevation: 3,
};
```

---

## 🎬 Transitions & Animations

### **Navigation Principles**
- **Use React Navigation Defaults**: No custom transition system
- **Consistent Timing**: 300ms for all transitions
- **Simple Animations**: Fade and slide only
- **Performance First**: Minimal custom animations

### **Screen Transitions Using React Components**
All screen transitions should use React Navigation's built-in transition components for consistency and performance:

```typescript
// Use standard React Navigation stack with iOS-style transitions
// Menu screen uses modal presentation
// All other screens use default horizontal slide transitions
```

### **Component Guidelines**
- Use PageLayout wrapper for all screens with consistent header
- Apply TouchableOpacity with activeOpacity={0.8} for button feedback
- Implement simple fade-in animations for content loading

---

## 👨‍💻 Development Guidelines

### **Project Structure**
```
src/
├── components/
│   ├── shared/           # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── TextInput.tsx
│   │   ├── Card.tsx
│   │   └── LoadingSpinner.tsx
│   ├── screens/          # Screen-specific components
│   │   ├── Main/
│   │   │   ├── QuoteCard.tsx
│   │   │   ├── IntentionSection.tsx
│   │   │   └── JournalSection.tsx
│   │   ├── Journal/
│   │   │   ├── EntryCard.tsx
│   │   │   └── MonthNavigation.tsx
│   │   └── Onboarding/
│   │       ├── WelcomePage.tsx
│   │       ├── TraditionsPage.tsx
│   │       ├── FeaturesPage.tsx
│   │       └── NotificationsPage.tsx
│   └── layout/
│       ├── PageLayout.tsx
│       ├── ScreenContainer.tsx
│       └── Header.tsx
├── screens/              # Screen containers (composition only)
│   ├── MainScreen.tsx           # <150 lines
│   ├── JournalReviewScreen.tsx  # <150 lines  
│   ├── MenuScreen.tsx           # <100 lines
│   ├── OnboardingScreen.tsx     # <100 lines
│   ├── SpiritualTraditionsScreen.tsx # <100 lines
│   ├── NotificationsScreen.tsx  # <150 lines
│   └── ReflectionCompleteScreen.tsx # <100 lines
├── hooks/                # Custom hooks
│   ├── queries/          # React Query hooks
│   │   ├── useJournalEntries.ts
│   │   ├── useDailyContent.ts
│   │   └── useUserSettings.ts
│   ├── mutations/        # React Query mutations
│   │   ├── useCreateJournalEntry.ts
│   │   ├── useUpdateUserSettings.ts
│   │   └── useDeleteJournalEntry.ts
│   ├── useResponsiveStyles.ts
│   ├── useKeyboard.ts
│   └── useNotifications.ts
├── services/             # External integrations
│   ├── StorageService.ts      # AsyncStorage wrapper
│   ├── ContentService.ts      # Content management
│   ├── NotificationService.ts # Expo notifications
│   └── AnalyticsService.ts    # Usage tracking
├── stores/               # Zustand stores (simplified)
│   ├── useUserStore.ts        # User settings & preferences
│   └── useAppStore.ts         # App state & onboarding
├── utils/                # Pure functions
│   ├── dateUtils.ts
│   ├── validationUtils.ts
│   ├── formatUtils.ts
│   └── constants.ts
├── types/                # TypeScript definitions
│   ├── navigation.ts
│   ├── content.ts
│   ├── user.ts
│   └── index.ts
└── constants/            # App configuration
    ├── colors.ts
    ├── fonts.ts
    ├── spacing.ts
    └── index.ts
```

## 💻 Development Guidelines

### **Architecture Principles**
- **Component Size**: Screens ≤150 lines, Components ≤200 lines, Services ≤300 lines
- **Single Responsibility**: Each component handles one clear function
- **Glass Morphism**: Consistent styling across all UI elements
- **Responsive Design**: Typography and spacing adapt to device size
- **Performance**: Use React.memo, useMemo, and useCallback appropriately
- **Testing**: Cover critical user journeys and component interactions

---


---

