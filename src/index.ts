import { Hono } from "hono";
import { getAnalyticsData, detectAnomalies, getTrafficTrends } from "./analytics";
import { generateInsights } from "./insights";
import { Dashboard } from "./dashboard";

const app = new Hono();

import { html } from "hono/html";

app.get("/", (c) => {
    return c.html(html`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Business Insight Engine</title>
      <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body class="bg-gray-50 min-h-screen flex items-center justify-center font-sans">
      <div class="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
        <div class="mb-6">
          <div class="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
          </div>
          <h1 class="text-2xl font-bold text-gray-900 mb-2">Business Insight Engine</h1>
          <p class="text-gray-500">Anomaly detection and automated business insights.</p>
        </div>
        
        <div class="space-y-3">
          <a href="/insights" class="block w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-200 flex items-center justify-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
            View Dashboard
          </a>
          
          <a href="/api/insights/business" target="_blank" class="block w-full py-3 px-4 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium rounded-lg transition duration-200 flex items-center justify-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>
            Test API Endpoint
          </a>
        </div>
      </div>
    </body>
    </html>
  `);
});

app.get("/insights", async (c) => {
    const data = await getAnalyticsData();
    const anomalies = detectAnomalies(data);
    const insights = await generateInsights(anomalies);
    const trends = await getTrafficTrends();
    return c.html(Dashboard(insights, trends));
});

app.get("/api/insights/business", async (c) => {
    try {
        const data = await getAnalyticsData();
        const anomalies = detectAnomalies(data);
        const insights = await generateInsights(anomalies);
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
