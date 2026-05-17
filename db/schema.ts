import { pgTable, varchar, boolean, timestamp } from "drizzle-orm/pg-core";

export const resultsTable = pgTable("results", {
  // clerk user Id
  clerkUserId: varchar({ length: 255 }).notNull().unique(),
  isVictory: boolean().notNull(),
  createdAt: timestamp().notNull().defaultNow(),
});
