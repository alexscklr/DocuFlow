
import { useState, useCallback } from 'react';
import { createProject, updateProject, deleteProject, getProjectsByOrganization } from '@/shared/lib';

// useProjects: Hook für Projekt-CRUD und State pro Organization
export function useProjects(organizationId) {
	const [projects, setProjects] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	// Projekte für Organization laden
	const loadProjects = useCallback(async () => {
		setLoading(true);
		setError(null);
		const { data, error } = await getProjectsByOrganization(organizationId);
		if (!error) setProjects(data ?? []);
		setError(error);
		setLoading(false);
		return { data, error };
	}, [organizationId]);

	// Projekt anlegen
	const addProjectHandler = useCallback(async (project) => {
		const { data, error } = await createProject({ ...project, organization_id: organizationId });
		if (!error) setProjects((prev) => [...prev, data]);
		return { data, error };
	}, [organizationId]);

	// Projekt aktualisieren
	const updateProjectHandler = useCallback(async (projectId, updates) => {
		const { data, error } = await updateProject(projectId, updates);
		if (!error) setProjects((prev) => prev.map((p) => (p.id === projectId ? { ...p, ...updates } : p)));
		return { data, error };
	}, []);

	// Projekt löschen
	const deleteProjectHandler = useCallback(async (projectId) => {
		const { data, error } = await deleteProject(projectId);
		if (!error) setProjects((prev) => prev.filter((p) => p.id !== projectId));
		return { data, error };
	}, []);

	return {
		projects,
		loading,
		error,
		loadProjects,
		addProject: addProjectHandler,
		updateProject: updateProjectHandler,
		deleteProject: deleteProjectHandler,
	};
}
