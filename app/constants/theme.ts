export const getTheme = (isDarkMode: boolean) => ({
    bg: isDarkMode ? 'bg-[#0d131f] text-slate-100' : 'bg-slate-100 text-slate-800',
    card: isDarkMode ? 'bg-[#151c2c] border-slate-800' : 'bg-white border-slate-200 shadow-sm',
    innerCard: isDarkMode ? 'bg-[#0d131f] border-slate-800/80' : 'bg-slate-50 border-slate-200',
    header: isDarkMode ? 'bg-[#151c2c]/95 border-slate-800' : 'bg-white/95 border-slate-200',
    textMuted: isDarkMode ? 'text-slate-400' : 'text-slate-500',
  });