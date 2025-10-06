import React from 'react'
import { Routes, Route } from 'react-router-dom'
import CloneStation from './pages/CloneStation'

function App() {
  return (
    <Routes>
      <Route path="/" element={<CloneStation />} />
    </Routes>
  )
}

export default App