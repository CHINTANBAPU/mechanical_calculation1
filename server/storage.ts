import { 
  type User, 
  type InsertUser, 
  type Calculation, 
  type InsertCalculation,
  type Project,
  type InsertProject,
  type Session
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User management
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Calculation management
  getCalculation(id: string): Promise<Calculation | undefined>;
  getCalculationsByUser(userId: string): Promise<Calculation[]>;
  createCalculation(calculation: InsertCalculation): Promise<Calculation>;
  updateCalculation(id: string, calculation: Partial<Calculation>): Promise<Calculation | undefined>;
  deleteCalculation(id: string): Promise<boolean>;
  
  // Project management
  getProject(id: string): Promise<Project | undefined>;
  getProjectsByUser(userId: string): Promise<Project[]>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: string, project: Partial<Project>): Promise<Project | undefined>;
  deleteProject(id: string): Promise<boolean>;
  
  // Session management
  createSession(userId: string): Promise<Session>;
  getSession(sessionId: string): Promise<Session | undefined>;
  deleteSession(sessionId: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private calculations: Map<string, Calculation>;
  private projects: Map<string, Project>;
  private sessions: Map<string, Session>;

  constructor() {
    this.users = new Map();
    this.calculations = new Map();
    this.projects = new Map();
    this.sessions = new Map();
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id,
      createdAt: new Date(),
      firstName: insertUser.firstName ?? null,
      lastName: insertUser.lastName ?? null,
      role: insertUser.role ?? "student"
    };
    this.users.set(id, user);
    return user;
  }

  // Calculation methods
  async getCalculation(id: string): Promise<Calculation | undefined> {
    return this.calculations.get(id);
  }

  async getCalculationsByUser(userId: string): Promise<Calculation[]> {
    return Array.from(this.calculations.values()).filter(calc => calc.userId === userId);
  }

  async createCalculation(insertCalculation: InsertCalculation): Promise<Calculation> {
    const id = randomUUID();
    const calculation: Calculation = {
      ...insertCalculation,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
      description: insertCalculation.description ?? null,
      userId: insertCalculation.userId ?? null,
      material: insertCalculation.material ?? null
    };
    this.calculations.set(id, calculation);
    return calculation;
  }

  async updateCalculation(id: string, update: Partial<Calculation>): Promise<Calculation | undefined> {
    const calculation = this.calculations.get(id);
    if (!calculation) return undefined;
    
    const updated = { ...calculation, ...update, updatedAt: new Date() };
    this.calculations.set(id, updated);
    return updated;
  }

  async deleteCalculation(id: string): Promise<boolean> {
    return this.calculations.delete(id);
  }

  // Project methods
  async getProject(id: string): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async getProjectsByUser(userId: string): Promise<Project[]> {
    return Array.from(this.projects.values()).filter(project => project.userId === userId);
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = randomUUID();
    const project: Project = {
      ...insertProject,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
      description: insertProject.description ?? null,
      status: insertProject.status ?? "in_progress",
      userId: insertProject.userId ?? null,
      calculations: insertProject.calculations ?? []
    };
    this.projects.set(id, project);
    return project;
  }

  async updateProject(id: string, update: Partial<Project>): Promise<Project | undefined> {
    const project = this.projects.get(id);
    if (!project) return undefined;
    
    const updated = { ...project, ...update, updatedAt: new Date() };
    this.projects.set(id, updated);
    return updated;
  }

  async deleteProject(id: string): Promise<boolean> {
    return this.projects.delete(id);
  }

  // Session methods
  async createSession(userId: string): Promise<Session> {
    const id = randomUUID();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now
    
    const session: Session = {
      id,
      userId,
      expiresAt
    };
    this.sessions.set(id, session);
    return session;
  }

  async getSession(sessionId: string): Promise<Session | undefined> {
    const session = this.sessions.get(sessionId);
    if (!session) return undefined;
    
    // Check if session is expired
    if (session.expiresAt < new Date()) {
      this.sessions.delete(sessionId);
      return undefined;
    }
    
    return session;
  }

  async deleteSession(sessionId: string): Promise<boolean> {
    return this.sessions.delete(sessionId);
  }
}

export const storage = new MemStorage();
