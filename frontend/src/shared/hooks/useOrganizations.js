
import { useState, useCallback } from 'react';
import { createOrganization, getOrganizations, updateOrganization, deleteOrganization } from '@/shared/lib';

// useOrganizations: Hook für Organization-CRUD und State
export function useOrganizations(userId) {
	const [organizations, setOrganizations] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	// Organisationen laden
	const loadOrganizations = useCallback(async () => {
		setLoading(true);
		setError(null);
		const { data, error } = await getOrganizations(userId);
		if (!error) setOrganizations(data ?? []);
		setError(error);
		setLoading(false);
		return { data, error };
	}, [userId]);

	// Organisation anlegen
	const addOrganizationHandler = useCallback(async (name, description) => {
		const { data, error } = await createOrganization(name, description);
		if (!error) setOrganizations((prev) => [data, ...prev]);
		return { data, error };
	}, []);

	// Organisation aktualisieren
	const updateOrganizationHandler = useCallback(async (orgId, updates) => {
		const { data, error } = await updateOrganization(orgId, updates);
		if (!error) setOrganizations((prev) => prev.map((o) => (o.id === orgId ? { ...o, ...updates } : o)));
		return { data, error };
	}, []);

	// Organisation löschen
	const deleteOrganizationHandler = useCallback(async (orgId) => {
		const { data, error } = await deleteOrganization(orgId);
		if (!error) setOrganizations((prev) => prev.filter((o) => o.id !== orgId));
		return { data, error };
	}, []);

	return {
		organizations,
		loading,
		error,
		loadOrganizations,
		addOrganization: addOrganizationHandler,
		updateOrganization: updateOrganizationHandler,
		deleteOrganization: deleteOrganizationHandler,
	};
}
