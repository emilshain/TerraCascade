"""
FastAPI Model Inference Service for TerraCascade
Provides live flood extent inference powered by Prithvi-100M-sen1floods11 ViT.
"""

from datetime import datetime, timezone
import time
from typing import Any, Dict, List, Optional
from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from inference_engine import engine, MODEL_REPOSITORY, DEFAULT_AOI_BOUNDS, DEFAULT_AOI_NAME

app = FastAPI(
    title="TerraCascade Model Service",
    description="Containerized Prithvi-100M-sen1floods11 Vision Transformer Flood Prediction Service",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PredictFloodRequest(BaseModel):
    scene_id: Optional[str] = Field(None, description="Sentinel-2 scene ID")
    scene_date: Optional[str] = Field(None, description="Acquisition date (YYYY-MM-DD)")
    discharge_cumecs: Optional[float] = Field(1200.0, description="Idamalayar dam release rate in cumecs (m3/s)")
    rainfall_mm_hr: Optional[float] = Field(45.0, description="Observed rainfall rate in mm/hour")
    scenario: Optional[str] = Field("custom", description="Scenario identifier or preset name")
    aoi_bounds: Optional[List[float]] = Field(None, description="AOI bounding box [west, south, east, north]")

class SurgeSimulationRequest(BaseModel):
    preset: str = Field(..., description="'monsoon_heavy' | 'controlled_release' | 'watch_monitoring'")
    actor_role: Optional[str] = Field("system", description="Role initiating the simulation")

@app.get("/health")
def health_check() -> Dict[str, Any]:
    return {
        "status": "healthy",
        "service": "TerraCascade Model Inference Service",
        "model": "Prithvi-100M-sen1floods11",
        "modelRepository": MODEL_REPOSITORY,
        "runtime": "Docker Containerized PyTorch & Shapely Engine",
        "aoi": DEFAULT_AOI_NAME,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }

@app.get("/model/metadata")
def model_metadata() -> Dict[str, Any]:
    return {
        "model": "Prithvi-100M-sen1floods11",
        "architecture": "Vision Transformer (ViT) with Temporal and Multi-Spectral Attention",
        "sourceHub": f"https://huggingface.co/{MODEL_REPOSITORY}",
        "inputBands": engine.band_order,
        "supportedSensors": ["Sentinel-2 MSI L2A", "Sentinel-1 SAR GRD"],
        "defaultAoiBounds": list(DEFAULT_AOI_BOUNDS),
        "targetResolutionMeters": 10.0,
        "status": "operational",
    }

@app.post("/predict/flood")
def predict_flood(req: PredictFloodRequest) -> Dict[str, Any]:
    t0 = time.time()
    bounds = tuple(req.aoi_bounds) if req.aoi_bounds and len(req.aoi_bounds) == 4 else DEFAULT_AOI_BOUNDS
    
    try:
        prediction = engine.generate_flood_extent(
            scene_id=req.scene_id,
            scene_date=req.scene_date,
            discharge_cumecs=req.discharge_cumecs or 1200.0,
            rainfall_mm_hr=req.rainfall_mm_hr or 45.0,
            aoi_bounds=bounds,
            scenario=req.scenario or "custom",
        )
        latency_ms = round((time.time() - t0) * 1000, 1)
        prediction["latencyMs"] = latency_ms
        return prediction
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Inference failed: {str(e)}")

@app.post("/simulate/surge")
def simulate_surge(req: SurgeSimulationRequest) -> Dict[str, Any]:
    preset_params = {
        "watch_monitoring": {"discharge": 520.0, "rain": 18.0, "scene": "S2_WATCH_MONITORING"},
        "controlled_release": {"discharge": 1380.0, "rain": 52.0, "scene": "S2_ORANGE_SPILLWAY_RELEASE"},
        "monsoon_heavy": {"discharge": 2650.0, "rain": 110.0, "scene": "S2_RED_EXTREME_MONSOON_SURGE"},
    }
    
    if req.preset not in preset_params:
        raise HTTPException(
            status_code=400,
            detail=f"Unknown preset '{req.preset}'. Choose from {list(preset_params.keys())}",
        )
    
    params = preset_params[req.preset]
    prediction = engine.generate_flood_extent(
        scene_id=params["scene"],
        discharge_cumecs=params["discharge"],
        rainfall_mm_hr=params["rain"],
        scenario=req.preset,
    )
    return {
        "message": f"Simulated '{req.preset}' scenario executed successfully.",
        "preset": req.preset,
        "prediction": prediction,
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
