import { useState, useEffect } from 'react';
import { useAppData } from '@/shared/context/AppDataContextBase';
import { InfoFieldButton } from '@/shared/components';
import { Modal, EntityFormDialog, ActionButton } from '@/shared/components';


export function OrganizationsPage() {
  const {
    addOrganization,
    loadOrganizations,
    organizations,
  } = useAppData();

  const [open, setOpen] = useState(false);
  const [isLoadingOrganizations, setIsLoadingOrganizations] = useState(false);

  // Load organizations on component mount
  useEffect(() => {
    handleLoadOrganizations();
  }, []);

  const handleLoadOrganizations = async () => {
    setIsLoadingOrganizations(true);
    try {
      await loadOrganizations();
    } catch (error) {
      console.error('Error loading organizations:', error);
    } finally {
      setIsLoadingOrganizations(false);
    }
  };

  return (
    <div className="h-screen text-[var(--color-text)]">
      <div
        className="
          px-4            /* mobile */
          md:px-8         /* tablet */
          xl:px-[250px]   /* desktop / FHD */
          py-[120px]
          space-y-10
        "
      >
        <div className="flex items-center justify-between gap-8">
          <h1 className="text-4xl text-left font-semibold distance-bottom-sm">Organisations</h1>
          <ActionButton
            variant="add"
            onClick={() => setOpen(true)}
          />
        </div>

        <hr className="border-white/20 distance-bottom-md" />

        <section className="grid gap-8 grid-cols-2">
          {organizations.map((organization) => (
            <InfoFieldButton
              key={organization.id}
              id={organization.id}
              title={organization.name}
              description={organization.description}
              date={organization.created_at}
              to={`/organizations/${organization.id}/projects`}
            />
          ))}
        </section>

        <Modal isOpen={open} onClose={() => setOpen(false)}>
         <EntityFormDialog
            title="Create Organsiation"
            field1Label="Name"
            field2Label="Description"
            onCancel={() => setOpen(false)}
            onCreate={async (data) => {
              await addOrganization({
                name: data.field1,
                description: data.field2,
              });

              await handleLoadOrganizations();
              setOpen(false);
            }}
          />
        </Modal>
      </div>
    </div>
  );
}
