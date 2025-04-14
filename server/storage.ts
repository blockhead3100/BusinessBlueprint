import { 
  users, type User, type InsertUser,
  clients, type Client, type InsertClient,
  projects, type Project, type InsertProject,
  businessPlans, type BusinessPlan, type InsertBusinessPlan,
  expenses, type Expense, type InsertExpense,
  tasks, type Task, type InsertTask,
  activities, type Activity, type InsertActivity
} from "@shared/schema";

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

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private clients: Map<number, Client>;
  private projects: Map<number, Project>;
  private businessPlans: Map<number, BusinessPlan>;
  private expenses: Map<number, Expense>;
  private tasks: Map<number, Task>;
  private activities: Map<number, Activity>;

  private currentUserId: number;
  private currentClientId: number;
  private currentProjectId: number;
  private currentBusinessPlanId: number;
  private currentExpenseId: number;
  private currentTaskId: number;
  private currentActivityId: number;

  constructor() {
    this.users = new Map();
    this.clients = new Map();
    this.projects = new Map();
    this.businessPlans = new Map();
    this.expenses = new Map();
    this.tasks = new Map();
    this.activities = new Map();

    this.currentUserId = 1;
    this.currentClientId = 1;
    this.currentProjectId = 1;
    this.currentBusinessPlanId = 1;
    this.currentExpenseId = 1;
    this.currentTaskId = 1;
    this.currentActivityId = 1;
    
    // Initialize with demo data
    this.initializeDemoData();
  }

  private initializeDemoData() {
    // Create demo user
    const demoUser: InsertUser = {
      username: "demo",
      password: "demo123",
      fullName: "Sarah Johnson",
      email: "sarah@example.com",
      planType: "Premium",
    };
    this.createUser(demoUser);
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Client methods
  async getClients(userId: number): Promise<Client[]> {
    return Array.from(this.clients.values()).filter(
      (client) => client.userId === userId,
    );
  }

  async getClient(id: number): Promise<Client | undefined> {
    return this.clients.get(id);
  }

  async createClient(insertClient: InsertClient): Promise<Client> {
    const id = this.currentClientId++;
    const client: Client = { ...insertClient, id };
    this.clients.set(id, client);
    
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
    const client = this.clients.get(id);
    if (!client) {
      return undefined;
    }
    
    const updatedClient = { ...client, ...clientUpdate };
    this.clients.set(id, updatedClient);
    
    return updatedClient;
  }

  async deleteClient(id: number): Promise<boolean> {
    return this.clients.delete(id);
  }

  // Project methods
  async getProjects(userId: number, clientId?: number): Promise<Project[]> {
    return Array.from(this.projects.values()).filter(
      (project) => 
        project.userId === userId && 
        (clientId === undefined || project.clientId === clientId)
    );
  }

  async getProject(id: number): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = this.currentProjectId++;
    const project: Project = { ...insertProject, id };
    this.projects.set(id, project);
    
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
    const project = this.projects.get(id);
    if (!project) {
      return undefined;
    }
    
    const updatedProject = { ...project, ...projectUpdate };
    this.projects.set(id, updatedProject);
    
    return updatedProject;
  }

  async deleteProject(id: number): Promise<boolean> {
    return this.projects.delete(id);
  }

  // Business Plan methods
  async getBusinessPlans(userId: number): Promise<BusinessPlan[]> {
    return Array.from(this.businessPlans.values()).filter(
      (plan) => plan.userId === userId,
    );
  }

  async getBusinessPlan(id: number): Promise<BusinessPlan | undefined> {
    return this.businessPlans.get(id);
  }

  async createBusinessPlan(insertPlan: InsertBusinessPlan): Promise<BusinessPlan> {
    const id = this.currentBusinessPlanId++;
    const plan: BusinessPlan = { ...insertPlan, id };
    this.businessPlans.set(id, plan);
    
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
    const plan = this.businessPlans.get(id);
    if (!plan) {
      return undefined;
    }
    
    const updatedPlan = { ...plan, ...planUpdate, lastUpdated: new Date() };
    this.businessPlans.set(id, updatedPlan);
    
    // Create activity
    await this.createActivity({
      type: "business_plan_updated",
      description: `Updated business plan: ${plan.name}`,
      timestamp: new Date(),
      entityId: plan.id,
      entityType: "business_plan",
      userId: plan.userId,
    });
    
    return updatedPlan;
  }

  async deleteBusinessPlan(id: number): Promise<boolean> {
    return this.businessPlans.delete(id);
  }

  // Expense methods
  async getExpenses(userId: number, clientId?: number, projectId?: number): Promise<Expense[]> {
    return Array.from(this.expenses.values()).filter(
      (expense) => 
        expense.userId === userId && 
        (clientId === undefined || expense.clientId === clientId) &&
        (projectId === undefined || expense.projectId === projectId)
    );
  }

  async getExpense(id: number): Promise<Expense | undefined> {
    return this.expenses.get(id);
  }

  async createExpense(insertExpense: InsertExpense): Promise<Expense> {
    const id = this.currentExpenseId++;
    const expense: Expense = { ...insertExpense, id };
    this.expenses.set(id, expense);
    
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
    const expense = this.expenses.get(id);
    if (!expense) {
      return undefined;
    }
    
    const updatedExpense = { ...expense, ...expenseUpdate };
    this.expenses.set(id, updatedExpense);
    
    return updatedExpense;
  }

  async deleteExpense(id: number): Promise<boolean> {
    return this.expenses.delete(id);
  }

  // Task methods
  async getTasks(userId: number, completed?: boolean): Promise<Task[]> {
    return Array.from(this.tasks.values()).filter(
      (task) => 
        task.userId === userId && 
        (completed === undefined || task.completed === completed)
    );
  }

  async getTask(id: number): Promise<Task | undefined> {
    return this.tasks.get(id);
  }

  async createTask(insertTask: InsertTask): Promise<Task> {
    const id = this.currentTaskId++;
    const task: Task = { ...insertTask, id };
    this.tasks.set(id, task);
    return task;
  }

  async updateTask(id: number, taskUpdate: Partial<InsertTask>): Promise<Task | undefined> {
    const task = this.tasks.get(id);
    if (!task) {
      return undefined;
    }
    
    const updatedTask = { ...task, ...taskUpdate };
    this.tasks.set(id, updatedTask);
    
    if (taskUpdate.completed && taskUpdate.completed !== task.completed) {
      // Create activity for task completion
      await this.createActivity({
        type: "task_completed",
        description: `Task completed: ${task.title}`,
        timestamp: new Date(),
        entityId: task.id,
        entityType: "task",
        userId: task.userId,
      });
    }
    
    return updatedTask;
  }

  async deleteTask(id: number): Promise<boolean> {
    return this.tasks.delete(id);
  }

  // Activity methods
  async getActivities(userId: number, limit?: number): Promise<Activity[]> {
    const activities = Array.from(this.activities.values())
      .filter(activity => activity.userId === userId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    
    return limit ? activities.slice(0, limit) : activities;
  }

  async createActivity(insertActivity: InsertActivity): Promise<Activity> {
    const id = this.currentActivityId++;
    const activity: Activity = { ...insertActivity, id };
    this.activities.set(id, activity);
    return activity;
  }
}

export const storage = new MemStorage();
