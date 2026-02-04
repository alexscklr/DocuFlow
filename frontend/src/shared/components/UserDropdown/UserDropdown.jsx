import { useState, useRef, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';

function measureTextWidth(text, font = '14px system-ui') {
  const canvas =
    measureTextWidth.canvas ||
    (measureTextWidth.canvas = document.createElement('canvas'));

  const ctx = canvas.getContext('2d');
  ctx.font = font;
  return ctx.measureText(text).width;
}

export default function UserDropdown({
  value,
  users,
  onChange,
  placeholder = 'Select project member',
}) {
  const [open, setOpen] = useState(false);
  const btnRef = useRef(null);
  const [pos, setPos] = useState(null);

  const current = users.find(u => u.id === value);

  const longestLabelWidth = useMemo(() => {
    return users.reduce(
      (max, u) => Math.max(max, measureTextWidth(u.label)),
      0
    );
  }, [users]);

  useEffect(() => {
    if (!open || !btnRef.current) return;

    const rect = btnRef.current.getBoundingClientRect();
    const padding = 40;

    setPos({
      top: rect.bottom + 6,
      left: rect.left,
      width: Math.max(rect.width, longestLabelWidth + padding),
    });
  }, [open, longestLabelWidth]);

  useEffect(() => {
    if (!open) return;

    const close = () => setOpen(false);
    window.addEventListener('scroll', close, true);
    window.addEventListener('resize', close);

    return () => {
      window.removeEventListener('scroll', close, true);
      window.removeEventListener('resize', close);
    };
  }, [open]);

  return (
    <>
      <button
        ref={btnRef}
        onClick={() => setOpen(v => !v)}
        className="
          glass w-full px-3 py-2 text-sm
          flex items-center justify-between
          cursor-pointer
        "
      >
        <span className={current ? 'text-white' : 'text-white/50'}>
          {current?.label ?? placeholder}
        </span>
        <span className="opacity-60">▾</span>
      </button>

      {open && pos &&
        createPortal(
          <div
            className="glass-flat-dropdown fixed z-50 rounded-xl overflow-hidden"
            style={{
              top: pos.top,
              left: pos.left,
              width: pos.width,
            }}
          >
            {users.map(u => (
              <div
                key={u.id}
                className="
                  px-4 py-2 text-sm cursor-pointer
                  hover:bg-white/10
                "
                onClick={() => {
                  onChange(u.id);
                  setOpen(false);
                }}
              >
                {u.label}
              </div>
            ))}
          </div>,
          document.body
        )
      }
    </>
  );
}