import { pgTable, timestamp, pgEnum, uuid, text } from "drizzle-orm/pg-core";
export const userRoleEnum = pgEnum("user_role", ["student", "recruiter"]);

// User Table (User.ts equivalent)
export const userTable = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  phoneNumber: text("phone_number").notNull(),
  password: text("password").notNull(),
  fullName: text("full_name").notNull(),
  role: userRoleEnum("role").notNull().default("student"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});