import { useNavigate } from 'react-router-dom';

export default function InfoFieldButton({ title, description, date, to }) {
const navigate = useNavigate();

return (
    <button className="border glass rounded-lg p-4 text-left" onClick={() => navigate(to)}>
      <div className="flex justify-between">
        <p className="text-2xs distance-bottom-sm text-white">
          {title}
        </p>
        <p className="text-xs distance-bottom-sm text-gray-300">
          {new Date(date).toLocaleDateString()}
        </p>
      </div>

      <p className="text-xs distance-bottom-sm text-white">
        {description}
      </p>
    </button>
  );
}