import os
import boto3
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware

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