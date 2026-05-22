from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"
    assert response.json()["ai_ready"] is True

def test_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["name"] == "ChefVision AI"
