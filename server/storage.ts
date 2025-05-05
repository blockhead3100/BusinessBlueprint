import { prisma } from "./db";

export class DatabaseStorage {
  // User methods
  async getUser(id: number) {
    return await prisma.user.findUnique({ where: { id } });
  }

  async getUserByUsername(username: string) {
    return await prisma.user.findUnique({ where: { username } });
  }

  async createUser(user: { username: string; password: string; fullName: string; email: string; planType: string }) {
    return await prisma.user.create({ data: user });
  }

  // Client methods
  async getClients(userId: number) {
    return await prisma.client.findMany({ where: { userId } });
  }

  async getClient(id: number) {
    return await prisma.client.findUnique({ where: { id } });
  }

  async createClient(client: any) {
    return await prisma.client.create({ data: client });
  }

  async updateClient(id: number, client: any) {
    return await prisma.client.update({ where: { id }, data: client });
  }

  async deleteClient(id: number) {
    await prisma.client.delete({ where: { id } });
    return true;
  }

  // Project methods
  async getProjects(userId: number, clientId?: number) {
    return await prisma.project.findMany({
      where: {
        userId,
        ...(clientId && { clientId }),
      },
    });
  }

  async getProject(id: number) {
    return await prisma.project.findUnique({ where: { id } });
  }

  async createProject(project: any) {
    return await prisma.project.create({ data: project });
  }

  async updateProject(id: number, project: any) {
    return await prisma.project.update({ where: { id }, data: project });
  }

  async deleteProject(id: number) {
    await prisma.project.delete({ where: { id } });
    return true;
  }

  // Business Plan methods
  async getBusinessPlans(userId: number) {
    return await prisma.businessPlan.findMany({ where: { userId } });
  }

  async getBusinessPlan(id: number) {
    return await prisma.businessPlan.findUnique({ where: { id } });
  }

  async createBusinessPlan(plan: any) {
    return await prisma.businessPlan.create({ data: plan });
  }

  async updateBusinessPlan(id: number, plan: any) {
    return await prisma.businessPlan.update({ where: { id }, data: plan });
  }

  async deleteBusinessPlan(id: number) {
    await prisma.businessPlan.delete({ where: { id } });
    return true;
  }

  // Expense methods
  async getExpenses(userId: number, clientId?: number, projectId?: number) {
    return await prisma.expense.findMany({
      where: {
        userId,
        ...(clientId && { clientId }),
        ...(projectId && { projectId }),
      },
    });
  }

  async getExpense(id: number) {
    return await prisma.expense.findUnique({ where: { id } });
  }

  async createExpense(expense: any) {
    return await prisma.expense.create({ data: expense });
  }

  async updateExpense(id: number, expense: any) {
    return await prisma.expense.update({ where: { id }, data: expense });
  }

  async deleteExpense(id: number) {
    await prisma.expense.delete({ where: { id } });
    return true;
  }

  // Task methods
  async getTasks(userId: number, completed?: boolean) {
    return await prisma.task.findMany({
      where: {
        userId,
        ...(completed !== undefined && { completed }),
      },
    });
  }

  async getTask(id: number) {
    return await prisma.task.findUnique({ where: { id } });
  }

  async createTask(task: any) {
    return await prisma.task.create({ data: task });
  }

  async updateTask(id: number, task: any) {
    return await prisma.task.update({ where: { id }, data: task });
  }

  async deleteTask(id: number) {
    await prisma.task.delete({ where: { id } });
    return true;
  }

  // Activity methods
  async getActivities(userId: number, limit?: number) {
    return await prisma.activity.findMany({
      where: { userId },
      orderBy: { timestamp: "desc" },
      ...(limit && { take: limit }),
    });
  }

  async createActivity(activity: any) {
    return await prisma.activity.create({ data: activity });
  }
}

// Mock control plane for development
const isDevelopment = process.env.NODE_ENV === "development";
const mockControlPlane = {
  execute: async (query: string) => {
    console.log("Mock control plane executed query:", query);
    return { success: true };
  },
};

// Refactor control plane logic into a separate function
const executeControlPlaneQuery = async (query: string) => {
  if (isDevelopment) {
    console.log("Mock control plane is being used in development mode.");
    return mockControlPlane.execute(query);
  }

  const controlPlaneEndpoint = process.env.CONTROL_PLANE_ENDPOINT;
  if (!controlPlaneEndpoint) {
    throw new Error("Control plane endpoint is not configured.");
  }

  console.log("Using real control plane endpoint.");
  // Replace this with the real control plane implementation
  return { success: false, message: "Real control plane not implemented in this environment." };
};

async function initializeDemoData() {
  try {
    console.log("Starting demo data initialization...");

    console.log("Checking for existing demo user...");
    const existingUser = await db.select().from(users).where(eq(users.username, "demo"));

    let userId: number;

    if (existingUser.length === 0) {
      console.log("Demo user not found. Creating demo user...");
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

    console.log("Checking for existing clients...");
    const existingClients = await db.select().from(clients).where(eq(clients.userId, userId));

    if (existingClients.length === 0) {
      console.log("No clients found. Creating demo data...");

      console.log("Executing control plane query...");
      const result = await executeControlPlaneQuery("CREATE DEMO DATA");
      console.log("Control plane query result:", result);

      if (!result.success) {
        throw new Error("Control plane failed to create demo data.");
      }

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
      
      console.log("Demo data created successfully.");
    } else {
      console.log("Demo data already exists, skipping creation.");
    }
    console.log("Demo data initialization completed successfully.");
  } catch (err) {
    if (err instanceof Error) {
      console.error("Error initializing demo data:", err.message);
      console.error("Stack trace:", err.stack);
    } else {
      console.error("Unknown error initializing demo data:", err);
    }
    console.log("Skipping demo data initialization due to the error.");
  }
}

// Ensure the function is called during startup
initializeDemoData().catch(err => {
  console.error("Unexpected error during demo data initialization:", err);
});

export const storage = new DatabaseStorage();
