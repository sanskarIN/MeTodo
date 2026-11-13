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

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [avatar, setAvatar] = useState<AvatarCustomization | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const taskStoreRef = useRef<SerializedStorageState<Task[]> | null>(null);
  if (!taskStoreRef.current) {
    taskStoreRef.current = new SerializedStorageState<Task[]>(AsyncStorage, "metodo_tasks", [], reviveTaskDates);
  }

  // Load data from AsyncStorage on mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [tasksData, categoriesData, settingsData, avatarData] = await Promise.all([
        taskStoreRef.current!.load(),
        AsyncStorage.getItem("metodo_categories"),
        AsyncStorage.getItem("metodo_settings"),
        AsyncStorage.getItem("metodo_avatar"),
      ]);

      setTasks(tasksData);
      if (categoriesData) setCategories(JSON.parse(categoriesData));
      if (settingsData) {
        const storedSettings = JSON.parse(settingsData);
        setSettings({
          ...DEFAULT_SETTINGS,
          ...storedSettings,
          ...normalizeChartAnimationSettings(storedSettings),
          ...normalizeCalendarSelectionSettings(storedSettings),
        });
      }
      if (avatarData) setAvatar(JSON.parse(avatarData));
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Queue writes against the most recent persisted state. Callers receive
  // storage failures instead of silently navigating away after data loss.
  const addTask = async (task: Task) => {
    const next = await taskStoreRef.current!.mutate((current) => [...current, task]);
    setTasks(next);
  };

  const updateTask = async (task: Task) => {
    const next = await taskStoreRef.current!.mutate((current) =>
      current.map((existing) => (existing.id === task.id ? task : existing)),
    );
    setTasks(next);
  };

  const updateTasks = async (nextTasks: Task[] | ((current: Task[]) => Task[])) => {
    const next = await taskStoreRef.current!.mutate((current) =>
      typeof nextTasks === "function" ? nextTasks(current) : nextTasks,
    );
    setTasks(next);
  };

  const deleteTask = async (id: string) => {
    const next = await taskStoreRef.current!.mutate((current) =>
      current.filter((task) => task.id !== id),
    );
    setTasks(next);
  };

  const addCategory = async (category: Category) => {
    try {
      const updatedCategories = [...categories, category];
      setCategories(updatedCategories);
      await AsyncStorage.setItem("metodo_categories", JSON.stringify(updatedCategories));
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  const updateSettings = async (newSettings: Partial<AppSettings>) => {
    try {
      const updatedSettings = { ...settings, ...newSettings };
      setSettings(updatedSettings);
      await AsyncStorage.setItem("metodo_settings", JSON.stringify(updatedSettings));
    } catch (error) {
      console.error("Error updating settings:", error);
    }
  };

  const saveAvatar = async (newAvatar: AvatarCustomization) => {
    try {
      setAvatar(newAvatar);
      await AsyncStorage.setItem("metodo_avatar", JSON.stringify(newAvatar));
    } catch (error) {
      console.error("Error saving avatar:", error);
    }
  };

  const addCustomTheme = async (theme: Theme) => {
    try {
      const updatedSettings = {
        ...settings,
        customThemes: [...settings.customThemes, theme],
      };
      setSettings(updatedSettings);
      await AsyncStorage.setItem("metodo_settings", JSON.stringify(updatedSettings));
    } catch (error) {
      console.error("Error adding custom theme:", error);
    }
  };

  const updateCustomTheme = async (theme: Theme) => {
    try {
      const updatedSettings = {
        ...settings,
        customThemes: settings.customThemes.map((t) => (t.id === theme.id ? theme : t)),
      };
      setSettings(updatedSettings);
      await AsyncStorage.setItem("metodo_settings", JSON.stringify(updatedSettings));
    } catch (error) {
      console.error("Error updating custom theme:", error);
    }
  };

  const deleteCustomTheme = async (id: string) => {
    try {
      const updatedSettings = {
        ...settings,
        customThemes: settings.customThemes.filter((t) => t.id !== id),
      };
      setSettings(updatedSettings);
      await AsyncStorage.setItem("metodo_settings", JSON.stringify(updatedSettings));
    } catch (error) {
      console.error("Error deleting custom theme:", error);
    }
  };

  const clearAllData = async () => {
    try {
      await taskStoreRef.current!.replace([]);
      await AsyncStorage.multiRemove([
        "metodo_categories",
        "metodo_settings",
        "metodo_avatar",
      ]);
      setTasks([]);
      setCategories(DEFAULT_CATEGORIES);
      setSettings(DEFAULT_SETTINGS);
      setAvatar(null);
    } catch (error) {
      console.error("Error clearing data:", error);
    }
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
