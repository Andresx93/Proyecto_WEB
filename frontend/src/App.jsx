import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [files, setFiles] = useState([]);
  const [plans, setPlans] = useState([]);
  const [devs, setDevs] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState(null);
  const [fontSize, setFontSize] = useState(16);
  const [contrast, setContrast] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [pqrForm, setPqrForm] = useState({ nombre: '', correo: '', celular: '', mensaje: '' });

  const toggleFontSize = () => setFontSize(prev => prev === 16 ? 20 : 16);
  const toggleContrast = () => setContrast(!contrast);

  const fetchFiles = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/files');
      const data = await response.json();
      setFiles(data.archivos || []);
    } catch (error) {
      console.error("Error al obtener archivos:", error);
    }
  };

  const fetchPlans = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/plans');
      const data = await response.json();
      setPlans(data.planes || []);
    } catch (error) {
      console.error("Error al obtener planes:", error);
    }
  };

  const fetchDevs = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/devs');
      const data = await response.json();
      setDevs(data.desarrolladores || []);
    } catch (error) {
      console.error("Error al obtener desarrolladores:", error);
    }
  };

  useEffect(() => {
    fetchFiles();
    fetchPlans();
    fetchDevs();
  }, []);

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
      if (response.ok) fetchFiles();
    } catch (error) {
      console.error("Error al subir:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (filename) => {
    window.location.href = `http://localhost:8000/api/files/${filename}`;
  };

  const handleDelete = async (filename) => {
    if (!window.confirm(`¿Estás seguro de que deseas eliminar ${filename}?`)) return;
    try {
      const response = await fetch(`http://localhost:8000/api/files/${filename}`, {
        method: 'DELETE',
      });
      if (response.ok) fetchFiles();
    } catch (error) {
      console.error("Error al eliminar:", error);
    }
  };

  const addToCart = (plan) => {
    setCart([...cart, plan]);
    alert(`${plan.nombre} añadido al carrito`);
  };

  const removeFromCart = (index) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
  };

  const handlePayment = () => {
    alert("✅ ¡Pago procesado exitosamente! Bienvenido a Cabbage Cloud.");
    setCart([]);
    setShowCheckout(false);
  };

  const recommendPlan = () => {
    const options = ["Estudiante", "Emprendedor", "Empresa"];
    const choice = prompt(`Selecciona tu perfil:\n1. ${options[0]}\n2. ${options[1]}\n3. ${options[2]}`);
    if (choice === '1') alert(" la IA recomienda: Seed Plan (Gratis) - Perfecto para tus estudios.");
    else if (choice === '2') alert(" la IA recomienda: Sprout Plan (1 TB) - Ideal para hacer crecer tu negocio.");
    else if (choice === '3') alert(" la IA recomienda: Harvest Plan (Ilimitado) - Potencia total para tu empresa.");
    else alert("Por favor elige una opción válida (1, 2 o 3).");
  };

  const handlePqrSubmit = (e) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?(\d{1,3})?[- .]?(\d{10})[- .]?$/;
    if (!emailRegex.test(pqrForm.correo)) {
      alert("Por favor ingresa un correo electrónico válido.");
      return;
    }
    if (!phoneRegex.test(pqrForm.celular)) {
      alert("Por favor ingresa un celular válido (10 dígitos).");
      return;
    }
    alert("✅ Tu solicitud PQR ha sido enviada exitosamente.");
    setPqrForm({ nombre: '', correo: '', celular: '', mensaje: '' });
  };

  const total = cart.reduce((sum, p) => sum + p.precio, 0);

  return (
    <div className="app-container" style={{ fontSize: `${fontSize}px`, filter: contrast ? 'contrast(150%)' : 'none' }}>
      <div className="accessibility-bar">
        <button className="acc-btn" onClick={toggleFontSize}>Aumentar Texto</button>
        <button className="acc-btn" onClick={toggleContrast}>Alto Contraste</button>
        <button className="acc-btn" onClick={() => alert('Lector de voz activado (Simulación)')}>Lector de Voz</button>
      </div>

      <header>
        <div className="nav-links">
          <a href="#inicio">Inicio</a>
          <a href="#servicios">Planes</a>
          <a href="#drive">Mi Nube</a>
          <a href="#contacto">Contacto</a>
          <a href="#nosotros">Nosotros</a>
        </div>
        <div className="logo-container">
          <img src="/src/assets/logo.png" alt="Cabbage Cloud Logo" className="main-logo" onError={(e) => e.target.style.display='none'} />
          <h1>Cabbage Cloud</h1>
        </div>
        <p>Sowing the seeds of your digital future</p>
      </header>

      <section id="inicio" className="slide-container">
        <div className="slide-content">
          <p>🚀 Almacenamiento Seguro e Ilimitado</p>
        </div>
      </section>

      <section className="accordion">
        <div className="accordion-item">
          <div className="accordion-header" onClick={() => setActiveAccordion(activeAccordion === 'mision' ? null : 'mision')}>
            <span>Nuestra Misión</span>
            <span>{activeAccordion === 'mision' ? '▲' : '▼'}</span>
          </div>
          <div className={`accordion-body ${activeAccordion === 'mision' ? 'active' : ''}`}>
            Liderar la transformación digital mediante soluciones de almacenamiento en la nube sostenibles y accesibles para todos los emprendedores.
          </div>
        </div>
        <div className="accordion-item">
          <div className="accordion-header" onClick={() => setActiveAccordion(activeAccordion === 'vision' ? null : 'vision')}>
            <span>Nuestra Visión</span>
            <span>{activeAccordion === 'vision' ? '▲' : '▼'}</span>
          </div>
          <div className={`accordion-body ${activeAccordion === 'vision' ? 'active' : ''}`}>
            Ser para el año 2030 la infraestructura de nube más confiable y ecológica de la región, impulsando el crecimiento de miles de empresas.
          </div>
        </div>
        <div className="accordion-item">
          <div className="accordion-header" onClick={() => setActiveAccordion(activeAccordion === 'objetivos' ? null : 'objetivos')}>
            <span>Objetivos</span>
            <span>{activeAccordion === 'objetivos' ? '▲' : '▼'}</span>
          </div>
          <div className={`accordion-body ${activeAccordion === 'objetivos' ? 'active' : ''}`}>
            Garantizar disponibilidad del 99.9% de los datos, implementar IA para la gestión de archivos y reducir la huella de carbono de nuestros centros de datos.
          </div>
        </div>
      </section>

      <section id="servicios" className="plans-section">
        <h2>📦 Planes de Almacenamiento</h2>
        <button className="ai-recommend-btn" onClick={recommendPlan}>🤖 IA: Ayúdame a elegir un plan</button>
        <div className="plans-grid">
          {plans.map(plan => (
            <div key={plan.id} className="plan-card">
              <div>
                <h3>{plan.nombre}</h3>
                <p>{plan.descripcion}</p>
                <div className="plan-price">${plan.precio} <span style={{fontSize: '1rem'}}>{plan.capacidad}</span></div>
              </div>
              <button className="btn-add-cart" onClick={() => addToCart(plan)}>Añadir al Carrito</button>
            </div>
          ))}
        </div>
      </section>

      {cart.length > 0 && (
        <section className="cart-section">
          <h2>🛒 Tu Carrito de Compras</h2>
          {cart.map((item, index) => (
            <div key={index} className="cart-item">
              <span>{item.nombre} - ${item.precio}</span>
              <button onClick={() => removeFromCart(index)} style={{color: 'red', cursor: 'pointer', border: 'none', background: 'none'}}>❌</button>
            </div>
          ))}
          <div style={{ textAlign: 'right', fontWeight: 'bold', fontSize: '1.2rem', marginTop: '1rem' }}>
            Total: ${total.toFixed(2)}
          </div>
          <button className="btn-checkout" onClick={() => setShowCheckout(true)}>Proceder al Pago</button>
        </section>
      )}

      {showCheckout && (
        <div className="cart-section" style={{ borderColor: '#2e7d32', border: '2px solid' }}>
          <h2>💳 Pasarela de Pago (Ficticia)</h2>
          <p>Estás adquiriendo planes por un total de: <strong style={{fontSize: '1.2rem'}}>${total.toFixed(2)}</strong></p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', textAlign: 'left' }}>
            <label>Número de Tarjeta: <input type="text" placeholder="XXXX XXXX XXXX XXXX" style={{width: '100%', padding: '8px', marginTop: '5px'}} /></label>
            <label>Vencimiento: <input type="text" placeholder="MM/AA" style={{width: '100%', padding: '8px', marginTop: '5px'}} /></label>
            <label>CVV: <input type="text" placeholder="123" style={{width: '100%', padding: '8px', marginTop: '5px'}} /></label>
          </div>
          <button className="btn-checkout" onClick={handlePayment}>Confirmar Pago</button>
          <button onClick={() => setShowCheckout(false)} style={{marginTop: '10px', background: 'none', border: 'none', cursor: 'pointer', width: '100%'}}>Cancelar</button>
        </div>
      )}

      <section id="drive" className="cloud-section">
        <h2 style={{textAlign: 'center'}}>☁️ Cabbage Drive - Panel de Usuario</h2>
        <div className="upload-section">
          <label className="upload-btn">
            {loading ? "Subiendo archivo..." : "Subir nuevo documento"}
            <input type="file" onChange={handleUpload} disabled={loading} hidden />
          </label>
        </div>
        <table className="files-table">
          <thead>
            <tr>
              <th>Nombre del Documento</th>
              <th>Tamaño (Bytes)</th>
              <th>Fecha de Modificación</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {files.map((file, index) => (
              <tr key={index}>
                <td style={{ fontWeight: 'bold' }}>{file.nombre}</td>
                <td>{file.tamaño_bytes}</td>
                <td>{new Date(file.fecha_modificacion).toLocaleString()}</td>
                <td>
                  <button onClick={() => handleDownload(file.nombre)} className="btn-download">Descargar</button>
                  <button onClick={() => handleDelete(file.nombre)} className="btn-delete">Eliminar</button>
                </td>
              </tr>
            ))}
            {files.length === 0 && (
              <tr>
                <td colSpan="4" className="empty-state" style={{textAlign: 'center', padding: '20px'}}>No hay archivos en tu nube. ¡Sube el primero!</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      <section id="contacto" className="contact-section">
        <div className="pqr-form">
          <h2>📩 Formulario de PQR</h2>
          <form onSubmit={handlePqrSubmit}>
            <label>Nombre Completo:</label>
            <input type="text" value={pqrForm.nombre} onChange={(e) => setPqrForm({...pqrForm, nombre: e.target.value})} required />
            <label>Correo Electrónico:</label>
            <input type="email" value={pqrForm.correo} onChange={(e) => setPqrForm({...pqrForm, correo: e.target.value})} required />
            <label>Celular:</label>
            <input type="text" value={pqrForm.celular} onChange={(e) => setPqrForm({...pqrForm, celular: e.target.value})} required />
            <label>Mensaje:</label>
            <textarea rows="4" value={pqrForm.mensaje} onChange={(e) => setPqrForm({...pqrForm, mensaje: e.target.value})} required></textarea>
            <button type="submit" className="btn-submit-pqr">Enviar Solicitud</button>
          </form>
        </div>
        <div className="map-container">
          <h2>📍 Ubicación Central</h2>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3901.47286328463!2s-74.081747!3s4.60971!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNMKuTjYuMTA3NfC0yNC40OTQ4M1L!5e0!3m2!1ses!2scl!4v1633000000000"
            allowFullScreen=""
            loading="lazy">
          </iframe>
        </div>
      </section>

      <section id="nosotros" className="devs-section">
        <h2>👨‍💻 Nuestro Equipo</h2>
        <div className="devs-grid">
          {devs.map(dev => (
            <div key={dev.id} className="dev-card">
              <img src={dev.foto} alt={dev.nombre} className="dev-photo" />
              <div className="dev-name">{dev.nombre}</div>
              <div className="dev-role">{dev.rol}</div>
              <div className="dev-phone">{dev.celular}</div>
            </div>
          ))}
        </div>
      </section>

      <footer>
        <div className="social-links">
          <a href="https://instagram.com" target="_blank">Instagram</a>
          <a href="https://facebook.com" target="_blank">Facebook</a>
          <a href="https://wa.me/123456789" target="_blank">Whatsapp</a>
          <a href="https://linkedin.com" target="_blank">LinkedIn</a>
        </div>
        <p>© 2026 Cabbage Cloud - Todos los derechos reservados</p>
        <div className="privacy-text">
          <strong>Manejo de Datos Personales:</strong> Cabbage Cloud se compromete a proteger la privacidad de sus usuarios.
          Los datos recolectados a través de nuestros formularios de PQR y registros de usuario son utilizados exclusivamente
          para la prestación de servicios y soporte técnico, cumpliendo con las normativas vigentes de protección de datos.
        </div>
      </footer>
    </div>
  )
}

export default App;