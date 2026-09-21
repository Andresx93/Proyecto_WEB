import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  // Función para consultar los archivos al backend
  const fetchFiles = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/files');
      const data = await response.json();
      setFiles(data.archivos || []);
    } catch (error) {
      console.error("Error al obtener archivos:", error);
    }
  };

  // Se ejecuta automáticamente al cargar la página
  useEffect(() => {
    fetchFiles();
  }, []);

  // Función para subir un archivo cuando el usuario lo selecciona
  const handleUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (response.ok) {
        fetchFiles(); // Recarga la tabla de archivos automáticamente
      }
    } catch (error) {
      console.error("Error al subir:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="app-container">
    <header>
        <h1>Mi OneDrive Local</h1>
        <p>Almacenamiento seguro impulsado por Docker y MinIO</p>
      </header>
      
      
      
      <section className="upload-section">
        <label className="upload-btn">
          {loading ? "Subiendo archivo..." : "Seleccionar y Subir Archivo"}
          <input type="file" onChange={handleUpload} disabled={loading} hidden />
        </label>
      </section>

      <section className="files-section">
        <h2>Archivos en la nube</h2>
        <table className="files-table">
          <thead>
            <tr>
              <th>Nombre del Documento</th>
              <th>Tamaño (Bytes)</th>
              <th>Fecha de Modificación</th>
            </tr>
          </thead>
          <tbody>
            {files.map((file, index) => (
              <tr key={index}>
                <td><strong>{file.nombre}</strong></td>
                <td>{file.tamaño_bytes}</td>
                <td>{new Date(file.fecha_modificacion).toLocaleString()}</td>
              </tr>
            ))}
            {files.length === 0 && (
              <tr>
                <td colSpan="3" className="empty-state">No hay archivos en tu nube. ¡Sube el primero!</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </main>
  )
}

export default App;