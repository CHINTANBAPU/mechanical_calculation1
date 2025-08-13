import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, loginSchema, insertCalculationSchema, insertProjectSchema } from "@shared/schema";
import bcrypt from "bcrypt";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Auth routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByUsername(userData.username) || 
                          await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }
      
      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      // Create user
      const user = await storage.createUser({
        ...userData,
        password: hashedPassword
      });
      
      // Create session
      const session = await storage.createSession(user.id);
      
      // Set session cookie
      res.cookie("sessionId", session.id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });
      
      res.json({ user: { ...user, password: undefined } });
    } catch (error) {
      res.status(400).json({ message: "Invalid registration data" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = loginSchema.parse(req.body);
      
      // Find user
      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Verify password
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Create session
      const session = await storage.createSession(user.id);
      
      // Set session cookie
      res.cookie("sessionId", session.id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });
      
      res.json({ user: { ...user, password: undefined } });
    } catch (error) {
      res.status(400).json({ message: "Invalid login data" });
    }
  });

  app.post("/api/auth/logout", async (req, res) => {
    const sessionId = req.cookies.sessionId;
    if (sessionId) {
      await storage.deleteSession(sessionId);
    }
    res.clearCookie("sessionId");
    res.json({ message: "Logged out successfully" });
  });

  app.get("/api/auth/me", async (req, res) => {
    const sessionId = req.cookies.sessionId;
    if (!sessionId) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    const session = await storage.getSession(sessionId);
    if (!session) {
      return res.status(401).json({ message: "Invalid session" });
    }
    
    const user = await storage.getUser(session.userId!);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    
    res.json({ user: { ...user, password: undefined } });
  });

  // Middleware to check authentication
  const requireAuth = async (req: any, res: any, next: any) => {
    const sessionId = req.cookies.sessionId;
    if (!sessionId) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    const session = await storage.getSession(sessionId);
    if (!session) {
      return res.status(401).json({ message: "Invalid session" });
    }
    
    const user = await storage.getUser(session.userId!);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    
    req.user = user;
    next();
  };

  // Calculation routes
  app.get("/api/calculations", requireAuth, async (req: any, res) => {
    const calculations = await storage.getCalculationsByUser(req.user.id);
    res.json(calculations);
  });

  app.post("/api/calculations", requireAuth, async (req: any, res) => {
    try {
      const calculationData = insertCalculationSchema.parse({
        ...req.body,
        userId: req.user.id
      });
      
      const calculation = await storage.createCalculation(calculationData);
      res.json(calculation);
    } catch (error) {
      res.status(400).json({ message: "Invalid calculation data" });
    }
  });

  app.get("/api/calculations/:id", requireAuth, async (req: any, res) => {
    const calculation = await storage.getCalculation(req.params.id);
    if (!calculation || calculation.userId !== req.user.id) {
      return res.status(404).json({ message: "Calculation not found" });
    }
    res.json(calculation);
  });

  app.put("/api/calculations/:id", requireAuth, async (req: any, res) => {
    const calculation = await storage.getCalculation(req.params.id);
    if (!calculation || calculation.userId !== req.user.id) {
      return res.status(404).json({ message: "Calculation not found" });
    }
    
    const updated = await storage.updateCalculation(req.params.id, req.body);
    res.json(updated);
  });

  app.delete("/api/calculations/:id", requireAuth, async (req: any, res) => {
    const calculation = await storage.getCalculation(req.params.id);
    if (!calculation || calculation.userId !== req.user.id) {
      return res.status(404).json({ message: "Calculation not found" });
    }
    
    await storage.deleteCalculation(req.params.id);
    res.json({ message: "Calculation deleted" });
  });

  // Project routes
  app.get("/api/projects", requireAuth, async (req: any, res) => {
    const projects = await storage.getProjectsByUser(req.user.id);
    res.json(projects);
  });

  app.post("/api/projects", requireAuth, async (req: any, res) => {
    try {
      const projectData = insertProjectSchema.parse({
        ...req.body,
        userId: req.user.id
      });
      
      const project = await storage.createProject(projectData);
      res.json(project);
    } catch (error) {
      res.status(400).json({ message: "Invalid project data" });
    }
  });

  app.get("/api/projects/:id", requireAuth, async (req: any, res) => {
    const project = await storage.getProject(req.params.id);
    if (!project || project.userId !== req.user.id) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.json(project);
  });

  app.put("/api/projects/:id", requireAuth, async (req: any, res) => {
    const project = await storage.getProject(req.params.id);
    if (!project || project.userId !== req.user.id) {
      return res.status(404).json({ message: "Project not found" });
    }
    
    const updated = await storage.updateProject(req.params.id, req.body);
    res.json(updated);
  });

  app.delete("/api/projects/:id", requireAuth, async (req: any, res) => {
    const project = await storage.getProject(req.params.id);
    if (!project || project.userId !== req.user.id) {
      return res.status(404).json({ message: "Project not found" });
    }
    
    await storage.deleteProject(req.params.id);
    res.json({ message: "Project deleted" });
  });

  // Stats endpoint
  app.get("/api/stats", requireAuth, async (req: any, res) => {
    const calculations = await storage.getCalculationsByUser(req.user.id);
    const projects = await storage.getProjectsByUser(req.user.id);
    
    const thisWeek = new Date();
    thisWeek.setDate(thisWeek.getDate() - 7);
    
    const recentCalculations = calculations.filter(calc => 
      calc.createdAt && new Date(calc.createdAt) > thisWeek
    );
    
    const stats = {
      totalCalculations: calculations.length,
      savedProjects: projects.length,
      thisWeek: recentCalculations.length,
      sharedWith: 0 // Placeholder for future feature
    };
    
    res.json(stats);
  });

  const httpServer = createServer(app);
  return httpServer;
}
