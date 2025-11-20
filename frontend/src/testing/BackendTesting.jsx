import React, { useEffect, useState } from 'react';
import { useAppData } from '@/shared/context/AppDataContextBase';

export const BackendTesting = () => {

    // Organization creation form state
    const [formData, setformData] = useState({ name: '', description: '' });
    const [orgData, setOrgData] = useState(null);

    // Global app data (user, orgs, actions)
    const {
        user,
        organizations,
        loading,
        error,
        createOrganization: createOrgAction,
        refreshOrganizations,
    } = useAppData();
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { data, error } = await createOrgAction(formData.name, formData.description);
        if (!error) setOrgData(data);
    }

    useEffect(() => {
        console.log("Organization creation data:", orgData);
    }, [orgData]);


    // Fetch and display organizations
    // Initial/Manual fetch via context action
    const fetchOrganizations = async () => {
        const { data, error } = await refreshOrganizations();
        if (error) {
            console.error('Error fetching organizations:', error);
        } else {
            console.log('Fetched organizations:', data);
        }
    }

    return (
        <div>
            <h1>Testing Page</h1>

            <form onSubmit={handleSubmit} style={{ gap: '10px', display: 'flex', flexDirection: 'column', maxWidth: '500px', margin: 'auto' }}>
                <h2>Create Organization Test Page</h2>
                <input type="text" placeholder="Organization Name" value={formData.name} onChange={(e) => setformData({ ...formData, name: e.target.value })} />
                <br />
                <input type="text" placeholder="Organization Description" value={formData.description} onChange={(e) => setformData({ ...formData, description: e.target.value })} />
                <br />
                <button type="submit">Create Organization</button>
            </form>
            {orgData && (<div style={{ marginTop: '20px', border: '1px solid #ccc', padding: '10px' }}>
                <h2>Organization Created:</h2>
                <p style={{ color: 'green' }}>
                    Name: {orgData.name} <br />
                    Description: {orgData.description}
                </p>
            </div>)}

            <section>
                <h2>Get Organizations of User</h2>
                <button type="button" onClick={fetchOrganizations} disabled={loading}>Fetch Organizations {loading ? '…' : ''}</button>
                {error && <p style={{ color: 'red' }}>Error: {error.message}</p>}
                {!user && <p style={{ color: 'orange' }}>Bitte einloggen, um Organizations zu sehen.</p>}
                <ul>
                    {organizations.map((org) => (
                        <li key={org.id}>
                            {org.name} - {org.description}
                            {/* Add delete action for quick test */}
                            <DeleteOrgButton orgId={org.id} />
                        </li>
                    ))}
                </ul>
            </section>
        </div>
    );
}

// Small inline delete button using the global context action
function DeleteOrgButton({ orgId }) {
    const { deleteOrganization, loading } = useAppData();
    const [localLoading, setLocalLoading] = useState(false);
    const onDelete = async () => {
        setLocalLoading(true);
        const { error } = await deleteOrganization(orgId);
        if (error) {
            console.error('Delete failed:', error);
        }
        setLocalLoading(false);
    };
    return (
        <button type="button" onClick={onDelete} disabled={loading || localLoading} style={{ marginLeft: 8 }}>
            {localLoading ? 'Deleting…' : 'Delete'}
        </button>
    );
}