const ICONS = {
  add: '+',
  edit: '✎',
  delete: 'x',
};

const STYLES = {
  base: `
    w-8 h-8
    border 
    glass
    rounded-full
    flex items-center justify-center
    text-xl
    transition-colors
  `,
  add: 'hover:bg-white/10',
  edit: 'hover:bg-blue-500/10',
  delete: 'hover:bg-red-500/10',
};

export default function ActionButton({
  variant = 'add',
  onClick,

  /** permissions */
  visible = true,
}) {
  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        ${STYLES.base}
        ${STYLES[variant]}
      `}
    >
      {ICONS[variant]}
    </button>
  );
}