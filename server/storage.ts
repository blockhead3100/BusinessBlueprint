import { 
  users, type User, type InsertUser,
  clients, type Client, type InsertClient,
  projects, type Project, type InsertProject,
  businessPlans, type BusinessPlan, type InsertBusinessPlan,
  expenses, type Expense, type InsertExpense,
  tasks, type Task, type InsertTask,
  activities, type Activity, type InsertActivity
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, isNull, isNotNull } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Client methods
  getClients(userId: number): Promise<Client[]>;
  getClient(id: number): Promise<Client | undefined>;
  createClient(client: InsertClient): Promise<Client>;
  updateClient(id: number, client: Partial<InsertClient>): Promise<Client | undefined>;
  deleteClient(id: number): Promise<boolean>;
  
  // Project methods
  getProjects(userId: number, clientId?: number): Promise<Project[]>;
  getProject(id: number): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: number, project: Partial<InsertProject>): Promise<Project | undefined>;
  deleteProject(id: number): Promise<boolean>;
  
  // Business Plan methods
  getBusinessPlans(userId: number): Promise<BusinessPlan[]>;
  getBusinessPlan(id: number): Promise<BusinessPlan | undefined>;
  createBusinessPlan(plan: InsertBusinessPlan): Promise<BusinessPlan>;
  updateBusinessPlan(id: number, plan: Partial<InsertBusinessPlan>): Promise<BusinessPlan | undefined>;
  deleteBusinessPlan(id: number): Promise<boolean>;
  
  // Expense methods
  getExpenses(userId: number, clientId?: number, projectId?: number): Promise<Expense[]>;
  getExpense(id: number): Promise<Expense | undefined>;
  createExpense(expense: InsertExpense): Promise<Expense>;
  updateExpense(id: number, expense: Partial<InsertExpense>): Promise<Expense | undefined>;
  deleteExpense(id: number): Promise<boolean>;
  
  // Task methods
  getTasks(userId: number, completed?: boolean): Promise<Task[]>;
  getTask(id: number): Promise<Task | undefined>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: number, task: Partial<InsertTask>): Promise<Task | undefined>;
  deleteTask(id: number): Promise<boolean>;
  
  // Activity methods
  getActivities(userId: number, limit?: number): Promise<Activity[]>;
  createActivity(activity: InsertActivity): Promise<Activity>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Client methods
  async getClients(userId: number): Promise<Client[]> {
    return await db.select().from(clients).where(eq(clients.userId, userId));
  }

  async getClient(id: number): Promise<Client | undefined> {
    const [client] = await db.select().from(clients).where(eq(clients.id, id));
    return client;
  }

  async createClient(insertClient: InsertClient): Promise<Client> {
    const [client] = await db.insert(clients).values(insertClient).returning();
    
    // Create activity
    await this.createActivity({
      type: "client_created",
      description: `New client added: ${client.name}`,
      timestamp: new Date(),
      entityId: client.id,
      entityType: "client",
      userId: client.userId,
    });
    
    return client;
  }

  async updateClient(id: number, clientUpdate: Partial<InsertClient>): Promise<Client | undefined> {
    const [updatedClient] = await db
      .update(clients)
      .set(clientUpdate)
      .where(eq(clients.id, id))
      .returning();
    
    return updatedClient;
  }

  async deleteClient(id: number): Promise<boolean> {
    const result = await db.delete(clients).where(eq(clients.id, id)).returning();
    return result.length > 0;
  }

  // Project methods
  async getProjects(userId: number, clientId?: number): Promise<Project[]> {
    if (clientId) {
      return await db
        .select()
        .from(projects)
        .where(
          and(
            eq(projects.userId, userId),
            eq(projects.clientId, clientId)
          )
        );
    }
    
    return await db
      .select()
      .from(projects)
      .where(eq(projects.userId, userId));
  }

  async getProject(id: number): Promise<Project | undefined> {
    const [project] = await db.select().from(projects).where(eq(projects.id, id));
    return project;
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const [project] = await db.insert(projects).values(insertProject).returning();
    
    // Create activity
    await this.createActivity({
      type: "project_created",
      description: `New project created: ${project.name}`,
      timestamp: new Date(),
      entityId: project.id,
      entityType: "project",
      userId: project.userId,
    });
    
    return project;
  }

  async updateProject(id: number, projectUpdate: Partial<InsertProject>): Promise<Project | undefined> {
    const [updatedProject] = await db
      .update(projects)
      .set(projectUpdate)
      .where(eq(projects.id, id))
      .returning();
    
    return updatedProject;
  }

  async deleteProject(id: number): Promise<boolean> {
    const result = await db.delete(projects).where(eq(projects.id, id)).returning();
    return result.length > 0;
  }

  // Business Plan methods
  async getBusinessPlans(userId: number): Promise<BusinessPlan[]> {
    return await db.select().from(businessPlans).where(eq(businessPlans.userId, userId));
  }

  async getBusinessPlan(id: number): Promise<BusinessPlan | undefined> {
    const [plan] = await db.select().from(businessPlans).where(eq(businessPlans.id, id));
    return plan;
  }

  async createBusinessPlan(insertPlan: InsertBusinessPlan): Promise<BusinessPlan> {
    const [plan] = await db.insert(businessPlans).values(insertPlan).returning();
    
    // Create activity
    await this.createActivity({
      type: "business_plan_created",
      description: `New business plan created: ${plan.name}`,
      timestamp: new Date(),
      entityId: plan.id,
      entityType: "business_plan",
      userId: plan.userId,
    });
    
    return plan;
  }

  async updateBusinessPlan(id: number, planUpdate: Partial<InsertBusinessPlan>): Promise<BusinessPlan | undefined> {
    // Make sure to update lastUpdated
    const updateData = {
      ...planUpdate,
      lastUpdated: new Date()
    };
    
    const [updatedPlan] = await db
      .update(businessPlans)
      .set(updateData)
      .where(eq(businessPlans.id, id))
      .returning();
    
    if (updatedPlan) {
      // Create activity
      await this.createActivity({
        type: "business_plan_updated",
        description: `Updated business plan: ${updatedPlan.name}`,
        timestamp: new Date(),
        entityId: updatedPlan.id,
        entityType: "business_plan",
        userId: updatedPlan.userId,
      });
    }
    
    return updatedPlan;
  }

  async deleteBusinessPlan(id: number): Promise<boolean> {
    const result = await db.delete(businessPlans).where(eq(businessPlans.id, id)).returning();
    return result.length > 0;
  }

  // Expense methods
  async getExpenses(userId: number, clientId?: number, projectId?: number): Promise<Expense[]> {
    let query = db.select().from(expenses).where(eq(expenses.userId, userId));
    
    if (clientId) {
      query = query.where(eq(expenses.clientId!, clientId));
    }
    
    if (projectId) {
      query = query.where(eq(expenses.projectId!, projectId));
    }
    
    return await query;
  }

  async getExpense(id: number): Promise<Expense | undefined> {
    const [expense] = await db.select().from(expenses).where(eq(expenses.id, id));
    return expense;
  }

  async createExpense(insertExpense: InsertExpense): Promise<Expense> {
    const [expense] = await db.insert(expenses).values(insertExpense).returning();
    
    // Create activity
    await this.createActivity({
      type: "expense_created",
      description: `New ${expense.isIncome ? 'income' : 'expense'} recorded: $${expense.amount.toFixed(2)}`,
      timestamp: new Date(),
      entityId: expense.id,
      entityType: "expense",
      userId: expense.userId,
    });
    
    return expense;
  }

  async updateExpense(id: number, expenseUpdate: Partial<InsertExpense>): Promise<Expense | undefined> {
    const [updatedExpense] = await db
      .update(expenses)
      .set(expenseUpdate)
      .where(eq(expenses.id, id))
      .returning();
    
    return updatedExpense;
  }

  async deleteExpense(id: number): Promise<boolean> {
    const result = await db.delete(expenses).where(eq(expenses.id, id)).returning();
    return result.length > 0;
  }

  // Task methods
  async getTasks(userId: number, completed?: boolean): Promise<Task[]> {
    let query = db.select().from(tasks).where(eq(tasks.userId, userId));
    
    if (completed !== undefined) {
      query = query.where(eq(tasks.completed, completed));
    }
    
    return await query;
  }

  async getTask(id: number): Promise<Task | undefined> {
    const [task] = await db.select().from(tasks).where(eq(tasks.id, id));
    return task;
  }

  async createTask(insertTask: InsertTask): Promise<Task> {
    const [task] = await db.insert(tasks).values(insertTask).returning();
    return task;
  }

  async updateTask(id: number, taskUpdate: Partial<InsertTask>): Promise<Task | undefined> {
    // Get the task first to check if we're marking it as completed
    let wasCompleted = false;
    if (taskUpdate.completed) {
      const [existingTask] = await db.select().from(tasks).where(eq(tasks.id, id));
      if (existingTask) {
        wasCompleted = !existingTask.completed && taskUpdate.completed;
      }
    }
    
    const [updatedTask] = await db
      .update(tasks)
      .set(taskUpdate)
      .where(eq(tasks.id, id))
      .returning();
    
    // If the task was marked as completed, create an activity
    if (wasCompleted && updatedTask) {
      await this.createActivity({
        type: "task_completed",
        description: `Task completed: ${updatedTask.title}`,
        timestamp: new Date(),
        entityId: updatedTask.id,
        entityType: "task",
        userId: updatedTask.userId,
      });
    }
    
    return updatedTask;
  }

  async deleteTask(id: number): Promise<boolean> {
    const result = await db.delete(tasks).where(eq(tasks.id, id)).returning();
    return result.length > 0;
  }

  // Activity methods
  async getActivities(userId: number, limit?: number): Promise<Activity[]> {
    let query = db
      .select()
      .from(activities)
      .where(eq(activities.userId, userId))
      .orderBy(desc(activities.timestamp));
    
    if (limit) {
      query = query.limit(limit);
    }
    
    return await query;
  }

  async createActivity(insertActivity: InsertActivity): Promise<Activity> {
    const [activity] = await db.insert(activities).values(insertActivity).returning();
    return activity;
  }
}

// Create a demo user if it doesn't exist
async function initializeDemoData() {
  const existingUser = await db.select().from(users).where(eq(users.username, "demo"));
  
  if (existingUser.length === 0) {
    const demoUser: InsertUser = {
      username: "demo",
      password: "demo123",
      fullName: "Sarah Johnson",
      email: "sarah@example.com",
      planType: "Premium",
    };
    await db.insert(users).values(demoUser);
  }
}

// Initialize the database with demo data
initializeDemoData().catch(console.error);

export const storage = new DatabaseStorage();
