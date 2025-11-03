import { relations, sql } from 'drizzle-orm';
import { boolean, int, mysqlTable, serial, text, timestamp, varchar } from 'drizzle-orm/mysql-core';

export const links = mysqlTable('links', {
  id: int().autoincrement().primaryKey(),
  shortCode: varchar({ length: 255 }).notNull().unique(),
  url: varchar({length:255}).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
  userId: int("user_id").notNull().references(() => users.id),
});

export const sessions = mysqlTable('sessions', {
  id: int().autoincrement().primaryKey(),
  userId: int('user_id').notNull().references(() => users.id, {onDelete:"cascade"}),
  valid: boolean('is_valid').default(true).notNull(),
  userAgent: text('user+agent'),
  ip: varchar({length: 255}),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull()
})

export const emailVerificationTable = mysqlTable("email_verification", {
  id: int().autoincrement().primaryKey(),
  userId: int("user_id").notNull().references(() => users.id, {onDelete:"cascade"}),
  token: varchar({length: 8}).notNull(),
  expiresAt: timestamp("expires_at")
    .default(sql`(NOW() + INTERVAL 1 DAY)`)
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
})

export const users = mysqlTable('users', {
  id: int().autoincrement().primaryKey(),
  username: varchar({length:255}).notNull(),
  email: varchar({length:255}).notNull().unique(),
  isEmailVerified: boolean("is_email_verified").default(false).notNull(),
  password: varchar({length:255}).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull()
})

export const usersRelation = relations(users, ({many, one}) => ({
  link: many(links),
  session: many(sessions)
}))

export const linksRelation = relations(links, ({one}) => ({
  linkUser: one(users, {
    fields: [links.userId],
    references : [users.id]
  })
}))

export const sessionsRelation = relations(sessions, ({one}) => ({
  sessionUser: one(users, {
    fields: [sessions.userId],
    references: [users.id]
  })
}))

