import { sql } from "drizzle-orm";
import { pgTable, text, varchar, real, integer, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const speciesIdentifications = pgTable("species_identifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  imageUrl: text("image_url").notNull(),
  predictions: json("predictions").$type<{
    species: string;
    confidence: number;
    scientificName: string;
    category: "plant" | "insect";
    impactLevel: "low" | "medium" | "high";
    nativeTo: string;
  }[]>().notNull(),
  regionCode: text("region_code"),
  userId: varchar("user_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const speciesReports = pgTable("species_reports", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  speciesName: text("species_name").notNull(),
  location: text("location").notNull(),
  notes: text("notes"),
  reportedBy: varchar("reported_by"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertSpeciesIdentificationSchema = createInsertSchema(speciesIdentifications).pick({
  imageUrl: true,
  predictions: true,
  regionCode: true,
  userId: true,
});

export const insertSpeciesReportSchema = createInsertSchema(speciesReports).pick({
  speciesName: true,
  location: true,
  notes: true,
  reportedBy: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertSpeciesIdentification = z.infer<typeof insertSpeciesIdentificationSchema>;
export type SpeciesIdentification = typeof speciesIdentifications.$inferSelect;
export type InsertSpeciesReport = z.infer<typeof insertSpeciesReportSchema>;
export type SpeciesReport = typeof speciesReports.$inferSelect;
