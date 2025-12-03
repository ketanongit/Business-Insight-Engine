import { db } from "./db";
import { pageviews, useractions, performance } from "./db/schema";
import { subHours } from "date-fns";

async function seed() {
    console.log("Seeding data...");

    const now = new Date();
    const pageCategories = ["Adventure", "Beach", "Trekking", "City"];
    const pages = [
        "/coorg-adventure-trek",
        "/maldives-packages",
        "/dubai-skydiving",
        "/rishikesh-rafting",
        "/bali-honeymoon",
    ];
    const referrers = ["Google", "Instagram", "Facebook", "Direct", "Email"];
    const deviceTypes = ["Mobile", "Desktop", "Tablet"];
    const regions = ["North India", "South India", "International"];

    const pvData: any[] = [];
    const uaData: any[] = [];
    const perfData: any[] = [];

    // Generate 30 hours of data (24h baseline + 6h current)
    for (let i = 0; i < 30; i++) {
        const time = subHours(now, i);
        const isCurrentWindow = i < 6;

        // 1. PageViews
        for (const page of pages) {
            let count = Math.floor(Math.random() * 100) + 50; // Base traffic

            // Anomaly: Traffic Surge on /coorg-adventure-trek in last 6h
            if (isCurrentWindow && page === "/coorg-adventure-trek") {
                count = Math.floor(count * 4.5); // +350%
            }

            pvData.push({
                timestamp: time,
                page,
                pageCategory: pageCategories[Math.floor(Math.random() * pageCategories.length)],
                referrer: isCurrentWindow && page === "/coorg-adventure-trek" ? "Instagram" : referrers[Math.floor(Math.random() * referrers.length)],
                count,
            });
        }

        // 2. UserActions (Checkout)
        let checkoutCount = Math.floor(Math.random() * 50) + 20;
        // Anomaly: Checkout Drop in last 6h
        if (isCurrentWindow) {
            checkoutCount = Math.floor(checkoutCount * 0.5); // -50%
        }
        uaData.push({
            timestamp: time,
            actionType: "checkout_complete",
            count: checkoutCount,
        });

        // 3. Performance
        for (const page of pages) {
            for (const device of deviceTypes) {
                let loadTime = Math.random() * 2 + 1; // 1-3s
                // Anomaly: High Load Time on /maldives-packages on Mobile in last 6h
                if (isCurrentWindow && page === "/maldives-packages" && device === "Mobile") {
                    loadTime = loadTime * 2.5; // +150%
                }
                perfData.push({
                    timestamp: time,
                    page,
                    deviceType: device,
                    avgLoadTime: parseFloat(loadTime.toFixed(2)),
                    region: regions[Math.floor(Math.random() * regions.length)],
                });
            }
        }
    }

    await db.insert(pageviews).values(pvData);
    await db.insert(useractions).values(uaData);
    await db.insert(performance).values(perfData);

    console.log("Seeding complete!");
    process.exit(0);
}

seed().catch((err) => {
    console.error(err);
    process.exit(1);
});
