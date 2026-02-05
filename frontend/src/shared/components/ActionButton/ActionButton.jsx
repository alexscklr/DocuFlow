import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CloudUpload as UploadIcon,
  CloudDownload as DownloadIcon,
  Group as MembersIcon,
  Label as StatusIcon,
} from '@mui/icons-material';

const ICONS = {
  add: <AddIcon fontSize="small" />,
  edit: <EditIcon fontSize="small" />,
  delete: <DeleteIcon fontSize="small" />,
  upload: <UploadIcon fontSize="small" />,
  download: <DownloadIcon fontSize="small" />,
  status: <StatusIcon fontSize="small" />,
  members: <MembersIcon fontSize="small" />,
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
  status: 'hover:bg-purple-500/10',
  members: 'hover:bg-purple-500/10',
};

export default function ActionButton({
  variant = 'add',
  onClick,
  visible = true,
  disabled = false,
}) {
  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        ${STYLES.base}
        ${STYLES[variant]}
        ${disabled ? 'opacity-40 cursor-not-allowed pointer-events-none' : ''}
      `}
    >
      {ICONS[variant]}
    </button>
  );
}