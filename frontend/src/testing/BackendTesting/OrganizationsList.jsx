import { OrganizationRow } from './OrganizationRow';

export function OrganizationsList({ 
  user, 
  organizations, 
  loading, 
  error, 
  loadOrganizations, 
  updateOrganization, 
  deleteOrganization 
}) {
  const fetchOrganizations = async () => {
    const { data, error } = await loadOrganizations();
    if (error) {
      console.error('Error fetching organizations:', error);
    } else {
      console.log('Fetched organizations:', data);
    }
  };

  return (
    <section className="glass p-6 w-stretch flex flex-col gap-6">
      <h2 className="text-xl font-semibold mb-2">Get Organizations of User</h2>
      <button
        type="button"
        onClick={fetchOrganizations}
        disabled={loading}
        className="glass glass-btn"
      >
        Fetch Organizations {loading ? '…' : '⟳'}
      </button>
      {error && <p className="text-[var(--danger)] mb-2">Error: {error.message}</p>}
      {!user && <p className="text-[var(--warning)] mb-2">Bitte einloggen, um Organizations zu sehen.</p>}
      <ul className="space-y-2">
        {organizations.map((org) => (
          <OrganizationRow
            key={org.id}
            org={org}
            onUpdate={updateOrganization}
            onDelete={deleteOrganization}
            globalLoading={loading}
          />
        ))}
      </ul>
    </section>
  );
}
