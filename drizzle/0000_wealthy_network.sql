CREATE TABLE "pageviews_hourly" (
	"id" serial PRIMARY KEY NOT NULL,
	"timestamp" timestamp NOT NULL,
	"page" text NOT NULL,
	"page_category" text,
	"referrer" text,
	"count" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "performance_hourly" (
	"id" serial PRIMARY KEY NOT NULL,
	"timestamp" timestamp NOT NULL,
	"page" text NOT NULL,
	"device_type" text,
	"avg_load_time" double precision NOT NULL,
	"region" text
);
--> statement-breakpoint
CREATE TABLE "useractions_hourly" (
	"id" serial PRIMARY KEY NOT NULL,
	"timestamp" timestamp NOT NULL,
	"action_type" text NOT NULL,
	"count" integer NOT NULL
);
