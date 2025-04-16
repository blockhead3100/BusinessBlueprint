import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertClientSchema, 
  insertBusinessPlanSchema, 
  insertExpenseSchema, 
  insertTaskSchema,
  insertProjectSchema,
  resources
} from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import { Router } from "express";
import { db } from "./db";

const router = Router();

export async function registerRoutes(app: Express): Promise<Server> {
  // All routes will be prefixed with /api
  
  // Helper function to handle validation errors
  const validateRequest = (schema: any, data: any) => {
    try {
      return { data: schema.parse(data), error: null };
    } catch (error) {
      if (error instanceof ZodError) {
        return { data: null, error: fromZodError(error).message };
      }
      return { data: null, error: "Validation error" };
    }
  };

  // User routes
  app.get("/api/user", async (req: Request, res: Response) => {
    // For demo purposes, we'll use a default user ID of 1
    const userId = 1;
    const user = await storage.getUser(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Don't send the password back
    const { password, ...userWithoutPassword } = user;
    return res.json(userWithoutPassword);
  });

  // Client routes
  app.get("/api/clients", async (req: Request, res: Response) => {
    const userId = 1; // For demo purposes
    const clients = await storage.getClients(userId);
    return res.json(clients);
  });

  app.get("/api/clients/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid client ID" });
    }
    
    const client = await storage.getClient(id);
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }
    
    return res.json(client);
  });

  app.post("/api/clients", async (req: Request, res: Response) => {
    const userId = 1; // For demo purposes
    const { data, error } = validateRequest(insertClientSchema, { ...req.body, userId });
    
    if (error) {
      return res.status(400).json({ message: error });
    }
    
    const client = await storage.createClient(data);
    return res.status(201).json(client);
  });

  app.put("/api/clients/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid client ID" });
    }
    
    const { data, error } = validateRequest(insertClientSchema.partial(), req.body);
    
    if (error) {
      return res.status(400).json({ message: error });
    }
    
    const updatedClient = await storage.updateClient(id, data);
    if (!updatedClient) {
      return res.status(404).json({ message: "Client not found" });
    }
    
    return res.json(updatedClient);
  });

  app.delete("/api/clients/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid client ID" });
    }
    
    const deleted = await storage.deleteClient(id);
    if (!deleted) {
      return res.status(404).json({ message: "Client not found" });
    }
    
    return res.json({ success: true });
  });

  // Project routes
  app.get("/api/projects", async (req: Request, res: Response) => {
    const userId = 1; // For demo purposes
    const clientId = req.query.clientId ? parseInt(req.query.clientId as string) : undefined;
    
    const projects = await storage.getProjects(userId, clientId);
    return res.json(projects);
  });

  app.post("/api/projects", async (req: Request, res: Response) => {
    const userId = 1; // For demo purposes
    const { data, error } = validateRequest(insertProjectSchema, { ...req.body, userId });
    
    if (error) {
      return res.status(400).json({ message: error });
    }
    
    const project = await storage.createProject(data);
    return res.status(201).json(project);
  });

  // Business Plan routes
  app.get("/api/business-plans", async (req: Request, res: Response) => {
    const userId = 1; // For demo purposes
    const plans = await storage.getBusinessPlans(userId);
    return res.json(plans);
  });

  app.get("/api/business-plans/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid business plan ID" });
    }
    
    const plan = await storage.getBusinessPlan(id);
    if (!plan) {
      return res.status(404).json({ message: "Business plan not found" });
    }
    
    return res.json(plan);
  });

  app.post("/api/business-plans", async (req: Request, res: Response) => {
    const userId = 1; // For demo purposes
    const { data, error } = validateRequest(insertBusinessPlanSchema, { 
      ...req.body, 
      userId,
      lastUpdated: new Date()
    });
    
    if (error) {
      return res.status(400).json({ message: error });
    }
    
    const plan = await storage.createBusinessPlan(data);
    return res.status(201).json(plan);
  });

  app.put("/api/business-plans/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid business plan ID" });
    }
    
    const { data, error } = validateRequest(insertBusinessPlanSchema.partial(), req.body);
    
    if (error) {
      return res.status(400).json({ message: error });
    }
    
    const updatedPlan = await storage.updateBusinessPlan(id, data);
    if (!updatedPlan) {
      return res.status(404).json({ message: "Business plan not found" });
    }
    
    return res.json(updatedPlan);
  });

  // Expense routes
  app.get("/api/expenses", async (req: Request, res: Response) => {
    const userId = 1; // For demo purposes
    const clientId = req.query.clientId ? parseInt(req.query.clientId as string) : undefined;
    const projectId = req.query.projectId ? parseInt(req.query.projectId as string) : undefined;
    
    const expenses = await storage.getExpenses(userId, clientId, projectId);
    return res.json(expenses);
  });

  app.post("/api/expenses", async (req: Request, res: Response) => {
    const userId = 1; // For demo purposes
    const { data, error } = validateRequest(insertExpenseSchema, { ...req.body, userId });
    
    if (error) {
      return res.status(400).json({ message: error });
    }
    
    // Convert date string to Date object if needed
    if (typeof data.date === 'string') {
      data.date = new Date(data.date);
    }
    
    const expense = await storage.createExpense(data);
    return res.status(201).json(expense);
  });

  // Task routes
  app.get("/api/tasks", async (req: Request, res: Response) => {
    const userId = 1; // For demo purposes
    const completed = req.query.completed === 'true' ? true : 
                     req.query.completed === 'false' ? false : 
                     undefined;
    
    const tasks = await storage.getTasks(userId, completed);
    return res.json(tasks);
  });

  app.post("/api/tasks", async (req: Request, res: Response) => {
    const userId = 1; // For demo purposes
    const { data, error } = validateRequest(insertTaskSchema, { ...req.body, userId });
    
    if (error) {
      return res.status(400).json({ message: error });
    }
    
    // Convert date string to Date object if needed
    if (typeof data.dueDate === 'string') {
      data.dueDate = new Date(data.dueDate);
    }
    
    const task = await storage.createTask(data);
    return res.status(201).json(task);
  });

  app.put("/api/tasks/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid task ID" });
    }
    
    const { data, error } = validateRequest(insertTaskSchema.partial(), req.body);
    
    if (error) {
      return res.status(400).json({ message: error });
    }
    
    // Convert date string to Date object if needed
    if (typeof data.dueDate === 'string') {
      data.dueDate = new Date(data.dueDate);
    }
    
    const updatedTask = await storage.updateTask(id, data);
    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }
    
    return res.json(updatedTask);
  });

  // Activity routes
  app.get("/api/activities", async (req: Request, res: Response) => {
    const userId = 1; // For demo purposes
    const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
    
    const activities = await storage.getActivities(userId, limit);
    return res.json(activities);
  });

  // Helper function to validate and parse request data
  function validateAndParseResourceData(req: Request) {
    const { name, description } = req.body;

    if (!name || !description) {
      throw new Error("Name and description are required.");
    }

    return { name, description };
  }

  // Refactored POST endpoint
  router.post("/api/resource", async (req, res) => {
    try {
      const data = validateAndParseResourceData(req);
      const result = await db.insert(resources).values(data);

      res.status(201).json({ message: "Resource created successfully.", data: result });
    } catch (error) {
      console.error(error);
      const err = error as Error; // Explicitly cast error to Error
      res.status(400).json({ message: err.message || "Internal server error." });
    }
  });

  // Create the server
  const httpServer = createServer(app);
  return httpServer;
}

// Ensure export default is at the top level
export default router;
