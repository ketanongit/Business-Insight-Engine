import { Hono } from "hono";
import { getAnalyticsData, detectAnomalies } from "./analytics";
import { generateInsights } from "./insights";

const app = new Hono();

app.get("/", (c) => c.text("Business Insight Engine Active"));

app.get("/api/insights/business", async (c) => {
    try {
        const data = await getAnalyticsData();
        const anomalies = detectAnomalies(data);
        const insights = generateInsights(anomalies);
        return c.json({ insights });
    } catch (error) {
        console.error(error);
        return c.json({ error: "Internal Server Error" }, 500);
    }
});

export default {
    port: 3000,
    fetch: app.fetch,
};
