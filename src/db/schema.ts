import { pgTable, serial, text, integer, timestamp, doublePrecision } from "drizzle-orm/pg-core";

export const pageviews = pgTable("pageviews_hourly", {
    id: serial("id").primaryKey(),
    timestamp: timestamp("timestamp").notNull(),
    page: text("page").notNull(),
    pageCategory: text("page_category"),
    referrer: text("referrer"),
    count: integer("count").notNull(),
});

export const useractions = pgTable("useractions_hourly", {
    id: serial("id").primaryKey(),
    timestamp: timestamp("timestamp").notNull(),
    actionType: text("action_type").notNull(),
    count: integer("count").notNull(),
});

export const performance = pgTable("performance_hourly", {
    id: serial("id").primaryKey(),
    timestamp: timestamp("timestamp").notNull(),
    page: text("page").notNull(),
    deviceType: text("device_type"),
    avgLoadTime: doublePrecision("avg_load_time").notNull(),
    region: text("region"),
});

export const businessInsights = pgTable("business_insights", {
    id: serial("id").primaryKey(),
    metricType: text("metric_type").notNull(),
    page: text("page").notNull(),
    insightText: text("insight_text").notNull(),
    suggestedAction: text("suggested_action").notNull(),
    impactScore: text("impact_score").notNull(), // "Critical", "High", "Medium", "Low"
    timestamp: timestamp("timestamp").defaultNow().notNull(),
});
