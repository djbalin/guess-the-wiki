import {
  pgTable,
  varchar,
  boolean,
  timestamp,
  uuid,
  index,
} from "drizzle-orm/pg-core";
import { DIFFICULTY_LEVELS } from "@/lib/constants";

export const resultsTable = pgTable(
  "results",
  {
    // clerk user Id
    clerkUserId: varchar({ length: 255 }).notNull(),
    isVictory: boolean().notNull(),
    createdAt: timestamp().notNull().defaultNow(),
    id: uuid("id").primaryKey().defaultRandom(),
    difficulty: varchar({ enum: DIFFICULTY_LEVELS }),
  },
  (table) => [
    // Every read of this table is "one player's results, newest first".
    // Without this index that is a full scan of every player's history.
    index("results_clerk_user_id_created_at_idx").on(
      table.clerkUserId,
      table.createdAt.desc(),
    ),
  ],
);
