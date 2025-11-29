# DocuFlow

Ein moderner, modular aufgebauter Dokumenten- und Organisations-Workflow Client (React + Vite + Supabase) mit Theme-Variablen, schlanker Global-State-Struktur und erweiterbaren Feature Hooks.

## Schnellstart

```powershell
cd frontend
npm install
npm run dev
```

Standardmäßig läuft Vite auf `http://localhost:5173`.

### Voraussetzungen
- Node.js (>= 18 empfohlen)
- Supabase Projekt (URL & Anon Key)
- Optional: .env / .env.local für Schlüssel

Erstelle in `frontend/` eine `.env` Datei (falls noch nicht vorhanden):
```
VITE_SUPABASE_URL=YOUR_SUPABASE_URL
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

## Projektstruktur (Auszug)
```
frontend/
	public/
	src/
		App.jsx
		main.jsx
		index.css                # Theme Variablen (dark/light) auf body
		assets/
		layout/                  # Layout-Komponenten (Header/Sidebar/Main)
		pages/
			projects/ProjectsPage.jsx
			... weitere Pages (documents, profile, settings)
		shared/
			components/            # Reusable UI (Button, etc.)
			context/
				AppDataContext.jsx   # Globaler Minimal-Context
				AppDataContextBase.js
			hooks/
				useAuthSession.js    # Auth (Session/User, changeEmail, signOut)
				useOrganizations.js  # CRUD + lokaler State für Organizations
				useProjects.js       # Lazy Projekte pro Organization
			lib/                   # Supabase Query / RPC Layer
				organizationQueries.js
				projectQueries.js
			utils/                 # Hilfsfunktionen (Platz für Format/Parsing)
		testing/
			BackendTesting.jsx     # Manuelle Testseite für Backend-Aufrufe
	package.json
	vite.config.js
```

## Architektur Überblick

### Globaler Context: `useAppData()`
Begrenzt auf wirklich globale Informationen:
- `session`, `user` (aus `useAuthSession`)
- `profile`
- `organizations` (Liste)
- `permissions` (Placeholder für spätere RLS / Rollen-Caching)
- Kombiniertes `loading` / `error`
- Aktionen: `loadOrganizations`, `addOrganization(details)`, `updateOrganization`, `deleteOrganization`, `signOut`, `changeEmail`, `updateProfile`

Projekte werden bewusst NICHT zentral gehalten, sondern über `useProjects(organizationId)` geladen (Lazy & scoped), um Render-Overhead und Speicher zu reduzieren.

### Feature Hooks
- `useAuthSession`: Session & User Listener, `changeEmail(newEmail)` mit Verifizierungsflow, `signOut()`.
- `useOrganizations`: CRUD + lokaler Cache. `addOrganization({ name, description, ... })` ist objekt-basiert, dadurch erweiterbar ohne API-Bruch.
- `useProjects(organizationId)`: Lädt Projekte je Org, bietet `addProject`, `updateProject`, `deleteProject`. Wird nur dann instanziiert, wenn eine Org wirklich angezeigt wird.

### Data Layer / Supabase
- Nutzung von RPC (z.B. `create_organization`, `create_project`) für atomische Serverlogik & RLS-Kontrolle.
- Direkte Table Queries für einfache Reads (`organizations`, `projects`).
- Policies sollten rekursive Abhängigkeiten vermeiden (z.B. keine Selbst-Referenz in `project_members`).
- Auth: Änderung der E-Mail via `supabase.auth.updateUser({ email })` → Verifizierungslink.

### Theming
- Alle Farb-/UI-Variablen liegen zentral auf `body` (und `body.light`).
- Komponenten referenzieren nur CSS-Variablen (kein Hardcoding von Farben), dadurch schnelles Umschalten zwischen Dark/Light.
- Beispiel Klassen: `bg-[var(--bg-primary)]`, `text-[var(--text-primary)]`, `border-[var(--border)]`, `bg-[var(--accent)]`.

### Gründe für die Trennung von Organizations & Projects
- Organizations: Klein, oft global benötigt (Navigation, Auswahl, Rechte).
- Projects: Potenziell groß, seiten-/org-bezogen, lazy laden reduziert Netzwerklast & Re-Renders.
- Ein Wechsel zu einem Cache/Query Layer (z.B. TanStack Query) ist später problemlos möglich.

## Typisches Nutzungsmuster

```jsx
import { useAppData } from '@/shared/context/AppDataContextBase';

function OrganizationList() {
	const { organizations, loading, error, addOrganization, loadOrganizations } = useAppData();

	async function create() {
		const { error } = await addOrganization({ name: 'Neue Org', description: 'Beschreibung' });
		if (!error) await loadOrganizations(); // optionaler Refresh
	}

	return (
		<div>
			<button onClick={create} disabled={loading}>Neu</button>
			<button onClick={loadOrganizations} disabled={loading}>Reload</button>
			{error && <p>Fehler: {error.message}</p>}
			<ul>{organizations.map(o => <li key={o.id}>{o.name}</li>)}</ul>
		</div>
	);
}
```

Lazy Projekte in einer Org:
```jsx
import { useProjects } from '@/shared/hooks/useProjects';

function OrgProjects({ organization }) {
	const { projects, loadProjects, addProject } = useProjects(organization.id);
	useEffect(() => { loadProjects(); }, [loadProjects]);
	// ...
}
```

## Erweiterbarkeit / Nächste Schritte (Ideen)
- Permissions Hook (`usePermissions(user, orgId)`) für Rollen-/RLS-Caching.
- Query Layer mit Stale-While-Revalidate (TanStack Query).
- Pagination & Suche (`loadOrganizations({ search, page })`).
- Upload-/Storage-Integration für Avatare / Dokumente über Supabase Storage.
- WebSocket/Realtime: Live Updates für Projekte oder Organisationen.

## Qualität & Wartung
- Objekt-basierte Parameter (z.B. `addOrganization(details)`) reduzieren zukünftige Refactor-Kosten.
- Hooks kapseln API/Server-Details → Komponenten bleiben leichtgewichtig.
- Klare Trennung global vs. scoped State verhindert unnötige Re-Renders.
- Theming über Variablen vermeidet Stil-Duplikate & erleichtert Erweiterung (weitere Themes).

## Skripte (frontend/package.json)
- `npm run dev` – Entwicklung
- `npm run build` – Produktion bundlen
- `npm run preview` – Build lokal testen

## Fehlerbehandlung / Debug Tipps
- Netzwerk/RPC Fehler: Console prüfen (`console.log` in Query-Funktionen vorhanden).
- Unveränderte E-Mail nach update: Verifikation-Link nicht geklickt → erneut prüfen mit `supabase.auth.getUser()`.
- Policy Recursion (42P17): Prüfen, ob Policy eine Tabelle indirekt erneut abfragt.

## Lizenz / Hinweise
Derzeit keine Lizenzangabe im Repository. Bei öffentlicher Veröffentlichung Lizenz ergänzen (z.B. MIT).

---
Bei Fragen oder gewünschter Erweiterung (z.B. ChangeEmail UI, Permissions, Query Layer) einfach melden.

