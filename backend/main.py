import os
import boto3
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse

app = FastAPI(title="OneDrive Local API")

# Configurar CORS para permitir que React se conecte
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Credenciales de MinIO
MINIO_ENDPOINT = os.getenv("MINIO_ENDPOINT", "localhost:9000")
MINIO_ACCESS_KEY = os.getenv("MINIO_ACCESS_KEY", "admin_onedrive")
MINIO_SECRET_KEY = os.getenv("MINIO_SECRET_KEY", "password123")
BUCKET_NAME = "mi-onedrive"

# Catálogo de Planes de Almacenamiento (Simulación de BD de Productos)
PLANES_ALMACENAMIENTO = [
    {"id": 1, "nombre": "Seed Plan", "capacidad": "100 GB", "precio": 0, "descripcion": "Ideal para empezar. Gratis para siempre."},
    {"id": 2, "nombre": "Sprout Plan", "capacidad": "1 TB", "precio": 9.99, "descripcion": "Para usuarios activos y emprendedores."},
    {"id": 3, "nombre": "Harvest Plan", "capacidad": "Ilimitado", "precio": 24.99, "descripcion": "Potencia total para empresas y profesionales."},
]

# Base de Datos de Desarrolladores (Simulación de CRUD de Perfiles)
DESARROLLADORES = [
    {"id": 1, "nombre": "Samuel", "rol": "Lead Developer", "celular": "3001234567", "foto": "https://via.placeholder.com/150"},
    {"id": 2, "nombre": "Integrante 2", "rol": "Frontend Dev", "celular": "3007654321", "foto": "https://via.placeholder.com/150"},
    {"id": 3, "nombre": "Integrante 3", "rol": "DevOps", "celular": "3009876543", "foto": "https://via.placeholder.com/150"},
]

s3_client = boto3.client(
    's3',
    endpoint_url=f"http://{MINIO_ENDPOINT}",
    aws_access_key_id=MINIO_ACCESS_KEY,
    aws_secret_access_key=MINIO_SECRET_KEY,
)

@app.get("/")
def ping():
    return {"mensaje": "API conectada y lista"}

@app.get("/api/files")
def list_files():
    try:
        response = s3_client.list_objects_v2(Bucket=BUCKET_NAME)
        archivos = []
        if 'Contents' in response:
            for obj in response['Contents']:
                archivos.append({
                    "nombre": obj['Key'],
                    "tamaño_bytes": obj['Size'],
                    "fecha_modificacion": obj['LastModified']
                })
        return {"archivos": archivos}
    except Exception as e:
        return {"error": str(e)}

@app.post("/api/upload")
async def upload_file(file: UploadFile = File(...)):
    try:
        s3_client.upload_fileobj(file.file, BUCKET_NAME, file.filename)
        return {"mensaje": f"Archivo '{file.filename}' subido exitosamente."}
    except Exception as e:
        return {"error": str(e)}

@app.get("/api/files/{filename}")
def download_file(filename: str):
    try:
        response = s3_client.get_object(Bucket=BUCKET_NAME, Key=filename)
        return StreamingResponse(
            response['Body'],
            media_type="application/octet-stream",
            headers={"Content-Disposition": f"attachment; filename={filename}"}
        )
    except Exception as e:
        return {"error": str(e)}

@app.delete("/api/files/{filename}")
def delete_file(filename: str):
    try:
        s3_client.delete_object(Bucket=BUCKET_NAME, Key=filename)
        return {"mensaje": f"Archivo '{filename}' eliminado exitosamente."}
    except Exception as e:
        return {"error": str(e)}

@app.get("/api/plans")
def get_plans():
    return {"planes": PLANES_ALMACENAMIENTO}

@app.get("/api/devs")
def get_devs():
    return {"desarrolladores": DESARROLLADORES}

@app.post("/api/devs")
def add_dev(dev: dict):
    DESARROLLADORES.append(dev)
    return {"mensaje": "Desarrollador añadido exitosamente"}

