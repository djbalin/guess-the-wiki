import {
  pgTable,
  varchar,
  boolean,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { DIFFICULTY_LEVELS } from "@/lib/constants";

export const resultsTable = pgTable("results", {
  // clerk user Id
  clerkUserId: varchar({ length: 255 }).notNull(),
  isVictory: boolean().notNull(),
  createdAt: timestamp().notNull().defaultNow(),
  id: uuid("id").primaryKey().defaultRandom(),
  difficulty: varchar({ enum: DIFFICULTY_LEVELS }),
});
