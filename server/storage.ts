import { 
  type User, 
  type InsertUser, 
  type SpeciesIdentification,
  type InsertSpeciesIdentification,
  type SpeciesReport,
  type InsertSpeciesReport
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  createSpeciesIdentification(identification: InsertSpeciesIdentification): Promise<SpeciesIdentification>;
  getSpeciesIdentifications(limit?: number): Promise<SpeciesIdentification[]>;
  getSpeciesIdentificationById(id: string): Promise<SpeciesIdentification | undefined>;
  
  createSpeciesReport(report: InsertSpeciesReport): Promise<SpeciesReport>;
  getSpeciesReports(limit?: number): Promise<SpeciesReport[]>;
  
  getStatsData(): Promise<{
    totalIdentifications: number;
    activeThreats: number;
    regionsCovered: number;
    conservationProgress: number;
  }>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private speciesIdentifications: Map<string, SpeciesIdentification>;
  private speciesReports: Map<string, SpeciesReport>;

  constructor() {
    this.users = new Map();
    this.speciesIdentifications = new Map();
    this.speciesReports = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createSpeciesIdentification(identification: InsertSpeciesIdentification): Promise<SpeciesIdentification> {
    const id = randomUUID();
    const speciesIdentification: SpeciesIdentification = {
      ...identification,
      id,
      createdAt: new Date(),
    };
    this.speciesIdentifications.set(id, speciesIdentification);
    return speciesIdentification;
  }

  async getSpeciesIdentifications(limit = 50): Promise<SpeciesIdentification[]> {
    const identifications = Array.from(this.speciesIdentifications.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
    return identifications;
  }

  async getSpeciesIdentificationById(id: string): Promise<SpeciesIdentification | undefined> {
    return this.speciesIdentifications.get(id);
  }

  async createSpeciesReport(report: InsertSpeciesReport): Promise<SpeciesReport> {
    const id = randomUUID();
    const speciesReport: SpeciesReport = {
      ...report,
      id,
      notes: report.notes || null,
      reportedBy: report.reportedBy || null,
      createdAt: new Date(),
    };
    this.speciesReports.set(id, speciesReport);
    return speciesReport;
  }

  async getSpeciesReports(limit = 50): Promise<SpeciesReport[]> {
    const reports = Array.from(this.speciesReports.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
    return reports;
  }

  async getStatsData(): Promise<{
    totalIdentifications: number;
    activeThreats: number;
    regionsCovered: number;
    conservationProgress: number;
  }> {
    return {
      totalIdentifications: this.speciesIdentifications.size,
      activeThreats: 196, // Based on 196 species in Indian dataset
      regionsCovered: 1, // India-focused, single region
      conservationProgress: Math.min(73, (this.speciesIdentifications.size / 100) * 100),
    };
  }
}

export const storage = new MemStorage();
