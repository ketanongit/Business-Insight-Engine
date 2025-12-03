CREATE TABLE "business_insights" (
	"id" serial PRIMARY KEY NOT NULL,
	"metric_type" text NOT NULL,
	"page" text NOT NULL,
	"insight_text" text NOT NULL,
	"suggested_action" text NOT NULL,
	"impact_score" text NOT NULL,
	"timestamp" timestamp DEFAULT now() NOT NULL
);
