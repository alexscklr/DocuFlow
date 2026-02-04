import { useState, useRef, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';


function measureTextWidth(text, font) {
  const canvas =
    measureTextWidth.canvas ||
    (measureTextWidth.canvas = document.createElement('canvas'));

  const context = canvas.getContext('2d');
  context.font = font;
  return context.measureText(text).width;
}

export default function Dropdown({ value, roles, onChange , variant }) {
  const [open, setOpen] = useState(false);
  const btnRef = useRef(null);
  const [pos, setPos] = useState(null);

  const current = roles.find(r => r.id === value);

  const longestLabelWidth = useMemo(() => {
    return roles.reduce((max, r) => {
      return Math.max(
        max,
        measureTextWidth(r.label, '12px system-ui')
      );
    }, 0);
  }, [roles]);

  useEffect(() => {
    if (!open || !btnRef.current) return;

    const rect = btnRef.current.getBoundingClientRect();

    const padding = 32; // arrow + paddings
    const finalWidth = Math.max(
      rect.width,
      longestLabelWidth + padding
    );

    setPos({
      top: rect.bottom + 6,
      left: rect.left,
      width: finalWidth,
    });
  }, [open, longestLabelWidth]);

  useEffect(() => {
    if (!open) return;

    const handleScroll = () => {
      setOpen(false);
    };

    window.addEventListener('scroll', handleScroll, true);

    return () => {
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [open]);

  return (
    <>
     <button
        ref={btnRef}
        onClick={() => setOpen(v => !v)}
        className={`
          glass-btn text-sm flex items-center justify-between
          ${variant === 'invite'
            ? 'h-10 min-w-[90px] px-3'
            : 'px-4 py-1'
          }
        `}
      >
      {current?.label ?? 'Role'}
      <span className="opacity-60">▾</span>
    </button>


      {open && pos &&
        createPortal(
          <div
            className="glass-flat-dropdown fixed overflow-hidden rounded-xl z-50"
            style={{
              top: pos.top,
              left: pos.left,
              width: pos.width,
            }}
          >
            {roles.map(role => (
              <div
                key={role.id}
                className="px-4 py-2 text-xs cursor-pointer hover:bg-white/10"
                onClick={() => {
                  onChange(role.id);
                  setOpen(false);
                }}
              >
                {role.label}
              </div>
            ))}
          </div>,
          document.body
        )
      }
    </>
  );
}