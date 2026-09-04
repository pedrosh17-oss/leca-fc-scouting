'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, CheckCircle2, Shield } from 'lucide-react';

interface CustomMultiSelectProps {
  options: Array<{ value: string; label: string; image?: string | null }>;
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  placeholder?: string;
  className?: string;
  isDarkMode?: boolean;
}

export default function CustomMultiSelect({
  options,
  selectedIds,
  onChange,
  placeholder = 'Selecionar...',
  className = '',
  isDarkMode = true,
}: CustomMultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleOption = (id: string) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((item) => item !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  };

  const selectedLabels = options.filter((o) => selectedIds.includes(o.value)).map((o) => o.label);
  const bgBtn = isDarkMode ? 'bg-[#0d131f] border-slate-800 text-slate-200' : 'bg-white border-slate-300 text-slate-800';
  const bgMenu = isDarkMode ? 'bg-[#151c2c]/95 border-slate-700/80' : 'bg-white/95 border-slate-300';

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full border rounded-xl p-3 md:p-3.5 text-left focus:outline-none focus:border-blue-500 flex justify-between items-center text-xs sm:text-sm transition min-h-[46px] ${bgBtn}`}
      >
        <span className={selectedLabels.length > 0 ? 'font-medium truncate' : 'text-slate-500'}>
          {selectedLabels.length > 0 ? selectedLabels.join(', ') : placeholder}
        </span>
        <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className={`absolute z-[100] left-0 right-0 mt-1 backdrop-blur-md border rounded-xl shadow-2xl max-h-52 overflow-y-auto p-1.5 space-y-1 text-xs sm:text-sm ${bgMenu}`}>
          {options.map((opt) => {
            const isSelected = selectedIds.includes(opt.value);
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => toggleOption(opt.value)}
                className={`w-full text-left px-3 py-3 md:py-2.5 rounded-lg transition flex items-center justify-between ${
                  isSelected
                    ? 'bg-blue-600/20 text-blue-400 font-bold border border-blue-500/30'
                    : isDarkMode
                    ? 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  {opt.image ? (
                    <img src={opt.image} alt="" className="w-5 h-5 object-contain rounded-full bg-slate-900" />
                  ) : (
                    <Shield className="w-3.5 h-3.5 text-slate-500" />
                  )}
                  <span className="truncate">{opt.label}</span>
                </div>
                {isSelected && <CheckCircle2 size={14} className="text-blue-400 flex-shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}