import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean, bigint, decimal } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Release Management Tables
export const releases = mysqlTable("releases", {
  id: int("id").autoincrement().primaryKey(),
  version: varchar("version", { length: 20 }).notNull().unique(),
  releaseDate: timestamp("releaseDate").notNull(),
  status: mysqlEnum("status", ["draft", "beta", "stable", "deprecated"]).default("draft").notNull(),
  releaseNotes: text("releaseNotes"),
  isBreakingChange: boolean("isBreakingChange").default(false).notNull(),
  requiresRestart: boolean("requiresRestart").default(true).notNull(),
  downloadUrl: varchar("downloadUrl", { length: 512 }),
  fileSize: bigint("fileSize", { mode: "number" }),
  checksum: varchar("checksum", { length: 256 }),
  stagedRolloutPercent: int("stagedRolloutPercent").default(100),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Release = typeof releases.$inferSelect;
export type InsertRelease = typeof releases.$inferInsert;

// Release Platforms
export const releasePlatforms = mysqlTable("releasePlatforms", {
  id: int("id").autoincrement().primaryKey(),
  releaseId: int("releaseId").notNull().references(() => releases.id, { onDelete: "cascade" }),
  platform: mysqlEnum("platform", ["android", "ios", "windows", "linux", "macos", "web"]).notNull(),
  downloadUrl: varchar("downloadUrl", { length: 512 }).notNull(),
  fileSize: bigint("fileSize", { mode: "number" }).notNull(),
  checksum: varchar("checksum", { length: 256 }).notNull(),
  minOSVersion: varchar("minOSVersion", { length: 20 }),
  minMemory: int("minMemory"),
  minStorage: int("minStorage"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ReleasePlatform = typeof releasePlatforms.$inferSelect;
export type InsertReleasePlatform = typeof releasePlatforms.$inferInsert;

// Release Changelog
export const releaseChangelog = mysqlTable("releaseChangelog", {
  id: int("id").autoincrement().primaryKey(),
  releaseId: int("releaseId").notNull().references(() => releases.id, { onDelete: "cascade" }),
  type: mysqlEnum("type", ["feature", "bugfix", "improvement", "breaking", "security"]).notNull(),
  description: text("description").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ReleaseChangelogEntry = typeof releaseChangelog.$inferSelect;
export type InsertReleaseChangelogEntry = typeof releaseChangelog.$inferInsert;

// Download Tracking
export const downloads = mysqlTable("downloads", {
  id: int("id").autoincrement().primaryKey(),
  releaseId: int("releaseId").notNull().references(() => releases.id, { onDelete: "cascade" }),
  platform: mysqlEnum("platform", ["android", "ios", "windows", "linux", "macos", "web"]).notNull(),
  downloadTime: int("downloadTime"),
  fileSize: bigint("fileSize", { mode: "number" }),
  deviceId: varchar("deviceId", { length: 256 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Download = typeof downloads.$inferSelect;
export type InsertDownload = typeof downloads.$inferInsert;

// Installation Tracking
export const installations = mysqlTable("installations", {
  id: int("id").autoincrement().primaryKey(),
  releaseId: int("releaseId").notNull().references(() => releases.id, { onDelete: "cascade" }),
  platform: mysqlEnum("platform", ["android", "ios", "windows", "linux", "macos", "web"]).notNull(),
  status: mysqlEnum("status", ["available", "installed", "failed", "skipped", "rolled_back"]).notNull(),
  installTime: int("installTime"),
  deviceId: varchar("deviceId", { length: 256 }),
  osVersion: varchar("osVersion", { length: 20 }),
  errorMessage: text("errorMessage"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Installation = typeof installations.$inferSelect;
export type InsertInstallation = typeof installations.$inferInsert;

// Update Feedback
export const updateFeedback = mysqlTable("updateFeedback", {
  id: int("id").autoincrement().primaryKey(),
  releaseId: int("releaseId").notNull().references(() => releases.id, { onDelete: "cascade" }),
  platform: mysqlEnum("platform", ["android", "ios", "windows", "linux", "macos", "web"]).notNull(),
  status: mysqlEnum("status", ["available", "installed", "failed", "skipped", "rolled_back"]).notNull(),
  feedback: text("feedback"),
  rating: int("rating"),
  deviceId: varchar("deviceId", { length: 256 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type UpdateFeedback = typeof updateFeedback.$inferSelect;
export type InsertUpdateFeedback = typeof updateFeedback.$inferInsert;

// Rollback Requests
export const rollbackRequests = mysqlTable("rollbackRequests", {
  id: int("id").autoincrement().primaryKey(),
  currentReleaseId: int("currentReleaseId").notNull().references(() => releases.id, { onDelete: "cascade" }),
  targetReleaseId: int("targetReleaseId").notNull().references(() => releases.id, { onDelete: "cascade" }),
  platform: mysqlEnum("platform", ["android", "ios", "windows", "linux", "macos", "web"]).notNull(),
  reason: text("reason"),
  status: mysqlEnum("status", ["pending", "approved", "rejected", "completed"]).default("pending").notNull(),
  deviceId: varchar("deviceId", { length: 256 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type RollbackRequest = typeof rollbackRequests.$inferSelect;
export type InsertRollbackRequest = typeof rollbackRequests.$inferInsert;

// Update Statistics (cached for performance)
export const updateStats = mysqlTable("updateStats", {
  id: int("id").autoincrement().primaryKey(),
  releaseId: int("releaseId").notNull().references(() => releases.id, { onDelete: "cascade" }),
  platform: mysqlEnum("platform", ["android", "ios", "windows", "linux", "macos", "web", "all"]).notNull(),
  totalDownloads: int("totalDownloads").default(0).notNull(),
  totalInstallations: int("totalInstallations").default(0).notNull(),
  successfulInstallations: int("successfulInstallations").default(0).notNull(),
  failedInstallations: int("failedInstallations").default(0).notNull(),
  averageDownloadTime: int("averageDownloadTime"),
  averageInstallTime: int("averageInstallTime"),
  averageRating: decimal("averageRating", { precision: 3, scale: 2 }),
  totalFeedback: int("totalFeedback").default(0).notNull(),
  lastUpdated: timestamp("lastUpdated").defaultNow().onUpdateNow().notNull(),
});

export type UpdateStat = typeof updateStats.$inferSelect;
export type InsertUpdateStat = typeof updateStats.$inferInsert;
