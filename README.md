# Business Insight Engine

A powerful analytics backend that detects anomalies in travel booking data and generates human-readable business insights. Built for a Thrillophilia-like travel platform to help non-technical teams (Marketing, Ops, Product) understand behavioral shifts and performance issues.

## 🚀 Features

-   **Anomaly Detection**: Compares current metrics (last 6h) against a 24h baseline using Z-Score analysis (> 2.5σ).
-   **Business Insights**: Translates raw data spikes/drops into actionable advice (e.g., "Traffic surge from Instagram -> Increase Ad Spend").
-   **Interactive Dashboard**: Visualizes traffic trends and lists top insights with priority scoring.
-   **PDF Reporting**: Generates downloadable daily reports with charts and insight tables.
-   **API First**: Exposes insights via a JSON endpoint for integration.

## 🛠️ Tech Stack

-   **Runtime**: [Bun](https://bun.sh) (Fast JavaScript runtime)
-   **Framework**: [Hono](https://hono.dev) (Lightweight web framework)
-   **Database**: PostgreSQL (Neon Tech)
-   **ORM**: [Drizzle ORM](https://orm.drizzle.team)
-   **Frontend**: Server-side rendered HTML with Tailwind CSS & Chart.js

## ⚙️ Setup & Installation

1.  **Install Dependencies**
    ```bash
    bun install
    ```

2.  **Environment Setup**
    Create a `.env` file in the root directory:
    ```env
    DATABASE_URL='your_postgres_connection_string'
    ```

3.  **Database Migration**
    Push the schema to your PostgreSQL instance:
    ```bash
    bun run drizzle-kit push
    ```

4.  **Seed Data**
    Populate the database with sample data (including simulated anomalies):
    ```bash
    bun run src/seed.ts
    ```

5.  **Run Server**
    ```bash
    bun run dev
    ```
    Visit `http://localhost:3000` to see the landing page.

## 🧠 Assumptions & Domain Logic

As per the project requirements, several assumptions were made regarding the travel domain and data patterns:

### 1. Anomaly Thresholds
-   **Statistical Significance**: We use a **Z-Score of 2.5** (2.5 standard deviations from the mean) to flag anomalies. This filters out normal hourly fluctuations while catching significant events.
-   **Baseline**: The "Baseline" is calculated from the **24-hour period immediately preceding** the current 6-hour window. This accounts for daily seasonality (e.g., traffic is naturally lower at 3 AM).

### 2. Business Logic Mappings
We map specific data patterns to business scenarios:
-   **Traffic Surge (+PageViews)**: If the referrer is "Instagram" or "Facebook", we assume it's a **Viral Campaign**. *Action: Increase Ad Spend.*
-   **Checkout Drop (-UserActions)**: A sudden drop in `checkout_complete` events suggests a **Payment Gateway Failure** or UI bug. *Action: Urgent Technical Review.*
-   **High Latency (+LoadTime)**: If specific to "Mobile" devices, we assume **Unoptimized Assets** (large images). *Action: Optimize Media.*

### 3. Data Simulation
-   Since we lack access to a real live stream, the `src/seed.ts` script generates **30 hours of synthetic data**.
-   It intentionally injects 3 specific anomalies (Coorg Trek surge, Checkout drop, Maldives mobile slowness) to demonstrate the engine's capabilities.

## 📂 Project Structure

-   `src/index.ts`: Main application entry point and route definitions.
-   `src/analytics.ts`: Core logic for fetching data and calculating Z-Scores.
-   `src/insights.ts`: Rule engine that converts statistical anomalies into text insights.
-   `src/dashboard.tsx`: HTML/JSX template for the frontend dashboard.
-   `src/db/`: Database schema and connection setup.