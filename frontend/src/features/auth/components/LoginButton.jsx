import { useNavigate } from 'react-router-dom';
import { useAppData } from '@/shared/context/AppDataContextBase';
import { Button } from '@/shared/components';

export const LoginButton = () => {
  const { profile } = useAppData();
  const navigate = useNavigate();

 if (!profile) {
    return (
      <Button
        label="Login"
        slug="/access"
      />
    );
  }

  return (
    <button
      onClick={() => navigate(`/profile/${profile.id}`)}
      className="
        flex items-center gap-2
        px-3 py-2
        transition
      "
    >
      {/* label */}
      <span className="text-xl truncate max-w-[140px]">
        {profile.display_name}
      </span>

      {/* avatar icon */}
      <span className="w-8 h-8 rounded-full overflow-hidden bg-white/20 shrink-0">
        {profile.avatar_url ? (
          <img
            src={profile.avatar_url}
            alt="avatar"
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="w-full h-full flex items-center justify-center text-xs font-semibold">
            {(profile.display_name || profile.email)?.[0]?.toUpperCase()}
          </span>
        )}
      </span>
    </button>
  );
};