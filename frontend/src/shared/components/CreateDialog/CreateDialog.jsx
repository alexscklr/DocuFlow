import { useState } from 'react';

export default function CreateDialog({
  title,
  field1Label,
  field2Label,
  onCancel,
  onCreate,
}) {
  const [field1, setField1] = useState('');
  const [field2, setField2] = useState('');

  const handleCreate = () => {
    onCreate({
      field1,
      field2,
    });
  };

  return (
    <div className="w-full max-w-md border glass rounded-lg p-4 space-y-4">
      <h2 className="text-sm font-semibold text-white">{title}</h2>

      <div>
        <label className="text-xs text-gray-300">{field1Label}</label>
        <input
          value={field1}
          onChange={(e) => setField1(e.target.value)}
          className="w-full border bg-transparent px-2 py-1 text-white"
        />
      </div>

      <div>
        <label className="text-xs text-gray-300">{field2Label}</label>
        <input
          value={field2}
          onChange={(e) => setField2(e.target.value)}
          className="w-full border bg-transparent px-2 py-1 text-white"
        />
      </div>

      <div className="flex justify-end gap-2">
        <button onClick={onCancel}>Cancel</button>

        <button
          type="button"
          onClick={handleCreate}
        >
          Create
        </button>
      </div>
    </div>
  );
}