// =============================================================================
// (c) Copyright Sanskar Yadav. All rights reserved.
// Made by Sanskar Yadav.
// =============================================================================

/**
 * FILE: lib/task-context.tsx
 * PURPOSE: Global task state management using React Context API
 *
 * DESCRIPTION:
 * Provides centralized task management with AsyncStorage persistence.
 * Handles task CRUD operations, filtering, and state synchronization.
 *
 * FEATURES:
 * - Create, read, update, delete tasks
 * - Manage categories and settings
 * - Persist data to AsyncStorage
 * - Sync data across app
 * - Error handling and recovery
 */

import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SerializedStorageState } from "@/lib/serialized-storage-state";
import { LocalBackupCoordinator, RESTORE_JOURNAL_KEY, type LocalBackupData } from "@/lib/local-backup";
import { appendUniqueTask, replaceExistingTask, removeExistingTask } from "@/lib/task-list-updates";
import { Task, Category, AppSettings, AvatarCustomization, Theme } from "@/types";
import { normalizeChartAnimationSettings } from "@/lib/chart-animation-settings";
import { DEFAULT_CALENDAR_SELECTION_SETTINGS, normalizeCalendarSelectionSettings } from "@/lib/calendar-selection-settings";

/**
 * TaskContextType Interface
 * Defines all available task management methods and state
 */
interface TaskContextType {
  tasks: Task[];
  categories: Category[];
  settings: AppSettings;
  avatar: AvatarCustomization | null;
  addTask: (task: Task) => Promise<void>;
  updateTask: (task: Task) => Promise<void>;
  updateTasks: (tasks: Task[] | ((current: Task[]) => Task[])) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  addCategory: (category: Category) => Promise<void>;
  updateSettings: (settings: Partial<AppSettings>) => Promise<void>;
  saveAvatar: (avatar: AvatarCustomization) => Promise<void>;
  addCustomTheme: (theme: Theme) => Promise<void>;
  updateCustomTheme: (theme: Theme) => Promise<void>;
  deleteCustomTheme: (id: string) => Promise<void>;
  clearAllData: () => Promise<void>;
  restoreBackup: (content: string) => Promise<void>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

const TASK_DATE_KEYS = new Set([
  "dueDate", "createdAt", "updatedAt", "time", "endDate",
  "linkedAt", "lastSyncedAt",
]);

function reviveTaskDates(key: string, value: unknown): unknown {
  if (!TASK_DATE_KEYS.has(key) || typeof value !== "string") return value;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date;
}

const DEFAULT_CATEGORIES: Category[] = [
  { id: "1", name: "Work", color: "#0a7ea4", icon: "briefcase" },
  { id: "2", name: "Personal", color: "#ec4899", icon: "heart" },
  { id: "3", name: "Shopping", color: "#f59e0b", icon: "bag" },
  { id: "4", name: "Health", color: "#22c55e", icon: "heart.fill" },
];

const DEFAULT_SETTINGS: AppSettings = {
  theme: "default",
  customThemes: [],
  avatar: null,
  categories: DEFAULT_CATEGORIES,
  notifications: true,
  darkMode: "auto",
  language: "en",
  version: "1.0.0",
  chartAnimationSpeed: "normal",
  reduceMotion: false,
  ...DEFAULT_CALENDAR_SELECTION_SETTINGS,
};

function normalizePersistedSettings(value: AppSettings): AppSettings {
  const stored = value && typeof value === "object" ? value : DEFAULT_SETTINGS;
  return {
    ...DEFAULT_SETTINGS,
    ...stored,
    customThemes: Array.isArray(stored.customThemes) ? stored.customThemes : [],
    categories: Array.isArray(stored.categories) ? stored.categories : DEFAULT_CATEGORIES,
    ...normalizeChartAnimationSettings(stored),
    ...normalizeCalendarSelectionSettings(stored),
  };
}

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [avatar, setAvatar] = useState<AvatarCustomization | null>(null);
  const taskStoreRef = useRef<SerializedStorageState<Task[]> | null>(null);
  const categoryStoreRef = useRef<SerializedStorageState<Category[]> | null>(null);
  const settingsStoreRef = useRef<SerializedStorageState<AppSettings> | null>(null);
  const avatarStoreRef = useRef<SerializedStorageState<AvatarCustomization | null> | null>(null);

  if (!taskStoreRef.current) {
    taskStoreRef.current = new SerializedStorageState<Task[]>(AsyncStorage, "metodo_tasks", [], reviveTaskDates);
  }
  if (!categoryStoreRef.current) {
    categoryStoreRef.current = new SerializedStorageState<Category[]>(AsyncStorage, "metodo_categories", DEFAULT_CATEGORIES);
  }
  if (!settingsStoreRef.current) {
    settingsStoreRef.current = new SerializedStorageState<AppSettings>(AsyncStorage, "metodo_settings", DEFAULT_SETTINGS, reviveTaskDates);
  }
  if (!avatarStoreRef.current) {
    avatarStoreRef.current = new SerializedStorageState<AvatarCustomization | null>(AsyncStorage, "metodo_avatar", null, reviveTaskDates);
  }

  const backupCoordinatorRef = useRef<LocalBackupCoordinator | null>(null);
  if (!backupCoordinatorRef.current) {
    backupCoordinatorRef.current = new LocalBackupCoordinator(AsyncStorage, {
      tasks: taskStoreRef.current,
      categories: categoryStoreRef.current,
      settings: settingsStoreRef.current,
      avatar: avatarStoreRef.current,
    });
  }

  // Hydrate stores independently. One corrupt key cannot block other data.
  // Every subsequent mutation is serialized after its key's hydration.
  useEffect(() => {
    let active = true;
    const hydrate = async () => {
      try {
        await backupCoordinatorRef.current!.recoverPending();
      } catch (error) {
        console.error("Incomplete backup recovery; data may require attention:", error);
      }
      await Promise.all([
        taskStoreRef.current!.load().then(value => { if (active) setTasks(value); })
        .catch(error => console.error("Error loading tasks:", error)),
      categoryStoreRef.current!.load().then(value => { if (active) setCategories(value); })
        .catch(error => console.error("Error loading categories:", error)),
      settingsStoreRef.current!.load().then(value => { if (active) setSettings(normalizePersistedSettings(value)); })
        .catch(error => console.error("Error loading settings:", error)),
      avatarStoreRef.current!.load().then(value => { if (active) setAvatar(value); })
        .catch(error => console.error("Error loading avatar:", error)),
      ]);
    };
    void hydrate();
    return () => { active = false; };
  }, []);

  // Queue writes against the most recent persisted state. Callers receive
  // storage failures instead of silently navigating away after data loss.
  const addTask = async (task: Task) => {
    const next = await taskStoreRef.current!.mutate(current => appendUniqueTask(current, task));
    setTasks(next);
  };

  const updateTask = async (task: Task) => {
    const next = await taskStoreRef.current!.mutate(current => replaceExistingTask(current, task));
    setTasks(next);
  };

  const updateTasks = async (nextTasks: Task[] | ((current: Task[]) => Task[])) => {
    const next = await taskStoreRef.current!.mutate(current =>
      typeof nextTasks === "function" ? nextTasks(current) : nextTasks,
    );
    setTasks(next);
  };

  const deleteTask = async (id: string) => {
    const next = await taskStoreRef.current!.mutate(current => removeExistingTask(current, id));
    setTasks(next);
  };

  const addCategory = async (category: Category) => {
    const next = await categoryStoreRef.current!.mutate(current => {
      if (!category.id || !category.name.trim() || current.some(existing => existing.id === category.id)) {
        throw new Error("Category requires a unique id and a non-empty name");
      }
      return [...current, category];
    });
    setCategories(next);
  };

  const updateSettings = async (newSettings: Partial<AppSettings>) => {
    const next = await settingsStoreRef.current!.mutate(current =>
      normalizePersistedSettings({ ...normalizePersistedSettings(current), ...newSettings }),
    );
    setSettings(next);
  };

  const saveAvatar = async (newAvatar: AvatarCustomization) => {
    const next = await avatarStoreRef.current!.replace(newAvatar);
    setAvatar(next);
  };

  const addCustomTheme = async (theme: Theme) => {
    const next = await settingsStoreRef.current!.mutate(current => {
      const state = normalizePersistedSettings(current);
      if (state.customThemes.some(existing => existing.id === theme.id)) {
        throw new Error("A custom theme already has that id");
      }
      return { ...state, customThemes: [...state.customThemes, theme] };
    });
    setSettings(next);
  };

  const updateCustomTheme = async (theme: Theme) => {
    const next = await settingsStoreRef.current!.mutate(current => {
      const state = normalizePersistedSettings(current);
      if (!state.customThemes.some(existing => existing.id === theme.id)) {
        throw new Error("Custom theme does not exist");
      }
      return {
        ...state,
        customThemes: state.customThemes.map(existing => existing.id === theme.id ? theme : existing),
      };
    });
    setSettings(next);
  };

  const deleteCustomTheme = async (id: string) => {
    const next = await settingsStoreRef.current!.mutate(current => {
      const state = normalizePersistedSettings(current);
      return {
        ...state,
        customThemes: state.customThemes.filter(existing => existing.id !== id),
      };
    });
    setSettings(next);
  };

  const clearAllData = async () => {
    // Discard an interrupted restore before clearing local data. Otherwise
    // a saved restore journal could silently recreate erased tasks on launch.
    try {
      await AsyncStorage.removeItem(RESTORE_JOURNAL_KEY);
      await taskStoreRef.current!.reset([]);
      setTasks([]);
      await categoryStoreRef.current!.reset(DEFAULT_CATEGORIES);
      setCategories(DEFAULT_CATEGORIES);
      await settingsStoreRef.current!.reset(DEFAULT_SETTINGS);
      setSettings(DEFAULT_SETTINGS);
      await avatarStoreRef.current!.reset(null);
      setAvatar(null);
    } catch (error) {
      console.error("Error clearing data:", error);
      throw error;
    }
  };

  const restoreBackup = async (content: string) => {
    const data: LocalBackupData = await backupCoordinatorRef.current!.restore(content);
    setTasks(data.tasks);
    setCategories(data.categories);
    setSettings(data.settings);
    setAvatar(data.avatar);
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        categories,
        settings,
        avatar,
        addTask,
        updateTask,
        updateTasks,
        deleteTask,
        addCategory,
        updateSettings,
        saveAvatar,
        addCustomTheme,
        updateCustomTheme,
        deleteCustomTheme,
        clearAllData,
        restoreBackup,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export function useTaskContext() {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTaskContext must be used within TaskProvider");
  }
  return context;
}

export { TaskContext };
