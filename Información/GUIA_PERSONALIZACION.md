# 🛠️ GUÍA DE PERSONALIZACIÓN - CABBAGE CLOUD

Utiliza esta guía para adaptar la información del proyecto a los datos reales de tu grupo y empresa.

## 1. Datos del Equipo (Integrantes)
**Archivo:** `backend/main.py`
**Sección:** Busca la lista `DESARROLLADORES` (al inicio del archivo).
- **Qué cambiar:** Modifica los campos `nombre`, `rol` y `celular`.
- **Fotos:** En el campo `foto`, puedes poner una URL de una imagen en la nube o la ruta de una imagen local.

## 2. Planes de Almacenamiento y Precios
**Archivo:** `backend/main.py`
**Sección:** Busca la lista `PLANES_ALMACENAMIENTO`.
- **Qué cambiar:** Puedes modificar los nombres de los planes (ej. "Plan Básico"), la capacidad (ej. "500 GB") y el precio.

## 3. Ubicación Geográfica (Google Maps)
**Archivo:** `frontend/src/App.jsx`
**Sección:** Busca la etiqueta `<iframe>` dentro de la sección `id="contacto"`.
- **Cómo cambiarlo:** 
  1. Ve a Google Maps y busca tu ubicación.
  2. Haz clic en "Compartir" $\rightarrow$ "Insertar mapa".
  3. Copia solo la URL que está dentro de `src="..."`.
  4. Pégala en el código reemplazando la URL actual.

## 4. Redes Sociales
**Archivo:** `frontend/src/App.jsx`
**Sección:** Busca el `<footer>` al final del archivo.
- **Qué cambiar:** Reemplaza los links genéricos (`https://instagram.com`, etc.) por los links reales de los perfiles de la empresa.

## 5. Identidad Visual (Logo)
**Acción:** Coloca tu imagen final en la ruta `frontend/src/assets/logo.png`. 
*Asegúrate de que el nombre del archivo sea exactamente `logo.png`.*
