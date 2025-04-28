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

export const storage = new DatabaseStorage();
