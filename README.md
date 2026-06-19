# 🎓 PlaceTrack — College Placement Management System

---

## 📁 Project Structure

```
placement-system/
├── backend/
│   ├── server.js       ← Express API server (all routes)
│   ├── db.js           ← MySQL connection
│   ├── .env            ← Your DB credentials (edit this!)
│   └── package.json
│
└── frontend/
    ├── index.html          ← Dashboard
    ├── students.html       ← Students CRUD
    ├── companies.html      ← Companies CRUD
    ├── jobs.html           ← Job Openings CRUD
    ├── applications.html   ← Applications + status update
    ├── results.html        ← Placed students
    ├── css/
    │   └── style.css
    └── js/
        └── api.js          ← Shared API helper
```

---

## ⚙️ STEP-BY-STEP SETUP

### STEP 1 — MySQL Workbench
1. Open MySQL Workbench
2. Run the SQL from the tables file to create the `placement_db` database and all tables
3. Note your MySQL **username** and **password**

---

### STEP 2 — Edit `.env` file
Open `backend/.env` and fill in YOUR MySQL details:
```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=YOUR_ACTUAL_PASSWORD_HERE
DB_NAME=placement_db
PORT=5000
```

---

### STEP 3 — Install Node.js
Download from: https://nodejs.org (LTS version)

---

### STEP 4 — Install backend dependencies
Open terminal in VS Code, navigate to the backend folder:
```bash
cd placement-system/backend
npm install
```

---

### STEP 5 — Start the backend server
```bash
npm run dev
```
You should see:
```
✅ Connected to MySQL Workbench (placement_db)
🚀 Server running at http://localhost:5000
```

---

### STEP 6 — Open the frontend
Open `frontend/index.html` directly in your browser.
(Right-click → Open with Live Server in VS Code, OR just double-click the file)

---

## 🌐 API Endpoints Reference

| Method | URL | Description |
|--------|-----|-------------|
| GET    | /api/students | Get all students |
| POST   | /api/students | Add student |
| DELETE | /api/students/:id | Delete student |
| GET    | /api/companies | Get all companies |
| POST   | /api/companies | Add company |
| GET    | /api/jobs | Get all jobs |
| POST   | /api/jobs | Post job drive |
| GET    | /api/applications | Get all applications |
| POST   | /api/applications | Submit application |
| PUT    | /api/applications/:id | Update status |
| GET    | /api/results | Get placed students |
| POST   | /api/results | Add placement result |
| GET    | /api/stats | Dashboard statistics |

---

## 🔧 VS Code Extensions Recommended
- **Live Server** — to open HTML files with auto-reload
- **REST Client** — to test API endpoints
- **MySQL** (by cweijan) — view your DB inside VS Code
