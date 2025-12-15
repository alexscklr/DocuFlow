import { useState, useEffect } from 'react';
import { useAppData } from '@/shared/context/AppDataContextBase';

export const ORGANIZATION_PROJECTS = [

  {
    id: "org-proj-2",
    name: "Project name",
    date: "XX.XX.20XX",
    description:
      "Description Description Description Description Description Description Description Description Description",
  },
  {
    id: "org-proj-3",
    name: "Project name",
    date: "XX.XX.20XX",
    description:
      "Description Description Description Description Description Description Description Description Description",
  },
  {
    id: "org-proj-4",
    name: "Project name",
    date: "XX.XX.20XX",
    description:
      "Description Description Description Description Description Description Description Description Description",
  },
  {
    id: "org-proj-5",
    name: "Project name",
    date: "XX.XX.20XX",
    description:
      "Description Description Description Description Description Description Description Description Description",
  },
  {
    id: "org-proj-6",
    name: "Project name",
    date: "XX.XX.20XX",
    description:
      "Description Description Description Description Description Description Description Description Description",
  },
];


export function OrganizationsPage() {
  const { addOrganization, updateOrganization, deleteOrganization, loadOrganizations } = useAppData();
  const [showForm, setShowForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [organizations, setOrganizations] = useState(ORGANIZATION_PROJECTS);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({ name: '', description: '' });
  const [deletingId, setDeletingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isLoadingOrganizations, setIsLoadingOrganizations] = useState(false);

  // Load organizations on component mount
  useEffect(() => {
    handleLoadOrganizations();
  }, []);

  const handleLoadOrganizations = async () => {
    setIsLoadingOrganizations(true);
    try {
      const res = await loadOrganizations();
      if (res && Array.isArray(res)) {
        setOrganizations(res);
      }
    } catch (error) {
      console.error('Error loading organizations:', error);
      // Keep current state if load fails
    } finally {
      setIsLoadingOrganizations(false);
    }
  };

  const handleAddClick = () => {
    setShowForm(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await addOrganization(formData);
      if (res) {
        // Add the new organization to the list
        setOrganizations(prev => [
          ...prev,
          {
            id: res.id || `org-${Date.now()}`,
            name: formData.name,
            date: new Date().toLocaleDateString('de-DE'),
            description: formData.description
          }
        ]);
        // Reset form
        setFormData({ name: '', description: '' });
        setShowForm(false);
      }
    } catch (error) {
      console.error('Error adding organization:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setFormData({ name: '', description: '' });
  };

  const handleEditClick = (org) => {
    setEditingId(org.id);
    setEditFormData({ name: org.name, description: org.description });
    setShowEditForm(true);
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await updateOrganization(editingId, editFormData);
      if (res) {
        // Update the organization in the list
        setOrganizations(prev =>
          prev.map(org =>
            org.id === editingId
              ? { ...org, name: editFormData.name, description: editFormData.description }
              : org
          )
        );
        // Reset form
        setEditingId(null);
        setEditFormData({ name: '', description: '' });
        setShowEditForm(false);
      }
    } catch (error) {
      console.error('Error updating organization:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditCancel = () => {
    setShowEditForm(false);
    setEditingId(null);
    setEditFormData({ name: '', description: '' });
  };

  const handleDeleteClick = (orgId) => {
    setDeletingId(orgId);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    setLoading(true);
    try {
      const res = await deleteOrganization(deletingId);
      if (res) {
        // Remove the organization from the list
        setOrganizations(prev => prev.filter(org => org.id !== deletingId));
        // Reset delete state
        setDeletingId(null);
        setShowDeleteConfirm(false);
      }
    } catch (error) {
      console.error('Error deleting organization:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
    setDeletingId(null);
  };

  return (
    <div className="h-screen text-[var(--color-text)]">
      {/* Header removed for this page (contained site title and Login button) */}

      <main
        className="
          px-4            /* mobile */
          md:px-8         /* tablet */
          xl:px-[250px]   /* desktop / FHD */
          py-[120px]
          space-y-10
        "
      >
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-4xl text-left font-semibold distance-bottom-sm">Organisation</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={handleLoadOrganizations}
              disabled={isLoadingOrganizations || loading}
              type="button"
              aria-label="Reload"
              className="w-10 h-10 border border-[var(--color-text)] rounded-full text-lg flex items-center justify-center hover:bg-[var(--color-text)]/10 transition-colors disabled:opacity-50"
              title="Reload organizations"
            >
              ↻
            </button>
            <button
              onClick={handleAddClick}
              type="button"
              aria-label="Add"
              className="w-14 h-14 border-2 border-[var(--color-text)] rounded-full text-3xl leading-none flex items-center justify-center hover:bg-[var(--color-text)]/10 transition-colors"
            >
              +
            </button>
          </div>
        </div>

        <hr className="border-white/20 distance-bottom-md" />

        <section className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {organizations.map((project) => (
            <article
              key={project.id}
              className="glass border border-[var(--color-text)]/30 rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <span
                    onClick={() => handleDeleteClick(project.id)}
                    className="w-6 h-6 border border-[var(--color-text)] rounded-full flex items-center justify-center text-xs cursor-pointer hover:bg-red-500/30 hover:border-red-500 transition-colors"
                  >
                    ✕
                  </span>
                  <span>{project.name}</span>
                </div>
                <span className="text-xs">{project.date}</span>
              </div>
              <p className="text-xs leading-relaxed text-[var(--color-text)]/80 mb-4">
                {project.description}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEditClick(project)}
                  className="flex-1 px-3 py-2 text-xs border border-[var(--color-text)]/30 rounded hover:bg-[var(--color-text)]/10 transition-colors"
                >
                  Edit
                </button>
              </div>
            </article>
          ))}
        </section>

        {/* Add Organization Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-[var(--color-bg)] border border-[var(--color-text)]/30 rounded-lg p-6 w-full max-w-md">
              <h2 className="text-2xl font-semibold mb-4">Add New Organization</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Organization Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-[var(--color-text)]/10 border border-[var(--color-text)]/30 rounded px-3 py-2 text-[var(--color-text)] placeholder-[var(--color-text)]/50 focus:outline-none focus:border-[var(--color-text)]/60"
                    placeholder="Enter organization name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-[var(--color-text)]/10 border border-[var(--color-text)]/30 rounded px-3 py-2 text-[var(--color-text)] placeholder-[var(--color-text)]/50 focus:outline-none focus:border-[var(--color-text)]/60 resize-none"
                    placeholder="Enter organization description"
                    rows="4"
                  />
                </div>
                <div className="flex gap-3 justify-end pt-4">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-4 py-2 border border-[var(--color-text)]/30 rounded hover:bg-[var(--color-text)]/10 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-[var(--color-text)]/20 border border-[var(--color-text)]/30 rounded hover:bg-[var(--color-text)]/30 transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Adding...' : 'Add Organization'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-[var(--color-bg)] border border-red-500/30 rounded-lg p-6 w-full max-w-sm">
              <h2 className="text-xl font-semibold mb-4 text-red-500">Delete Organization</h2>
              <p className="text-sm mb-6">Are you sure you want to delete this organization? This action cannot be undone.</p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={handleDeleteCancel}
                  disabled={loading}
                  className="px-4 py-2 border border-[var(--color-text)]/30 rounded hover:bg-[var(--color-text)]/10 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  disabled={loading}
                  className="px-4 py-2 bg-red-500/20 border border-red-500/30 rounded hover:bg-red-500/30 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Organization Form Modal */}
        {showEditForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-[var(--color-bg)] border border-[var(--color-text)]/30 rounded-lg p-6 w-full max-w-md">
              <h2 className="text-2xl font-semibold mb-4">Edit Organization</h2>
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Organization Name</label>
                  <input
                    type="text"
                    name="name"
                    value={editFormData.name}
                    onChange={handleEditInputChange}
                    required
                    className="w-full bg-[var(--color-text)]/10 border border-[var(--color-text)]/30 rounded px-3 py-2 text-[var(--color-text)] placeholder-[var(--color-text)]/50 focus:outline-none focus:border-[var(--color-text)]/60"
                    placeholder="Enter organization name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    name="description"
                    value={editFormData.description}
                    onChange={handleEditInputChange}
                    required
                    className="w-full bg-[var(--color-text)]/10 border border-[var(--color-text)]/30 rounded px-3 py-2 text-[var(--color-text)] placeholder-[var(--color-text)]/50 focus:outline-none focus:border-[var(--color-text)]/60 resize-none"
                    placeholder="Enter organization description"
                    rows="4"
                  />
                </div>
                <div className="flex gap-3 justify-end pt-4">
                  <button
                    type="button"
                    onClick={handleEditCancel}
                    className="px-4 py-2 border border-[var(--color-text)]/30 rounded hover:bg-[var(--color-text)]/10 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-[var(--color-text)]/20 border border-[var(--color-text)]/30 rounded hover:bg-[var(--color-text)]/30 transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Updating...' : 'Update Organization'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
