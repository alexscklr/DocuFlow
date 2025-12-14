import { useAppData } from '@/shared/context/AppDataContextBase';
import ProjectsPage from '../pages/projects/ProjectsPage';
import { OrganizationCreationForm } from './BackendTesting/OrganizationCreationForm';
import { OrganizationsList } from './BackendTesting/OrganizationsList';
import { ProjectCreationForm } from './BackendTesting/ProjectCreationForm';
import { ProjectsList } from './BackendTesting/ProjectsList';
import { MembersManagement } from './BackendTesting/MembersManagement';

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

    return (
        <div className="glass min-h-screen w-full flex flex-col items-center justify-start py-8 gap-6">
            <button onClick={async () => {
                console.log(user.email);
            }}>Klick me!</button>
            
            <h1 className="text-3xl font-bold mb-8">Testing Page</h1>

            <OrganizationCreationForm 
                addOrganization={addOrganization} 
                loading={loading} 
            />

            <OrganizationsList
                user={user}
                organizations={organizations}
                loading={loading}
                error={error}
                loadOrganizations={loadOrganizations}
                updateOrganization={updateOrganization}
                deleteOrganization={deleteOrganization}
            />

            <ProjectCreationForm 
                organizations={organizations}
                loading={loading}
            />

            <ProjectsList
                organizations={organizations}
                loading={loading}
            />

            <MembersManagement 
                organizations={organizations} 
                loading={loading} 
            />

            <ProjectsPage />
            {/* To test accepting invites from a link, mount this when an invitationId is available */}
            {/* <AcceptInvitation invitationId={someInvitationId} /> */}
        </div>
    );
}