import { db } from "./db";
import { pageviews, useractions, performance } from "./db/schema";
import { sql, desc, and, gte, lt } from "drizzle-orm";
import { subHours } from "date-fns";

export async function getAnalyticsData() {
    const now = new Date();
    const sixHoursAgo = subHours(now, 6);
    const thirtyHoursAgo = subHours(now, 30); // 24h before the 6h window

    // Helper to fetch and aggregate
    const fetchMetric = async (table: any, metricCol: any, groupByCols: any[]) => {
        // Baseline: [30h ago, 6h ago)
        const baseline = await db
            .select({
                ...Object.fromEntries(groupByCols.map((c) => [c.name, c])),
                avg: sql<number>`avg(${metricCol})`,
                stddev: sql<number>`stddev(${metricCol})`,
            })
            .from(table)
            .where(and(gte(table.timestamp, thirtyHoursAgo), lt(table.timestamp, sixHoursAgo)))
            .groupBy(...groupByCols);

        // Current: [6h ago, now]
        const current = await db
            .select({
                ...Object.fromEntries(groupByCols.map((c) => [c.name, c])),
                avg: sql<number>`avg(${metricCol})`,
            })
            .from(table)
            .where(gte(table.timestamp, sixHoursAgo))
            .groupBy(...groupByCols);

        return { baseline, current };
    };

    // 1. PageViews
    const pvData = await fetchMetric(pageviews, pageviews.count, [pageviews.page]);

    // 2. Checkout Actions
    const uaData = await fetchMetric(useractions, useractions.count, [useractions.actionType]);

    // 3. Performance
    const perfData = await fetchMetric(performance, performance.avgLoadTime, [performance.page, performance.deviceType]);

    return { pvData, uaData, perfData };
}

export function detectAnomalies(data: any) {
    const anomalies: any[] = [];

    const check = (baselineItems: any[], currentItems: any[], keyFn: (i: any) => string, metricName: string, contextFn: (i: any) => any) => {
        const baselineMap = new Map(baselineItems.map((i) => [keyFn(i), i]));

        for (const curr of currentItems) {
            const key = keyFn(curr);
            const base = baselineMap.get(key);

            if (base && base.stddev > 0) {
                const zScore = (curr.avg - base.avg) / base.stddev;
                if (Math.abs(zScore) > 2.5) {
                    anomalies.push({
                        type: zScore > 0 ? "Spike" : "Drop",
                        metric: metricName,
                        key,
                        change: `${((curr.avg - base.avg) / base.avg * 100).toFixed(0)}%`,
                        zScore,
                        context: contextFn(curr),
                        baseAvg: base.avg,
                        currAvg: curr.avg
                    });
                }
            }
        }
    };

    // PageViews
    check(
        data.pvData.baseline,
        data.pvData.current,
        (i: any) => i.page,
        "PageViews",
        (i: any) => ({ page: i.page })
    );

    // UserActions
    check(
        data.uaData.baseline,
        data.uaData.current,
        (i: any) => i.action_type,
        "UserActions",
        (i: any) => ({ action: i.action_type })
    );

    // Performance
    check(
        data.perfData.baseline,
        data.perfData.current,
        (i: any) => `${i.page}-${i.device_type}`,
        "LoadTime",
        (i: any) => ({ page: i.page, device: i.device_type })
    );

    return anomalies;
}


export async function getTrafficTrends() {
    const now = new Date();
    const twentyFourHoursAgo = subHours(now, 24);

    const trends = await db
        .select({
            hour: sql<string>`to_char(${pageviews.timestamp}, 'HH24:00')`,
            count: sql<number>`sum(${pageviews.count})`,
        })
        .from(pageviews)
        .where(gte(pageviews.timestamp, twentyFourHoursAgo))
        .groupBy(sql`to_char(${pageviews.timestamp}, 'HH24:00')`)
        .orderBy(sql`to_char(${pageviews.timestamp}, 'HH24:00')`);

    console.log("Trends Data:", trends);
    return trends.map(t => ({ label: t.hour, value: Number(t.count) }));
}
