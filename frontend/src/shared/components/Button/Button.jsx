import { useNavigate } from 'react-router-dom';

export default function Button({ icon, label, slug, iconPosition = "top", className = ""}) {

    const navigate = useNavigate();

    const positionClasses = {
        top: "flex flex-col items-center gap-2",
        left: "flex flex-row items-center gap-2",
        right: "flex flex-row items-center gap-2 flex-row-reverse",
    };
    return <button onClick={() => navigate(`${slug}`)} className={`glass-btn px-4 py-2 ${positionClasses[iconPosition]} ${className}`}> 
      {icon && (
        <img
          src={icon}
          alt=""
          className="w-6 h-6 object-contain"
        />
      )}

      <span>{label}</span>
   </button>;
}