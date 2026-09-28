CREATE TABLE "results" (
	"clerkUserId" varchar(255) NOT NULL,
	"isVictory" boolean NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"difficulty" varchar
);
--> statement-breakpoint
CREATE INDEX "results_clerk_user_id_created_at_idx" ON "results" USING btree ("clerkUserId","createdAt" DESC NULLS LAST);