# Golden Threads - Implementation Plan
*Step-by-Step Development Guide Based on PRD v2.0*

## 📋 Overview

This implementation plan provides a complete roadmap for rebuilding Golden Threads with simplified architecture, following the specifications in the PRD. The plan is organized into phases to ensure proper foundation-building and iterative development.

### **Total Estimated Timeline: 10-12 weeks** *(Revised to include comprehensive performance optimizations and enhanced error handling. Timeline includes thorough template integration validation and performance testing phases.)*
- **Phase 1**: Foundation & Setup + Enhanced Error Handling + Testing Setup (2 weeks)
- **Phase 2**: Content Processing Pipeline + Template Analysis (2 weeks)  
- **Phase 3**: Template Integration & Navigation Setup (2.5 weeks)
- **Phase 4**: Enhanced Data & State Management + Performance Optimization (2.5 weeks)
- **Phase 5**: Security Hardening + Background Processing Implementation (1.5 weeks)
- **Phase 6**: Comprehensive Testing & Performance Validation (1.5 weeks)

### **Note on Data Migration**
This implementation plan assumes a fresh application build without migration of existing user data from a previous version. If data migration from an older version of Golden Threads is required, a dedicated phase for designing, implementing, and testing this migration path would need to be added.

---

## 🚀 Phase 1: Foundation & Setup (Week 1)

### **Day 1-2: Project Setup**

#### **1.1 Initialize New Project**
```bash
# Create new Expo project
npx create-expo-app golden-threads-v2 --template typescript
cd golden-threads-v2

# Install core dependencies
npm install @react-navigation/native @react-navigation/stack
npm install react-native-screens react-native-safe-area-context
npm install expo-linear-gradient expo-haptics expo-notifications
npm install @react-native-async-storage/async-storage
npm install zustand react-hook-form

# Install testing and development dependencies
npm install --save-dev jest @testing-library/react-native @testing-library/jest-native
npm install --save-dev detox @react-native-community/netinfo
npm install react-error-boundary expo-crypto
npm install react-native-device-info @react-native-community/netinfo
```

#### **1.2 Project Structure Setup**
```
src/
├── templates/                    # Pre-built template source
│   └── examples/                # Template files to integrate
├── integration/                 # Template integration services
│   ├── TemplateIntegrationService.ts
│   ├── OnboardingIntegrator.ts
│   ├── MainScreenIntegrator.ts
│   └── ComponentExtractor.ts
├── components/                  # Extracted & enhanced components
│   ├── extracted/              # Components extracted from templates
│   ├── enhanced/              # Enhanced versions with functionality
│   ├── layout/
│   ├── shared/
│   └── error/
├── screens/                    # Integrated screen implementations
├── navigation/
├── store/
│   ├── userStore.ts
│   ├── journalStore.ts
│   └── appStore.ts
├── services/
│   ├── storage/
│   ├── notification/
│   └── error/
├── constants/
├── types/
├── hooks/
├── utils/
├── __tests__/
│   ├── unit/
│   ├── integration/
│   ├── e2e/
│   └── template-integration/   # Tests for template integration
└── security/
```

#### **1.3 TypeScript Configuration**
- Configure strict TypeScript settings
- Set up path aliases for clean imports
- Create base type definitions

### **Day 3-4: Core Constants & Design System**

#### **1.4 Design System Implementation**
```typescript
// src/constants/colors.ts
export const COLORS = {
  primary: '#F59E0B',
  primaryLight: '#FEF3C7',
  primaryDark: '#D97706',
  glass: 'rgba(255, 255, 255, 0.5)',
  glassStrong: 'rgba(255, 255, 255, 0.8)',
  glassBorder: 'rgba(255, 255, 255, 0.3)',
  text: {
    primary: '#111827',
    secondary: '#4B5563',
    tertiary: '#9CA3AF',
    white: '#FFFFFF',
  },
  traditions: {
    // All tradition colors as specified in PRD
  },
};

// src/constants/typography.ts
export const FONTS = {
  size: {
    xs: 12, sm: 14, base: 16, lg: 18, xl: 20,
    '2xl': 24, '3xl': 30, '4xl': 36, '5xl': 48,
  },
  weight: {
    extralight: '200', light: '300', normal: '400',
    medium: '500', semibold: '600', bold: '700',
  },
};

// src/constants/spacing.ts
export const SPACING = {
  xs: 4, sm: 8, md: 16, lg: 24, xl: 32, '2xl': 48, '3xl': 64,
};
```

#### **1.5 Responsive Hook Implementation**
```typescript
// src/hooks/useResponsiveStyles.ts
export const useResponsiveStyles = () => {
  const { width, height } = useWindowDimensions();
  
  // Device detection logic from PRD
  const getOptimizedSpacing = () => { /* ... */ };
  const getOptimizedTypography = () => { /* ... */ };
  
  return {
    spacing: getOptimizedSpacing(),
    fonts: getOptimizedTypography(),
    dimensions: getDimensions(),
    isTablet: width >= 768,
  };
};
```
- **Documentation Note:** The implementation of `getOptimizedSpacing` and `getOptimizedTypography` within `useResponsiveStyles.ts` should clearly document its adaptation logic. This includes defining specific breakpoints (e.g., small <375dp, medium 375dp-768dp, large >768dp) and how font sizes/spacing values are scaled or selected for these tiers to ensure consistency and maintainability.
```

### **Day 5-7: Navigation & Layout Foundation + Error Handling**

#### **1.6 Enhanced Error Handling System with Resilience**
```typescript
// src/components/error/ErrorBoundary.tsx
import React from 'react';
import { ErrorBoundary as RNErrorBoundary } from 'react-error-boundary';
import { ErrorFallback } from './ErrorFallback';
import { EnhancedErrorService } from '../services/error/EnhancedErrorService';

export const AppErrorBoundary = ({ children }) => (
  <RNErrorBoundary
    FallbackComponent={ErrorFallback}
    onError={(error, errorInfo) => {
      EnhancedErrorService.logError(error, {
        ...errorInfo,
        context: 'ErrorBoundary',
        timestamp: new Date().toISOString(),
      });
    }}
    onReset={() => {
      // Reset app state and clear error cache
      EnhancedErrorService.clearErrorState();
    }}
  >
    {children}
  </RNErrorBoundary>
);

// src/services/error/EnhancedErrorService.ts
export class EnhancedErrorService {
  private static errorCache = new Map<string, number>();
  private static circuitBreaker = new Map<string, { failures: number; lastFailure: number }>();

  static async logError(error: Error, context?: Record<string, unknown>) {
    const errorKey = `${error.name}-${error.message}`;
    const count = this.errorCache.get(errorKey) || 0;
    this.errorCache.set(errorKey, count + 1);

    // Prevent error spam
    if (count < 5) {
      console.error('App Error:', error, context);
      // Integrate with crash reporting service
      await this.reportToCrashService(error, context);
    }
  }

  static async executeWithRetry<T>(
    operation: () => Promise<T>,
    operationName: string,
    maxRetries: number = 3,
    baseDelay: number = 1000
  ): Promise<T> {
    const circuitState = this.circuitBreaker.get(operationName);
    
    // Circuit breaker logic
    if (circuitState && circuitState.failures >= 5) {
      const timeSinceLastFailure = Date.now() - circuitState.lastFailure;
      if (timeSinceLastFailure < 60000) { // 1 minute cool-down
        throw new Error(`Circuit breaker open for ${operationName}`);
      }
    }

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const result = await operation();
        // Reset circuit breaker on success
        this.circuitBreaker.delete(operationName);
        return result;
      } catch (error) {
        const circuitState = this.circuitBreaker.get(operationName) || { failures: 0, lastFailure: 0 };
        circuitState.failures++;
        circuitState.lastFailure = Date.now();
        this.circuitBreaker.set(operationName, circuitState);

        if (attempt === maxRetries) {
          await this.logError(error as Error, { 
            operation: operationName, 
            attempt, 
            maxRetries 
          });
          throw error;
        }

        // Exponential backoff with jitter
        const delay = baseDelay * Math.pow(2, attempt - 1) + Math.random() * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    throw new Error('Unexpected error in retry logic');
  }

  private static async reportToCrashService(error: Error, context?: Record<string, unknown>) {
    // Integration point for crash reporting service
    // TODO: Implement Sentry/Firebase Crashlytics integration
  }

  static clearErrorState() {
    this.errorCache.clear();
    this.circuitBreaker.clear();
  }
}
```

#### **1.7 Background Processing Service**
```typescript
// src/services/background/BackgroundProcessingService.ts
interface BackgroundTask {
  id: string;
  operation: string;
  priority: 'low' | 'medium' | 'high';
  payload: unknown;
  createdAt: string;
  retryCount: number;
  maxRetries: number;
}

export class BackgroundProcessingService {
  private static processingQueue: BackgroundTask[] = [];
  private static isProcessing = false;
  private static maxConcurrentTasks = 3;
  private static runningTasks = new Set<string>();

  static async queueTask<T>(
    operation: () => Promise<T>,
    options: {
      priority?: 'low' | 'medium' | 'high';
      maxRetries?: number;
      operationName: string;
    }
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      const task: BackgroundTask = {
        id: `${Date.now()}-${Math.random()}`,
        operation: options.operationName,
        priority: options.priority || 'medium',
        payload: { resolve, reject, operation },
        createdAt: new Date().toISOString(),
        retryCount: 0,
        maxRetries: options.maxRetries || 3,
      };

      this.addToQueue(task);
      this.processQueue();
    });
  }

  private static addToQueue(task: BackgroundTask) {
    // Priority queue implementation
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    const insertIndex = this.processingQueue.findIndex(
      t => priorityOrder[t.priority] > priorityOrder[task.priority]
    );
    
    if (insertIndex === -1) {
      this.processingQueue.push(task);
    } else {
      this.processingQueue.splice(insertIndex, 0, task);
    }
  }

  private static async processQueue() {
    if (this.runningTasks.size >= this.maxConcurrentTasks || this.processingQueue.length === 0) {
      return;
    }

    const task = this.processingQueue.shift();
    if (!task) return;

    this.runningTasks.add(task.id);

    try {
      const { resolve, reject, operation } = task.payload as any;
      const result = await operation();
      resolve(result);
    } catch (error) {
      if (task.retryCount < task.maxRetries) {
        task.retryCount++;
        this.addToQueue(task);
      } else {
        const { reject } = task.payload as any;
        reject(error);
      }
    } finally {
      this.runningTasks.delete(task.id);
      // Process next task
      setTimeout(() => this.processQueue(), 100);
    }
  }
}
```

- **Task:** Select and integrate a crash reporting service (e.g., Sentry, Firebase Crashlytics, Bugsnag).
  - Install the chosen service's SDK.
  - Configure `EnhancedErrorService.reportToCrashService` to report errors to this service.
  - Implement circuit breaker pattern for resilient error handling.
  - Add background processing queue for heavy operations.
```

#### **1.7 Network & Connectivity Handling**
```typescript
// src/hooks/useNetworkStatus.ts
import { useState, useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';

export const useNetworkStatus = () => {
  const [isConnected, setIsConnected] = useState(true);
  const [networkType, setNetworkType] = useState<string>('unknown');

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected ?? false);
      setNetworkType(state.type);
    });

    return unsubscribe;
  }, []);

  return { isConnected, networkType };
};
```

#### **1.8 Navigation Setup with Error Handling**
```typescript
// src/navigation/AppNavigator.tsx
import { createStackNavigator } from '@react-navigation/stack';
import { AppErrorBoundary } from '../components/error/ErrorBoundary';

const Stack = createStackNavigator<RootStackParamList>();

export const AppNavigator = () => (
  <AppErrorBoundary>
    <Stack.Navigator 
      initialRouteName="Onboarding"
      screenOptions={defaultScreenOptions}
    >
      {/* All screens as specified in PRD */}
    </Stack.Navigator>
  </AppErrorBoundary>
);
```

#### **1.9 Layout Components with Performance Optimization**
```typescript
// src/components/layout/BackgroundGradient.tsx
import React, { memo } from 'react';
import { LinearGradient } from 'expo-linear-gradient';

export const BackgroundGradient = memo(() => (
  <LinearGradient
    colors={['#FDF2F8', '#FFFBEB', '#EDE9FE', '#F0F9FF']}
    locations={[0, 0.35, 0.65, 1]}
    style={StyleSheet.absoluteFill}
  />
));

// src/components/layout/PageLayout.tsx
import React, { memo, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';

export const PageLayout = memo(({ children, onMenuPress, ...props }) => {
  const handleMenuPress = useCallback(() => {
    onMenuPress?.();
  }, [onMenuPress]);

  // Cleanup on screen blur
  useFocusEffect(
    useCallback(() => {
      return () => {
        // Cleanup logic when leaving screen
      };
    }, [])
  );

  return (
    <View style={styles.container}>
      <BackgroundGradient />
      <SafeAreaView style={styles.content}>
        {children}
      </SafeAreaView>
    </View>
  );
});
```

#### **1.10 Testing Setup**
```typescript
// jest.config.js
module.exports = {
  preset: 'react-native',
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|expo|@expo|@react-navigation)/)',
  ],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/__tests__/**',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
};

// src/__tests__/setup.ts
import 'react-native-gesture-handler/jestSetup';
import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';

---

## Phase 2: Content Pipeline (V1), Template Analysis & Component Extraction (Week 2-3)

### **2.0 Enhanced CSV Content Processing & Optimization Pipeline**
```typescript
// scripts/content-processor.ts - Build-time content optimization
import { parse } from 'csv-parse/sync';
import { z } from 'zod';
import * as crypto from 'crypto';

interface ContentProcessorConfig {
  chunkSize: number;
  generateSearchIndex: boolean;
  calculateReadingTimes: boolean;
  enableCompression: boolean;
  maxContentAge: number; // days
}

export class ContentProcessor {
  private config: ContentProcessorConfig;

  constructor(config: ContentProcessorConfig) {
    this.config = config;
  }

  async processContentCSV(csvPath: string): Promise<void> {
    console.log('🚀 Starting content processing pipeline...');
    
    // Step 1: Parse and validate CSV
    const rawContent = await this.parseCSV(csvPath);
    const validatedContent = await this.validateContent(rawContent);
    
    // Step 2: Enhance content with metadata
    const enhancedContent = await this.enhanceContent(validatedContent);
    
    // Step 3: Create optimized data structures
    const optimizedBundle = await this.createOptimizedBundle(enhancedContent);
    
    // Step 4: Generate search indexes
    const searchIndex = await this.generateSearchIndex(enhancedContent);
    
    // Step 5: Create chunked storage for memory efficiency
    const chunks = await this.createContentChunks(enhancedContent);
    
    // Step 6: Pre-calculate daily content for a year
    const dailyContentCache = await this.generateDailyContentCache(enhancedContent);
    
    // Step 7: Save all optimized files
    await this.saveOptimizedFiles({
      bundle: optimizedBundle,
      searchIndex,
      chunks,
      dailyCache: dailyContentCache,
    });
    
    console.log('✅ Content processing complete!');
  }

  private async enhanceContent(content: DailyContent[]): Promise<DailyContent[]> {
    return content.map(item => ({
      ...item,
      preProcessed: true,
      searchKeywords: this.extractKeywords(item.today_wisdom + ' ' + item.reflection_prompt),
      estimatedReadingTime: this.calculateReadingTime(item.today_wisdom + item.go_deeper),
      contentHash: crypto.createHash('sha256').update(JSON.stringify(item)).digest('hex'),
    }));
  }

  private async createContentChunks(content: DailyContent[]): Promise<Record<string, DailyContent[]>> {
    const chunks: Record<string, DailyContent[]> = {};
    
    for (let i = 0; i < content.length; i += this.config.chunkSize) {
      const chunkId = `chunk_${Math.floor(i / this.config.chunkSize)}`;
      chunks[chunkId] = content.slice(i, i + this.config.chunkSize);
    }
    
    return chunks;
  }

  private async generateDailyContentCache(content: DailyContent[]): Promise<Record<string, string>> {
    const cache: Record<string, string> = {};
    const startDate = new Date();
    
    for (let i = 0; i < 365; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      const dateString = date.toISOString().split('T')[0];
      
      // Rotate through content based on date
      const contentIndex = i % content.length;
      cache[dateString] = content[contentIndex].contentId;
    }
    
    return cache;
  }

  private extractKeywords(text: string): string[] {
    // Simple keyword extraction - can be enhanced with NLP
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 3)
      .slice(0, 10); // Top 10 keywords
  }

  private calculateReadingTime(text: string): number {
    const wordsPerMinute = 200;
    const wordCount = text.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  }
}
```

#### **2.1 Optimized Content Service**
```typescript
// src/services/content/OptimizedContentService.ts
export class OptimizedContentService {
  private static contentChunks: Map<string, DailyContent[]> = new Map();
  private static searchIndex: Map<string, string[]> = new Map();
  private static dailyContentCache: Map<string, string> = new Map();
  private static loadedChunks = new Set<string>();

  static async initialize(): Promise<void> {
    // Load only essential indexes and daily cache
    await this.loadDailyContentCache();
    await this.loadSearchIndex();
    
    // Preload current week's content chunk
    await this.preloadCurrentWeekContent();
  }

  static async getTodaysContent(selectedTraditions: string[]): Promise<DailyContent | null> {
    const today = new Date().toISOString().split('T')[0];
    const contentId = this.dailyContentCache.get(today);
    
    if (!contentId) return null;

    // Find which chunk contains this content
    const chunkId = await this.findContentChunk(contentId);
    if (!chunkId) return null;

    // Load chunk if not already loaded
    if (!this.loadedChunks.has(chunkId)) {
      await this.loadContentChunk(chunkId);
    }

    const chunk = this.contentChunks.get(chunkId);
    if (!chunk) return null;

    const content = chunk.find(item => item.contentId === contentId);
    
    // Filter by selected traditions
    if (content && selectedTraditions.includes(content.tradition)) {
      return content;
    }

    // Fallback: find alternative content from selected traditions
    return this.findAlternativeContent(selectedTraditions, today);
  }

  private static async loadContentChunk(chunkId: string): Promise<void> {
    try {
      // Use background processing for chunk loading
      await BackgroundProcessingService.queueTask(
        async () => {
          const chunkData = await import(`../../../assets/content_chunks/${chunkId}.json`);
          this.contentChunks.set(chunkId, chunkData.default);
          this.loadedChunks.add(chunkId);
        },
        { 
          operationName: `loadContentChunk-${chunkId}`,
          priority: 'high'
        }
      );
    } catch (error) {
      console.error(`Failed to load content chunk ${chunkId}:`, error);
    }
  }

  // Memory management: unload old chunks
  static cleanupMemory(): void {
    const maxLoadedChunks = 3;
    if (this.loadedChunks.size > maxLoadedChunks) {
      const oldestChunks = Array.from(this.loadedChunks).slice(0, -maxLoadedChunks);
      oldestChunks.forEach(chunkId => {
        this.contentChunks.delete(chunkId);
        this.loadedChunks.delete(chunkId);
      });
    }
  }
}
```

**Tasks:**
- Create build-time content processing pipeline with optimization
- Implement chunked content loading for memory efficiency
- Pre-calculate daily content assignments for a full year
- Generate search indexes for fast content lookup
- Add background processing for heavy content operations
- Implement memory management for loaded content chunks

---

// src/integration/TemplateIntegrationService.ts
export class TemplateIntegrationService {
  static async integrateAllTemplates(): Promise<void> {
    const integrationPlan = {
      // Secondary application screens
      reflectionComplete: {
        template: '/templates/examples/ReflectionCompletePreview.tsx',
        integrator: ReflectionCompleteIntegrator,
        dependencies: ['MainScreen', 'JournalReview'],
      },
      notifications: {
        template: '/templates/examples/NotificationsTemplate.tsx', 
        integrator: NotificationsIntegrator,
        dependencies: ['UserStore', 'NotificationService'],
      },
      spiritualTraditions: {
        template: '/templates/examples/SpiritualTraditionsRebuilt.tsx',
        integrator: SpiritualTraditionsIntegrator, 
        dependencies: ['UserStore', 'TraditionData'],
      },
    };

    // Execute integration for each template
    for (const [screenName, config] of Object.entries(integrationPlan)) {
      await this.integrateTemplate(screenName, config);
    }
  }

  private static async integrateTemplate(screenName: string, config: TemplateConfig) {
    console.log(`Integrating ${screenName} template...`);
    
    // 1. Deep analysis of template
    const analysis = await this.analyzeTemplate(config.template);
    
    // 2. Component extraction and enhancement  
    const components = await this.extractAndEnhanceComponents(analysis);
    
    // 3. State management integration
    const stateIntegration = await this.integrateStateManagement(components, config.dependencies);
    
    // 4. Navigation setup
    const navigationSetup = await this.setupNavigation(screenName, config.dependencies);
    
    // 5. Error handling and validation
    const errorHandling = await this.addErrorHandling(components);
    
    // 6. Performance optimization
    const optimizedComponents = await this.optimizePerformance(components);
    
    // 7. Accessibility enhancement
    const accessibleComponents = await this.enhanceAccessibility(optimizedComponents);
    
    // 8. Integration validation
    await this.validateIntegration(screenName, accessibleComponents);
    
    console.log(`✅ ${screenName} template integration complete`);
  }
}

// src/store/userStore.ts - Enhanced User preferences and settings with performance optimization
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { subscribeWithSelector } from 'zustand/middleware';

interface UserState {
  selectedTraditions: string[];
  onboardingCompleted: boolean;
  notificationSettings: NotificationSettings;
  
  // Performance tracking
  lastActivity: string;
  sessionStartTime: string;
  
  // Actions
  setSelectedTraditions: (traditions: string[]) => void;
  completeOnboarding: () => void;
  updateNotificationSettings: (settings: NotificationSettings) => void;
  resetUserData: () => void;
  updateActivity: () => void;
}

// Optimized selector hooks to prevent unnecessary re-renders
export const useSelectedTraditions = () => useUserStore(state => state.selectedTraditions);
export const useOnboardingStatus = () => useUserStore(state => state.onboardingCompleted);
export const useNotificationSettings = () => useUserStore(state => state.notificationSettings);

export const useUserStore = create<UserState>()(
  subscribeWithSelector(
    persist(
      (set, get) => ({
        selectedTraditions: [],
        onboardingCompleted: false,
        notificationSettings: defaultNotificationSettings,
        lastActivity: new Date().toISOString(),
        sessionStartTime: new Date().toISOString(),
        
        setSelectedTraditions: (traditions) => {
          if (traditions.length === 0) {
            throw new Error('At least one tradition must be selected');
          }
          
          // Use background processing for tradition validation
          BackgroundProcessingService.queueTask(
            async () => {
              // Validate traditions and update related content cache
              await OptimizedContentService.validateTraditions(traditions);
            },
            { operationName: 'validateTraditions', priority: 'medium' }
          );
          
          set({ 
            selectedTraditions: traditions,
            lastActivity: new Date().toISOString()
          });
        },
        
        completeOnboarding: () => set({ 
          onboardingCompleted: true,
          lastActivity: new Date().toISOString()
        }),
        
        updateNotificationSettings: (settings) => {
          set({ 
            notificationSettings: { ...get().notificationSettings, ...settings },
            lastActivity: new Date().toISOString()
          });
        },
        
        updateActivity: () => set({ lastActivity: new Date().toISOString() }),
        
        resetUserData: () => set({
          selectedTraditions: [],
          onboardingCompleted: false,
          notificationSettings: defaultNotificationSettings,
          lastActivity: new Date().toISOString(),
        }),
      }),
      {
        name: 'user-store',
        // Enhanced persistence with performance monitoring
        onRehydrateStorage: () => (state) => {
          console.log('🔄 Rehydrating user store...');
          
          // Validate rehydrated state
          if (state && state.selectedTraditions.length === 0) {
            state.selectedTraditions = ['Buddhism']; // Default tradition
          }
          
          // Update session start time
          if (state) {
            state.sessionStartTime = new Date().toISOString();
          }
          
          console.log('✅ User store rehydrated successfully');
        },
        // Selective serialization for performance
        partialize: (state) => ({
          selectedTraditions: state.selectedTraditions,
          onboardingCompleted: state.onboardingCompleted,
          notificationSettings: state.notificationSettings,
          lastActivity: state.lastActivity,
        }),
      }
    )
  )
);

// src/store/journalStore.ts - Journal entries and daily content
interface JournalState {
  journalEntries: JournalEntry[];
  currentQuote: Quote | null;
  todaysIntention: string;
  todaysReflection: string;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  saveJournalEntry: (entry: JournalEntry) => Promise<void>;
  updateTodaysIntention: (intention: string) => void;
  updateTodaysReflection: (reflection: string) => void;
  setCurrentQuote: (quote: Quote) => void;
  deleteJournalEntry: (id: string) => Promise<void>;
  clearError: () => void;
}

export const useJournalStore = create<JournalState>()(
  persist(
    (set, get) => ({
      journalEntries: [],
      currentQuote: null,
      todaysIntention: '',
      todaysReflection: '',
      isLoading: false,
      error: null,
      
      saveJournalEntry: async (entry) => {
        set({ isLoading: true, error: null });
        try {
          // Validate entry before saving
          if (!entry.intention && !entry.journal) {
            throw new Error('Entry must have either intention or reflection');
          }
          
          const existingEntries = get().journalEntries;
          const updatedEntries = existingEntries.filter(e => e.id !== entry.id);
          updatedEntries.push(entry);
          
          set({ 
            journalEntries: updatedEntries,
            isLoading: false
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to save entry',
            isLoading: false 
          });
          throw error;
        }
      },
      
      updateTodaysIntention: (intention) => set({ todaysIntention: intention }),
      updateTodaysReflection: (reflection) => set({ todaysReflection: reflection }),
      setCurrentQuote: (quote) => set({ currentQuote: quote }),
      clearError: () => set({ error: null }),
      
      deleteJournalEntry: async (id) => {
        set({ isLoading: true, error: null });
        try {
          const entries = get().journalEntries.filter(entry => entry.id !== id);
          set({ journalEntries: entries, isLoading: false });
        } catch (error) {
          set({ 
            error: 'Failed to delete entry',
            isLoading: false 
          });
          throw error;
        }
      },
    }),
    {
      name: 'journal-store',
      partialize: (state) => ({
        journalEntries: state.journalEntries,
        todaysIntention: state.todaysIntention,
        todaysReflection: state.todaysReflection,
      }),
    }
  )
);

// src/store/appStore.ts - General app state
interface AppState {
  isInitialized: boolean;
  isOnline: boolean;
  currentScreen: string;
  lastActiveDate: string;
  
  // Actions
  setInitialized: () => void;
  setOnlineStatus: (status: boolean) => void;
  setCurrentScreen: (screen: string) => void;
  updateLastActiveDate: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  isInitialized: false,
  isOnline: true,
  currentScreen: 'Main',
  lastActiveDate: new Date().toDateString(),
  
  setInitialized: () => set({ isInitialized: true }),
  setOnlineStatus: (status) => set({ isOnline: status }),
  setCurrentScreen: (screen) => set({ currentScreen: screen }),
  updateLastActiveDate: () => set({ lastActiveDate: new Date().toDateString() }),
}));
```

#### **4.2 Content Service**
```typescript
// src/services/ContentService.ts
export class ContentService {
  private static quotes: Quote[] = [
    // Comprehensive quote database organized by tradition
  ];

  static getTodaysQuote(selectedTraditions: string[]): Quote {
    const today = new Date().toDateString();
    const seed = this.hashCode(today);
    
    const filteredQuotes = this.quotes.filter(
      quote => selectedTraditions.includes(quote.tradition)
    );
    
    const index = Math.abs(seed) % filteredQuotes.length;
    return filteredQuotes[index];
  }

  static getTodaysPrompt(): string {
    const prompts = [
      "What moment today filled you with gratitude?",
      "How did you practice mindfulness today?",
      "What wisdom did you discover in today's challenges?",
      // ... more prompts
    ];
    
    const today = new Date().toDateString();
    const seed = this.hashCode(today);
    const index = Math.abs(seed) % prompts.length;
    return prompts[index];
  }

  private static hashCode(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash;
  }
}
```

### **Week 8.5: Performance Optimization & Memory Management**

#### **4.2 Performance Monitoring & Optimization**
```typescript
// src/hooks/usePerformanceMonitor.ts
import { useEffect, useRef } from 'react';
import DeviceInfo from 'react-native-device-info';

export const usePerformanceMonitor = (componentName: string) => {
  const renderStartTime = useRef<number>();
  const mountTime = useRef<number>();

  useEffect(() => {
    mountTime.current = Date.now();
    return () => {
      const unmountTime = Date.now();
      const lifespan = mountTime.current ? unmountTime - mountTime.current : 0;
      if (lifespan > 10000) { // Log long-lived components
        console.log(`Component ${componentName} lifespan: ${lifespan}ms`);
      }
    };
  }, [componentName]);

  const startRender = () => {
    renderStartTime.current = Date.now();
  };

  const endRender = () => {
    if (renderStartTime.current) {
      const renderTime = Date.now() - renderStartTime.current;
      if (renderTime > 100) { // Log slow renders
        console.log(`Slow render in ${componentName}: ${renderTime}ms`);
      }
    }
  };

  return { startRender, endRender };
};

// src/components/optimized/OptimizedFlatList.tsx
import React, { memo, useCallback, useMemo } from 'react';
import { FlatList, ListRenderItem } from 'react-native';

interface OptimizedFlatListProps<T> {
  data: T[];
  renderItem: ListRenderItem<T>;
  keyExtractor: (item: T, index: number) => string;
  estimatedItemSize?: number;
}

export const OptimizedFlatList = memo(<T,>({
  data,
  renderItem,
  keyExtractor,
  estimatedItemSize = 100,
}: OptimizedFlatListProps<T>) => {
  const getItemLayout = useCallback(
    (_: any, index: number) => ({
      length: estimatedItemSize,
      offset: estimatedItemSize * index,
      index,
    }),
    [estimatedItemSize]
  );

  const memoizedData = useMemo(() => data, [data]);

  return (
    <FlatList
      data={memoizedData}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      getItemLayout={getItemLayout}
      removeClippedSubviews={true}
      maxToRenderPerBatch={10}
      initialNumToRender={5}
      windowSize={10}
    />
  );
});
```

#### **4.3 Memory Leak Prevention**
```typescript
// src/hooks/useCleanupEffect.ts
import { useEffect, useRef } from 'react';

export const useCleanupEffect = (effect: () => (() => void) | void, deps?: React.DependencyList) => {
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    cleanupRef.current?.(); // Cleanup previous effect
    cleanupRef.current = (effect() as () => void) || null;

    return () => {
      cleanupRef.current?.();
      cleanupRef.current = null;
    };
  }, deps);

  useEffect(() => {
    return () => {
      cleanupRef.current?.();
    };
  }, []);
};

// src/hooks/useAsyncOperation.ts
import { useState, useEffect, useRef, useCallback } from 'react';

export const useAsyncOperation = <T>(
  asyncFn: () => Promise<T>,
  dependencies: React.DependencyList = []
) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const execute = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await asyncFn();
      
      if (isMountedRef.current) {
        setData(result);
      }
    } catch (err) {
      if (isMountedRef.current) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, dependencies);

  useEffect(() => {
    execute();
  }, [execute]);

  return { data, loading, error, retry: execute };
};
```

### **Week 9: Enhanced Data Persistence & E2E Testing**

- **Task:** Configure Zustand's `persist` middleware to use the custom `StorageService` as its storage adapter. This centralizes AsyncStorage interactions, encryption, and error handling for stored state.
  ```typescript
  // Conceptual example in a store (e.g., journalStore.ts):
  // import { StorageService } from '../services/storage/StorageService'; // Ensure StorageService methods align with StateStorage interface
  // persist(
  //   (set, get) => ({ /* store logic */ }),
  //   {
  //     name: 'journal-storage', // unique name for AsyncStorage key
  //     storage: {
  //       getItem: async (name: string) => {
  //         const str = await StorageService.getItem(name); // Assumes StorageService.getItem handles decryption
  //         return str ? JSON.parse(str) : null;
  //       },
  //       setItem: async (name: string, value: string) => {
  //         // Zustand's persist middleware passes the already stringified state as 'value'.
  //         await StorageService.setItem(name, value); // Assumes StorageService.setItem handles encryption
  //       },
  //       removeItem: async (name: string) => {
  //         await StorageService.removeItem(name);
  //       },
  //     },
  //   }
  // )
  ```

#### **4.1 Domain-Separated Zustand Stores**
```typescript
// src/services/storage/StorageService.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { ErrorService } from '../error/ErrorService';

export class StorageService {
  private static readonly KEYS = {
    JOURNAL_ENTRIES: 'journal_entries_v2',
    USER_PREFERENCES: 'user_preferences_v2',
    NOTIFICATION_SETTINGS: 'notification_settings_v2',
    ONBOARDING_STATE: 'onboarding_state_v2',
  };

  private static readonly RETRY_ATTEMPTS = 3;
  private static readonly RETRY_DELAY = 1000;

  // Enhanced journal entries with atomic operations and validation
  static async saveJournalEntry(entry: JournalEntry): Promise<void> {
    try {
      this.validateJournalEntry(entry);
      
      await this.atomicOperation(async () => {
        const existing = await this.getJournalEntries();
        const updated = existing.filter(e => e.id !== entry.id);
        updated.push(entry);
        
        await AsyncStorage.setItem(
          this.KEYS.JOURNAL_ENTRIES,
          JSON.stringify(updated)
        );
      });
    } catch (error) {
      ErrorService.handleAsyncError('saveJournalEntry', error as Error);
      throw error;
    }
  }

  static async getJournalEntries(): Promise<JournalEntry[]> {
    try {
      return await this.retryOperation(async () => {
        const data = await AsyncStorage.getItem(this.KEYS.JOURNAL_ENTRIES);
        if (!data) return [];
        
        const entries = JSON.parse(data);
        return this.validateAndFilterEntries(entries);
      });
    } catch (error) {
      ErrorService.handleAsyncError('getJournalEntries', error as Error);
      return [];
    }
  }

  static async deleteJournalEntry(entryId: string): Promise<void> {
    try {
      await this.atomicOperation(async () => {
        const existing = await this.getJournalEntries();
        const filtered = existing.filter(entry => entry.id !== entryId);
        
        await AsyncStorage.setItem(
          this.KEYS.JOURNAL_ENTRIES,
          JSON.stringify(filtered)
        );
      });
    } catch (error) {
      ErrorService.handleAsyncError('deleteJournalEntry', error as Error);
      throw error;
    }
  }

  // Secure storage for sensitive user data
  static async saveUserSettings(settings: UserSettings): Promise<void> {
    try {
      this.validateUserSettings(settings);
      const settingsWithTimestamp = {
        ...settings,
        lastUpdated: new Date().toISOString(),
      };
      
      await this.retryOperation(async () => {
        await SecureStore.setItemAsync(
          this.KEYS.USER_PREFERENCES,
          JSON.stringify(settingsWithTimestamp)
        );
      });
    } catch (error) {
      ErrorService.handleAsyncError('saveUserSettings', error as Error);
      throw error;
    }
  }

  static async getUserSettings(): Promise<UserSettings | null> {
    try {
      return await this.retryOperation(async () => {
        const data = await SecureStore.getItemAsync(this.KEYS.USER_PREFERENCES);
        if (!data) return null;
        
        const settings = JSON.parse(data);
        return this.validateUserSettingsData(settings);
      });
    } catch (error) {
      ErrorService.handleAsyncError('getUserSettings', error as Error);
      return null;
    }
  }

  // Data validation methods
  private static validateJournalEntry(entry: JournalEntry): void {
    if (!entry.id || !entry.date) {
      throw new Error('Invalid journal entry: missing required fields');
    }
    if (typeof entry.intention !== 'string' || typeof entry.journal !== 'string') {
      throw new Error('Invalid journal entry: invalid field types');
    }
  }

  private static validateUserSettings(settings: UserSettings): void {
    if (typeof settings.notificationsEnabled !== 'boolean') {
      throw new Error('Invalid user settings: notificationsEnabled must be boolean');
    }
    if (!Array.isArray(settings.selectedTraditions) || settings.selectedTraditions.length === 0) {
      throw new Error('Invalid user settings: selectedTraditions must be non-empty array');
    }
  }

  private static validateAndFilterEntries(entries: any[]): JournalEntry[] {
    if (!Array.isArray(entries)) return [];
    
    return entries.filter(entry => {
      try {
        this.validateJournalEntry(entry);
        return true;
      } catch {
        return false; // Filter out invalid entries
      }
    });
  }

  private static validateUserSettingsData(settings: any): UserSettings | null {
    try {
      this.validateUserSettings(settings);
      return settings;
    } catch {
      return null;
    }
  }

  // Atomic operations to prevent partial writes
  private static async atomicOperation<T>(operation: () => Promise<T>): Promise<T> {
    // Simple atomic operation implementation
    // In a more complex app, you might use a more sophisticated locking mechanism
    return await operation();
  }

  // Retry mechanism for storage operations
  private static async retryOperation<T>(
    operation: () => Promise<T>,
    attempts: number = this.RETRY_ATTEMPTS
  ): Promise<T> {
    for (let i = 0; i < attempts; i++) {
      try {
        return await operation();
      } catch (error) {
        if (i === attempts - 1) throw error;
        await new Promise(resolve => setTimeout(resolve, this.RETRY_DELAY * (i + 1)));
      }
    }
    throw new Error('Operation failed after all retry attempts');
  }

  // Data migration for version updates
  static async migrateDataIfNeeded(): Promise<void> {
    try {
      const currentVersion = await AsyncStorage.getItem('data_version');
      if (currentVersion !== '2.0') {
        await this.performDataMigration();
        await AsyncStorage.setItem('data_version', '2.0');
      }
    } catch (error) {
      ErrorService.handleAsyncError('migrateDataIfNeeded', error as Error);
    }
  }

  private static async performDataMigration(): Promise<void> {
    // Migrate data from old format to new format
    // This would include moving from old keys to new versioned keys
  }
}
```

#### **4.4 Notification Service**
```typescript
// src/services/NotificationService.ts
import * as Notifications from 'expo-notifications';

export class NotificationService {
  static async requestPermissions(): Promise<boolean> {
    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
  }

  static async scheduleDailyNotification(
    type: 'wisdom' | 'intention' | 'reflection',
    time: Date
  ): Promise<void> {
    const notificationContent = this.getNotificationContent(type);
    
    await Notifications.scheduleNotificationAsync({
      content: notificationContent,
      trigger: {
        hour: time.getHours(),
        minute: time.getMinutes(),
        repeats: true,
      },
    });
  }

  private static getNotificationContent(type: string) {
    const contentMap = {
      wisdom: {
        title: "Daily Wisdom",
        body: "Your spiritual quote for today is ready"
      },
      intention: {
        title: "Set Your Intention",
        body: "Take a moment to set your intention for the day"
      },
      reflection: {
        title: "Evening Reflection",
        body: "Time to reflect on your day's journey"
      }
    };
    return contentMap[type];
  }
}
```

---

#### **4.5 End-to-End Testing Implementation**
```typescript
// e2e/onboarding.e2e.js
describe('Onboarding Flow', () => {
  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should complete full onboarding process', async () => {
    // Welcome screen
    await expect(element(by.text('Welcome to Golden Threads'))).toBeVisible();
    await element(by.text('Begin')).tap();
    
    // Traditions selection
    await expect(element(by.text('Select Traditions'))).toBeVisible();
    await element(by.text('Buddhism')).tap();
    await element(by.text('Christianity')).tap();
    await element(by.text('Continue')).tap();
    
    // Features overview
    await expect(element(by.text('Your Daily Practice'))).toBeVisible();
    await element(by.text('Onward')).tap();
    
    // Notifications setup
    await expect(element(by.text('Stay Connected'))).toBeVisible();
    await element(by.text('Start the Practice')).tap();
    
    // Verify main screen
    await expect(element(by.text('Home'))).toBeVisible();
    await expect(element(by.id('quote-card'))).toBeVisible();
  });

  it('should handle network connectivity issues', async () => {
    await device.setNetworkConnection('none');
    await element(by.text('Begin')).tap();
    
    // Should still work offline
    await expect(element(by.text('Select Traditions'))).toBeVisible();
    
    await device.setNetworkConnection('wifi');
  });
});

// e2e/journaling.e2e.js
describe('Journaling Flow', () => {
  beforeEach(async () => {
    await device.reloadReactNative();
    // Skip onboarding for these tests
    await element(by.id('skip-onboarding')).tap();
  });

  it('should save and retrieve journal entries', async () => {
    // Enter intention
    await element(by.id('intention-input')).typeText('Practice mindfulness today');
    
    // Enter reflection
    await element(by.id('reflection-input')).typeText('I felt peaceful during meditation');
    
    // Save entry
    await element(by.text('Remember')).tap();
    
    // Verify success screen
    await expect(element(by.text('Beautifully Remembered'))).toBeVisible();
    
    // Navigate to journal review
    await element(by.text('Review Entries')).tap();
    
    // Verify entry appears
    await expect(element(by.text('Practice mindfulness today'))).toBeVisible();
    await expect(element(by.text('I felt peaceful during meditation'))).toBeVisible();
  });
});
```

## ✨ Phase 5: Security Audit + Accessibility + Load Testing (Week 10-10.5)

### **Week 10: Security Audit & Accessibility**

#### **5.1 Comprehensive Testing Strategy**
- **Unit Tests:**
  - **Target Coverage:** Aim for >80% unit test coverage for all services, utility functions, Zustand stores, and complex UI components.
  - **Tools:** Jest, React Native Testing Library.
  - **Focus:** Validate individual functions, state mutations, component rendering based on props, and basic user interactions within components.
  - **Example:** Test `StorageService` encryption/decryption, `ContentService` content retrieval logic, Zustand store actions and selectors, `useResponsiveStyles` outputs for different dimensions.
- **Integration Tests:**
  - **Focus:** Verify interactions between components and services (e.g., a screen fetching data from a service and updating its state, form submission logic involving validation and service calls).
  - **Tools:** Jest, React Native Testing Library.
  - **Example:** Test the flow of saving a journal entry (UI -> Zustand store -> `StorageService`). Test content display on `MainScreen` ( `ContentService` -> UI).
- **End-to-End (E2E) Tests:**
  - **Tool:** Detox.
  - **Key Flows to Cover:**
    1.  **Onboarding:** Complete selection of spiritual traditions, notification preferences.
    2.  **Daily Interaction:** View quote, set intention, write reflection, save entry.
    3.  **Journal Review:** Navigate to review screen, view past entries, interact with entry details (expand/collapse if applicable).
    4.  **Settings:** Change notification preferences, manage traditions.
    5.  **Offline Functionality:** Verify app behavior when offline (content display from cache, saving entries locally for later sync if applicable in future versions).
- **Template Integration Tests:**
  - **Focus:** Specifically test the integration and correct functioning of UI components derived or heavily based on the chosen UI template/kit.
  - **Task:** Create a `TemplateIntegrationService` (as outlined in Phase 1) to systematically check props, styles, and basic interactions of template components used in the app.
- **Manual Testing:**
  - **Focus:** Exploratory testing, UI/UX review, accessibility checks (VoiceOver, TalkBack), performance on target devices.
  - **Device Matrix:** Test on a range of iOS and Android devices/emulators representing different screen sizes and OS versions.
- **Offline Functionality Testing:**
    - **Task:** Systematically test all core features (viewing content, writing/saving journal entries, settings) with the device in airplane mode or network disconnected to ensure graceful degradation and use of cached data.

#### **5.2 Security Hardening & Audit**
- **Task:** Review and implement all security measures outlined in the PRD (Data Encryption, Input Sanitization, Secure Key Management).
- **Task:** Perform a manual security audit focusing on:
    -   Local data storage (AsyncStorage encryption effectiveness).
    -   Input validation points to prevent injection or data corruption.
    -   Secure handling of any sensitive information (e.g., API keys for future services like crash reporting).
    -   Dependencies for known vulnerabilities.
- **Task:** Ensure `expo-secure-store` is used for storing the encryption key for `StorageService`.

#### **5.3 Accessibility Review (WCAG AA)**
- **Task:** Conduct a thorough accessibility review against WCAG AA guidelines.
- **Focus:** Semantic HTML (React Native accessibility props), ARIA attributes, keyboard navigability, screen reader compatibility (VoiceOver, TalkBack), color contrast, touch target sizes.
- **Task:** Utilize accessibility inspector tools and manual testing with assistive technologies.

#### **5.4 Performance Profiling & Optimization**
- **Task:** Profile app performance using React Native developer tools (Performance Monitor, Flipper if integrated).
- **Focus:** Identify and address:
    -   Slow component rendering.
    -   Unnecessary re-renders.
    -   Memory leaks.
    -   Slow startup time.
- **Task:** Optimize images and assets.

    const screenReaderListener = AccessibilityInfo.addEventListener(
      'screenReaderChanged',
      setIsScreenReaderEnabled
    );

    const reduceMotionListener = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      setIsReduceMotionEnabled
    );

    return () => {
      screenReaderListener?.remove();
      reduceMotionListener?.remove();
    };
  }, []);

  return {
    isScreenReaderEnabled,
    isReduceMotionEnabled,
    announceForAccessibility: AccessibilityInfo.announceForAccessibility,
  };
};
```

#### **5.3 Load Testing & Performance Validation**
```typescript
// __tests__/integration/onboarding.test.tsx
describe('Onboarding Flow', () => {
  it('should complete full onboarding process', async () => {
    const { getByText, getByTestId } = render(<OnboardingFlow />);
    
    // Test welcome screen
    expect(getByText('Welcome to Golden Threads')).toBeTruthy();
    fireEvent.press(getByText('Begin'));
    
    // Test traditions selection
    fireEvent.press(getByText('Buddhism'));
    fireEvent.press(getByText('Continue'));
    
    // Test features overview
    fireEvent.press(getByText('Onward'));
    
    // Test notifications setup
    fireEvent.press(getByText('Start the Practice'));
    
    // Verify navigation to main screen
    await waitFor(() => {
      expect(getByTestId('main-screen')).toBeTruthy();
    });
  });
});
```

#### **5.2 Enhanced Performance Optimization & Memory Management**
```typescript
// src/hooks/useOptimizedQuote.ts
import { useMemo, useEffect, useCallback } from 'react';
import { useSelectedTraditions } from '../store/userStore';

export const useOptimizedQuote = () => {
  const selectedTraditions = useSelectedTraditions();
  
  // Memoize quote loading with dependency array optimization
  const memoizedQuote = useMemo(() => {
    return OptimizedContentService.getTodaysContent(selectedTraditions);
  }, [selectedTraditions.join(','), new Date().toDateString()]);

  // Cleanup memory on unmount
  useEffect(() => {
    return () => {
      OptimizedContentService.cleanupMemory();
    };
  }, []);

  return memoizedQuote;
};

// src/components/main/OptimizedQuoteCard.tsx
export const OptimizedQuoteCard = React.memo(() => {
  const quote = useOptimizedQuote();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Performance monitoring
  const renderStartTime = useRef(Date.now());
  
  useEffect(() => {
    const renderTime = Date.now() - renderStartTime.current;
    if (renderTime > 100) { // Log slow renders
      console.warn(`QuoteCard slow render: ${renderTime}ms`);
    }
  });

  const handleQuotePress = useCallback(() => {
    // Background processing for analytics
    BackgroundProcessingService.queueTask(
      async () => {
        await AnalyticsService.trackQuoteInteraction(quote?.contentId);
      },
      { operationName: 'trackQuoteInteraction', priority: 'low' }
    );
  }, [quote?.contentId]);

  if (error) {
    return <ErrorFallback error={error} onRetry={() => setError(null)} />;
  }

  if (isLoading || !quote) {
    return <LoadingSpinner message="Loading today's wisdom..." />;
  }
  
  return (
    <GlassCard 
      style={styles.quoteCard}
      accessibilityRole="button"
      accessibilityLabel={`Today's wisdom: ${quote.today_wisdom}`}
      onPress={handleQuotePress}
    >
      <Text style={styles.quoteText}>"{quote.today_wisdom}"</Text>
      <Text style={styles.author}>— {quote.author || 'Unknown'}</Text>
      <Text style={styles.tradition}>{quote.tradition}</Text>
      <Text style={styles.readingTime}>
        {quote.estimatedReadingTime} min read
      </Text>
    </GlassCard>
  );
});

// Performance monitoring hook
export const usePerformanceMonitoring = () => {
  const [metrics, setMetrics] = useState({
    renderTime: 0,
    memoryUsage: 0,
    errorCount: 0,
  });

  const trackRender = useCallback((componentName: string, renderTime: number) => {
    if (renderTime > 100) {
      console.warn(`${componentName} slow render: ${renderTime}ms`);
      setMetrics(prev => ({ ...prev, renderTime }));
    }
  }, []);

  const trackMemoryUsage = useCallback(() => {
    // Track memory usage (React Native specific)
    if (__DEV__) {
      const memoryInfo = (performance as any).memory;
      if (memoryInfo) {
        setMetrics(prev => ({ 
          ...prev, 
          memoryUsage: memoryInfo.usedJSHeapSize 
        }));
      }
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(trackMemoryUsage, 10000); // Every 10 seconds
    return () => clearInterval(interval);
  }, [trackMemoryUsage]);

  return { metrics, trackRender, trackMemoryUsage };
};
```

#### **5.3 Enhanced Security Service**
```typescript
// src/services/security/EnhancedSecurityService.ts
import * as Crypto from 'expo-crypto';
import * as SecureStore from 'expo-secure-store';
import * as Device from 'expo-device';

export class EnhancedSecurityService {
  private static deviceFingerprint: string | null = null;
  private static encryptionKey: string | null = null;

  static async initialize(): Promise<void> {
    await this.generateDeviceFingerprint();
    await this.initializeEncryptionKey();
  }

  private static async generateDeviceFingerprint(): Promise<void> {
    try {
      const deviceId = await Device.getDeviceTypeAsync();
      const installationId = await Crypto.randomUUID();
      
      const fingerprint = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        `${deviceId}-${installationId}-golden-threads-v2`
      );
      
      this.deviceFingerprint = fingerprint;
      await SecureStore.setItemAsync('device_fingerprint', fingerprint);
    } catch (error) {
      console.error('Failed to generate device fingerprint:', error);
    }
  }

  static async encryptJournalEntry(entry: string): Promise<string> {
    if (!this.encryptionKey) {
      await this.initializeEncryptionKey();
    }

    try {
      // Use background processing for encryption
      return await this.performEncryption(entry);
    } catch (error) {
      console.error('Encryption failed:', error);
      throw new Error('Failed to encrypt journal entry');
    }
  }

  static async decryptJournalEntry(encryptedEntry: string): Promise<string> {
    if (!this.encryptionKey) {
      await this.initializeEncryptionKey();
    }

    try {
      return await this.performDecryption(encryptedEntry);
    } catch (error) {
      console.error('Decryption failed:', error);
      throw new Error('Failed to decrypt journal entry');
    }
  }

  private static async initializeEncryptionKey(): Promise<void> {
    try {
      let key = await SecureStore.getItemAsync('encryption_key');
      
      if (!key) {
        // Generate new key using device-specific entropy
        const salt = await Crypto.getRandomBytesAsync(32);
        const keyMaterial = `${this.deviceFingerprint}-${Date.now()}`;
        
        key = await Crypto.digestStringAsync(
          Crypto.CryptoDigestAlgorithm.SHA256,
          keyMaterial + salt.toString()
        );
        
        await SecureStore.setItemAsync('encryption_key', key);
      }
      
      this.encryptionKey = key;
    } catch (error) {
      console.error('Failed to initialize encryption key:', error);
      throw new Error('Security initialization failed');
    }
  }

  private static async performEncryption(data: string): Promise<string> {
    // Implementation would use proper AES-256 encryption
    // This is a simplified example
    const encoded = Buffer.from(data, 'utf8').toString('base64');
    return encoded;
  }

  private static async performDecryption(encryptedData: string): Promise<string> {
    // Implementation would use proper AES-256 decryption
    // This is a simplified example
    const decoded = Buffer.from(encryptedData, 'base64').toString('utf8');
    return decoded;
  }
}
```

#### **5.3 Accessibility Improvements**
```typescript
// Add accessibility props throughout components
<TouchableOpacity
  accessibilityRole="button"
  accessibilityLabel="Save journal entry"
  accessibilityHint="Saves your intention and reflection"
  onPress={handleSave}
>
  <Text>Remember</Text>
</TouchableOpacity>

// Ensure proper heading hierarchy
<Text 
  accessibilityRole="header"
  accessibilityLevel={1}
  style={styles.screenTitle}
>
  Journal Review
</Text>
```

#### **5.4 Error Handling & Loading States**
```typescript
// src/components/shared/LoadingSpinner.tsx
export const LoadingSpinner = () => (
  <View style={styles.container}>
    <ActivityIndicator size="large" color={COLORS.primary} />
    <Text style={styles.loadingText}>Loading...</Text>
  </View>
);

// src/components/shared/ErrorBoundary.tsx
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Something went wrong.</Text>
          <PrimaryButton onPress={() => this.setState({ hasError: false })}>
            Try Again
          </PrimaryButton>
        </View>
      );
    }

    return this.props.children;
  }
}
```

#### **5.5 Final Build Preparation**
```typescript
// app.config.js
export default {
  expo: {
    name: "Golden Threads",
    slug: "golden-threads",
    version: "2.0.0",
    platforms: ["ios", "android", "web"],
    icon: "./assets/icon.png",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#FDF2F8"
    },
    updates: {
      fallbackToCacheTimeout: 0
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.goldenthreads.app"
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#FDF2F8"
      },
      package: "com.goldenthreads.app"
    },
    web: {
      favicon: "./assets/favicon.png"
    }
  }
};
```

---

## 🚀 Deployment & Launch

### **Pre-Launch Checklist**
- ⏳ All screens implemented and tested
- ✅ Data persistence working correctly
- ⏳ Notifications functioning properly
- ✅ Glass morphism design consistent throughout
- ✅ Responsive design tested on multiple devices
- ✅ Performance optimized
- ✅ Accessibility compliance verified
- ✅ Error handling comprehensive
- ⏳ App store assets prepared
- ⏳ Privacy policy and terms created

### **Launch Strategy**
1. **Internal Testing**: TestFlight (iOS) / Internal Testing (Android)
2. **Beta Release**: Limited user group for feedback
3. **App Store Submission**: Following platform guidelines
4. **Marketing Assets**: Screenshots showcasing glass morphism design
5. **User Documentation**: Simple onboarding guide

---

## 📊 Success Metrics

### **Enhanced Technical Metrics**
- App load time < 1.5 seconds (improved with content chunking)
- Smooth 60fps animations with optimized rendering
- Crash rate < 0.05% (enhanced error handling)
- Memory usage < 100MB with active cleanup
- Background task completion rate > 95%
- Content loading time < 500ms (chunked loading)
- Error recovery success rate > 90%

### **User Experience Metrics**
- Onboarding completion rate > 85% (optimized flow)
- Daily active usage > 65%
- Journal entry completion rate > 75%
- User retention after 1 week > 60%
- App responsiveness rating > 4.5/5
- Security incident rate: 0% (enhanced encryption)

### **Performance Monitoring & Alerting**
```typescript
// src/services/monitoring/PerformanceMonitoringService.ts
export class PerformanceMonitoringService {
  static startupMetrics = {
    appLaunchTime: 0,
    contentLoadTime: 0,
    firstRenderTime: 0,
  };

  static performanceThresholds = {
    slowRender: 100, // ms
    memoryWarning: 80, // MB
    networkTimeout: 5000, // ms
  };

  static trackAppLaunch(): void {
    const startTime = Date.now();
    
    // Track when app becomes interactive
    setTimeout(() => {
      this.startupMetrics.appLaunchTime = Date.now() - startTime;
      this.reportMetrics();
    }, 0);
  }

  static trackSlowOperation(operationName: string, duration: number): void {
    if (duration > this.performanceThresholds.slowRender) {
      console.warn(`🐌 Slow operation detected: ${operationName} took ${duration}ms`);
      
      // Queue for background reporting
      BackgroundProcessingService.queueTask(
        async () => {
          await this.reportSlowOperation(operationName, duration);
        },
        { operationName: 'reportPerformance', priority: 'low' }
      );
    }
  }

  private static async reportSlowOperation(operationName: string, duration: number): Promise<void> {
    // Implementation for performance analytics
    console.log(`Performance alert: ${operationName} - ${duration}ms`);
  }
}
```

This enhanced implementation plan provides a comprehensive roadmap for building Golden Threads with enterprise-grade performance, security, and reliability while maintaining the spiritual focus and beautiful glass morphism design. The architecture now includes robust error handling, background processing, memory management, and performance monitoring to ensure a smooth user experience. 