import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Playground } from '@/pages/Playground'
import './styles/pixels.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Playground />
  </StrictMode>,
)