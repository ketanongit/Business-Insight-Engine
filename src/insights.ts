export function generateInsights(anomalies: any[]) {
    return anomalies.map((anomaly) => {
        let insight = {
            type: anomaly.type,
            metric: anomaly.metric,
            change: anomaly.change,
            businessInsight: "Unusual activity detected.",
            suggestedAction: "Investigate further.",
            priority: "Medium",
            context: anomaly.context
        };

        // Rule Engine
        if (anomaly.metric === "PageViews" && anomaly.type === "Spike") {
            insight.businessInsight = `Significant traffic surge on ${anomaly.context.page}. Likely due to successful marketing or viral content.`;
            insight.suggestedAction = "Capitalize on traffic: Ensure server capacity and optimize landing page for conversion.";
            insight.priority = "High";
        }

        if (anomaly.metric === "UserActions" && anomaly.context.action === "checkout_complete" && anomaly.type === "Drop") {
            insight.businessInsight = "Checkout completions have dropped significantly. Potential payment gateway failure or UI bug.";
            insight.suggestedAction = "URGENT: Test checkout flow and check payment gateway logs.";
            insight.priority = "Critical";
        }

        if (anomaly.metric === "LoadTime" && anomaly.type === "Spike") {
            insight.businessInsight = `Page load time increased on ${anomaly.context.page} (${anomaly.context.device}). May affect SEO and bounce rates.`;
            insight.suggestedAction = "Optimize assets (images/scripts) for this device type.";
            insight.priority = "High";
        }

        return insight;
    }).sort((a, b) => {
        const priorities = { Critical: 3, High: 2, Medium: 1, Low: 0 };
        return (priorities[b.priority as keyof typeof priorities] || 0) - (priorities[a.priority as keyof typeof priorities] || 0);
    }).slice(0, 5);
}
