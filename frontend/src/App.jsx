
import './App.css'
import { Button } from './shared/components'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import AppDataProvider from '@/shared/context/AppDataContext'
import Main from './layout/main/Main'
import { AccessPage } from './pages/Access/AccessPage';
import { BackendTesting } from './testing/BackendTesting';
import ProjectsPage from '@/pages/projects/ProjectsPage';

import viteLogo from '/vite.svg'

function App() {

  return (
    <AppDataProvider>
      <Router>
        {/* Header */}

        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/about" element={<Button icon={viteLogo} label="Back To Main" slug="/" />} />
          <Route path="/access" element={<AccessPage />} />
         <Route path="/testing" element={<BackendTesting />} />
         <Route path="/projects" element={<ProjectsPage />} />
        </Routes>

        {/* Footer */}
      </Router>
    </AppDataProvider>
  )
}

export default App