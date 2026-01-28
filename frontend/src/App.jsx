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
import ProjectPage from '@/pages/Project/ProjectPage';
import { OrganizationsPage } from '@/pages/Organizations/OrganizationsPage';
import { MembersPage } from '@/pages/Members/Members';
import { DocumentsPage } from '@/pages/DocumentsPage/DocumentsPage';
import AcceptInvitation from './testing/AcceptInvite';
import Header from './layout/header/Header';


function ThemeSwitch() {
  // Default: dark
  const [theme, setTheme] = React.useState(() => document.body.classList.contains('light') ? 'light' : 'dark');
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
        {/*<ThemeSwitch />*/}
        <Header />
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/access" element={<AccessPage />} />
          <Route path="/testing" element={<BackendTesting />} />
          <Route path="/invite" element={<AcceptInvitation />} />
          <Route path="/organizations" element={<OrganizationsPage />} />
          <Route path="/members" element={<MembersPage />} />
          <Route path="/documents" element={<DocumentsPage />} />
          <Route path="/profile/:profileId" element={<ProfilePage />} />
          <Route path="/organizations/:orgId/projects" element={<ProjectsPage />} />
          <Route path="/organizations/:orgId/projects/:projectId" element={<ProjectPage />} />
          <Route path="/organizations/:orgId/projects/:projectId/documents/:documentId" element={<DocumentsPage />} />
        </Routes>
        {/* Footer */}
      </Router>
    </AppDataProvider>
  );
}

export default App