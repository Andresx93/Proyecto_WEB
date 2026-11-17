import { useState, useEffect, useRef } from 'react'
import logo from './assets/logo.png'
import './App.css'

const API = 'http://localhost:8000'

const SLIDES = [
  { titulo: 'Tus archivos, en capas y a salvo', texto: 'Cifrado y copias en cada capa, como las hojas de un repollo.', tono: '#2f6b4a' },
  { titulo: 'Seed: empieza sin pagar', texto: '100 GB gratis para siempre, sin tarjeta.', tono: '#4f8a3f' },
  { titulo: 'Sprout: crece con tu negocio', texto: '1 TB para emprendedores que ya cosechan clientes.', tono: '#7a2e6e' },
  { titulo: 'Harvest: potencia para empresas', texto: 'Capacidad ilimitada y disponibilidad del 99.9 %.', tono: '#1f4f5c' },
  { titulo: 'Centros de datos con menos huella', texto: 'Infraestructura pensada para gastar menos energía.', tono: '#5b6b1f' },
]

const PERFILES = [
  { id: 'est', label: 'Estudiante', res: 'Seed Plan (100 GB, gratis): suficiente para tus trabajos y apuntes.' },
  { id: 'emp', label: 'Emprendedor', res: 'Sprout Plan (1 TB): espacio para crecer sin pensar en el límite.' },
  { id: 'org', label: 'Empresa', res: 'Harvest Plan (ilimitado): equipos grandes y disponibilidad alta.' },
]

const ACORDEON = [
  { id: 'mision', t: 'Nuestra misión', c: 'Liderar la transformación digital con almacenamiento en la nube sostenible y accesible para todos los emprendedores.' },
  { id: 'vision', t: 'Nuestra visión', c: 'Ser para 2030 la infraestructura de nube más confiable y ecológica de la región, impulsando a miles de empresas.' },
  { id: 'objetivos', t: 'Objetivos', c: 'Garantizar 99.9 % de disponibilidad, usar IA para gestionar archivos y reducir la huella de carbono de nuestros centros de datos.' },
]

function Cabbage() {
  return (
    <svg viewBox="0 0 200 200" className="cabbage" aria-hidden="true">
      <circle cx="100" cy="100" r="92" fill="#cfe3bd" />
      <circle cx="100" cy="100" r="74" fill="none" stroke="#2f6b4a" strokeWidth="3" />
      <path d="M100 100 C 60 90, 50 50, 100 30 C 150 50, 140 90, 100 100Z" fill="#8fbf7a" />
      <circle cx="100" cy="100" r="54" fill="none" stroke="#7a2e6e" strokeWidth="2" strokeDasharray="6 8" />
      <circle cx="100" cy="100" r="34" fill="#eef3e6" stroke="#17352a" strokeWidth="3" />
      <circle cx="100" cy="100" r="14" fill="#17352a" />
    </svg>
  )
}

function App() {
  const [files, setFiles] = useState([])
  const [plans, setPlans] = useState([])
  const [devs, setDevs] = useState([])
  const [cart, setCart] = useState([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(null)
  const [big, setBig] = useState(false)
  const [contrast, setContrast] = useState(false)
  const [reading, setReading] = useState(false)
  const [showCheckout, setShowCheckout] = useState(false)
  const [slide, setSlide] = useState(0)
  const [paused, setPaused] = useState(false)
  const [recomend, setRecomend] = useState(null)
  const [toast, setToast] = useState('')
  const [errs, setErrs] = useState({})
  const [pqr, setPqr] = useState({ nombre: '', correo: '', celular: '', mensaje: '' })
  const [pago, setPago] = useState({ tarjeta: '', venc: '', cvv: '' })
  const timer = useRef(null)

  const avisar = (m) => {
    setToast(m)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setToast(''), 4000)
  }

  const get = async (path, set, key, nombre) => {
    try {
      const r = await fetch(`${API}${path}`)
      const d = await r.json()
      set(d[key] || [])
    } catch (e) {
      console.error(`Error al obtener ${nombre}:`, e)
    }
  }
  const fetchFiles = () => get('/api/files', setFiles, 'archivos', 'archivos')

  useEffect(() => {
    fetchFiles()
    get('/api/plans', setPlans, 'planes', 'planes')
    get('/api/devs', setDevs, 'desarrolladores', 'desarrolladores')
  }, [])

  useEffect(() => {
    if (paused) return
    const id = setInterval(() => setSlide((s) => (s + 1) % SLIDES.length), 6000)
    return () => clearInterval(id)
  }, [paused])

  useEffect(() => {
    document.documentElement.style.setProperty('--fs', big ? '20px' : '16px')
    document.documentElement.style.fontSize = big ? '20px' : '16px'
    document.body.classList.toggle('hc', contrast)
  }, [big, contrast])

  const leer = () => {
    if (!('speechSynthesis' in window)) return avisar('Tu navegador no soporta lectura en voz alta.')
    if (reading) { window.speechSynthesis.cancel(); setReading(false); return }
    const u = new SpeechSynthesisUtterance(document.querySelector('main').innerText.slice(0, 1500))
    u.lang = 'es-CO'
    u.onend = () => setReading(false)
    window.speechSynthesis.speak(u)
    setReading(true)
  }

  const handleUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    const fd = new FormData()
    fd.append('file', file)
    setLoading(true)
    try {
      const r = await fetch(`${API}/api/upload`, { method: 'POST', body: fd })
      if (r.ok) { fetchFiles(); avisar(`${file.name} subido a tu nube.`) }
      else avisar('No se pudo subir el archivo. Revisa que el bucket exista en MinIO.')
    } catch { avisar('No hay conexión con el servidor. Verifica que el backend esté activo.') }
    finally { setLoading(false); e.target.value = '' }
  }

  const handleDelete = async (name) => {
    if (!window.confirm(`¿Eliminar ${name}? Esta acción no se puede deshacer.`)) return
    try {
      const r = await fetch(`${API}/api/files/${name}`, { method: 'DELETE' })
      if (r.ok) { fetchFiles(); avisar(`${name} eliminado.`) }
    } catch (e) { console.error('Error al eliminar:', e) }
  }

  const addToCart = (p) => { setCart([...cart, p]); avisar(`${p.nombre} añadido al carrito.`) }
  const removeFromCart = (i) => setCart(cart.filter((_, k) => k !== i))
  const total = cart.reduce((s, p) => s + p.precio, 0)

  const handlePayment = (e) => {
    e.preventDefault()
    const x = {}
    if (!/^\d{4} ?\d{4} ?\d{4} ?\d{4}$/.test(pago.tarjeta)) x.tarjeta = 'Escribe 16 dígitos, por ejemplo 4242 4242 4242 4242.'
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(pago.venc)) x.venc = 'Usa el formato MM/AA.'
    if (!/^\d{3,4}$/.test(pago.cvv)) x.cvv = 'Son 3 o 4 dígitos.'
    setErrs(x)
    if (Object.keys(x).length) return
    avisar('Pago procesado. Bienvenido a Cabbage Cloud.')
    setCart([]); setShowCheckout(false); setPago({ tarjeta: '', venc: '', cvv: '' })
  }

  const handlePqr = (e) => {
    e.preventDefault()
    const x = {}
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(pqr.correo)) x.correo = 'Escribe un correo válido, como nombre@dominio.com.'
    if (!/^\+?(\d{1,3})?[- .]?(\d{10})[- .]?$/.test(pqr.celular)) x.celular = 'Escribe un celular de 10 dígitos.'
    setErrs(x)
    if (Object.keys(x).length) return
    avisar('Tu solicitud PQR fue enviada. Te responderemos por correo.')
    setPqr({ nombre: '', correo: '', celular: '', mensaje: '' })
  }

  const campo = (id, label, value, onChange, props = {}) => (
    <div className="campo">
      <label htmlFor={id}>{label}</label>
      <input id={id} value={value} onChange={onChange} aria-invalid={!!errs[id]} aria-describedby={errs[id] ? `${id}-e` : undefined} {...props} />
      {errs[id] && <p className="error" id={`${id}-e`}>{errs[id]}</p>}
    </div>
  )

  return (
    <>
      <a className="saltar" href="#contenido">Saltar al contenido</a>
      <div className="acc-bar" role="group" aria-label="Opciones de accesibilidad">
        <button onClick={() => setBig(!big)} aria-pressed={big}>{big ? 'Texto normal' : 'Aumentar texto'}</button>
        <button onClick={() => setContrast(!contrast)} aria-pressed={contrast}>Alto contraste</button>
        <button onClick={leer} aria-pressed={reading}>{reading ? 'Detener lectura' : 'Lector de voz'}</button>
      </div>

      <header className="top">
        <a href="#inicio" className="marca">
          <img src={logo} alt="" width="44" height="44" onError={(e) => (e.target.style.display = 'none')} />
          <span>Cabbage Cloud</span>
        </a>
        <nav aria-label="Principal">
          <a href="#inicio">Inicio</a>
          <a href="#planes">Planes</a>
          <a href="#drive">Mi nube</a>
          <a href="#contacto">Contacto</a>
          <a href="#nosotros">Nosotros</a>
        </nav>
        <a href="#carrito" className="cart-pill">Carrito ({cart.length})</a>
      </header>

      <main id="contenido">
        <section id="inicio" className="hero">
          <div className="hero-copy">
            <h1>Tus datos, protegidos capa por capa.</h1>
            <p>Almacenamiento en la nube seguro y sostenible. Sube, descarga y comparte tus archivos desde un solo lugar.</p>
            <div className="hero-actions">
              <a className="btn primary" href="#planes">Ver planes</a>
              <a className="btn ghost" href="#drive">Ir a mi nube</a>
            </div>
          </div>
          <Cabbage />
        </section>

        <section className="slider" aria-roledescription="carrusel" aria-label="Novedades de Cabbage Cloud"
          onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
          {SLIDES.map((s, i) => (
            <article key={s.titulo} className={`slide ${i === slide ? 'on' : ''}`} style={{ '--tono': s.tono }}
              aria-hidden={i !== slide} aria-label={`Diapositiva ${i + 1} de ${SLIDES.length}`}>
              <svg viewBox="0 0 120 120" aria-hidden="true" className="slide-art">
                {[52, 40, 28, 16].map((r, k) => <circle key={r} cx="60" cy="60" r={r} fill="none" stroke="#fff" strokeOpacity={0.25 + k * 0.15} strokeWidth="3" />)}
              </svg>
              <div><h2>{s.titulo}</h2><p>{s.texto}</p></div>
            </article>
          ))}
          <div className="slider-ctl">
            <button onClick={() => setSlide((slide + SLIDES.length - 1) % SLIDES.length)} aria-label="Diapositiva anterior">‹</button>
            {SLIDES.map((s, i) => (
              <button key={s.titulo} className={i === slide ? 'dot on' : 'dot'} onClick={() => setSlide(i)} aria-label={`Ir a la diapositiva ${i + 1}`} aria-current={i === slide} />
            ))}
            <button onClick={() => setSlide((slide + 1) % SLIDES.length)} aria-label="Diapositiva siguiente">›</button>
            <button onClick={() => setPaused(!paused)} aria-pressed={paused}>{paused ? 'Reanudar' : 'Pausar'}</button>
          </div>
        </section>

        <section className="acordeon" aria-label="Sobre la empresa">
          {ACORDEON.map((a) => (
            <div key={a.id} className="ac-item">
              <h2><button className="ac-head" aria-expanded={open === a.id} aria-controls={`ac-${a.id}`} onClick={() => setOpen(open === a.id ? null : a.id)}>
                {a.t}<span aria-hidden="true">{open === a.id ? '−' : '+'}</span>
              </button></h2>
              <div id={`ac-${a.id}`} role="region" hidden={open !== a.id} className="ac-body">{a.c}</div>
            </div>
          ))}
        </section>

        <section id="planes" className="bloque">
          <div className="bloque-head">
            <h2>Planes de almacenamiento</h2>
            <button className="btn ai" onClick={() => setRecomend(recomend ? null : { sel: null })}>Ayúdame a elegir un plan</button>
          </div>
          {recomend && (
            <div className="ia-panel" role="region" aria-label="Recomendador de planes con IA">
              <p>¿Cuál describe mejor tu uso?</p>
              <div className="ia-opts">
                {PERFILES.map((p) => <button key={p.id} className="btn ghost" onClick={() => setRecomend({ sel: p })}>{p.label}</button>)}
              </div>
              {recomend.sel && <p className="ia-res" aria-live="polite">Te recomendamos: {recomend.sel.res}</p>}
            </div>
          )}
          <div className="planes">
            {plans.length === 0 && <p className="vacio">No pudimos cargar los planes. Verifica que el backend esté activo en el puerto 8000.</p>}
            {plans.map((p, i) => (
              <article key={p.id} className={`plan ${i === 1 ? 'dest' : ''}`}>
                <h3>{p.nombre}</h3>
                <p className="plan-desc">{p.descripcion}</p>
                <p className="precio">{p.precio === 0 ? 'Gratis' : `$${p.precio}`}<small> {p.capacidad}</small></p>
                <button className="btn primary" onClick={() => addToCart(p)}>Añadir al carrito</button>
              </article>
            ))}
          </div>
        </section>

        <section id="carrito" className="bloque carrito" aria-live="polite">
          <h2>Tu carrito</h2>
          {cart.length === 0 ? <p className="vacio">Aún no tienes planes. Elige uno arriba para empezar.</p> : (
            <>
              <ul>
                {cart.map((it, i) => (
                  <li key={i}><span>{it.nombre}</span><span>${it.precio}</span>
                    <button className="link-btn" onClick={() => removeFromCart(i)} aria-label={`Quitar ${it.nombre}`}>Quitar</button></li>
                ))}
              </ul>
              <p className="total">Total: ${total.toFixed(2)}</p>
              {!showCheckout && <button className="btn primary" onClick={() => setShowCheckout(true)}>Proceder al pago</button>}
            </>
          )}
          {showCheckout && cart.length > 0 && (
            <form className="pago" onSubmit={handlePayment} noValidate>
              <h3>Pasarela de pago (ficticia)</h3>
              {campo('tarjeta', 'Número de tarjeta', pago.tarjeta, (e) => setPago({ ...pago, tarjeta: e.target.value }), { inputMode: 'numeric', placeholder: '4242 4242 4242 4242', autoComplete: 'off' })}
              <div className="fila">
                {campo('venc', 'Vencimiento', pago.venc, (e) => setPago({ ...pago, venc: e.target.value }), { placeholder: 'MM/AA', autoComplete: 'off' })}
                {campo('cvv', 'CVV', pago.cvv, (e) => setPago({ ...pago, cvv: e.target.value }), { inputMode: 'numeric', placeholder: '123', autoComplete: 'off' })}
              </div>
              <div className="hero-actions">
                <button type="submit" className="btn primary">Confirmar pago</button>
                <button type="button" className="btn ghost" onClick={() => setShowCheckout(false)}>Cancelar</button>
              </div>
            </form>
          )}
        </section>

        <section id="drive" className="bloque">
          <div className="bloque-head">
            <h2>Cabbage Drive</h2>
            <label className="btn primary">
              {loading ? 'Subiendo…' : 'Subir documento'}
              <input type="file" onChange={handleUpload} disabled={loading} hidden />
            </label>
          </div>
          <div className="tabla-wrap">
            <table>
              <caption className="sr">Archivos guardados en tu nube</caption>
              <thead><tr><th scope="col">Documento</th><th scope="col">Tamaño</th><th scope="col">Modificado</th><th scope="col">Acciones</th></tr></thead>
              <tbody>
                {files.map((f) => (
                  <tr key={f.nombre}>
                    <th scope="row">{f.nombre}</th>
                    <td data-label="Tamaño">{f.tamaño_bytes} bytes</td>
                    <td data-label="Modificado">{new Date(f.fecha_modificacion).toLocaleString('es-CO')}</td>
                    <td className="acciones">
                      <a className="btn ghost sm" href={`${API}/api/files/${encodeURIComponent(f.nombre)}`}>Descargar</a>
                      <button className="btn danger sm" onClick={() => handleDelete(f.nombre)}>Eliminar</button>
                    </td>
                  </tr>
                ))}
                {files.length === 0 && <tr><td colSpan="4" className="vacio">Tu nube está vacía. Sube tu primer documento.</td></tr>}
              </tbody>
            </table>
          </div>
        </section>

        <section id="contacto" className="bloque dos-col">
          <form onSubmit={handlePqr} noValidate className="pqr">
            <h2>Peticiones, quejas y reclamos</h2>
            {campo('nombre', 'Nombre completo', pqr.nombre, (e) => setPqr({ ...pqr, nombre: e.target.value }), { required: true, autoComplete: 'name' })}
            {campo('correo', 'Correo electrónico', pqr.correo, (e) => setPqr({ ...pqr, correo: e.target.value }), { type: 'email', required: true, autoComplete: 'email' })}
            {campo('celular', 'Celular', pqr.celular, (e) => setPqr({ ...pqr, celular: e.target.value }), { type: 'tel', required: true, autoComplete: 'tel', placeholder: '3001234567' })}
            <div className="campo">
              <label htmlFor="mensaje">Mensaje</label>
              <textarea id="mensaje" rows="4" required value={pqr.mensaje} onChange={(e) => setPqr({ ...pqr, mensaje: e.target.value })} />
            </div>
            <button type="submit" className="btn primary">Enviar solicitud</button>
          </form>
          <div className="mapa">
            <h2>Dónde estamos</h2>
            <iframe title="Ubicación de Cabbage Cloud en Google Maps" loading="lazy" allowFullScreen
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3901.47286328463!2d-74.081747!3d4.60971!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNMKwMzYnMzUuNCJOIDc0wrAwNCc1My4zIlc!5e0!3m2!1ses!2sco!4v1633000000000" />
          </div>
        </section>

        <section id="nosotros" className="bloque">
          <h2>Nuestro equipo</h2>
          <div className="equipo">
            {devs.map((d) => (
              <article key={d.id} className="dev">
                <img src={d.foto} alt={`Foto de ${d.nombre}`} width="88" height="88" />
                <h3>{d.nombre}</h3>
                <p>{d.rol}</p>
                <p className="tel">{d.celular}</p>
              </article>
            ))}
          </div>
        </section>
      </main>

      <footer>
        <nav aria-label="Redes sociales" className="redes">
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a>
          <a href="https://wa.me/123456789" target="_blank" rel="noopener noreferrer">WhatsApp</a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</a>
        </nav>
        <p className="privacidad"><strong>Manejo de datos personales.</strong> Usamos los datos de tus solicitudes PQR y de tu registro solo para prestarte el servicio y darte soporte técnico, conforme a la normativa de protección de datos vigente.</p>
        <p className="copy">© 2026 Cabbage Cloud. Todos los derechos reservados.</p>
      </footer>

      <div className="toast" role="status" aria-live="polite">{toast}</div>
    </>
  )
}

export default App
