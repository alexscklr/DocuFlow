
import { useState, useCallback, useEffect, useMemo } from 'react';
import { createProject, updateProject, deleteProject, getProjectsByOrganization, getProjectsByUserMembership, getProjectById } from '@/shared/lib';

/**
 * useProjects: Hook für Projekt-CRUD und State
 * 
 * @param {string|null} organizationId - ID der Organization oder null für alle User-Projekte
 * @param {Object} options - Optional: { organizations: [], userId: '' } - nur benötigt wenn organizationId === null
 * @returns {Object} { projects, loading, error, loadProjects, addProject, updateProject, deleteProject }
 * 
 * Verwendung:
 * - useProjects(orgId) - lädt Projekte einer spezifischen Organisation
 * - useProjects(null, { organizations, userId }) - lädt alle Projekte des Users (aus allen Orgs + direkte Mitgliedschaften)
 */
export function useProjects(organizationId, options = {}) {
	const [projects, setProjects] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	// Stabilize options to prevent unnecessary re-renders
	const stableOptions = useMemo(() => options, [options.organizations?.length, options.userId]);

	// Projekte laden - entweder für eine Org oder alle User-Projekte
	const loadProjects = useCallback(async () => {
		setLoading(true);
		setError(null);

		try {
			// Fall 1: Spezifische Organization
			if (organizationId) {
				const { data, error } = await getProjectsByOrganization(organizationId);
				if (!error) setProjects(data ?? []);
				setError(error);
				setLoading(false);
				return { data, error };
			}

			// Fall 2: Alle User-Projekte (organizationId === null)
			const { organizations = [], userId = null } = options;

			if (!userId) {
				setProjects([]);
				setLoading(false);
				return { data: [], error: null };
			}

			const combined = [];

			// 1) Alle Projekte aus User-Organizations
			if (organizations.length > 0) {
				for (const org of organizations) {
					const { data, error: orgError } = await getProjectsByOrganization(org.id);
					if (orgError) {
						console.error(`Error loading projects for org ${org.id}:`, orgError);
						continue;
					}
					if (data) combined.push(...data);
				}
			}

			// 2) Projekte mit direkter User-Mitgliedschaft
			const { data: memberProjects, error: memberError } = await getProjectsByUserMembership(userId);
			if (memberError) {
				console.error('Error loading projects by user membership:', memberError);
			} else if (memberProjects) {
				combined.push(...memberProjects);
			}

			// 3) Deduplizierung
			const uniqueById = [];
			const seen = new Set();
			for (const p of combined) {
				const id = p?.id;
				if (!id || seen.has(id)) continue;
				seen.add(id);
				uniqueById.push(p);
			}

			setProjects(uniqueById);
			setLoading(false);
			return { data: uniqueById, error: null };
		} catch (err) {
			console.error('Error in useProjects:', err);
			setError(err);
			setLoading(false);
			return { data: [], error: err };
		}
	}, [organizationId, stableOptions]);

	// Auto-load: When organizationId is null and we have userId/organizations
	useEffect(() => {
		if (organizationId === null && stableOptions.userId && stableOptions.organizations) {
			loadProjects();
		}
	}, [organizationId, stableOptions.userId, stableOptions.organizations, loadProjects]);

	// Projekt anlegen
	const addProjectHandler = useCallback(async (project) => {
		const { data, error } = await createProject({ ...project, organization_id: organizationId });
		if (!error) {
			if (data && data.id) {
				setProjects((prev) => [...prev, data]);
			} else {
				// Falls RPC kein vollständiges Objekt zurückliefert → neu laden
				await loadProjects();
			}
		}
		return { data, error };
	}, [organizationId, loadProjects]);

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

	// Projekt erhalten
	const getProjectByIdHandler = useCallback(async (projectId) => {
		if (!projectId) {
			return { data: null, error: null };
		}

		const { data, error } = await getProjectById(projectId);
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
		getProjectById: getProjectByIdHandler,
	};
}
