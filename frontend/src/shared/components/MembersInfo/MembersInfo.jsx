import React from 'react';
import Dropdown from '../Dropdown/Dropdown.jsx';
import { Delete as DeleteIcon } from '@mui/icons-material';

export default function MembersInfo({
    member,
    roles,
    onRoleChange,
    onRemove
}) {

  return (
    <div
      className="
        flex items-center justify-between
        glass-flat border rounded-lg
        px-4 py-3 distance-bottom-sm
      "
    >
      {/* Left: avatar + info */}
        <div className="flex items-center gap-3 ">
            {/* Avatar */}
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
            {member.avatar_url ? (
                <img
                src={member.avatar_url}
                alt=""
                className="w-full h-full object-cover"
                />
            ) : (
                <span className="text-sm">👤</span>
            )}
            </div>

            {/* User info */}
            <div className="flex flex-col text-left">
                <span className="text-sm text-white">
                    {member.display_name ?? 'Unknown user'}
                </span>
            </div>
        </div>
        
        <div className='flex items-center gap-2'>
          {onRoleChange ? (
            <Dropdown
              value={member.role_id}
              roles={roles}
              onChange={(newRoleId) =>
                onRoleChange(member, newRoleId)
              }
            />
            ) : (
              <span className="text-sm text-white/70 px-2">
                {roles?.find(r => r.id === member.role_id)?.label ?? '—'}
              </span>
          )}
        
          <button
              onClick={() => onRemove()}
              className="glass-btn" 
              title="Remove member"
          >
              <DeleteIcon fontSize="small" />
          </button>
        </div>
       
        
    </div>
  );
}