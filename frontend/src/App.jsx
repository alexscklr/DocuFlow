
import './App.css'
import { Button } from './shared/components'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Main from './layout/main/Main'
import { AccessPage } from './pages/Access/AccessPage';

import viteLogo from '/vite.svg'

function App() {

  return (
    <Router>
      {/* Header */}

      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/about" element={<Button icon={viteLogo} label="Back To Main" slug="/" />} />
        <Route path="/access" element={<AccessPage />} />
      </Routes>

      {/* Footer */}
    </Router>
  )
}

export default App