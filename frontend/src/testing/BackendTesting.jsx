import { useAppData } from '@/shared/context/AppDataContextBase';
import { useState } from 'react';
import ProjectsPage from '../pages/projects/ProjectsPage';
import { OrganizationCreationForm } from './BackendTesting/OrganizationCreationForm';
import { OrganizationsList } from './BackendTesting/OrganizationsList';
import { ProjectCreationForm } from './BackendTesting/ProjectCreationForm';
import { ProjectsList } from './BackendTesting/ProjectsList';
import { MembersManagement } from './BackendTesting/MembersManagement';
import { ProfileTesting } from './BackendTesting/ProfileTesting';

export const BackendTesting = () => {
    const {
        user,
        organizations,
        loading,
        error,
        addOrganization,
        updateOrganization,
        deleteOrganization,
        loadOrganizations,
    } = useAppData();

    const [expandedSections, setExpandedSections] = useState({
        organizations: true,
        organizationsList: true,
        projects: true,
        projectsList: true,
        members: true,
        profile: true,
    });

    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const CollapsibleSection = ({ title, section, children }) => (
        <div className="border border-[var(--border)] rounded-lg overflow-hidden">
            <button
                onClick={() => toggleSection(section)}
                className="w-full flex items-center justify-between bg-[var(--bg-secondary)] p-4 hover:bg-[var(--bg-tertiary)] transition-colors"
            >
                <h2 className="text-lg font-semibold text-[var(--text-primary)]">{title}</h2>
                <span className="text-xl font-bold text-[var(--accent)]">
                    {expandedSections[section] ? '−' : '+'}
                </span>
            </button>
            {expandedSections[section] && (
                <div className="p-4 bg-[var(--bg-primary)]">
                    {children}
                </div>
            )}
        </div>
    );

    return (
        <div className="glass min-h-screen w-full flex flex-col items-center justify-start py-8 gap-6">
            <div className="w-4/5 flex flex-col gap-6">
                <h1 className="text-3xl font-bold mb-8">Testing Page</h1>

                <CollapsibleSection title="Organization erstellen" section="organizations">
                    <OrganizationCreationForm 
                        addOrganization={addOrganization} 
                        loading={loading} 
                    />
                </CollapsibleSection>

                <CollapsibleSection title="Organisationen" section="organizationsList">
                    <OrganizationsList
                        user={user}
                        organizations={organizations}
                        loading={loading}
                        error={error}
                        loadOrganizations={loadOrganizations}
                        updateOrganization={updateOrganization}
                        deleteOrganization={deleteOrganization}
                    />
                </CollapsibleSection>

                <hr className='w-full'/>

                <CollapsibleSection title="Projekt erstellen" section="projects">
                    <ProjectCreationForm 
                        organizations={organizations}
                        loading={loading}
                    />
                </CollapsibleSection>

                <CollapsibleSection title="Projekte" section="projectsList">
                    <ProjectsList
                        organizations={organizations}
                        loading={loading}
                    />
                </CollapsibleSection>

                <CollapsibleSection title="Mitglieder" section="members">
                    <MembersManagement 
                        organizations={organizations} 
                        loading={loading} 
                    />
                </CollapsibleSection>

                <CollapsibleSection title="Profil" section="profile">
                    <ProfileTesting user={user} />
                </CollapsibleSection>
            </div>
        </div>
    );
}