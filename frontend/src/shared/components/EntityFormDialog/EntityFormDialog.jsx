import { useState } from 'react';

export default function EntityFormDialog({
  width = '520px',
  title,
  field1Label,
  field2Label,
  initialValues = { field1: '', field2: '' },
  submitLabel = 'Create',
  onCancel,
  onSubmit,
}) {
  const [field1, setField1] = useState(initialValues.field1);
  const [field2, setField2] = useState(initialValues.field2);

  const isSubmitDisabled = !field1.trim();

  const handleSubmit = () => {
    onSubmit({
      field1,
      field2,
    });
  };

  return (
     <div
      style={{ maxWidth: width }}
      className="w-full border glass rounded-lg p-6"
    >
      <div className="flex flex-col items-center">
        <h2 className="text-lg font-semibold text-white distance-bottom-sm">
          {title}
        </h2>

        <div className="w-full distance-bottom-sm">
          <label className="block text-2xs text-white text-left">
            {field1Label}
          </label>
          <input
            value={field1}
            onChange={(e) => setField1(e.target.value)}
            className="
             glass w-full px-3 py-2 text-sm bg-transparent outline-none focus-visible:ring-2 focus-visible:ring-white/40"
          />
        </div>

        <div className="w-full distance-bottom-md">
          <label className="block text-2xs text-white text-left">
            {field2Label}
          </label>
          <input
            value={field2}
            onChange={(e) => setField2(e.target.value)}
            className="glass w-full px-3 py-2 text-sm bg-transparent outline-none focus-visible:ring-2 focus-visible:ring-white/40"
          />
        </div>

        {/* Actions */}
        <div className="w-full flex justify-between gap-4 pt-2">
          <button
            onClick={onCancel}
            className="glass-btn px-4 py-1"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            className={`
              glass-btn px-4 py-1
              ${isSubmitDisabled ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
           {submitLabel}
          </button>
        </div>
      </div>
    </div>
  );
}