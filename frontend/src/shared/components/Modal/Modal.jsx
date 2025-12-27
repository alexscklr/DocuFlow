export default function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
     <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Content wrapper */}
      <div className="relative z-10 flex min-h-full items-center justify-center p-4">
        {children}
      </div>
    </div>
  );
}