'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';

interface CustomSelectProps {
  options: Array<{ value: string; label: string; image?: string | null; icon?: React.ReactNode }>;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  searchable?: boolean;
  className?: string;
  isDarkMode?: boolean;
}

export default function CustomSelect({
  options,
  value,
  onChange,
  placeholder = 'Selecionar...',
  searchable = false,
  className = '',
  isDarkMode = true,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
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

  const selectedOption = options.find((o) => o.value === value);
  const filteredOptions = searchable
    ? options.filter((o) => (o.label || '').toLowerCase().includes((searchTerm || '').toLowerCase()))
    : options;

  const bgBtn = isDarkMode ? 'bg-[#0d131f] border-slate-800 text-slate-200' : 'bg-white border-slate-300 text-slate-800';
  const bgMenu = isDarkMode ? 'bg-[#151c2c]/95 border-slate-700/80' : 'bg-white/95 border-slate-300';
  const bgInput = isDarkMode ? 'bg-[#0d131f] border-slate-800 text-slate-200' : 'bg-slate-100 border-slate-300 text-slate-800';

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full border rounded-xl p-3 md:p-3.5 text-left focus:outline-none focus:border-blue-500 flex justify-between items-center text-xs sm:text-sm transition ${bgBtn}`}
      >
        <div className="flex items-center gap-2 overflow-hidden">
          {selectedOption?.image && <img src={selectedOption.image} alt="" className="w-5 h-5 object-contain rounded-full bg-slate-900" />}
          {selectedOption?.icon && !selectedOption.image && <div className="text-slate-400">{selectedOption.icon}</div>}
          <span className={`truncate ${selectedOption ? 'font-medium' : 'text-slate-500'}`}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>
        <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className={`absolute z-[100] left-0 right-0 mt-1 backdrop-blur-md border rounded-xl shadow-2xl max-h-60 overflow-y-auto p-1.5 space-y-1 text-xs sm:text-sm ${bgMenu}`}>
          {searchable && (
            <div className={`p-1 sticky top-0 z-10 pb-2 ${isDarkMode ? 'bg-[#151c2c]' : 'bg-white'}`}>
              <input
                type="text"
                placeholder="Pesquisar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full border rounded-lg p-2.5 text-xs sm:text-sm focus:outline-none focus:border-blue-500 ${bgInput}`}
              />
            </div>
          )}
          {filteredOptions.length === 0 ? (
            <div className="p-3 text-slate-500 text-center font-medium">Sem opções</div>
          ) : (
            filteredOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                  setSearchTerm('');
                }}
                className={`w-full text-left px-3 py-3 md:py-2.5 rounded-lg transition flex items-center gap-2.5 ${
                  opt.value === value
                    ? 'bg-blue-600/20 text-blue-400 font-medium border border-blue-500/30'
                    : isDarkMode
                    ? 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                {opt.image ? (
                  <img src={opt.image} alt="" className="w-6 h-6 object-contain rounded-md bg-[#0d131f] p-0.5 border border-slate-700" />
                ) : opt.icon ? (
                  <span className="text-slate-400">{opt.icon}</span>
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 flex-shrink-0" />
                )}
                <span className="truncate">{opt.label}</span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}