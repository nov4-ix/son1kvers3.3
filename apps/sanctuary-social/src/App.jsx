import React from 'react'
import { Routes, Route } from 'react-router-dom'
import SanctuarySocial from './pages/SanctuarySocial'

function App() {
  return (
    <Routes>
      <Route path="/" element={<SanctuarySocial />} />
    </Routes>
  )
}

export default App