drop extension if exists "pg_net";


  create table "public"."document_comments" (
    "id" uuid not null default gen_random_uuid(),
    "version_id" uuid not null,
    "user_id" uuid,
    "content" text not null default ''::text,
    "created_at" timestamp with time zone not null default now()
      );


alter table "public"."document_comments" enable row level security;


  create table "public"."document_shares" (
    "id" uuid not null default gen_random_uuid(),
    "document_id" uuid default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "user_id" uuid default gen_random_uuid(),
    "role_id" uuid not null
      );


alter table "public"."document_shares" enable row level security;


  create table "public"."document_statuses" (
    "id" uuid not null default gen_random_uuid(),
    "project_id" uuid,
    "name" text not null default ''::text,
    "color" text,
    "icon_url" text
      );


alter table "public"."document_statuses" enable row level security;


  create table "public"."document_versions" (
    "id" uuid not null default gen_random_uuid(),
    "document_id" uuid not null default gen_random_uuid(),
    "version_number" smallint not null default '0'::smallint,
    "file_url" text not null default ''::text,
    "change_note" text not null default ''::text,
    "created_by" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now()
      );


alter table "public"."document_versions" enable row level security;


  create table "public"."documents" (
    "id" uuid not null default gen_random_uuid(),
    "project_id" uuid not null default gen_random_uuid(),
    "current_version_id" uuid default gen_random_uuid(),
    "title" text not null default ''::text,
    "status_id" uuid,
    "created_at" timestamp with time zone not null default now()
      );


alter table "public"."documents" enable row level security;


  create table "public"."invitations" (
    "id" uuid not null default gen_random_uuid(),
    "email" text not null,
    "inviter_id" uuid not null,
    "organization_id" uuid,
    "project_id" uuid,
    "role_id" uuid,
    "created_at" timestamp with time zone default now(),
    "accepted" boolean default false
      );


alter table "public"."invitations" enable row level security;


  create table "public"."organization_invites" (
    "id" uuid not null default gen_random_uuid(),
    "organization_id" uuid not null,
    "email" text not null,
    "role_id" uuid not null,
    "invited_by" uuid not null,
    "created_at" timestamp with time zone not null default now(),
    "token" uuid not null default gen_random_uuid(),
    "accepted_at" timestamp with time zone
      );


alter table "public"."organization_invites" enable row level security;


  create table "public"."organization_members" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null default auth.uid(),
    "role_id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "organization_id" uuid not null
      );


alter table "public"."organization_members" enable row level security;


  create table "public"."organizations" (
    "id" uuid not null default gen_random_uuid(),
    "name" text not null default ''::text,
    "created_at" timestamp with time zone not null default now(),
    "description" text
      );


alter table "public"."organizations" enable row level security;


  create table "public"."permissions" (
    "id" uuid not null default gen_random_uuid(),
    "permission" text not null default ''::text,
    "description" text default ''::text,
    "scope" text not null default ''::text
      );


alter table "public"."permissions" enable row level security;


  create table "public"."project_invites" (
    "id" uuid not null default gen_random_uuid(),
    "project_id" uuid not null,
    "email" text not null,
    "role_id" uuid not null,
    "invited_by" uuid not null,
    "created_at" timestamp with time zone not null default now(),
    "token" uuid not null default gen_random_uuid(),
    "accepted_at" timestamp with time zone
      );


alter table "public"."project_invites" enable row level security;


  create table "public"."project_members" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null default gen_random_uuid(),
    "project_id" uuid not null default gen_random_uuid(),
    "role_id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now()
      );


alter table "public"."project_members" enable row level security;


  create table "public"."projects" (
    "id" uuid not null default gen_random_uuid(),
    "organization_id" uuid default gen_random_uuid(),
    "name" text not null default ''::text,
    "description" text,
    "created_at" timestamp with time zone not null default now()
      );


alter table "public"."projects" enable row level security;


  create table "public"."role_permissions" (
    "role_id" uuid not null,
    "permission_id" uuid not null
      );


alter table "public"."role_permissions" enable row level security;


  create table "public"."roles" (
    "id" uuid not null default gen_random_uuid(),
    "project_id" uuid default gen_random_uuid(),
    "name" text not null,
    "description" text,
    "organization_id" uuid,
    "scope" text not null default 'project'::text
      );


alter table "public"."roles" enable row level security;


  create table "public"."user_profiles" (
    "id" uuid not null default gen_random_uuid(),
    "display_name" text not null default ''::text,
    "avatar_url" text,
    "phone_number" text,
    "email" text
      );


alter table "public"."user_profiles" enable row level security;


insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true);

insert into storage.buckets (id, name, public)
values ('documents', 'documents', true);

CREATE UNIQUE INDEX document_comments_pkey ON public.document_comments USING btree (id);

CREATE INDEX document_shares_document_id_user_id_idx ON public.document_shares USING btree (document_id, user_id);

CREATE UNIQUE INDEX document_shares_document_user_unique ON public.document_shares USING btree (document_id, user_id);

CREATE UNIQUE INDEX document_shares_pkey ON public.document_shares USING btree (id);

CREATE UNIQUE INDEX document_statuses_pkey ON public.document_statuses USING btree (id);

CREATE UNIQUE INDEX document_versions_pkey ON public.document_versions USING btree (id);

CREATE UNIQUE INDEX documents_pkey ON public.documents USING btree (id);

CREATE UNIQUE INDEX invitations_pkey ON public.invitations USING btree (id);

CREATE UNIQUE INDEX organization_invites_pkey ON public.organization_invites USING btree (id);

CREATE UNIQUE INDEX organization_invites_token_key ON public.organization_invites USING btree (token);

CREATE UNIQUE INDEX organization_members_pkey ON public.organization_members USING btree (id);

CREATE UNIQUE INDEX organizations_pkey ON public.organizations USING btree (id);

CREATE UNIQUE INDEX permissions_pkey ON public.permissions USING btree (id);

CREATE UNIQUE INDEX project_invites_pkey ON public.project_invites USING btree (id);

CREATE UNIQUE INDEX project_invites_token_key ON public.project_invites USING btree (token);

CREATE UNIQUE INDEX project_members_pkey ON public.project_members USING btree (id);

CREATE INDEX project_members_project_id_user_id_idx ON public.project_members USING btree (project_id, user_id);

CREATE UNIQUE INDEX project_roles_pkey ON public.roles USING btree (id);

CREATE UNIQUE INDEX projects_pkey ON public.projects USING btree (id);

CREATE UNIQUE INDEX unique_active_project_invite ON public.project_invites USING btree (project_id, email) WHERE (accepted_at IS NULL);

CREATE UNIQUE INDEX unique_project_user ON public.project_members USING btree (project_id, user_id);

CREATE UNIQUE INDEX user_profiles_pkey ON public.user_profiles USING btree (id);

alter table "public"."document_comments" add constraint "document_comments_pkey" PRIMARY KEY using index "document_comments_pkey";

alter table "public"."document_shares" add constraint "document_shares_pkey" PRIMARY KEY using index "document_shares_pkey";

alter table "public"."document_statuses" add constraint "document_statuses_pkey" PRIMARY KEY using index "document_statuses_pkey";

alter table "public"."document_versions" add constraint "document_versions_pkey" PRIMARY KEY using index "document_versions_pkey";

alter table "public"."documents" add constraint "documents_pkey" PRIMARY KEY using index "documents_pkey";

alter table "public"."invitations" add constraint "invitations_pkey" PRIMARY KEY using index "invitations_pkey";

alter table "public"."organization_invites" add constraint "organization_invites_pkey" PRIMARY KEY using index "organization_invites_pkey";

alter table "public"."organization_members" add constraint "organization_members_pkey" PRIMARY KEY using index "organization_members_pkey";

alter table "public"."organizations" add constraint "organizations_pkey" PRIMARY KEY using index "organizations_pkey";

alter table "public"."permissions" add constraint "permissions_pkey" PRIMARY KEY using index "permissions_pkey";

alter table "public"."project_invites" add constraint "project_invites_pkey" PRIMARY KEY using index "project_invites_pkey";

alter table "public"."project_members" add constraint "project_members_pkey" PRIMARY KEY using index "project_members_pkey";

alter table "public"."projects" add constraint "projects_pkey" PRIMARY KEY using index "projects_pkey";

alter table "public"."roles" add constraint "project_roles_pkey" PRIMARY KEY using index "project_roles_pkey";

alter table "public"."user_profiles" add constraint "user_profiles_pkey" PRIMARY KEY using index "user_profiles_pkey";

alter table "public"."document_comments" add constraint "document_comments_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.user_profiles(id) not valid;

alter table "public"."document_comments" validate constraint "document_comments_user_id_fkey";

alter table "public"."document_comments" add constraint "document_comments_version_id_fkey" FOREIGN KEY (version_id) REFERENCES public.document_versions(id) ON DELETE CASCADE not valid;

alter table "public"."document_comments" validate constraint "document_comments_version_id_fkey";

alter table "public"."document_shares" add constraint "document_shares_document_id_fkey" FOREIGN KEY (document_id) REFERENCES public.documents(id) ON DELETE CASCADE not valid;

alter table "public"."document_shares" validate constraint "document_shares_document_id_fkey";

alter table "public"."document_shares" add constraint "document_shares_document_user_unique" UNIQUE using index "document_shares_document_user_unique";

alter table "public"."document_shares" add constraint "document_shares_role_id_fkey" FOREIGN KEY (role_id) REFERENCES public.roles(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."document_shares" validate constraint "document_shares_role_id_fkey";

alter table "public"."document_shares" add constraint "document_shares_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.user_profiles(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."document_shares" validate constraint "document_shares_user_id_fkey";

alter table "public"."document_statuses" add constraint "document_statuses_project_id_fkey" FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE not valid;

alter table "public"."document_statuses" validate constraint "document_statuses_project_id_fkey";

alter table "public"."document_versions" add constraint "document_versions_created_by_fkey" FOREIGN KEY (created_by) REFERENCES public.user_profiles(id) not valid;

alter table "public"."document_versions" validate constraint "document_versions_created_by_fkey";

alter table "public"."document_versions" add constraint "document_versions_document_id_fkey" FOREIGN KEY (document_id) REFERENCES public.documents(id) ON DELETE CASCADE not valid;

alter table "public"."document_versions" validate constraint "document_versions_document_id_fkey";

alter table "public"."documents" add constraint "documents_current_version_id_fkey" FOREIGN KEY (current_version_id) REFERENCES public.document_versions(id) ON DELETE SET NULL not valid;

alter table "public"."documents" validate constraint "documents_current_version_id_fkey";

alter table "public"."documents" add constraint "documents_project_id_fkey" FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE not valid;

alter table "public"."documents" validate constraint "documents_project_id_fkey";

alter table "public"."documents" add constraint "documents_status_id_fkey" FOREIGN KEY (status_id) REFERENCES public.document_statuses(id) ON DELETE SET NULL not valid;

alter table "public"."documents" validate constraint "documents_status_id_fkey";

alter table "public"."invitations" add constraint "invitations_inviter_id_fkey" FOREIGN KEY (inviter_id) REFERENCES auth.users(id) not valid;

alter table "public"."invitations" validate constraint "invitations_inviter_id_fkey";

alter table "public"."invitations" add constraint "invitations_organization_id_fkey" FOREIGN KEY (organization_id) REFERENCES public.organizations(id) not valid;

alter table "public"."invitations" validate constraint "invitations_organization_id_fkey";

alter table "public"."invitations" add constraint "invitations_project_id_fkey" FOREIGN KEY (project_id) REFERENCES public.projects(id) not valid;

alter table "public"."invitations" validate constraint "invitations_project_id_fkey";

alter table "public"."invitations" add constraint "invitations_role_id_fkey" FOREIGN KEY (role_id) REFERENCES public.roles(id) not valid;

alter table "public"."invitations" validate constraint "invitations_role_id_fkey";

alter table "public"."organization_invites" add constraint "organization_invites_invited_by_fkey" FOREIGN KEY (invited_by) REFERENCES public.user_profiles(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."organization_invites" validate constraint "organization_invites_invited_by_fkey";

alter table "public"."organization_invites" add constraint "organization_invites_organization_id_fkey" FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."organization_invites" validate constraint "organization_invites_organization_id_fkey";

alter table "public"."organization_invites" add constraint "organization_invites_role_id_fkey" FOREIGN KEY (role_id) REFERENCES public.roles(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."organization_invites" validate constraint "organization_invites_role_id_fkey";

alter table "public"."organization_invites" add constraint "organization_invites_token_key" UNIQUE using index "organization_invites_token_key";

alter table "public"."organization_members" add constraint "organization_members_organization_id_fkey" FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE CASCADE not valid;

alter table "public"."organization_members" validate constraint "organization_members_organization_id_fkey";

alter table "public"."organization_members" add constraint "organization_members_role_id_fkey" FOREIGN KEY (role_id) REFERENCES public.roles(id) not valid;

alter table "public"."organization_members" validate constraint "organization_members_role_id_fkey";

alter table "public"."organization_members" add constraint "organization_members_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.user_profiles(id) ON DELETE CASCADE not valid;

alter table "public"."organization_members" validate constraint "organization_members_user_id_fkey";

alter table "public"."project_invites" add constraint "project_invites_invited_by_fkey" FOREIGN KEY (invited_by) REFERENCES public.user_profiles(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."project_invites" validate constraint "project_invites_invited_by_fkey";

alter table "public"."project_invites" add constraint "project_invites_project_id_fkey" FOREIGN KEY (project_id) REFERENCES public.projects(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."project_invites" validate constraint "project_invites_project_id_fkey";

alter table "public"."project_invites" add constraint "project_invites_role_id_fkey" FOREIGN KEY (role_id) REFERENCES public.roles(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."project_invites" validate constraint "project_invites_role_id_fkey";

alter table "public"."project_invites" add constraint "project_invites_token_key" UNIQUE using index "project_invites_token_key";

alter table "public"."project_members" add constraint "project_members_project_id_fkey" FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE not valid;

alter table "public"."project_members" validate constraint "project_members_project_id_fkey";

alter table "public"."project_members" add constraint "project_members_role_id_fkey" FOREIGN KEY (role_id) REFERENCES public.roles(id) not valid;

alter table "public"."project_members" validate constraint "project_members_role_id_fkey";

alter table "public"."project_members" add constraint "project_members_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) not valid;

alter table "public"."project_members" validate constraint "project_members_user_id_fkey";

alter table "public"."project_members" add constraint "project_members_user_id_fkey1" FOREIGN KEY (user_id) REFERENCES public.user_profiles(id) not valid;

alter table "public"."project_members" validate constraint "project_members_user_id_fkey1";

alter table "public"."project_members" add constraint "unique_project_user" UNIQUE using index "unique_project_user";

alter table "public"."projects" add constraint "projects_organization_id_fkey" FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE CASCADE not valid;

alter table "public"."projects" validate constraint "projects_organization_id_fkey";

alter table "public"."role_permissions" add constraint "role_permissions_permission_id_fkey" FOREIGN KEY (permission_id) REFERENCES public.permissions(id) ON DELETE CASCADE not valid;

alter table "public"."role_permissions" validate constraint "role_permissions_permission_id_fkey";

alter table "public"."role_permissions" add constraint "role_permissions_role_id_fkey" FOREIGN KEY (role_id) REFERENCES public.roles(id) ON DELETE CASCADE not valid;

alter table "public"."role_permissions" validate constraint "role_permissions_role_id_fkey";

alter table "public"."roles" add constraint "project_roles_project_id_fkey" FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE not valid;

alter table "public"."roles" validate constraint "project_roles_project_id_fkey";

alter table "public"."roles" add constraint "roles_organization_id_fkey" FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE CASCADE not valid;

alter table "public"."roles" validate constraint "roles_organization_id_fkey";

alter table "public"."user_profiles" add constraint "user_profiles_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."user_profiles" validate constraint "user_profiles_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.accept_invite(p_token uuid)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$DECLARE
  v_email text;
  v_user uuid := auth.uid();
  v_org_inv organization_invites;
  v_proj_inv project_invites;
BEGIN
  -- Check organization invite
  SELECT * INTO v_org_inv
  FROM organization_invites
  WHERE token = p_token AND accepted_at IS NULL;

  IF FOUND THEN
      -- Sicherheitscheck: E-Mail muss matchen
      SELECT email INTO v_email FROM auth.users WHERE id = v_user;
      IF lower(v_org_inv.email) <> lower(v_email) THEN
          RAISE EXCEPTION 'Invite email does not match your account.';
      END IF;

      -- Mitglied hinzufügen, nur falls noch nicht vorhanden
      INSERT INTO organization_members (organization_id, user_id, role_id)
      SELECT v_org_inv.organization_id, v_user, v_org_inv.role_id
      WHERE NOT EXISTS (
          SELECT 1
          FROM organization_members
          WHERE organization_id = v_org_inv.organization_id
            AND user_id = v_user
      );

      UPDATE organization_invites SET accepted_at = now()
      WHERE id = v_org_inv.id;

      RETURN 'organization';
  END IF;

  -- Check project invite
  SELECT * INTO v_proj_inv
  FROM project_invites
  WHERE token = p_token AND accepted_at IS NULL;

  IF FOUND THEN
      SELECT email INTO v_email FROM auth.users WHERE id = v_user;
      IF lower(v_proj_inv.email) <> lower(v_email) THEN
          RAISE EXCEPTION 'Invite email does not match your account.';
      END IF;

      -- Mitglied hinzufügen, nur falls noch nicht vorhanden
      INSERT INTO project_members (project_id, user_id, role_id)
      SELECT v_proj_inv.project_id, v_user, v_proj_inv.role_id
      WHERE NOT EXISTS (
          SELECT 1
          FROM project_members
          WHERE project_id = v_proj_inv.project_id
            AND user_id = v_user
      );

      UPDATE project_invites SET accepted_at = now()
      WHERE id = v_proj_inv.id;

      RETURN 'project';
  END IF;

  RETURN 'invalid';
END;$function$
;

CREATE OR REPLACE FUNCTION public.create_document_version(p_document_id uuid, p_file_path text, p_change_note text DEFAULT NULL::text)
 RETURNS TABLE(version_id uuid, version_number integer, created_at timestamp with time zone)
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  v_project_id uuid;
  v_next_version int;
  v_version_id uuid;
  v_version_number int;
  v_created_at timestamptz;
BEGIN
  -- 🔒 Lock document
  PERFORM 1
  FROM documents d
  WHERE d.id = p_document_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION USING ERRCODE = '02000', MESSAGE = 'Document not found.';
  END IF;

  SELECT d.project_id INTO v_project_id
  FROM documents d
  WHERE d.id = p_document_id;

  -- 🔹 Permission check (Nutzt deine neue has_permission Logik)
  IF NOT (
    public.has_permission('project', 'manage_documents', v_project_id) OR
    public.has_permission('document', 'upload', p_document_id) OR
    public.has_permission('document', 'edit', p_document_id)
  ) THEN
    RAISE EXCEPTION USING ERRCODE = '42501', MESSAGE = 'You do not have permission.';
  END IF;

  -- 🔢 Next version number (Alias dv verwendet!)
  SELECT COALESCE(MAX(dv.version_number), 0) + 1
  INTO v_next_version
  FROM document_versions dv
  WHERE dv.document_id = p_document_id;

  -- ➕ Insert version
  INSERT INTO document_versions (
    document_id,
    version_number,
    file_url,
    change_note,
    created_by
  )
  VALUES (
    p_document_id,
    v_next_version,
    p_file_path,
    p_change_note,
    auth.uid()
  )
  RETURNING
    id,
    document_versions.version_number, -- Explizit die Tabellenspalte
    document_versions.created_at      -- Explizit die Tabellenspalte
  INTO
    v_version_id,
    v_version_number,
    v_created_at;

  -- 🔁 Update document
  UPDATE documents
  SET current_version_id = v_version_id
  WHERE id = p_document_id;

  -- 🔚 Zuweisung an die RETURNS TABLE Variablen
  -- Wir nutzen "this." oder weisen es direkt zu, 
  -- aber am sichersten ist die explizite Zuweisung am Ende:
  create_document_version.version_id := v_version_id;
  create_document_version.version_number := v_version_number;
  create_document_version.created_at := v_created_at;

  RETURN NEXT;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.create_empty_document(p_project_id uuid, p_title text)
 RETURNS TABLE(doc_id uuid, doc_project_id uuid, doc_title text, doc_created_at timestamp with time zone)
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  v_doc_id uuid;
BEGIN
  -- Permission: Projekt darf Dokumente anlegen
  IF NOT has_permission('project', 'create_document', p_project_id) THEN
    RAISE EXCEPTION 'Permission denied';
  END IF;

  INSERT INTO documents (project_id, title, current_version_id)
  VALUES (p_project_id, p_title, NULL)
  RETURNING id, project_id, title, created_at
  INTO v_doc_id, doc_project_id, doc_title, doc_created_at;

  RETURN QUERY
  SELECT
    v_doc_id,
    doc_project_id,
    doc_title,
    doc_created_at;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.create_organization(neworg_name text, neworg_description text DEFAULT NULL::text)
 RETURNS TABLE(org_id uuid, org_name text, org_description text, org_created_at timestamp with time zone)
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  v_org_id UUID;
  v_user_id UUID; -- Variable für die aktuelle User-ID
  v_owner_role_id UUID; -- Variable für die ID der Eigentümer-Rolle
BEGIN
  -- Ermittle die ID des aktuell angemeldeten Benutzers
  SELECT auth.uid() INTO v_user_id;

  -- Prüfe, ob der Benutzer angemeldet ist (optional, aber gut)
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Benutzer ist nicht authentifiziert. Kann keine Organisation erstellen.';
  END IF;

  -- 1️⃣ Organisation anlegen
  INSERT INTO organizations (name, description)
  VALUES (neworg_name, neworg_description)
  RETURNING id INTO v_org_id;

  -- 2️⃣ Template-Rollen mit scope = 'organization' klonen
  INSERT INTO roles (name, scope, organization_id, project_id, description)
  SELECT name, 'organization', v_org_id, NULL, description
  FROM roles
  WHERE organization_id IS NULL AND scope = 'organization';

  -- 3️⃣ Permissions kopieren (Logik bleibt gleich)
  INSERT INTO role_permissions (role_id, permission_id)
  SELECT r2.id, rp.permission_id
  FROM roles r1
  JOIN role_permissions rp ON rp.role_id = r1.id
  JOIN roles r2 ON r2.name = r1.name AND r2.organization_id = v_org_id
  WHERE r1.organization_id IS NULL AND r1.scope = 'organization';

  -- 4️⃣ Benutzer als Mitglied hinzufügen und Eigentümer-Rolle zuweisen
  -- Zuerst die ID der spezifischen Eigentümer-Rolle in der neuen Organisation finden
  SELECT id INTO v_owner_role_id
  FROM roles
  WHERE organization_id = v_org_id AND name = 'organization_owner' LIMIT 1; -- Name muss existieren!

  -- Benutzer der organization_members Tabelle hinzufügen
  INSERT INTO organization_members (organization_id, user_id, role_id)
  VALUES (v_org_id, v_user_id, v_owner_role_id);

  -- 5️⃣ Rückgabe
  RETURN QUERY
  SELECT o.id AS org_id,
         o.name AS org_name,
         o.description AS org_description,
         o.created_at AS org_created_at
  FROM organizations o
  WHERE o.id = v_org_id;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.create_project(p_name text, p_organization_id uuid, p_description text DEFAULT NULL::text)
 RETURNS TABLE(proj_id uuid, proj_name text, proj_description text, proj_organization_id uuid, proj_created_at timestamp with time zone)
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  v_owner_role_id uuid;
  v_template_role_id uuid;
  v_proj_id uuid;
  v_proj_name text;
  v_proj_description text;
  v_proj_organization_id uuid;
  v_proj_created_at timestamptz;
BEGIN
  -- 1️⃣ Check: User muss Org Admin / Owner sein
  IF NOT is_org_admin(p_organization_id) THEN
    RAISE EXCEPTION 'Permission denied. Must be organization admin or owner to create project.';
  END IF;

  -- 2️⃣ Projekt anlegen
  INSERT INTO public.projects (name, description, organization_id)
  VALUES (p_name, p_description, p_organization_id)
  RETURNING id, name, description, organization_id, created_at
  INTO v_proj_id, v_proj_name, v_proj_description, v_proj_organization_id, v_proj_created_at;

  -- 3️⃣ Template project_owner Rolle finden
  SELECT id INTO v_template_role_id
  FROM public.roles
  WHERE name = 'project_owner'
    AND project_id IS NULL
    AND scope = 'project'
  LIMIT 1;

  IF v_template_role_id IS NULL THEN
    RAISE EXCEPTION 'Template role "project_owner" not found';
  END IF;

  -- 4️⃣ project_owner für dieses Projekt klonen
  INSERT INTO public.roles (name, description, project_id, scope)
  SELECT name, description, v_proj_id, 'project'
  FROM public.roles
  WHERE id = v_template_role_id
  RETURNING id INTO v_owner_role_id;

  -- 5️⃣ Permissions kopieren
  INSERT INTO public.role_permissions (role_id, permission_id)
  SELECT v_owner_role_id, permission_id
  FROM public.role_permissions
  WHERE role_id = v_template_role_id;

  -- 6️⃣ Ersteller als project_owner zuweisen
  INSERT INTO public.project_members (project_id, user_id, role_id)
  VALUES (v_proj_id, auth.uid(), v_owner_role_id);

  -- 7️⃣ Ergebnis zurückgeben
  RETURN QUERY
  SELECT 
    v_proj_id,
    v_proj_name,
    v_proj_description,
    v_proj_organization_id,
    v_proj_created_at;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.create_user_with_profile(p_user_id uuid, p_display_name text, p_avatar_url text, p_email text)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
begin
  insert into public.user_profiles (id, display_name, avatar_url, email)
  values (p_user_id, p_display_name, p_avatar_url, p_email)
  on conflict (id) do update
    set 
      display_name = excluded.display_name,
      avatar_url = excluded.avatar_url,
      -- Nutze EXCLUDED (bezieht sich auf p_email aus dem INSERT)
      email = excluded.email; 
end;
$function$
;

CREATE OR REPLACE FUNCTION public.create_version_comment(p_version_id uuid, p_content text)
 RETURNS TABLE(comment_id uuid, created_at timestamp with time zone, user_display_name text)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'auth'
AS $function$
DECLARE
  v_document_id uuid;
  v_project_id uuid;
  v_user_id uuid := auth.uid();
BEGIN
  -- 1. Dokument- und Projekt-ID für die Berechtigungsprüfung finden
  SELECT dv.document_id, d.project_id
  INTO v_document_id, v_project_id
  FROM document_versions dv
  JOIN documents d ON d.id = dv.document_id
  WHERE dv.id = p_version_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Die angegebene Version wurde nicht gefunden.';
  END IF;

  -- 2. Berechtigung prüfen (Originale Signatur: scope, permission, target_id)
  -- Der Nutzer darf kommentieren, wenn er das Dokument bearbeiten, hochladen oder 
  -- das gesamte Projekt verwalten darf.
  IF NOT (
    public.has_permission('project', 'manage_documents', v_project_id) OR
    public.has_permission('document', 'edit', v_document_id) OR
    public.has_permission('document', 'upload', v_document_id) OR 
    public.has_permission('document', 'create_comment', v_document_id)
  ) THEN
    RAISE EXCEPTION USING ERRCODE = '42501', MESSAGE = 'Keine Berechtigung zum Kommentieren.';
  END IF;

  -- 3. Kommentar einfügen
  RETURN QUERY
  WITH inserted_comment AS (
    INSERT INTO public.document_comments (
      version_id,
      user_id,
      content
    )
    VALUES (
      p_version_id,
      v_user_id,
      p_content
    )
    RETURNING id, document_comments.created_at, document_comments.user_id
  )
  SELECT 
    ic.id, 
    ic.created_at, 
    up.display_name
  FROM inserted_comment ic
  JOIN public.user_profiles up ON up.id = ic.user_id;

END;
$function$
;

CREATE OR REPLACE FUNCTION public.delete_old_versions(p_target_version_id uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
    v_document_id uuid;
    v_project_id uuid;
    v_target_version_number int;
    v_file_urls text[];
BEGIN
    -- 1. Daten holen
    SELECT dv.document_id, d.project_id, dv.version_number
    INTO v_document_id, v_project_id, v_target_version_number
    FROM document_versions dv
    JOIN documents d ON d.id = dv.document_id
    WHERE dv.id = p_target_version_id
    FOR UPDATE;

    -- 2. Berechtigung prüfen (Originale Signatur)
    IF NOT (
        public.has_permission('project', 'manage_documents', v_project_id) OR
        public.has_permission('document', 'delete', v_document_id)
    ) THEN
        RAISE EXCEPTION USING ERRCODE = '42501', MESSAGE = 'Keine Berechtigung.';
    END IF;

    -- 3. Alte Files für Storage-Cleanup sammeln
    SELECT array_agg(file_url) INTO v_file_urls
    FROM document_versions
    WHERE document_id = v_document_id AND version_number < v_target_version_number;

    -- 4. Alte Versionen löschen
    DELETE FROM document_versions
    WHERE document_id = v_document_id AND version_number < v_target_version_number;

    -- 5. NEUNUMMERIERUNG der verbleibenden Versionen
    -- Wir setzen die version_number basierend auf dem Erstellungsdatum neu
    WITH renumbered AS (
        SELECT id, row_number() OVER (ORDER BY created_at ASC) as new_nr
        FROM document_versions
        WHERE document_id = v_document_id
    )
    UPDATE document_versions dv
    SET version_number = r.new_nr
    FROM renumbered r
    WHERE dv.id = r.id;

    -- 6. Storage Cleanup
    IF v_file_urls IS NOT NULL THEN
        DELETE FROM storage.objects WHERE bucket_id = 'documents' AND name = ANY(v_file_urls);
    END IF;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.delete_organization(p_org_id uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET row_security TO 'off'
AS $function$BEGIN
  -- 1) Sicherheitscheck: Caller muss Org-Owner oder Org-Admin sein
  IF NOT (
    has_permission('organization','delete', p_org_id)
  ) THEN
    RAISE EXCEPTION 'Permission denied: must be organization_owner or organization_admin to delete organization.';
  END IF;

  -- 2) Nur die Organization löschen, alles andere passiert durch CASCADE
  DELETE FROM public.organizations
  WHERE id = p_org_id;
END;$function$
;

CREATE OR REPLACE FUNCTION public.get_permissions_of_user()
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  v_user uuid := auth.uid();
  v_result jsonb := '{}'::jsonb;
BEGIN
  /* ============================
     ORGANIZATION PERMISSIONS
     ============================ */
  v_result := jsonb_set(
    v_result,
    '{organization}',
    COALESCE((
      SELECT jsonb_object_agg(
        t.organization_id::text,
        t.perms
      )
      FROM (
        SELECT
          om.organization_id,
          jsonb_agg(DISTINCT p.permission) AS perms
        FROM organization_members om
        JOIN roles r ON r.id = om.role_id
        JOIN role_permissions rp ON rp.role_id = r.id
        JOIN permissions p ON p.id = rp.permission_id
        WHERE om.user_id = v_user
          AND p.scope = 'organization'
        GROUP BY om.organization_id
      ) t
    ), '{}'::jsonb)
  );

  /* ============================
     PROJECT PERMISSIONS
     ============================ */
  v_result := jsonb_set(
    v_result,
    '{project}',
    COALESCE((
      SELECT jsonb_object_agg(
        t.project_id::text,
        t.perms
      )
      FROM (
        SELECT
          pm.project_id,
          jsonb_agg(DISTINCT p.permission) AS perms
        FROM project_members pm
        JOIN roles r ON r.id = pm.role_id
        JOIN role_permissions rp ON rp.role_id = r.id
        JOIN permissions p ON p.id = rp.permission_id
        WHERE pm.user_id = v_user
          AND p.scope = 'project'
        GROUP BY pm.project_id
      ) t
    ), '{}'::jsonb)
  );

  /* ============================
     DOCUMENT PERMISSIONS
     ============================ */
  v_result := jsonb_set(
    v_result,
    '{document}',
    COALESCE((
      SELECT jsonb_object_agg(
        t.document_id::text,
        t.perms
      )
      FROM (
        SELECT
          ds.document_id,
          jsonb_agg(DISTINCT p.permission) AS perms
        FROM document_shares ds
        JOIN roles r ON r.id = ds.role_id
        JOIN role_permissions rp ON rp.role_id = r.id
        JOIN permissions p ON p.id = rp.permission_id
        WHERE ds.user_id = v_user
          AND p.scope = 'document'
        GROUP BY ds.document_id
      ) t
    ), '{}'::jsonb)
  );

  RETURN v_result;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.has_permission(p_scope text, p_permission text, p_target_id uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$DECLARE
  v_user uuid := auth.uid();
  v_project_id uuid;
BEGIN
  IF p_target_id IS NULL OR p_scope IS NULL OR p_permission IS NULL THEN
    RETURN false;
  END IF;

  -- 🔹 ORGANIZATION
  IF p_scope = 'organization' THEN
    RETURN EXISTS (
      SELECT 1
      FROM organization_members om
      JOIN roles r ON r.id = om.role_id
      JOIN role_permissions rp ON rp.role_id = r.id
      JOIN permissions p ON p.id = rp.permission_id
      WHERE om.user_id = v_user
        AND om.organization_id = p_target_id
        AND p.scope = 'organization'
        AND p.permission = p_permission
    );
  END IF;

  -- 🔹 PROJECT
  IF p_scope = 'project' THEN
    RETURN EXISTS (
      SELECT 1
      FROM project_members pm
      JOIN roles r ON r.id = pm.role_id
      JOIN role_permissions rp ON rp.role_id = r.id
      JOIN permissions p ON p.id = rp.permission_id
      WHERE pm.user_id = v_user
        AND pm.project_id = p_target_id
        AND p.scope = 'project'
        AND p.permission = p_permission
    );
  END IF;

  -- 🔹 DOCUMENT
  IF p_scope = 'document' THEN
    -- Projekt zum Dokument holen
    SELECT project_id INTO v_project_id
    FROM documents
    WHERE id = p_target_id;

    IF v_project_id IS NULL THEN
      RETURN false;
    END IF;

    -- 1️⃣ Projektweite Superrechte
    IF has_permission('project', 'manage_documents', v_project_id) THEN
      RETURN true;
    END IF;

    -- 2️⃣ Projektrollen mit document-Permission
    IF EXISTS (
      SELECT 1
      FROM project_members pm
      JOIN roles r ON r.id = pm.role_id
      JOIN role_permissions rp ON rp.role_id = r.id
      JOIN permissions p ON p.id = rp.permission_id
      WHERE pm.user_id = v_user
        AND pm.project_id = v_project_id
        AND p.scope = 'document'
        AND p.permission = p_permission
    ) THEN
      RETURN true;
    END IF;

    -- 3️⃣ Dokument-spezifische Shares
    RETURN EXISTS (
      SELECT 1
      FROM document_shares ds
      JOIN roles r ON r.id = ds.role_id
      JOIN role_permissions rp ON rp.role_id = r.id
      JOIN permissions p ON p.id = rp.permission_id
      WHERE ds.user_id = v_user
        AND ds.document_id = p_target_id
        AND p.scope = 'document'
        AND p.permission = p_permission
    );
  END IF;

  RETURN false;
END;$function$
;

CREATE OR REPLACE FUNCTION public.invite_to_organization(p_organization_id uuid, p_email text, p_role_id uuid)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$DECLARE
  v_token uuid;
BEGIN
  IF NOT has_permission('organization', 'invite_member', p_organization_id) THEN
      RAISE EXCEPTION 'You do not have permission to invite members.';
  END IF;

  INSERT INTO public.organization_invites (organization_id, email, role_id, invited_by)
  VALUES (p_organization_id, p_email, p_role_id, auth.uid())
  RETURNING token INTO v_token;

  RETURN v_token;
END;$function$
;

CREATE OR REPLACE FUNCTION public.invite_to_project(p_project_id uuid, p_email text, p_role_id uuid)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$DECLARE
  v_token uuid;
BEGIN
  IF NOT has_permission('project', 'invite_member', p_project_id) THEN
      RAISE EXCEPTION 'You do not have permission to invite members to this project.';
  END IF;

  INSERT INTO public.project_invites (project_id, email, role_id, invited_by)
  VALUES (p_project_id, p_email, p_role_id, auth.uid())
  RETURNING token INTO v_token;

  RETURN v_token;
END;$function$
;

CREATE OR REPLACE FUNCTION public.is_org_admin(org_id uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.organization_members om
    JOIN public.roles r ON r.id = om.role_id
    WHERE om.organization_id = org_id
      AND om.user_id = auth.uid()::uuid
      AND r.name IN ('organization_owner', 'organization_admin')
  );
END;
$function$
;

CREATE OR REPLACE FUNCTION public.is_org_admin_for_project(org_id uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.organization_members om
    JOIN public.roles r ON r.id = om.role_id
    WHERE om.organization_id = org_id
      AND om.user_id = auth.uid()::uuid
      AND r.name IN ('organization_owner', 'organization_admin')
  );
END;
$function$
;

CREATE OR REPLACE FUNCTION public.is_project_admin(proj_id uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.project_members pm
    JOIN public.roles r ON r.id = pm.role_id
    WHERE pm.project_id = proj_id
      AND pm.user_id = auth.uid()::uuid
      AND r.name IN ('project_owner', 'project_admin', 'organization_owner', 'organization_admin')
  );
END;
$function$
;

CREATE OR REPLACE FUNCTION public.is_project_member(proj_id uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.project_members pm
    WHERE pm.project_id = proj_id
      AND pm.user_id = auth.uid()::uuid
  );
END;
$function$
;

create or replace view "public"."project_visible_user_profiles" as  SELECT id,
    display_name,
    avatar_url,
    phone_number
   FROM public.user_profiles u;


CREATE OR REPLACE FUNCTION public.revert_document_to_version(p_target_version_id uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
    v_document_id uuid;
    v_project_id uuid;
    v_target_version_number int;
    v_file_urls text[];
BEGIN
    -- 1. Infos sammeln & Lock
    SELECT dv.document_id, d.project_id, dv.version_number
    INTO v_document_id, v_project_id, v_target_version_number
    FROM document_versions dv
    JOIN documents d ON d.id = dv.document_id
    WHERE dv.id = p_target_version_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Version nicht gefunden.';
    END IF;

    -- 2. Berechtigung prüfen
    IF NOT (
        public.has_permission('project', 'manage_documents', v_project_id) OR
        public.has_permission('document', 'delete', v_document_id)
    ) THEN
        RAISE EXCEPTION USING ERRCODE = '42501', MESSAGE = 'Keine Berechtigung zum Revertieren.';
    END IF;

    -- 3. Pfade für Storage-Löschung sammeln (alle neueren)
    SELECT array_agg(file_url)
    INTO v_file_urls
    FROM document_versions
    WHERE document_id = v_document_id AND version_number > v_target_version_number;

    -- 4. Neuere Versionen löschen
    -- (document_comments werden durch CASCADE automatisch mitgelöscht)
    DELETE FROM document_versions
    WHERE document_id = v_document_id AND version_number > v_target_version_number;

    -- 5. Hauptdokument auf die Ziel-Version zurücksetzen
    UPDATE documents
    SET current_version_id = p_target_version_id
    WHERE id = v_document_id;

    -- 6. Trigger für Storage Cleanup (Optional/Vorbereitung)
    -- Hinweis: SQL kann Dateien nicht physisch löschen, außer über Supabase Edge Functions 
    -- oder man löscht die Einträge in storage.objects (sofern Pfade bekannt):
    IF v_file_urls IS NOT NULL THEN
        DELETE FROM storage.objects 
        WHERE bucket_id = 'documents' -- Name deines Buckets anpassen
        AND name = ANY(v_file_urls);
    END IF;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.revoke_document_share(p_share_id uuid)
 RETURNS void
 LANGUAGE plpgsql
AS $function$BEGIN
  -- 1) Sicherheitscheck: Caller muss Org-Owner oder Org-Admin sein
  IF NOT (
    has_permission('document','share', (SELECT document_id 
    FROM document_shares
    WHERE id = p_share_id))
  ) THEN
    RAISE EXCEPTION 'Permission denied: must have the permission to share the document';
  END IF;

  -- 2) Nur die Organization löschen, alles andere passiert durch CASCADE
  DELETE FROM public.document_shares
  WHERE id = p_share_id;
END;$function$
;

CREATE OR REPLACE FUNCTION public.share_document(p_document_id uuid, p_user_id uuid, p_role_id uuid DEFAULT NULL::uuid)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'auth'
AS $function$
DECLARE
  v_share_id UUID;
  v_project_id UUID;
BEGIN
  -- 1. Projekt-ID holen
  SELECT project_id INTO v_project_id FROM documents WHERE id = p_document_id;

  -- 2. Berechtigung prüfen (Originale Signatur: scope, permission, target_id)
  IF NOT (
    public.has_permission('project', 'manage_documents', v_project_id) OR
    public.has_permission('document', 'share', p_document_id)
  ) THEN
    RAISE EXCEPTION USING ERRCODE = '42501', MESSAGE = 'Keine Berechtigung zum Teilen.';
  END IF;

  -- 3. Insert / Update
  INSERT INTO document_shares (document_id, user_id, role_id, created_at)
  VALUES (p_document_id, p_user_id, p_role_id, NOW())
  ON CONFLICT (document_id, user_id) 
  DO UPDATE SET 
    role_id = EXCLUDED.role_id, 
    created_at = NOW()
  RETURNING id INTO v_share_id;

  RETURN v_share_id;
END;
$function$
;

grant delete on table "public"."document_comments" to "anon";

grant insert on table "public"."document_comments" to "anon";

grant references on table "public"."document_comments" to "anon";

grant select on table "public"."document_comments" to "anon";

grant trigger on table "public"."document_comments" to "anon";

grant truncate on table "public"."document_comments" to "anon";

grant update on table "public"."document_comments" to "anon";

grant delete on table "public"."document_comments" to "authenticated";

grant insert on table "public"."document_comments" to "authenticated";

grant references on table "public"."document_comments" to "authenticated";

grant select on table "public"."document_comments" to "authenticated";

grant trigger on table "public"."document_comments" to "authenticated";

grant truncate on table "public"."document_comments" to "authenticated";

grant update on table "public"."document_comments" to "authenticated";

grant delete on table "public"."document_comments" to "service_role";

grant insert on table "public"."document_comments" to "service_role";

grant references on table "public"."document_comments" to "service_role";

grant select on table "public"."document_comments" to "service_role";

grant trigger on table "public"."document_comments" to "service_role";

grant truncate on table "public"."document_comments" to "service_role";

grant update on table "public"."document_comments" to "service_role";

grant delete on table "public"."document_shares" to "anon";

grant insert on table "public"."document_shares" to "anon";

grant references on table "public"."document_shares" to "anon";

grant select on table "public"."document_shares" to "anon";

grant trigger on table "public"."document_shares" to "anon";

grant truncate on table "public"."document_shares" to "anon";

grant update on table "public"."document_shares" to "anon";

grant delete on table "public"."document_shares" to "authenticated";

grant insert on table "public"."document_shares" to "authenticated";

grant references on table "public"."document_shares" to "authenticated";

grant select on table "public"."document_shares" to "authenticated";

grant trigger on table "public"."document_shares" to "authenticated";

grant truncate on table "public"."document_shares" to "authenticated";

grant update on table "public"."document_shares" to "authenticated";

grant delete on table "public"."document_shares" to "service_role";

grant insert on table "public"."document_shares" to "service_role";

grant references on table "public"."document_shares" to "service_role";

grant select on table "public"."document_shares" to "service_role";

grant trigger on table "public"."document_shares" to "service_role";

grant truncate on table "public"."document_shares" to "service_role";

grant update on table "public"."document_shares" to "service_role";

grant delete on table "public"."document_statuses" to "anon";

grant insert on table "public"."document_statuses" to "anon";

grant references on table "public"."document_statuses" to "anon";

grant select on table "public"."document_statuses" to "anon";

grant trigger on table "public"."document_statuses" to "anon";

grant truncate on table "public"."document_statuses" to "anon";

grant update on table "public"."document_statuses" to "anon";

grant delete on table "public"."document_statuses" to "authenticated";

grant insert on table "public"."document_statuses" to "authenticated";

grant references on table "public"."document_statuses" to "authenticated";

grant select on table "public"."document_statuses" to "authenticated";

grant trigger on table "public"."document_statuses" to "authenticated";

grant truncate on table "public"."document_statuses" to "authenticated";

grant update on table "public"."document_statuses" to "authenticated";

grant delete on table "public"."document_statuses" to "service_role";

grant insert on table "public"."document_statuses" to "service_role";

grant references on table "public"."document_statuses" to "service_role";

grant select on table "public"."document_statuses" to "service_role";

grant trigger on table "public"."document_statuses" to "service_role";

grant truncate on table "public"."document_statuses" to "service_role";

grant update on table "public"."document_statuses" to "service_role";

grant delete on table "public"."document_versions" to "anon";

grant insert on table "public"."document_versions" to "anon";

grant references on table "public"."document_versions" to "anon";

grant select on table "public"."document_versions" to "anon";

grant trigger on table "public"."document_versions" to "anon";

grant truncate on table "public"."document_versions" to "anon";

grant update on table "public"."document_versions" to "anon";

grant delete on table "public"."document_versions" to "authenticated";

grant insert on table "public"."document_versions" to "authenticated";

grant references on table "public"."document_versions" to "authenticated";

grant select on table "public"."document_versions" to "authenticated";

grant trigger on table "public"."document_versions" to "authenticated";

grant truncate on table "public"."document_versions" to "authenticated";

grant update on table "public"."document_versions" to "authenticated";

grant delete on table "public"."document_versions" to "service_role";

grant insert on table "public"."document_versions" to "service_role";

grant references on table "public"."document_versions" to "service_role";

grant select on table "public"."document_versions" to "service_role";

grant trigger on table "public"."document_versions" to "service_role";

grant truncate on table "public"."document_versions" to "service_role";

grant update on table "public"."document_versions" to "service_role";

grant delete on table "public"."documents" to "anon";

grant insert on table "public"."documents" to "anon";

grant references on table "public"."documents" to "anon";

grant select on table "public"."documents" to "anon";

grant trigger on table "public"."documents" to "anon";

grant truncate on table "public"."documents" to "anon";

grant update on table "public"."documents" to "anon";

grant delete on table "public"."documents" to "authenticated";

grant insert on table "public"."documents" to "authenticated";

grant references on table "public"."documents" to "authenticated";

grant select on table "public"."documents" to "authenticated";

grant trigger on table "public"."documents" to "authenticated";

grant truncate on table "public"."documents" to "authenticated";

grant update on table "public"."documents" to "authenticated";

grant delete on table "public"."documents" to "service_role";

grant insert on table "public"."documents" to "service_role";

grant references on table "public"."documents" to "service_role";

grant select on table "public"."documents" to "service_role";

grant trigger on table "public"."documents" to "service_role";

grant truncate on table "public"."documents" to "service_role";

grant update on table "public"."documents" to "service_role";

grant delete on table "public"."invitations" to "anon";

grant insert on table "public"."invitations" to "anon";

grant references on table "public"."invitations" to "anon";

grant select on table "public"."invitations" to "anon";

grant trigger on table "public"."invitations" to "anon";

grant truncate on table "public"."invitations" to "anon";

grant update on table "public"."invitations" to "anon";

grant delete on table "public"."invitations" to "authenticated";

grant insert on table "public"."invitations" to "authenticated";

grant references on table "public"."invitations" to "authenticated";

grant select on table "public"."invitations" to "authenticated";

grant trigger on table "public"."invitations" to "authenticated";

grant truncate on table "public"."invitations" to "authenticated";

grant update on table "public"."invitations" to "authenticated";

grant delete on table "public"."invitations" to "service_role";

grant insert on table "public"."invitations" to "service_role";

grant references on table "public"."invitations" to "service_role";

grant select on table "public"."invitations" to "service_role";

grant trigger on table "public"."invitations" to "service_role";

grant truncate on table "public"."invitations" to "service_role";

grant update on table "public"."invitations" to "service_role";

grant delete on table "public"."organization_invites" to "anon";

grant insert on table "public"."organization_invites" to "anon";

grant references on table "public"."organization_invites" to "anon";

grant select on table "public"."organization_invites" to "anon";

grant trigger on table "public"."organization_invites" to "anon";

grant truncate on table "public"."organization_invites" to "anon";

grant update on table "public"."organization_invites" to "anon";

grant delete on table "public"."organization_invites" to "authenticated";

grant insert on table "public"."organization_invites" to "authenticated";

grant references on table "public"."organization_invites" to "authenticated";

grant select on table "public"."organization_invites" to "authenticated";

grant trigger on table "public"."organization_invites" to "authenticated";

grant truncate on table "public"."organization_invites" to "authenticated";

grant update on table "public"."organization_invites" to "authenticated";

grant delete on table "public"."organization_invites" to "service_role";

grant insert on table "public"."organization_invites" to "service_role";

grant references on table "public"."organization_invites" to "service_role";

grant select on table "public"."organization_invites" to "service_role";

grant trigger on table "public"."organization_invites" to "service_role";

grant truncate on table "public"."organization_invites" to "service_role";

grant update on table "public"."organization_invites" to "service_role";

grant delete on table "public"."organization_members" to "anon";

grant insert on table "public"."organization_members" to "anon";

grant references on table "public"."organization_members" to "anon";

grant select on table "public"."organization_members" to "anon";

grant trigger on table "public"."organization_members" to "anon";

grant truncate on table "public"."organization_members" to "anon";

grant update on table "public"."organization_members" to "anon";

grant delete on table "public"."organization_members" to "authenticated";

grant insert on table "public"."organization_members" to "authenticated";

grant references on table "public"."organization_members" to "authenticated";

grant select on table "public"."organization_members" to "authenticated";

grant trigger on table "public"."organization_members" to "authenticated";

grant truncate on table "public"."organization_members" to "authenticated";

grant update on table "public"."organization_members" to "authenticated";

grant delete on table "public"."organization_members" to "service_role";

grant insert on table "public"."organization_members" to "service_role";

grant references on table "public"."organization_members" to "service_role";

grant select on table "public"."organization_members" to "service_role";

grant trigger on table "public"."organization_members" to "service_role";

grant truncate on table "public"."organization_members" to "service_role";

grant update on table "public"."organization_members" to "service_role";

grant delete on table "public"."organizations" to "anon";

grant insert on table "public"."organizations" to "anon";

grant references on table "public"."organizations" to "anon";

grant select on table "public"."organizations" to "anon";

grant trigger on table "public"."organizations" to "anon";

grant truncate on table "public"."organizations" to "anon";

grant update on table "public"."organizations" to "anon";

grant delete on table "public"."organizations" to "authenticated";

grant insert on table "public"."organizations" to "authenticated";

grant references on table "public"."organizations" to "authenticated";

grant select on table "public"."organizations" to "authenticated";

grant trigger on table "public"."organizations" to "authenticated";

grant truncate on table "public"."organizations" to "authenticated";

grant update on table "public"."organizations" to "authenticated";

grant delete on table "public"."organizations" to "service_role";

grant insert on table "public"."organizations" to "service_role";

grant references on table "public"."organizations" to "service_role";

grant select on table "public"."organizations" to "service_role";

grant trigger on table "public"."organizations" to "service_role";

grant truncate on table "public"."organizations" to "service_role";

grant update on table "public"."organizations" to "service_role";

grant delete on table "public"."permissions" to "anon";

grant insert on table "public"."permissions" to "anon";

grant references on table "public"."permissions" to "anon";

grant select on table "public"."permissions" to "anon";

grant trigger on table "public"."permissions" to "anon";

grant truncate on table "public"."permissions" to "anon";

grant update on table "public"."permissions" to "anon";

grant delete on table "public"."permissions" to "authenticated";

grant insert on table "public"."permissions" to "authenticated";

grant references on table "public"."permissions" to "authenticated";

grant select on table "public"."permissions" to "authenticated";

grant trigger on table "public"."permissions" to "authenticated";

grant truncate on table "public"."permissions" to "authenticated";

grant update on table "public"."permissions" to "authenticated";

grant delete on table "public"."permissions" to "service_role";

grant insert on table "public"."permissions" to "service_role";

grant references on table "public"."permissions" to "service_role";

grant select on table "public"."permissions" to "service_role";

grant trigger on table "public"."permissions" to "service_role";

grant truncate on table "public"."permissions" to "service_role";

grant update on table "public"."permissions" to "service_role";

grant delete on table "public"."project_invites" to "anon";

grant insert on table "public"."project_invites" to "anon";

grant references on table "public"."project_invites" to "anon";

grant select on table "public"."project_invites" to "anon";

grant trigger on table "public"."project_invites" to "anon";

grant truncate on table "public"."project_invites" to "anon";

grant update on table "public"."project_invites" to "anon";

grant delete on table "public"."project_invites" to "authenticated";

grant insert on table "public"."project_invites" to "authenticated";

grant references on table "public"."project_invites" to "authenticated";

grant select on table "public"."project_invites" to "authenticated";

grant trigger on table "public"."project_invites" to "authenticated";

grant truncate on table "public"."project_invites" to "authenticated";

grant update on table "public"."project_invites" to "authenticated";

grant delete on table "public"."project_invites" to "service_role";

grant insert on table "public"."project_invites" to "service_role";

grant references on table "public"."project_invites" to "service_role";

grant select on table "public"."project_invites" to "service_role";

grant trigger on table "public"."project_invites" to "service_role";

grant truncate on table "public"."project_invites" to "service_role";

grant update on table "public"."project_invites" to "service_role";

grant delete on table "public"."project_members" to "anon";

grant insert on table "public"."project_members" to "anon";

grant references on table "public"."project_members" to "anon";

grant select on table "public"."project_members" to "anon";

grant trigger on table "public"."project_members" to "anon";

grant truncate on table "public"."project_members" to "anon";

grant update on table "public"."project_members" to "anon";

grant delete on table "public"."project_members" to "authenticated";

grant insert on table "public"."project_members" to "authenticated";

grant references on table "public"."project_members" to "authenticated";

grant select on table "public"."project_members" to "authenticated";

grant trigger on table "public"."project_members" to "authenticated";

grant truncate on table "public"."project_members" to "authenticated";

grant update on table "public"."project_members" to "authenticated";

grant delete on table "public"."project_members" to "service_role";

grant insert on table "public"."project_members" to "service_role";

grant references on table "public"."project_members" to "service_role";

grant select on table "public"."project_members" to "service_role";

grant trigger on table "public"."project_members" to "service_role";

grant truncate on table "public"."project_members" to "service_role";

grant update on table "public"."project_members" to "service_role";

grant delete on table "public"."projects" to "anon";

grant insert on table "public"."projects" to "anon";

grant references on table "public"."projects" to "anon";

grant select on table "public"."projects" to "anon";

grant trigger on table "public"."projects" to "anon";

grant truncate on table "public"."projects" to "anon";

grant update on table "public"."projects" to "anon";

grant delete on table "public"."projects" to "authenticated";

grant insert on table "public"."projects" to "authenticated";

grant references on table "public"."projects" to "authenticated";

grant select on table "public"."projects" to "authenticated";

grant trigger on table "public"."projects" to "authenticated";

grant truncate on table "public"."projects" to "authenticated";

grant update on table "public"."projects" to "authenticated";

grant delete on table "public"."projects" to "service_role";

grant insert on table "public"."projects" to "service_role";

grant references on table "public"."projects" to "service_role";

grant select on table "public"."projects" to "service_role";

grant trigger on table "public"."projects" to "service_role";

grant truncate on table "public"."projects" to "service_role";

grant update on table "public"."projects" to "service_role";

grant delete on table "public"."role_permissions" to "anon";

grant insert on table "public"."role_permissions" to "anon";

grant references on table "public"."role_permissions" to "anon";

grant select on table "public"."role_permissions" to "anon";

grant trigger on table "public"."role_permissions" to "anon";

grant truncate on table "public"."role_permissions" to "anon";

grant update on table "public"."role_permissions" to "anon";

grant delete on table "public"."role_permissions" to "authenticated";

grant insert on table "public"."role_permissions" to "authenticated";

grant references on table "public"."role_permissions" to "authenticated";

grant select on table "public"."role_permissions" to "authenticated";

grant trigger on table "public"."role_permissions" to "authenticated";

grant truncate on table "public"."role_permissions" to "authenticated";

grant update on table "public"."role_permissions" to "authenticated";

grant delete on table "public"."role_permissions" to "service_role";

grant insert on table "public"."role_permissions" to "service_role";

grant references on table "public"."role_permissions" to "service_role";

grant select on table "public"."role_permissions" to "service_role";

grant trigger on table "public"."role_permissions" to "service_role";

grant truncate on table "public"."role_permissions" to "service_role";

grant update on table "public"."role_permissions" to "service_role";

grant delete on table "public"."roles" to "anon";

grant insert on table "public"."roles" to "anon";

grant references on table "public"."roles" to "anon";

grant select on table "public"."roles" to "anon";

grant trigger on table "public"."roles" to "anon";

grant truncate on table "public"."roles" to "anon";

grant update on table "public"."roles" to "anon";

grant delete on table "public"."roles" to "authenticated";

grant insert on table "public"."roles" to "authenticated";

grant references on table "public"."roles" to "authenticated";

grant select on table "public"."roles" to "authenticated";

grant trigger on table "public"."roles" to "authenticated";

grant truncate on table "public"."roles" to "authenticated";

grant update on table "public"."roles" to "authenticated";

grant delete on table "public"."roles" to "service_role";

grant insert on table "public"."roles" to "service_role";

grant references on table "public"."roles" to "service_role";

grant select on table "public"."roles" to "service_role";

grant trigger on table "public"."roles" to "service_role";

grant truncate on table "public"."roles" to "service_role";

grant update on table "public"."roles" to "service_role";

grant delete on table "public"."user_profiles" to "anon";

grant insert on table "public"."user_profiles" to "anon";

grant references on table "public"."user_profiles" to "anon";

grant select on table "public"."user_profiles" to "anon";

grant trigger on table "public"."user_profiles" to "anon";

grant truncate on table "public"."user_profiles" to "anon";

grant update on table "public"."user_profiles" to "anon";

grant delete on table "public"."user_profiles" to "authenticated";

grant insert on table "public"."user_profiles" to "authenticated";

grant references on table "public"."user_profiles" to "authenticated";

grant select on table "public"."user_profiles" to "authenticated";

grant trigger on table "public"."user_profiles" to "authenticated";

grant truncate on table "public"."user_profiles" to "authenticated";

grant update on table "public"."user_profiles" to "authenticated";

grant delete on table "public"."user_profiles" to "service_role";

grant insert on table "public"."user_profiles" to "service_role";

grant references on table "public"."user_profiles" to "service_role";

grant select on table "public"."user_profiles" to "service_role";

grant trigger on table "public"."user_profiles" to "service_role";

grant truncate on table "public"."user_profiles" to "service_role";

grant update on table "public"."user_profiles" to "service_role";


  create policy "create comment with permission"
  on "public"."document_comments"
  as permissive
  for insert
  to authenticated
with check ((EXISTS ( SELECT 1
   FROM (public.document_versions dv
     JOIN public.documents d ON ((d.id = dv.document_id)))
  WHERE ((dv.id = document_comments.version_id) AND public.has_permission('document'::text, 'create_comment'::text, ( SELECT d_1.id
           FROM (public.document_versions dv_1
             JOIN public.documents d_1 ON ((d_1.id = dv_1.document_id)))
          WHERE (dv_1.id = document_comments.version_id)))))));



  create policy "remove comment as project admin"
  on "public"."document_comments"
  as permissive
  for delete
  to authenticated
using ((EXISTS ( SELECT 1
   FROM (public.document_versions dv
     JOIN public.documents d ON ((d.id = dv.document_id)))
  WHERE ((dv.id = document_comments.version_id) AND public.has_permission('project'::text, 'manage_documents'::text, d.project_id)))));



  create policy "select with document_read permission"
  on "public"."document_comments"
  as permissive
  for select
  to authenticated
using ((EXISTS ( SELECT 1
   FROM (public.document_versions dv
     JOIN public.documents d ON ((d.id = dv.document_id)))
  WHERE ((dv.id = document_comments.version_id) AND public.has_permission('document'::text, 'read'::text, ( SELECT d_1.id
           FROM (public.document_versions dv_1
             JOIN public.documents d_1 ON ((d_1.id = dv_1.document_id)))
          WHERE (dv_1.id = document_comments.version_id)))))));



  create policy "read own shares and with permission"
  on "public"."document_shares"
  as permissive
  for select
  to authenticated
using (((user_id = auth.uid()) OR public.has_permission('document'::text, 'share'::text, document_id)));



  create policy "remove share with permission"
  on "public"."document_shares"
  as permissive
  for delete
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public.documents d
  WHERE ((d.id = document_shares.document_id) AND public.has_permission('project'::text, 'manage_documents'::text, d.project_id)))));



  create policy "share with permission"
  on "public"."document_shares"
  as permissive
  for insert
  to authenticated
with check ((EXISTS ( SELECT 1
   FROM public.documents d
  WHERE ((d.id = document_shares.document_id) AND (public.has_permission('document'::text, 'share'::text, document_shares.document_id) OR public.has_permission('project'::text, 'manage_documents'::text, d.project_id))))));



  create policy "add statuses as project admin"
  on "public"."document_statuses"
  as permissive
  for insert
  to authenticated
with check (public.has_permission('project'::text, 'manage_documents'::text, project_id));



  create policy "edit statuses as project admin"
  on "public"."document_statuses"
  as permissive
  for update
  to authenticated
using (public.has_permission('project'::text, 'manage_documents'::text, project_id))
with check (public.has_permission('project'::text, 'manage_documents'::text, project_id));



  create policy "read as project member"
  on "public"."document_statuses"
  as permissive
  for select
  to authenticated
using ((public.is_project_member(project_id) OR (project_id IS NULL)));



  create policy "remove statuses as project admin"
  on "public"."document_statuses"
  as permissive
  for delete
  to authenticated
using (public.has_permission('project'::text, 'manage_documents'::text, project_id));



  create policy "add a new version"
  on "public"."document_versions"
  as permissive
  for insert
  to authenticated
with check ((EXISTS ( SELECT 1
   FROM public.documents d
  WHERE ((d.id = document_versions.document_id) AND public.has_permission('document'::text, 'upload'::text, ( SELECT dv.document_id
           FROM public.document_versions dv
          WHERE (dv.id = document_versions.id)))))));



  create policy "delete versions"
  on "public"."document_versions"
  as permissive
  for delete
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public.documents d
  WHERE ((d.id = document_versions.document_id) AND public.has_permission('document'::text, 'delete'::text, ( SELECT dv.document_id
           FROM public.document_versions dv
          WHERE (dv.id = document_versions.id)))))));



  create policy "read versions with permission"
  on "public"."document_versions"
  as permissive
  for select
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public.documents d
  WHERE ((d.id = document_versions.document_id) AND (public.has_permission('document'::text, 'version_history'::text, document_versions.document_id) OR public.has_permission('project'::text, 'manage_documents'::text, d.project_id))))));



  create policy "can read documents with permission"
  on "public"."documents"
  as permissive
  for select
  to authenticated
using ((public.has_permission('document'::text, 'read'::text, id) OR public.has_permission('project'::text, 'manage_documents'::text, project_id)));



  create policy "create document with permission"
  on "public"."documents"
  as permissive
  for insert
  to authenticated
with check ((public.has_permission('project'::text, 'create_document'::text, project_id) OR public.has_permission('project'::text, 'manage_documents'::text, project_id)));



  create policy "delete document with permission"
  on "public"."documents"
  as permissive
  for delete
  to authenticated
using ((public.has_permission('document'::text, 'delete'::text, id) OR public.has_permission('project'::text, 'manage_documents'::text, project_id)));



  create policy "edit document details with permission"
  on "public"."documents"
  as permissive
  for update
  to authenticated
using ((public.has_permission('document'::text, 'edit'::text, id) OR public.has_permission('project'::text, 'manage_documents'::text, project_id)))
with check ((public.has_permission('document'::text, 'edit'::text, id) OR public.has_permission('project'::text, 'manage_documents'::text, project_id)));



  create policy "invitations_insert"
  on "public"."invitations"
  as permissive
  for insert
  to authenticated
with check ((((organization_id IS NOT NULL) AND public.has_permission('organization'::text, 'invite_member'::text, organization_id)) OR ((project_id IS NOT NULL) AND public.has_permission('project'::text, 'invite_member'::text, project_id))));



  create policy "invitations_select"
  on "public"."invitations"
  as permissive
  for select
  to authenticated
using ((inviter_id = auth.uid()));



  create policy "Invites updated only via backend functions"
  on "public"."organization_invites"
  as permissive
  for update
  to authenticated
using (false)
with check (false);



  create policy "Org admins and inviters can view invites"
  on "public"."organization_invites"
  as permissive
  for select
  to authenticated
using (((invited_by = auth.uid()) OR public.has_permission('organization'::text, 'invite_member'::text, organization_id)));



  create policy "Org admins can delete invites"
  on "public"."organization_invites"
  as permissive
  for delete
  to authenticated
using (public.has_permission('organization'::text, 'invite_member'::text, organization_id));



  create policy "Org members with invite permission can create invites"
  on "public"."organization_invites"
  as permissive
  for insert
  to authenticated
with check (public.has_permission('organization'::text, 'invite_member'::text, organization_id));



  create policy "Members can view their organization membership"
  on "public"."organization_members"
  as permissive
  for select
  to authenticated
using (((user_id = auth.uid()) OR public.is_org_admin(organization_id)));



  create policy "admins can edit members"
  on "public"."organization_members"
  as permissive
  for update
  to authenticated
using (public.is_org_admin(organization_id))
with check (public.is_org_admin(organization_id));



  create policy "admins can remove members"
  on "public"."organization_members"
  as permissive
  for delete
  to authenticated
using (public.is_org_admin(organization_id));



  create policy "org admins can add members"
  on "public"."organization_members"
  as permissive
  for insert
  to authenticated
with check (public.is_org_admin(organization_id));



  create policy "Users can view organizations they belong to"
  on "public"."organizations"
  as permissive
  for select
  to authenticated
using ((public.has_permission('organization'::text, 'read'::text, id) OR (EXISTS ( SELECT 1
   FROM public.projects p
  WHERE ((p.organization_id = organizations.id) AND public.has_permission('project'::text, 'read'::text, p.id))))));



  create policy "delete_organization_with_permission"
  on "public"."organizations"
  as permissive
  for delete
  to authenticated
using (public.has_permission('organization'::text, 'delete'::text, id));



  create policy "organization_update_permission"
  on "public"."organizations"
  as permissive
  for update
  to authenticated
using (public.has_permission('organization'::text, 'edit'::text, id))
with check (public.has_permission('organization'::text, 'edit'::text, id));



  create policy "Enable read access for all users"
  on "public"."permissions"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Project admins and inviters can view invites"
  on "public"."project_invites"
  as permissive
  for select
  to authenticated
using (((invited_by = auth.uid()) OR public.has_permission('project'::text, 'invite_member'::text, project_id)));



  create policy "Project admins can delete invites"
  on "public"."project_invites"
  as permissive
  for delete
  to authenticated
using (public.has_permission('project'::text, 'invite_member'::text, project_id));



  create policy "Project invites updated only via backend functions"
  on "public"."project_invites"
  as permissive
  for update
  to authenticated
using (false)
with check (false);



  create policy "Project members with invite permission can create invites"
  on "public"."project_invites"
  as permissive
  for insert
  to authenticated
with check (public.has_permission('project'::text, 'invite_member'::text, project_id));



  create policy "Members can view members"
  on "public"."project_members"
  as permissive
  for select
  to authenticated
using (public.is_project_member(project_id));



  create policy "admins and members with permission can add members"
  on "public"."project_members"
  as permissive
  for insert
  to authenticated
with check ((public.is_org_admin(( SELECT projects.organization_id
   FROM public.projects
  WHERE (projects.id = project_members.project_id))) OR public.has_permission('project'::text, 'invite_member'::text, project_id)));



  create policy "members with permission can remove members"
  on "public"."project_members"
  as permissive
  for delete
  to authenticated
using ((public.has_permission('project'::text, 'remove_member'::text, project_id) OR public.is_org_admin(( SELECT projects.organization_id
   FROM public.projects
  WHERE (projects.id = project_members.project_id)))));



  create policy "members with permission can update members"
  on "public"."project_members"
  as permissive
  for update
  to authenticated
using (public.has_permission('project'::text, 'manage_roles'::text, project_id))
with check (public.has_permission('project'::text, 'manage_roles'::text, project_id));



  create policy "members_can_select_their_projects"
  on "public"."projects"
  as permissive
  for select
  to authenticated
using ((public.has_permission('project'::text, 'read'::text, id) OR public.has_permission('organization'::text, 'read'::text, organization_id)));



  create policy "project_delete_with_permission"
  on "public"."projects"
  as permissive
  for delete
  to authenticated
using (public.has_permission('project'::text, 'delete'::text, id));



  create policy "project_insert_with_permission"
  on "public"."projects"
  as permissive
  for insert
  to authenticated
with check (public.has_permission('organization'::text, 'create_project'::text, organization_id));



  create policy "project_update_with_permission"
  on "public"."projects"
  as permissive
  for update
  to authenticated
using (public.has_permission('project'::text, 'delete'::text, id))
with check (public.has_permission('project'::text, 'delete'::text, id));



  create policy "delete_with_permissions"
  on "public"."role_permissions"
  as permissive
  for delete
  to authenticated
using ((public.has_permission('project'::text, 'manage_roles'::text, ( SELECT roles.project_id
   FROM public.roles
  WHERE (roles.id = role_permissions.role_id))) OR public.has_permission('organization'::text, 'manage_roles'::text, ( SELECT roles.organization_id
   FROM public.roles
  WHERE (roles.id = role_permissions.role_id)))));



  create policy "role_permissions_insert"
  on "public"."role_permissions"
  as permissive
  for insert
  to authenticated
with check ((public.has_permission('project'::text, 'manage_roles'::text, ( SELECT roles.project_id
   FROM public.roles
  WHERE (roles.id = role_permissions.role_id))) OR public.has_permission('organization'::text, 'manage_roles'::text, ( SELECT roles.organization_id
   FROM public.roles
  WHERE (roles.id = role_permissions.role_id)))));



  create policy "role_permissoins_select"
  on "public"."role_permissions"
  as permissive
  for select
  to authenticated
using (true);



  create policy "roles_delete"
  on "public"."roles"
  as permissive
  for delete
  to authenticated
using ((((scope = 'project'::text) AND public.has_permission('project'::text, 'manage_roles'::text, project_id)) OR ((scope = 'organization'::text) AND public.has_permission('organization'::text, 'manage_roles'::text, organization_id))));



  create policy "roles_insert"
  on "public"."roles"
  as permissive
  for insert
  to authenticated
with check ((((scope = 'project'::text) AND (project_id IS NOT NULL) AND public.has_permission('project'::text, 'manage_roles'::text, project_id)) OR ((scope = 'document'::text) AND (project_id IS NOT NULL) AND public.has_permission('project'::text, 'manage_roles'::text, project_id)) OR ((scope = 'organization'::text) AND (organization_id IS NOT NULL) AND public.has_permission('organization'::text, 'manage_roles'::text, organization_id))));



  create policy "roles_select"
  on "public"."roles"
  as permissive
  for select
  to authenticated
using ((((project_id IS NULL) AND (organization_id IS NULL)) OR ((project_id IN ( SELECT project_members.project_id
   FROM public.project_members
  WHERE (project_members.user_id = auth.uid()))) OR (organization_id IN ( SELECT organization_members.organization_id
   FROM public.organization_members
  WHERE (organization_members.user_id = auth.uid()))))));



  create policy "roles_update"
  on "public"."roles"
  as permissive
  for update
  to authenticated
using ((((scope = 'project'::text) AND public.has_permission('project'::text, 'manage_roles'::text, project_id)) OR ((scope = 'organization'::text) AND public.has_permission('organization'::text, 'manage_roles'::text, organization_id))))
with check ((((scope = 'project'::text) AND public.has_permission('project'::text, 'manage_roles'::text, project_id)) OR ((scope = 'organization'::text) AND public.has_permission('organization'::text, 'manage_roles'::text, organization_id))));



  create policy "user can edit their profile"
  on "public"."user_profiles"
  as permissive
  for update
  to authenticated
using ((id = auth.uid()))
with check ((id = auth.uid()));



  create policy "user can insert their profile"
  on "public"."user_profiles"
  as permissive
  for insert
  to authenticated
with check ((id = auth.uid()));



  create policy "user_profiles_select"
  on "public"."user_profiles"
  as permissive
  for select
  to authenticated
using ((true OR ((id = auth.uid()) OR (EXISTS ( SELECT 1
   FROM (public.project_members pm1
     JOIN public.project_members pm2 ON ((pm1.project_id = pm2.project_id)))
  WHERE ((pm1.user_id = auth.uid()) AND (pm2.user_id = user_profiles.id)))) OR (EXISTS ( SELECT 1
   FROM (public.organization_members om1
     JOIN public.organization_members om2 ON ((om1.organization_id = om2.organization_id)))
  WHERE ((om1.user_id = auth.uid()) AND (om2.user_id = user_profiles.id)))))));



  create policy "Allow public read 1oj01fe_0"
  on "storage"."objects"
  as permissive
  for select
  to authenticated, anon
using ((bucket_id = 'avatars'::text));



  create policy "documents_delete"
  on "storage"."objects"
  as permissive
  for delete
  to authenticated
using (((bucket_id = 'documents'::text) AND ((EXISTS ( SELECT 1
   FROM (((public.document_shares ds
     JOIN public.roles r ON ((r.id = ds.role_id)))
     JOIN public.role_permissions rp ON ((rp.role_id = r.id)))
     JOIN public.permissions p ON ((p.id = rp.permission_id)))
  WHERE ((ds.user_id = auth.uid()) AND (ds.document_id = (split_part(r.name, '/'::text, 3))::uuid) AND (p.scope = 'document'::text) AND (p.permission = 'delete'::text)))) OR public.has_permission('project'::text, 'manage_documents'::text, (split_part(name, '/'::text, 2))::uuid))));



  create policy "documents_read"
  on "storage"."objects"
  as permissive
  for select
  to authenticated
using (((bucket_id = 'documents'::text) AND ((EXISTS ( SELECT 1
   FROM (((public.document_shares ds
     JOIN public.roles r ON ((r.id = ds.role_id)))
     JOIN public.role_permissions rp ON ((rp.role_id = r.id)))
     JOIN public.permissions p ON ((p.id = rp.permission_id)))
  WHERE ((ds.user_id = auth.uid()) AND (ds.document_id = (split_part(r.name, '/'::text, 3))::uuid) AND (p.scope = 'document'::text) AND (p.permission = ANY (ARRAY['read'::text, 'version_history'::text]))))) OR public.has_permission('project'::text, 'manage_documents'::text, (split_part(name, '/'::text, 2))::uuid))));



  create policy "documents_upload"
  on "storage"."objects"
  as permissive
  for insert
  to authenticated
with check (((bucket_id = 'documents'::text) AND (
CASE
    WHEN (length(split_part(name, '/'::text, 2)) = 36) THEN public.has_permission('project'::text, 'manage_documents'::text, (split_part(name, '/'::text, 2))::uuid)
    ELSE false
END OR (EXISTS ( SELECT 1
   FROM (((public.document_shares ds
     JOIN public.roles r ON ((r.id = ds.role_id)))
     JOIN public.role_permissions rp ON ((rp.role_id = r.id)))
     JOIN public.permissions p ON ((p.id = rp.permission_id)))
  WHERE ((ds.user_id = auth.uid()) AND (length(split_part(objects.name, '/'::text, 3)) = 36) AND (ds.document_id = (split_part(objects.name, '/'::text, 3))::uuid) AND (p.scope = 'document'::text) AND (p.permission = ANY (ARRAY['upload'::text, 'edit'::text]))))))));



  create policy "user can delete their avatar 1oj01fe_0"
  on "storage"."objects"
  as permissive
  for delete
  to authenticated
using (((bucket_id = 'avatars'::text) AND (split_part(name, '/'::text, 1) = (auth.uid())::text)));



  create policy "user can edit their avatar 1oj01fe_0"
  on "storage"."objects"
  as permissive
  for update
  to authenticated
using (((bucket_id = 'avatars'::text) AND (split_part(name, '/'::text, 1) = (auth.uid())::text)))
with check (((bucket_id = 'avatars'::text) AND (split_part(name, '/'::text, 1) = (auth.uid())::text)));



  create policy "user can insert their avatar 1oj01fe_0"
  on "storage"."objects"
  as permissive
  for insert
  to authenticated
with check (((bucket_id = 'avatars'::text) AND (split_part(name, '/'::text, 1) = (auth.uid())::text)));



