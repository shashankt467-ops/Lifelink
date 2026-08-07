from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from typing import Optional, List
import uvicorn
from datetime import datetime, date
import random

app = FastAPI(
    title="Anti Gravity Healthcare API",
    description="AI-Powered Emergency Healthcare Platform Backend",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
)

import os

# CORS Configuration
default_origins = [
    "https://lifelink-omega-black.vercel.app",
    "http://localhost:5173",
    "http://localhost:3000",
    "http://localhost:5175",
    "http://localhost:5176",
    "http://localhost:5177",
    "http://localhost:5178",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:8000"
]

raw_origins = os.getenv("CORS_ORIGINS") or os.getenv("ALLOWED_ORIGINS")
if raw_origins:
    env_origins = [o.strip() for o in raw_origins.split(",") if o.strip()]
    origins = list(set(default_origins + env_origins))
else:
    origins = ["*"] if os.getenv("APP_ENV") != "production" else default_origins

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins if origins else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── MOCK DATA ────────────────────────────────────────────────────────────────
HOSPITALS = [
    {
        "id": 1, "name": "Apollo Hospitals", "type": "Multi-Specialty",
        "address": "21, Greams Lane, Chennai", "lat": 13.0614, "lng": 80.2479,
        "distance": 1.2, "eta": 5, "rating": 4.8, "reviewCount": 2341,
        "phone": "+91-44-28290200", "emergency": True,
        "beds": {"general": 45, "icu": 8, "emergency": 12, "total": 500},
        "icuBeds": {"available": 8, "total": 40},
        "specialists": ["Cardiologist", "Neurologist", "Orthopedic"],
        "score": 95, "waitTime": 15,
    },
    {
        "id": 2, "name": "Fortis Hospitals", "type": "Multi-Specialty",
        "address": "14, Cunningham Road, Bangalore", "lat": 12.9854, "lng": 77.5860,
        "distance": 2.4, "eta": 9, "rating": 4.6, "reviewCount": 1876,
        "phone": "+91-80-66214444", "emergency": True,
        "beds": {"general": 30, "icu": 5, "emergency": 8, "total": 350},
        "icuBeds": {"available": 5, "total": 30},
        "specialists": ["Cardiologist", "Neurologist", "Gastroenterologist"],
        "score": 88, "waitTime": 25,
    },
    {
        "id": 3, "name": "AIIMS Delhi", "type": "Government Teaching",
        "address": "Ansari Nagar, New Delhi", "lat": 28.5672, "lng": 77.2100,
        "distance": 3.8, "eta": 14, "rating": 4.9, "reviewCount": 5432,
        "phone": "+91-11-26588500", "emergency": True,
        "beds": {"general": 80, "icu": 15, "emergency": 25, "total": 2500},
        "icuBeds": {"available": 15, "total": 100},
        "specialists": ["Cardiologist", "Neurologist", "Orthopedic", "Oncologist"],
        "score": 98, "waitTime": 45,
    },
]

DOCTORS = [
    {
        "id": 1, "name": "Dr. Rajiv Sharma", "specialization": "Cardiologist",
        "hospital": "Apollo Hospitals", "hospitalId": 1, "experience": 18,
        "rating": 4.9, "consultationFee": 800, "available": True,
        "availableSlots": ["10:00 AM", "11:30 AM", "3:00 PM"],
        "qualification": "MD, DM Cardiology – AIIMS Delhi",
    },
    {
        "id": 2, "name": "Dr. Priya Menon", "specialization": "Neurologist",
        "hospital": "Fortis Hospitals", "hospitalId": 2, "experience": 14,
        "rating": 4.7, "consultationFee": 700, "available": True,
        "availableSlots": ["9:00 AM", "12:00 PM", "2:30 PM"],
        "qualification": "MD, DM Neurology – PGI Chandigarh",
    },
]

AMBULANCES = [
    {
        "id": 1, "type": "Advanced Life Support", "code": "ALS-001",
        "hospital": "Apollo Hospitals", "driver": "Ramesh Kumar",
        "driverPhone": "+91-9876543210", "distance": 0.8, "eta": 4,
        "status": "Available", "equipped": ["Defibrillator", "Ventilator", "ECG Machine"],
    },
    {
        "id": 2, "type": "Basic Life Support", "code": "BLS-002",
        "hospital": "Fortis Hospitals", "driver": "Suresh Babu",
        "driverPhone": "+91-9876543211", "distance": 1.5, "eta": 7,
        "status": "Available", "equipped": ["First Aid Kit", "Oxygen", "Stretcher"],
    },
]

appointments_store = []

# ─── ROUTES ───────────────────────────────────────────────────────────────────

@app.get("/")
def root():
    return {"message": "Anti Gravity Healthcare API", "version": "1.0.0", "status": "running"}

@app.get("/api/health")
def health_check():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

# Hospitals
@app.get("/api/hospitals")
def get_hospitals(emergency: Optional[bool] = None, type: Optional[str] = None):
    result = HOSPITALS
    if emergency is not None:
        result = [h for h in result if h["emergency"] == emergency]
    if type:
        result = [h for h in result if h["type"].lower() == type.lower()]
    return {"data": result, "count": len(result)}

@app.get("/api/hospitals/{hospital_id}")
def get_hospital(hospital_id: int):
    hospital = next((h for h in HOSPITALS if h["id"] == hospital_id), None)
    if not hospital:
        raise HTTPException(status_code=404, detail="Hospital not found")
    return {"data": hospital}

@app.post("/api/hospitals/ai-recommendation")
def ai_recommendation(payload: dict):
    condition = payload.get("condition", "")
    specialist = payload.get("specialist", "")
    urgency = payload.get("urgency", "normal")

    def score(h):
        s = 0
        s += max(0, (10 - h["distance"]) / 10) * 25
        s += (h["icuBeds"]["available"] / h["icuBeds"]["total"]) * 20
        s += (h["rating"] / 5) * 15
        if h["emergency"]: s += 15
        s += max(0, (60 - h["waitTime"]) / 60) * 10
        if urgency == "critical" and h["distance"] < 3: s *= 1.2
        return min(100, round(s))

    scored = [{"aiScore": score(h), **h} for h in HOSPITALS]
    scored.sort(key=lambda x: x["aiScore"], reverse=True)
    return {"data": scored, "recommended": scored[0]}

# Doctors
@app.get("/api/doctors")
def get_doctors(specialization: Optional[str] = None, available: Optional[bool] = None):
    result = DOCTORS
    if specialization:
        result = [d for d in result if d["specialization"].lower() == specialization.lower()]
    if available is not None:
        result = [d for d in result if d["available"] == available]
    return {"data": result, "count": len(result)}

# Ambulances
@app.get("/api/ambulances")
def get_ambulances(status: Optional[str] = None):
    result = AMBULANCES
    if status:
        result = [a for a in result if a["status"].lower() == status.lower()]
    return {"data": result, "count": len(result)}

@app.post("/api/ambulances/request")
def request_ambulance(payload: dict):
    available = [a for a in AMBULANCES if a["status"] == "Available"]
    if not available:
        raise HTTPException(status_code=503, detail="No ambulances available")
    amb = available[0]
    return {
        "data": {**amb, "status": "Assigned", "bookingId": f"AMB-{random.randint(10000,99999)}"},
        "success": True,
    }

# Appointments
@app.get("/api/appointments")
def get_appointments():
    return {"data": appointments_store, "count": len(appointments_store)}

@app.post("/api/appointments")
def book_appointment(payload: dict):
    doctor = next((d for d in DOCTORS if d["id"] == payload.get("doctorId")), None)
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")
    appointment = {
        "id": random.randint(1000, 9999),
        "doctorId": doctor["id"],
        "doctorName": doctor["name"],
        "specialization": doctor["specialization"],
        "hospital": doctor["hospital"],
        "date": payload.get("date"),
        "time": payload.get("time"),
        "type": payload.get("type", "Consultation"),
        "status": "Confirmed",
        "tokenNumber": f"T-{random.randint(100, 999)}",
        "fee": doctor["consultationFee"],
        "createdAt": datetime.now().isoformat(),
    }
    appointments_store.append(appointment)
    return {"data": appointment, "success": True}

@app.delete("/api/appointments/{appointment_id}")
def cancel_appointment(appointment_id: int):
    for appt in appointments_store:
        if appt["id"] == appointment_id:
            appt["status"] = "Cancelled"
            return {"data": appt, "success": True}
    raise HTTPException(status_code=404, detail="Appointment not found")

# AI Health Chat
@app.post("/api/ai/chat")
def ai_chat(payload: dict):
    message = payload.get("message", "").lower()
    responses = {
        "fever": {
            "guidance": "A fever above 100.4°F/38°C usually signals your body fighting an infection. Stay hydrated, rest, and monitor temperature. Seek care if fever exceeds 103°F or persists over 3 days.",
            "severity": "moderate", "seekEmergency": False, "specialist": "General Physician",
        },
        "chest pain": {
            "guidance": "⚠️ EMERGENCY: Chest pain may indicate a heart attack. Call 112 IMMEDIATELY. Do not drive yourself.",
            "severity": "critical", "seekEmergency": True, "specialist": "Cardiologist / Emergency",
        },
        "headache": {
            "guidance": "Most headaches are tension headaches caused by stress or dehydration. Rest, hydrate, and reduce screen time. Seek urgent care for sudden severe headache.",
            "severity": "low", "seekEmergency": False, "specialist": "General Physician",
        },
    }
    response = next((v for k, v in responses.items() if k in message), {
        "guidance": "Thank you for describing your symptoms. Please consult a healthcare professional for proper evaluation. AI guidance cannot replace professional medical advice.",
        "severity": "low", "seekEmergency": False, "specialist": "General Physician",
    })
    return {"data": response, "success": True}

# Analytics
@app.get("/api/analytics/dashboard")
def dashboard_analytics():
    return {
        "data": {
            "totalHospitals": len(HOSPITALS),
            "totalDoctors": len(DOCTORS),
            "availableAmbulances": len([a for a in AMBULANCES if a["status"] == "Available"]),
            "totalAppointments": len(appointments_store),
        }
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
