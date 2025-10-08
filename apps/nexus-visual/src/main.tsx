import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

function App() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#0A0C10', 
      color: 'white', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem', color: '#00FFE7' }}>
          🎉 NEXUS VISUAL FUNCIONANDO! 🎉
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#B84DFF' }}>
          Sistema de Pixels Adaptativos
        </p>
        <div style={{ 
          marginTop: '2rem', 
          padding: '1rem', 
          backgroundColor: 'rgba(255,255,255,0.1)', 
          borderRadius: '10px',
          border: '1px solid rgba(255,255,255,0.2)'
        }}>
          <p>✅ React funcionando</p>
          <p>✅ Tailwind cargado</p>
          <p>✅ Framer Motion activo</p>
        </div>
      </div>
    </div>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)