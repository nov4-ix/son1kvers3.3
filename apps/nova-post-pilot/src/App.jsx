import React from 'react'
import { Routes, Route } from 'react-router-dom'
import NovaPostPilot from './pages/NovaPostPilot'

function App() {
  return (
    <Routes>
      <Route path="/" element={<NovaPostPilot />} />
    </Routes>
  )
}

export default App