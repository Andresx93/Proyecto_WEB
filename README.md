# ☁️ Prototipo Web Tipo OneDrive (Local con Docker)

Este repositorio contiene el código fuente de una aplicación web tipo OneDrive, diseñada con una arquitectura de microservicios. Permite visualizar, subir y almacenar archivos de manera persistente utilizando contenedores de Docker y un servidor de almacenamiento de objetos (MinIO).

## 🛠️ Stack Tecnológico
* **Frontend:** React + Vite (HTML5, CSS3)
* **Backend:** Python + FastAPI + Boto3
* **Almacenamiento:** MinIO (Object Storage compatible con Amazon S3)
* **Infraestructura:** Docker & Docker Compose

## 🏗️ Arquitectura del Sistema
1. **Frontend (Capa Visual - Puerto 5173):** Interfaz que permite al usuario interactuar, visualizar la tabla de documentos y realizar subidas asíncronas sin recargar la página.
2. **Backend (Capa Lógica - Puerto 8000):** API central documentada automáticamente (Swagger) que recibe las peticiones, procesa los archivos binarios y actúa como puente seguro hacia la capa de datos.
3. **MinIO (Capa de Almacenamiento - Puertos 9000/9001):** Servidor de objetos que guarda los archivos físicamente vinculados a un volumen local (`minio_data/`), asegurando la persistencia total de la información.

## 📋 Requisitos Previos
* [Docker Desktop](https://www.docker.com/products/docker-desktop/) (Asegurarse de que el motor de contenedores esté en ejecución).
* [Git](https://git-scm.com/)

## 🚀 Guía de Instalación y Ejecución

**1. Clonar el repositorio**
Abre tu terminal y ejecuta:
```bash'''

git clone [https://github.com/TU_USUARIO/mi-onedrive-local.git](https://github.com/TU_USUARIO/mi-onedrive-local.git)
cd mi-onedrive-local

**2. componer el Docker*
Abre tu terminal y ejecuta:

docker compose up --build