import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GhostStudio } from './pages/GhostStudio'
import './styles/ghost.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GhostStudio />
  </StrictMode>,
)
