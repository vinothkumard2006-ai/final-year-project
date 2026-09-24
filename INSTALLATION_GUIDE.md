# Installation and Setup Guide

## 1. Prerequisites
- Python 3.11+
- Node.js 18+
- A MySQL server or use the built-in SQLite fallback for local demo runs

## 2. Backend Setup

### Linux
```bash
cd backend
python3 -m pip install -r requirements.txt
python3 -m uvicorn main:app --host 0.0.0.0 --port 8000
```

### Windows
```powershell
cd backend
py -m pip install -r requirements.txt
py -m uvicorn main:app --host 0.0.0.0 --port 8000
```

## 3. Seed Demo Data
Open the following URL after the backend starts:
```bash
http://127.0.0.1:8000/api/seed
```

## 4. Frontend Setup

### Linux
```bash
cd frontend
npm install
npm run dev -- --host 0.0.0.0 --port 5173
```

### Windows
```powershell
cd frontend
npm install
npm run dev -- --host 0.0.0.0 --port 5173
```

## 5. Login Credentials
Use these demo credentials:
- Username: admin
- Password: admin123

## 6. Real-World Notes
- The app uses a lightweight demo-mode flow by default.
- For real deployment, replace the demo auth flow with a secure JWT backend and a production MySQL database.
- Keep the database schema simple and avoid storing raw packet payloads.
