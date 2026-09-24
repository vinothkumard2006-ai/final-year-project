<<<<<<< HEAD
# Intelligent Network Monitoring and Predictive Threat Analytics Platform

This project is a lightweight, low-memory, full-stack demo platform for network monitoring. It includes:

- FastAPI backend with a compact MySQL-friendly schema
- React + Vite frontend with Tailwind styling
- Demo-mode data generation and lightweight aggregated analytics
- Basic JWT-style auth flow and role-based access concepts

## Requirements

- Python 3.11+
- Node.js 18+
- MySQL 8.0 running locally

## Backend setup

1. Create a MySQL database named `network_monitoring_db`
2. Install Python dependencies:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```
3. Start the API:
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```
4. Seed the database by calling:
   ```bash
   curl http://127.0.0.1:8000/api/seed
   ```

## Frontend setup

1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```
2. Start the UI:
   ```bash
   npm run dev
   ```

## Notes

- The system intentionally avoids storing raw packet payloads.
- Data is kept lightweight through aggregated summaries and a small retention window.
- The UI is optimized for low-memory environments and uses demo-mode data by default.
=======
# final-year-project
>>>>>>> 5f0e0b36a2f34ed20619c580a607f9f6896c061c
