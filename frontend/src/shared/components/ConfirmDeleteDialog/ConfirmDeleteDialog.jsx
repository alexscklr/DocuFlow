export default function ConfirmDeleteDialog({
  title = 'Delete',
  text,
  onCancel,
  onConfirm,
}) {
  return (
    <div className="w-full max-w-md glass glass-border rounded-lg p-6">
      <div className="flex flex-col">
        <h2 className="text-lg font-semibold text-white distance-bottom-sm">
          {title}
        </h2>

        <p className="text-sm text-white distance-bottom-sm">
          {text}
        </p>

        <div className="flex justify-between gap-4 pt-2">
          <button onClick={onCancel} className="glass-btn px-4 py-1">Cancel</button>
          <button onClick={onConfirm} className="glass-btn px-4 py-1 text-red-400 hover:text-red-300">Delete</button>
        </div>
      </div>
    </div>
  );
}