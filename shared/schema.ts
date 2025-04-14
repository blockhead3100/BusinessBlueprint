import { pgTable, text, serial, integer, timestamp, boolean, doublePrecision } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  planType: text("plan_type").default("basic"),
  avatarUrl: text("avatar_url"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  fullName: true,
  email: true,
  planType: true,
  avatarUrl: true,
});

// Clients table
export const clients = pgTable("clients", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  industry: text("industry"),
  contactName: text("contact_name"),
  contactEmail: text("contact_email"),
  contactPhone: text("contact_phone"),
  notes: text("notes"),
  status: text("status").default("active"),
  userId: integer("user_id").notNull(),
});

export const insertClientSchema = createInsertSchema(clients).pick({
  name: true,
  industry: true,
  contactName: true,
  contactEmail: true,
  contactPhone: true,
  notes: true,
  status: true,
  userId: true,
});

// Projects table
export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  clientId: integer("client_id").notNull(),
  status: text("status").default("active"),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  userId: integer("user_id").notNull(),
});

export const insertProjectSchema = createInsertSchema(projects).pick({
  name: true,
  description: true,
  clientId: true,
  status: true,
  startDate: true,
  endDate: true,
  userId: true,
});

// Business Plans table
export const businessPlans = pgTable("business_plans", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  template: text("template"),
  clientId: integer("client_id"),
  content: text("content"),
  status: text("status").default("draft"),
  lastUpdated: timestamp("last_updated"),
  userId: integer("user_id").notNull(),
});

export const insertBusinessPlanSchema = createInsertSchema(businessPlans).pick({
  name: true,
  template: true,
  clientId: true,
  content: true,
  status: true,
  lastUpdated: true,
  userId: true,
});

// Expenses table
export const expenses = pgTable("expenses", {
  id: serial("id").primaryKey(),
  description: text("description").notNull(),
  amount: doublePrecision("amount").notNull(),
  date: timestamp("date").notNull(),
  category: text("category"),
  isIncome: boolean("is_income").default(false),
  clientId: integer("client_id"),
  projectId: integer("project_id"),
  userId: integer("user_id").notNull(),
});

export const insertExpenseSchema = createInsertSchema(expenses).pick({
  description: true,
  amount: true,
  date: true,
  category: true,
  isIncome: true,
  clientId: true,
  projectId: true,
  userId: true,
});

// Tasks table
export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  dueDate: timestamp("due_date"),
  completed: boolean("completed").default(false),
  projectId: integer("project_id"),
  clientId: integer("client_id"),
  userId: integer("user_id").notNull(),
});

export const insertTaskSchema = createInsertSchema(tasks).pick({
  title: true,
  description: true,
  dueDate: true,
  completed: true,
  projectId: true,
  clientId: true,
  userId: true,
});

// Activities table
export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(),
  description: text("description").notNull(),
  timestamp: timestamp("timestamp").notNull(),
  entityId: integer("entity_id"),
  entityType: text("entity_type"),
  userId: integer("user_id").notNull(),
});

export const insertActivitySchema = createInsertSchema(activities).pick({
  type: true,
  description: true,
  timestamp: true,
  entityId: true,
  entityType: true,
  userId: true,
});

// Export all types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Client = typeof clients.$inferSelect;
export type InsertClient = z.infer<typeof insertClientSchema>;

export type Project = typeof projects.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;

export type BusinessPlan = typeof businessPlans.$inferSelect;
export type InsertBusinessPlan = z.infer<typeof insertBusinessPlanSchema>;

export type Expense = typeof expenses.$inferSelect;
export type InsertExpense = z.infer<typeof insertExpenseSchema>;

export type Task = typeof tasks.$inferSelect;
export type InsertTask = z.infer<typeof insertTaskSchema>;

export type Activity = typeof activities.$inferSelect;
export type InsertActivity = z.infer<typeof insertActivitySchema>;
