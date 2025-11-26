import { useEffect } from "react";
import { ORGANIZATION_PROJECTS } from "@/shared/lib";

export function OrganizationsPage() {
  useEffect(() => {
    // Force light theme while this page is visible to match the wireframe background.
    document.body.classList.add("light");
    return () => document.body.classList.remove("light");
  }, []);

  return (
    <div className="min-h-screen text-[var(--color-text)]">
      <header className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-text)]/30">
        <div className="text-3xl font-semibold">DokuFlow</div>
        <button type="button" className="text-sm">
          Login
        </button>
      </header>

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
          <h1 className="text-5xl font-light">Organisation</h1>
          <button
            type="button"
            aria-label="Add"
            className="w-14 h-14 border-2 border-[var(--color-text)] rounded-full text-3xl leading-none flex items-center justify-center"
          >
            +
          </button>
        </div>

        <hr className="border-[var(--color-text)]/40" />

        <section className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {ORGANIZATION_PROJECTS.map((project) => (
            <article
              key={project.id}
              className="glass border border-[var(--color-text)]/30 rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <span className="w-6 h-6 border border-[var(--color-text)] rounded-full flex items-center justify-center text-xs">
                    ✕
                  </span>
                  <span>{project.name}</span>
                </div>
                <span className="text-xs">{project.date}</span>
              </div>
              <p className="text-xs leading-relaxed text-[var(--color-text)]/80">
                {project.description}
              </p>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
