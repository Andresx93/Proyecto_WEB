# 📋 Documento de Requerimientos - Proyecto Cabbage Cloud

Este documento detalla la ubicación exacta de cada uno de los requerimientos solicitados por el sensei dentro de la estructura del proyecto.

---

## 🚀 1. Backend (Lógica de Servidor y Datos)
**Ubicación principal:** `backend/main.py`

| Requerimiento | Implementación Técnica | Descripción |
| :--- | :--- | :--- |
| **Gestión de Archivos** | Endpoints `GET /api/files`, `POST /api/upload`, `DELETE` | Permite la subida, listado y eliminación de archivos en el sistema. |
| **Almacenamiento de Objetos** | Integración con **MinIO (S3 API)** | Uso de la librería `boto3` para gestionar el almacenamiento físico de los datos. |
| **Suministro de Información** | Endpoints `GET /api/plans` y `GET /api/devs` | Entrega de datos dinámicos sobre los planes de almacenamiento y el equipo de desarrollo. |

---

## 🎨 2. Frontend (Interfaz y Experiencia de Usuario)
**Ubicación principal:** `frontend/src/App.jsx` y `frontend/src/App.css`

| Requerimiento | Implementación Técnica | Descripción |
| :--- | :--- | :--- |
| **Lógica de Negocio** | Gestión de Estado en React | Implementación del carrito de compras y flujo de pasarela de pago. |
| **IA de Recomendación** | Algoritmo de Sugerencia | Lógica que analiza las necesidades del usuario para recomendar el plan de almacenamiento más apto. |
| **Validación de Formularios** | **Expresiones Regulares (RegEx)** | Validaciones estrictas en el formulario de PQR para asegurar la integridad de los datos ingresados. |
| **Accesibilidad (A11y)** | Estados de Contraste y Tipografía | Funcionalidades para cambiar el contraste y el tamaño de letra, cumpliendo estándares de inclusión. |
| **Diseño Responsivo** | Media Queries en CSS | Interfaz adaptable a diferentes dispositivos (móviles, tablets, desktop) mediante `App.css`. |

---

## 🐳 3. Infraestructura y Despliegue
**Ubicación principal:** Archivos de configuración en la raíz del proyecto

| Requerimiento | Archivo | Descripción |
| :--- | :--- | :--- |
| **Contenerización** | `backend/Dockerfile` y `frontend/Dockerfile` | Creación de imágenes aisladas para asegurar que el entorno sea idéntico en cualquier máquina. |
| **Orquestación de Servicios** | `docker-compose.yml` | Configuración de la red y volúmenes para que el Frontend, Backend y MinIO se comuniquen automáticamente. |
| **Documentación Técnica** | `README.md` y `MAPA_DEL_PROYECTO.md` | Guías paso a paso para la instalación, ejecución y comprensión de la arquitectura. |

---
**Fecha de generación:** 2026-10-24
**Proyecto:** Cabbage Cloud
