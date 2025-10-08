import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import TheGenerator from './pages/TheGenerator'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TheGenerator />} />
      </Routes>
    </Router>
  )
}

export default App
