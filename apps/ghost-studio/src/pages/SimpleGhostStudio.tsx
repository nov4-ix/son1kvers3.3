// src/pages/SimpleGhostStudio.tsx
import { SimpleDebug } from '../components/SimpleDebug';

export function SimpleGhostStudio() {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0A0C10',
      color: 'white',
      padding: '20px'
    }}>
      <SimpleDebug />
      
      <h1 style={{
        fontSize: '2rem',
        fontWeight: 'bold',
        background: 'linear-gradient(135deg, #00FFE7, #B84DFF)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        marginBottom: '20px'
      }}>
        Ghost Studio
      </h1>
      
      <p style={{ color: '#ffffff70', marginBottom: '30px' }}>
        AI-Powered Music Production
      </p>
      
      <div style={{
        backgroundColor: 'rgba(255,255,255,0.05)',
        padding: '20px',
        borderRadius: '10px',
        border: '1px solid rgba(255,255,255,0.1)'
      }}>
        <h2 style={{ marginBottom: '10px' }}>Test Component</h2>
        <p>Si puedes ver esto, React está funcionando correctamente.</p>
        <button 
          onClick={() => alert('¡Funciona!')}
          style={{
            backgroundColor: '#00FFE7',
            color: '#0A0C10',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            marginTop: '10px'
          }}
        >
          Test Button
        </button>
      </div>
    </div>
  );
}
