# 🌊 TerraCascade — EAP Command & Flood Response System

> **Incident Command & Flood Hazard Response System for the Idamalayar Dam & Periyar River Basin**

---

## 📌 Overview

**TerraCascade** is an Emergency Action Plan (EAP) incident command dashboard and automated cascade risk reasoning platform. It bridges geospatial satellite inference (Prithvi-100M-sen1floods11), dynamic protocol action management, downstream cascade asset graphs, and 0/1 knapsack disaster mitigation budget portfolio optimization into a unified, authenticated command center.

---

## 🏗️ Architecture

```
TerraCascade/
├── frontend/          # Next.js 16 (App Router) + Tailwind CSS + MapLibre GL
├── backend/           # Node.js + Express + TypeScript + Mongoose (MongoDB)
├── model-service/     # FastAPI Python microservice (Prithvi-100M geospatial inference)
├── config/            # GeoJSON boundaries, Idamalayar AOI & assets
└── docs/              # Specifications, judge QA sheets & pitch docs
```

---

## 🚀 Key Features

- **Multi-Role Emergency Clearance**:
  - `kseb_epm`: KSEB Emergency Preparedness Manager (Dam safety & release logic)
  - `district_eoc`: District EOC Coordinator (Inter-agency resource chain)
  - `district_collector`: District Collector (Authorized public alerting)
  - `budget_planner`: Disaster Mitigation Budget Planner (Portfolio optimization)
- **Live Geospatial Impact Map**: Satellite flood inundation zones overlaying critical infrastructure, road cascades, and relief camps.
- **EAP Playbook Engine**: Blue (Watch), Orange (Controlled Readiness), and Red (Emergency Release) protocol action workflows with human-in-the-loop overrides.
- **0/1 Knapsack Budget Optimizer**: Deterministic dynamic programming optimizer allocating regional mitigation budgets to maximize population safety impact.
- **MongoDB Atlas Telemetry & Audit Trail**: Real-time cluster latency indicators and immutable command event audit timeline.

---

## 🛠️ Local Development

### 1. Backend
```bash
cd backend
npm install
npm run dev
```

### 2. Frontend
```bash
cd frontend
npm install
npm run dev
```

### 3. Model Service (Optional)
```bash
cd model-service
pip install -r requirements.txt
python main.py
```

---

## 🌐 Deployment Configuration

- **Frontend (Vercel)**:
  - Root Directory: `frontend`
  - `NEXT_PUBLIC_API_URL`: Backend public URL
- **Backend (Railway)**:
  - `PORT`: `4000`
  - `MONGODB_URI`: MongoDB Atlas or Railway MongoDB connection URI
  - `MODEL_SERVICE_URL`: Model service public URL
  - `JWT_SECRET`: Secure authorization secret key
- **Model Service (Railway)**:
  - Standard Python FastAPI service on port `8000`