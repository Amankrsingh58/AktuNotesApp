import { useEffect, useRef, useState } from "react";
import Icon from "../../components/AppIcon";

const SearchModal = ({ isOpen, onClose, value, onChange }) => {
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    const esc = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-start justify-center pt-24 px-4">
      <div className="w-full max-w-xl bg-card border border-border rounded-xl shadow-lg">
        <div className="p-4 flex items-center gap-3">
          <Icon name="Search" size={18} className="text-muted-foreground" />
          <input
            ref={inputRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Search subject by name..."
            className="flex-1 bg-transparent outline-none text-foreground"
          />
          <button onClick={onClose}>
            <Icon name="X" size={20} className="text-muted-foreground" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
