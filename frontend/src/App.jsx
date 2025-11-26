import React from 'react';
import './App.css'
import { Button } from './shared/components'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import AppDataProvider from '@/shared/context/AppDataContext'
import Main from './layout/main/Main'
import { AccessPage } from './pages/Access/AccessPage';
import { BackendTesting } from './testing/BackendTesting';
import { ProfilePage } from './pages/Profile/ProfilePage';
import ProjectsPage from '@/pages/projects/ProjectsPage';
import OrganizationsPage from '@/pages/Organizations/OrganizationsPage';
import viteLogo from '/vite.svg'


function ThemeSwitch() {
  // Default: light unless explicitly set to dark
  const [theme, setTheme] = React.useState(() =>
    document.body.classList.contains('dark') ? 'dark' : 'light'
  );
  React.useEffect(() => {
    document.body.classList.remove('light', 'dark');
    document.body.classList.add(theme);
  }, [theme]);
  return (
    <button
      className="fixed top-4 right-4 z-50 glass-btn"
      onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? '🌞 Light' : '🌙 Dark'}
    </button>
  );
}

function App() {
  return (
    <AppDataProvider>
      <Router>
        <ThemeSwitch />
        {/* Header */}
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/about" element={<Button icon={viteLogo} label="Back To Main" slug="/" />} />
          <Route path="/access" element={<AccessPage />} />
          <Route path="/testing" element={<BackendTesting />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/organization" element={<OrganizationsPage />} />
        </Routes>
        {/* Footer */}
      </Router>
    </AppDataProvider>
  );
}

export default App
