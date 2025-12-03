import { html, raw } from "hono/html";

export const Dashboard = (insights: any[], trends: any[]) => html`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Business Insight Dashboard</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.29/jspdf.plugin.autotable.min.js"></script>
</head>
<body class="bg-gray-50 font-sans antialiased">
    <div class="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm px-4 md:px-8 py-4 mb-8 transition-all duration-300">
        <div class="max-w-8xl mx-auto flex justify-between items-center">
            <h1 class="text-xl md:text-3xl font-bold text-gray-900 tracking-tight">
                Business Insight <span class="text-blue-600">Dashboard</span>
            </h1>
            <button onclick="generatePDF()" class="group bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 text-xs md:text-base px-3 py-2 md:px-6 md:py-2.5 flex items-center gap-2">
                <svg class="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                <span>Download Report</span>
            </button>
        </div>
    </div>

    <div class="max-w-8xl mx-auto px-8 pb-8">
        <!-- Top Insights -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div class="bg-white p-6 rounded-lg shadow-md">
                <h2 class="text-xl font-semibold mb-4 text-gray-700">Top Insights Today</h2>
                <div class="space-y-4">
                    ${insights.map(i => html`
                        <div class="border-l-4 ${i.priority === 'Critical' ? 'border-red-500' : i.priority === 'High' ? 'border-orange-500' : 'border-blue-500'} pl-4 py-2 bg-gray-50">
                            <div class="flex justify-between items-start">
                                <h3 class="font-bold text-gray-800">${i.metric} ${i.type}</h3>
                                <span class="text-xs font-semibold px-2 py-1 rounded ${i.priority === 'Critical' ? 'bg-red-100 text-red-800' : i.priority === 'High' ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800'}">
                                    ${i.priority}
                                </span>
                            </div>
                            <p class="text-sm text-gray-600 mt-1">${i.businessInsight}</p>
                            <p class="text-sm font-medium text-gray-700 mt-2">Action: ${i.suggestedAction}</p>
                        </div>
                    `)}
                </div>
            </div>

            <!-- Trend Chart -->
            <div class="bg-white p-6 rounded-lg shadow-md">
                <h2 class="text-xl font-semibold mb-4 text-gray-700">Traffic Trends (Last 24h)</h2>
                <canvas id="trafficChart"></canvas>
            </div>
        </div>
    </div>

    <script>
        const trendsData = ${raw(JSON.stringify(trends))};

        // Mock Chart Data (In a real app, pass this from backend)
        const ctx = document.getElementById('trafficChart').getContext('2d');
        const myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ${raw(JSON.stringify(trends.map(t => t.label)))},
                datasets: [{
                    label: 'Page Views',
                    data: ${raw(JSON.stringify(trends.map(t => t.value)))},
                    borderColor: 'rgb(59, 130, 246)',
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
            }
        });

        // PDF Generation
        async function generatePDF() {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();

            doc.setFontSize(20);
            doc.text("Daily Business Insight Report", 20, 20);
            doc.setFontSize(12);
            doc.text("Generated on: " + new Date().toLocaleDateString(), 20, 30);

            const insights = ${raw(JSON.stringify(insights))};
            
            const tableData = insights.map(i => [
                i.priority,
                i.metric + " " + i.type,
                i.businessInsight,
                i.suggestedAction
            ]);

            doc.autoTable({
                startY: 40,
                head: [['Priority', 'Metric', 'Insight', 'Action']],
                body: tableData,
                theme: 'grid',
                headStyles: { fillColor: [41, 128, 185] },
            });

            // Add Chart
            const chartImg = myChart.toBase64Image();
            const finalY = doc.lastAutoTable.finalY || 40;
            doc.addImage(chartImg, 'PNG', 15, finalY + 20, 180, 100);

            doc.save("daily-insights.pdf");
        }
    </script>
</body>
</html>
`;
