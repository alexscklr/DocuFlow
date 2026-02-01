const ICONS = {
  add: '+',
  edit: '✎',
  delete: 'x',
  upload: '↑',
  download: '↓',
  members: '👥',
};

const STYLES = {
  base: `
    w-8 h-8
    border
    glass
    rounded-full
    grid place-items-center
    text-xl leading-none
    transition-colors`,
  add: 'hover:bg-white/10',
  edit: 'hover:bg-blue-500/10',
  delete: 'hover:bg-red-500/10',
  upload: 'hover:bg-green-500/10',
  download: 'hover:bg-blue-500/10',
  members: 'hover:bg-purple-500/10',
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