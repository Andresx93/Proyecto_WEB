# 🗺️ MAPA DEL PROYECTO - ARQUITECTURA Y FUNCIONES

Esta guía describe la función de cada archivo del proyecto para facilitar la sustentación técnica.

## 📦 1. Backend (El Servidor)
El backend está desarrollado con **FastAPI (Python)** y actúa como el puente entre el usuario y la base de datos/almacenamiento.

- `backend/main.py`: **El cerebro del sistema**. Contiene todos los endpoints de la API:
  - `GET /api/files`: Lista los archivos en MinIO.
  - `POST /api/upload`: Sube archivos al bucket.
  - `GET /api/files/{filename}`: Permite la descarga de archivos.
  - `DELETE /api/files/{filename}`: Borra archivos.
  - `GET /api/plans`: Entrega la lista de planes de almacenamiento.
  - `GET /api/devs`: Entrega la información del equipo de desarrollo.
- `backend/requirements.txt`: Lista las librerías necesarias (FastAPI, Uvicorn, Boto3) para que el servidor funcione.
- `backend/Dockerfile`: Configura el entorno de Python y las dependencias dentro de un contenedor Docker.

## 🎨 2. Frontend (La Interfaz)
El frontend está desarrollado con **React.js** y se encarga de la interacción con el usuario.

- `frontend/src/App.jsx`: **El archivo principal**. Contiene la lógica de negocio:
  - Gestión del carrito de compras y pasarela de pago.
  - Implementación de la IA de recomendación de planes.
  - Validaciones de formularios PQR usando Expresiones Regulares (RegEx).
  - Manejo de estados de accesibilidad (contraste y tamaño de letra).
- `frontend/src/App.css`: Define toda la identidad visual de **Cabbage Cloud**, asegurando que la página sea responsiva y cumpla con estándares de UX.
- `frontend/src/assets/`: Carpeta de almacenamiento de recursos visuales (como el logo).
- `frontend/Dockerfile`: Empaqueta la aplicación de React para que se despliegue en un contenedor Docker.

## 🐳 3. Infraestructura y Despliegue
- `docker-compose.yml`: **El orquestador**. Define cómo se levantan y comunican los tres servicios: `frontend`, `backend` y `minio`.
- `README.md`: Manual de usuario final con instrucciones de instalación y ejecución.
- `.gitignore`: Especifica los archivos que no deben subirse al repositorio (como carpetas de configuración local).

## 🔄 Flujo de Datos (Ejemplo: Subida de Archivo)
`Usuario (React)` $\rightarrow$ `Petición POST /api/upload` $\rightarrow$ `Servidor (FastAPI)` $\rightarrow$ `S3 API (MinIO)` $\rightarrow$ `Almacenamiento Físico`.
