import { useState, useEffect } from 'react';
import { useAppData } from '@/shared/context/AppDataContextBase';
import { OrganizationField } from '@/shared/components';
import { Modal, CreateDialog } from '@/shared/components';


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
            <button onClick={() => setOpen(true)} className="w-8 h-8 border-2 rounded-full text-3xl flex items-center justify-center hover:bg-white/10">
              +
            </button>
        </div>

        <hr className="border-white/20 distance-bottom-md" />

        <section className="grid gap-8 grid-cols-2">
          {organizations.map((organization) => (
            <OrganizationField
              key={organization.id}
              id={organization.id}
              organizationName={organization.name}
              description={organization.description}
              date={organization.created_at}
            />
          ))}
        </section>

        <Modal isOpen={open} onClose={() => setOpen(false)}>
         <CreateDialog
            title="Create organisation"
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
