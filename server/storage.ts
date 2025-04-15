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
    let conditions = [eq(expenses.userId, userId)];
    
    if (clientId) {
      conditions.push(eq(expenses.clientId!, clientId));
    }
    
    if (projectId) {
      conditions.push(eq(expenses.projectId!, projectId));
    }
    
    return await db.select().from(expenses).where(and(...conditions));
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
    let conditions = [eq(tasks.userId, userId)];
    
    if (completed !== undefined) {
      conditions.push(eq(tasks.completed, completed));
    }
    
    return await db.select().from(tasks).where(and(...conditions));
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
    // For activities, we need to handle the query differently due to the limit
    if (limit) {
      return await db
        .select()
        .from(activities)
        .where(eq(activities.userId, userId))
        .orderBy(desc(activities.timestamp))
        .limit(limit);
    }
    
    return await db
      .select()
      .from(activities)
      .where(eq(activities.userId, userId))
      .orderBy(desc(activities.timestamp));
  }

  async createActivity(insertActivity: InsertActivity): Promise<Activity> {
    const [activity] = await db.insert(activities).values(insertActivity).returning();
    return activity;
  }
}

// Create demo data if it doesn't exist
async function initializeDemoData() {
  // Check if demo user exists
  const existingUser = await db.select().from(users).where(eq(users.username, "demo"));
  
  let userId: number;
  
  // Create demo user if needed
  if (existingUser.length === 0) {
    const demoUser: InsertUser = {
      username: "demo",
      password: "demo123",
      fullName: "Sarah Johnson",
      email: "sarah@example.com",
      planType: "Premium",
    };
    
    const [newUser] = await db.insert(users).values(demoUser).returning();
    userId = newUser.id;
    console.log("Created demo user:", newUser.fullName);
  } else {
    userId = existingUser[0].id;
    console.log("Using existing demo user:", existingUser[0].fullName);
  }
  
  // Check if we already have clients
  const existingClients = await db.select().from(clients).where(eq(clients.userId, userId));
  
  // If no clients, create demo data
  if (existingClients.length === 0) {
    console.log("Creating demo data...");
    
    // Create clients
    const clientsData: InsertClient[] = [
      {
        name: "TechInnovate Solutions",
        industry: "Technology",
        contactName: "John Smith",
        contactEmail: "john@techinnovate.example",
        contactPhone: "555-123-4567",
        notes: "Enterprise client focused on AI solutions",
        status: "active",
        userId
      },
      {
        name: "Green Earth Organics",
        industry: "Food & Agriculture",
        contactName: "Emily Wilson",
        contactEmail: "emily@greenearth.example",
        contactPhone: "555-234-5678",
        notes: "Sustainable food producer",
        status: "active",
        userId
      },
      {
        name: "Urban Fitness Co",
        industry: "Health & Fitness",
        contactName: "Michael Brown",
        contactEmail: "michael@urbanfitness.example",
        contactPhone: "555-345-6789",
        notes: "Expanding to new locations in 2024",
        status: "active",
        userId
      }
    ];
    
    const [client1, client2, client3] = await Promise.all(
      clientsData.map(async (clientData) => {
        const [newClient] = await db.insert(clients).values(clientData).returning();
        return newClient;
      })
    );
    
    // Create business plans
    const businessPlansData: InsertBusinessPlan[] = [
      {
        name: "TechInnovate Expansion Plan",
        template: "tech-startup",
        clientId: client1.id,
        content: JSON.stringify({
          executiveSummary: "Plan to expand AI solutions to new markets",
          marketAnalysis: "Growing demand for AI in healthcare and finance",
          financialProjections: "Expected 25% growth in next fiscal year"
        }),
        status: "active",
        lastUpdated: new Date(),
        userId
      },
      {
        name: "Green Earth Product Launch",
        template: "food-business",
        clientId: client2.id,
        content: JSON.stringify({
          executiveSummary: "Launch of new organic product line",
          marketAnalysis: "Increasing consumer preference for organic foods",
          financialProjections: "Initial investment: $150,000, ROI expected within 18 months"
        }),
        status: "draft",
        lastUpdated: new Date(),
        userId
      }
    ];
    
    await Promise.all(
      businessPlansData.map(async (planData) => {
        await db.insert(businessPlans).values(planData).returning();
      })
    );
    
    // Create expenses (with option for new accounts to have zero revenue)
    const newAccount = false; // Set to true for new accounts
    
    const expensesData: InsertExpense[] = newAccount ? 
    [
      // For new accounts, only show expenses, no income
      {
        description: "Initial setup costs",
        amount: 500,
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        category: "Setup",
        isIncome: false,
        clientId: client1.id,
        userId
      }
    ] : 
    [
      // For demo accounts, show typical expenses and income
      {
        description: "Website development",
        amount: 2500,
        date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
        category: "Development",
        isIncome: false,
        clientId: client1.id,
        userId
      },
      {
        description: "Marketing campaign",
        amount: 1800,
        date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
        category: "Marketing",
        isIncome: false,
        clientId: client2.id,
        userId
      },
      {
        description: "Monthly retainer",
        amount: 3500,
        date: new Date(),
        category: "Consulting",
        isIncome: true,
        clientId: client1.id,
        userId
      }
    ];
    
    await Promise.all(
      expensesData.map(async (expenseData) => {
        await db.insert(expenses).values(expenseData).returning();
      })
    );
    
    // Create tasks
    const tasksData: InsertTask[] = [
      {
        title: "Finalize TechInnovate business plan",
        description: "Complete financial projections section",
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        completed: false,
        clientId: client1.id,
        userId
      },
      {
        title: "Green Earth marketing proposal",
        description: "Create proposal for Q2 marketing campaign",
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        completed: false,
        clientId: client2.id,
        userId
      },
      {
        title: "Urban Fitness initial consultation",
        description: "Prepare materials for kickoff meeting",
        dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // Tomorrow
        completed: false,
        clientId: client3.id,
        userId
      },
      {
        title: "Update portfolio",
        description: "Add recent projects to website portfolio",
        dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        completed: true,
        userId
      }
    ];
    
    await Promise.all(
      tasksData.map(async (taskData) => {
        await db.insert(tasks).values(taskData).returning();
      })
    );
    
    // Create activities (adjust based on new/existing account)
    const activitiesData: InsertActivity[] = newAccount ? 
    [
      // For new accounts, show only a welcome activity and expense
      {
        type: "client_created",
        description: "New client added: TechInnovate Solutions",
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        entityId: client1.id,
        entityType: "client",
        userId
      },
      {
        type: "expense_created",
        description: "Initial setup costs: $500.00",
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        userId
      }
    ] : 
    [
      // For demo accounts, show full history
      {
        type: "client_created",
        description: "New client added: TechInnovate Solutions",
        timestamp: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000), // 45 days ago
        entityId: client1.id,
        entityType: "client",
        userId
      },
      {
        type: "client_created",
        description: "New client added: Green Earth Organics",
        timestamp: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
        entityId: client2.id,
        entityType: "client",
        userId
      },
      {
        type: "client_created",
        description: "New client added: Urban Fitness Co",
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        entityId: client3.id,
        entityType: "client",
        userId
      },
      {
        type: "business_plan_created",
        description: "New business plan created: TechInnovate Expansion Plan",
        timestamp: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000), // 20 days ago
        userId
      },
      {
        type: "expense_created",
        description: "New income recorded: $3500.00",
        timestamp: new Date(),
        userId
      }
    ];
    
    await Promise.all(
      activitiesData.map(async (activityData) => {
        await db.insert(activities).values(activityData).returning();
      })
    );
    
    console.log("Demo data created successfully");
  } else {
    console.log("Demo data already exists, skipping creation");
  }
}

// Initialize the database with demo data
initializeDemoData().catch(err => {
  console.error("Error initializing demo data:", err);
});

export const storage = new DatabaseStorage();
