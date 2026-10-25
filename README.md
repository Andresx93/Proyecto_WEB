# ☁️ Cabbage Cloud - Infrastructure & Storage Solutions

Cabbage Cloud es una plataforma profesional de infraestructura de datos y almacenamiento en la nube, diseñada para ofrecer soluciones escalables, seguras y sostenibles. Este proyecto fue desarrollado como trabajo final, integrando un ecosistema de microservicios contenerizados con un enfoque en la experiencia de usuario y la accesibilidad.

## 🚀 Stack Tecnológico

La arquitectura del proyecto sigue un modelo de capas para garantizar la separación de responsabilidades:

- **Frontend:** [React.js](https://reactjs.org/) + [Vite](https://vitejs.dev/) (Interfaz moderna con Dark Mode y Glassmorphism).
- **Backend:** [FastAPI](https://fastapi.tiangolo.com/) / Python (API REST de alta eficiencia).
- **Almacenamiento:** [MinIO](https://min.io/) (S3 Compatible Object Storage).
- **Infraestructura:** [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/) (Contenerización completa).

---

## ✨ Características Principales

### 📦 Cabbage Drive (Gestión de Archivos)
Un sistema completo de almacenamiento donde los usuarios pueden:
- **Subir** documentos directamente a la nube.
- **Listar** archivos con detalles de tamaño y fecha de modificación.
- **Descargar** sus activos de forma segura.
- **Eliminar** archivos para optimizar su espacio.

### 🛒 E-Commerce de Planes
Un módulo de ventas integrado para la adquisición de servicios:
- **Catálogo de Planes:** Diferentes niveles de almacenamiento (Seed, Sprout, Harvest).
- **Carrito de Compras:** Gestión de selección de planes y cálculo de totales en tiempo real.
- **Pasarela de Pago:** Simulación de proceso de pago seguro para la adquisición de servicios.

### 🤖 Inteligencia Artificial & UX
- **IA Recomendadora:** Un componente inteligente que analiza el perfil del usuario para sugerir el plan de almacenamiento ideal.
- **Accesibilidad Total:** Implementación de herramientas para diversidad funcional:
  - Ajuste dinámico de tamaño de fuente.
  - Modo de alto contraste.
  - Simulación de lector de voz.
- **Validaciones Avanzadas:** Uso de expresiones regulares (**RegEx**) para la validación de datos en el formulario de PQR.

---

## 🛠️ Guía de Instalación y Ejecución

Sigue estos pasos para desplegar la plataforma en tu entorno local:

### 1. Requisitos Previos
- Tener instalado y ejecutando [Docker Desktop](https://www.docker.com/products/docker-desktop/).

### 2. Despliegue del Sistema
Abre una terminal en la carpeta raíz del proyecto y ejecuta:

```bash
docker compose up --build
```

### 3. Configuración de Almacenamiento (Obligatorio)
Para que la aplicación pueda gestionar archivos, es necesario crear el bucket en MinIO:

1. Accede a la consola de MinIO: `http://localhost:9001`
2. Credenciales: 
   - **Usuario:** `admin_onedrive`
   - **Contraseña:** `password123`
3. Ve a **"Buckets"** $\rightarrow$ **"Create Bucket"**.
4. Nombre del Bucket: `mi-onedrive`

---

## 💻 Acceso a la Plataforma
Una vez desplegado el sistema, puedes acceder a los siguientes servicios:

- **Interfaz de Usuario (Frontend):** `http://localhost:5173`
- **API del Sistema (Backend):** `http://localhost:8000`
- **Panel de Control MinIO:** `http://localhost:9001`

---

## ❓ Solución de Problemas

### Conflicto de Contenedores
Si recibes un error de `Conflict. The container name is already in use`, ejecuta:
```bash
docker compose down
docker rm -f onedrive_minio
docker compose up --build
```

### Errores de Conexión
Asegúrate de que el puerto `8000` y `5173` no estén siendo utilizados por otras aplicaciones en tu sistema.
