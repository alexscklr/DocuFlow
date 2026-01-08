import { useState, useEffect } from 'react';
import { useMembers } from '@/shared/hooks/useMembers';
import { InfoFieldButton } from '@/shared/components';
import { Modal, EntityFormDialog, ActionButton } from '@/shared/components';


export function MembersPage() {
  const {
    addMember,
    loadMembers,
    members,
  } = useMembers();

  const [open, setOpen] = useState(false);
  const [isLoadingMembers, setIsLoadingMembers] = useState(false);

  // Load members on component mount
  useEffect(() => {
    handleLoadMembers();
  }, []);

  const handleLoadMembers = async () => {
    setIsLoadingMembers(true);
    try {
      await loadMembers();
    } catch (error) {
      console.error('Error loading members:', error);
    } finally {
      setIsLoadingMembers(false);
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
          <h1 className="text-4xl text-left font-semibold distance-bottom-sm">Members</h1>
          <ActionButton
            variant="add"
            onClick={() => setOpen(true)}
          />
        </div>

        <hr className="border-white/20 distance-bottom-md" />

        <section className="grid gap-8 grid-cols-2">
          {members.map((member) => (
            <InfoFieldButton
              key={member.id}
              id={member.id}
              title={member.display_name || member.email || 'Unnamed Member'}
              description={member.phone_number || member.email || 'No description'}
              date={member.created_at}
              to={`/members/${member.id}`}
            />
          ))}
        </section>

        <Modal isOpen={open} onClose={() => setOpen(false)}>
         <EntityFormDialog
            title="Create Member"
            field1Label="Display Name"
            field2Label="Email"
            onCancel={() => setOpen(false)}
            onCreate={async (data) => {
              await addMember({
                display_name: data.field1,
                email: data.field2,
              });

              await handleLoadMembers();
              setOpen(false);
            }}
          />
        </Modal>
      </div>
    </div>
  );
}
