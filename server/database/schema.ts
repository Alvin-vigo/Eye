/* eslint-disable */
/** auto generated, do not edit */
import { sql } from 'drizzle-orm';
import { boolean, foreignKey, index, integer, numeric, pgTable, uniqueIndex, uuid, varchar, customType } from "drizzle-orm/pg-core"

export const customTimestamptz = customType<{
  data: Date;
  driverData: string;
  config: { precision?: number };
}>({
  dataType(config) {
    const precision = typeof config?.precision !== 'undefined'
      ? ` (${config.precision})`
      : '';
    return `timestamptz${precision}`;
  },
  toDriver(value: Date | string | number) {
    if (value == null) return value as any;
    if (typeof value === 'number') return new Date(value).toISOString();
    if (typeof value === 'string') return value;
    if (value instanceof Date) return value.toISOString();
    throw new Error('Invalid timestamp value');
  },
  fromDriver(value: string | Date): Date {
    if (value instanceof Date) return value;
    return new Date(value);
  },
});

export const userProfile = customType<{
  data: string;
  driverData: string;
}>({
  dataType() {
    return 'user_profile';
  },
  toDriver(value: string) {
    return sql`ROW(${value})::user_profile`;
  },
  fromDriver(value: string) {
    const [userId] = value.slice(1, -1).split(',');
    return userId.trim();
  },
});

export type FileAttachment = {
  bucket_id: string;
  file_path: string;
};

export const fileAttachment = customType<{
  data: FileAttachment;
  driverData: string;
}>({
  dataType() {
    return 'file_attachment';
  },
  toDriver(value: FileAttachment) {
    return sql`ROW(${value.bucket_id},${value.file_path})::file_attachment`;
  },
  fromDriver(value: string): FileAttachment {
    const [bucketId, filePath] = value.slice(1, -1).split(',');
    return { bucket_id: bucketId.trim(), file_path: filePath.trim() };
  },
});

export function escapeLiteral(str: string): string {
  return "'" + str.replace(/'/g, "''") + "'";
}

export const userProfileArray = customType<{
  data: string[];
  driverData: string;
}>({
  dataType() {
    return 'user_profile[]';
  },
  toDriver(value: string[]) {
    if (!value || value.length === 0) {
      return sql`'{}'::user_profile[]`;
    }
    const elements = value.map(id => `ROW(${escapeLiteral(id)})::user_profile`).join(',');
    return sql.raw(`ARRAY[${elements}]::user_profile[]`);
  },
  fromDriver(value: string): string[] {
    if (!value || value === '{}') return [];
    const inner = value.slice(1, -1);
    const matches = inner.match(/\([^)]*\)/g) || [];
    return matches.map(m => m.slice(1, -1).split(',')[0].trim());
  },
});

export const fileAttachmentArray = customType<{
  data: FileAttachment[];
  driverData: string;
}>({
  dataType() {
    return 'file_attachment[]';
  },
  toDriver(value: FileAttachment[]) {
    if (!value || value.length === 0) {
      return sql`'{}'::file_attachment[]`;
    }
    const elements = value.map(f =>
      `ROW(${escapeLiteral(f.bucket_id)},${escapeLiteral(f.file_path)})::file_attachment`
    ).join(',');
    return sql.raw(`ARRAY[${elements}]::file_attachment[]`);
  },
  fromDriver(value: string): FileAttachment[] {
    if (!value || value === '{}') return [];
    const inner = value.slice(1, -1);
    const matches = inner.match(/\([^)]*\)/g) || [];
    return matches.map(m => {
      const [bucketId, filePath] = m.slice(1, -1).split(',');
      return { bucket_id: bucketId.trim(), file_path: filePath.trim() };
    });
  },
});

export const vpSettings = pgTable("vp_settings", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().unique(),
  voiceSpeed: varchar("voice_speed", { length: 10 }).notNull().default('1.0x'),
  voiceTone: varchar("voice_tone", { length: 10 }).notNull().default('female'),
  vibrationLevel: integer("vibration_level").notNull().default(2),
  fontSize: varchar("font_size", { length: 10 }).notNull().default('large'),
  highContrast: boolean("high_contrast").notNull().default(false),
  obstacleDetection: boolean("obstacle_detection").notNull().default(true),
  trafficLightAnnounce: boolean("traffic_light_announce").notNull().default(true),
  currencyRecognition: boolean("currency_recognition").notNull().default(true),
  faceCapture: boolean("face_capture").notNull().default(false),
  medicineRecognition: boolean("medicine_recognition").notNull().default(true),
  sosEnabled: boolean("sos_enabled").notNull().default(true),
  // System field: Creation time (auto-filled, do not modify)
  createdAt: customTimestamptz("_created_at", { precision: 3 }).notNull().default(sql`CURRENT_TIMESTAMP`),
  // System field: Update time (auto-filled, do not modify)
  updatedAt: customTimestamptz("_updated_at", { precision: 3 }).notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
  uniqueIndex("vp_settings_user_id_key").on(table.userId),
  foreignKey({
    columns: [table.userId],
    foreignColumns: [vpUsers.id],
    name: "vp_settings_user_id_fkey",
  }).onDelete("cascade"),
]);

export const vpSubscriptions = pgTable("vp_subscriptions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(),
  planCode: varchar("plan_code", { length: 50 }).notNull(),
  planName: varchar("plan_name", { length: 100 }).notNull(),
  price: numeric("price").notNull(),
  status: varchar("status", { length: 20 }).notNull().default('active'),
  startDate: customTimestamptz("start_date", { precision: 3 }).notNull().default(sql`CURRENT_TIMESTAMP`),
  endDate: customTimestamptz("end_date", { precision: 3 }).notNull(),
  // System field: Creation time (auto-filled, do not modify)
  createdAt: customTimestamptz("_created_at", { precision: 3 }).notNull().default(sql`CURRENT_TIMESTAMP`),
  // System field: Update time (auto-filled, do not modify)
  updatedAt: customTimestamptz("_updated_at", { precision: 3 }).notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
  index("idx_vp_subscriptions_user_id").on(table.userId),
  foreignKey({
    columns: [table.userId],
    foreignColumns: [vpUsers.id],
    name: "vp_subscriptions_user_id_fkey",
  }).onDelete("cascade"),
]);

export const vpDevices = pgTable("vp_devices", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(),
  snCode: varchar("sn_code", { length: 50 }).notNull().unique(),
  model: varchar("model", { length: 50 }).notNull().default('视在必行智能终端 V1.0'),
  firmwareVersion: varchar("firmware_version", { length: 20 }).notNull().default('1.0.0'),
  connectionStatus: varchar("connection_status", { length: 20 }).notNull().default('offline'),
  batteryLevel: integer("battery_level").notNull().default(100),
  lastSyncTime: customTimestamptz("last_sync_time", { precision: 3 }),
  todayUsageMinutes: integer("today_usage_minutes").notNull().default(0),
  todayWarnings: integer("today_warnings").notNull().default(0),
  totalNavigationKm: numeric("total_navigation_km").notNull().default('0'),
  // System field: Creation time (auto-filled, do not modify)
  createdAt: customTimestamptz("_created_at", { precision: 3 }).notNull().default(sql`CURRENT_TIMESTAMP`),
  // System field: Update time (auto-filled, do not modify)
  updatedAt: customTimestamptz("_updated_at", { precision: 3 }).notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
  uniqueIndex("vp_devices_sn_code_key").on(table.snCode),
  index("idx_vp_devices_user_id").on(table.userId),
  foreignKey({
    columns: [table.userId],
    foreignColumns: [vpUsers.id],
    name: "vp_devices_user_id_fkey",
  }).onDelete("cascade"),
]);

export const vpUsers = pgTable("vp_users", {
  id: uuid("id").primaryKey().defaultRandom(),
  account: varchar("account", { length: 100 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  nickname: varchar("nickname", { length: 100 }),
  phone: varchar("phone", { length: 20 }),
  email: varchar("email", { length: 100 }),
  sessionToken: varchar("session_token", { length: 255 }),
  sessionExpiresAt: customTimestamptz("session_expires_at", { precision: 3 }),
  // System field: Creation time (auto-filled, do not modify)
  createdAt: customTimestamptz("_created_at", { precision: 3 }).notNull().default(sql`CURRENT_TIMESTAMP`),
  // System field: Update time (auto-filled, do not modify)
  updatedAt: customTimestamptz("_updated_at", { precision: 3 }).notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
  uniqueIndex("vp_users_account_key").on(table.account),
]);

// table aliases
export const vpDevicesTable = vpDevices;
export const vpSettingsTable = vpSettings;
export const vpSubscriptionsTable = vpSubscriptions;
export const vpUsersTable = vpUsers;
