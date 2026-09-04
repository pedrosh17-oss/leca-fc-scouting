import React from 'react';

export function getUserTitle(name: string): string {
  const lowerName = (name || '').toLowerCase();
  if (lowerName.includes('pedro oliveira')) return 'Head of Scouting';
  if (lowerName.includes('miguel salvador')) return 'Diretor Desportivo';
  if (lowerName.includes('josé luís') || lowerName.includes('jose luis')) return 'Presidente';
  if (lowerName.includes('andré da silva') || lowerName.includes('andre da silva')) return 'Diretor Geral';
  return 'Scout do Clube';
}

export function renderFormattedMarkdown(text: string) {
  if (!text) return null;
  const lines = text.split('\n');
  return (
    <div className="space-y-1 text-slate-200">
      {lines.map((line, idx) => {
        if (line.trim() === '---') return <hr key={idx} className="my-4 border-slate-700/60" />;
        const parts = line.split(/(\*\*.*?\*\*)/g);
        return (
          <p key={idx} className={line.trim() === '' ? 'h-2' : 'min-h-[1.25rem] leading-relaxed'}>
            {parts.map((part, pIdx) => {
              if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={pIdx} className="font-bold text-white">{part.slice(2, -2)}</strong>;
              }
              return part;
            })}
          </p>
        );
      })}
    </div>
  );
}

export function extractPlayerBaseName(str: string): string {
  if (!str) return '';
  return str.replace(/\s*\([^)]*\)/g, '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
}

export function extractContextTag(row: any): string {
  const idStr = row.Player_ID || row.Player || '';
  const match = idStr.match(/\(([^)]+)\)/);
  if (match) {
    const content = match[1];
    if (content.includes('-')) {
      const parts = content.split('-');
      return parts[parts.length - 1].trim(); 
    }
    return content.trim();
  }
  if (row.Competição && row.Competição !== 'N/D') return row.Competição;
  return 'Atual';
}

export function getPlayerAlgoEntries(player: any, algorithmData: Record<string, any[]>) {
  if (!player || !algorithmData) return [];
  const cleanName = extractPlayerBaseName(player.name);
  const currentClub = extractPlayerBaseName(player.club || '');
  const playerAge = Number(player.age);
  
  const rawPlayerH = Number(String(player.height || '').replace(/[^0-9.]/g, ''));
  const playerHeight = rawPlayerH > 0 ? (rawPlayerH < 3 ? rawPlayerH * 100 : rawPlayerH) : 0;

  const targetNameWords = cleanName.split(/\s+/).filter(Boolean);
  const targetLastName = targetNameWords[targetNameWords.length - 1] || '';
  const targetFirstInitial = targetNameWords[0]?.[0] || '';
  const targetClubWords = currentClub.split(/\s+/).filter(w => w.length > 2);

  const checkNameMatch = (rName: string) => {
    if (rName === cleanName) return true;
    const rNameWords = rName.split(/\s+/).filter(Boolean);
    const rLastName = rNameWords[rNameWords.length - 1] || '';
    const rFirstWord = rNameWords[0] || '';
    
    if (rNameWords.length > 0 && targetNameWords.length > 0) {
      const isSubset = rNameWords.every(w => targetNameWords.includes(w)) || targetNameWords.every(w => rNameWords.includes(w));
      if (isSubset) return true;
    }

    const isInitial = rFirstWord.length === 1 || (rFirstWord.length === 2 && rFirstWord.endsWith('.'));
    if (isInitial) {
      const rFirstInitial = rFirstWord[0];
      if (rLastName === targetLastName && rFirstInitial === targetFirstInitial && targetLastName.length > 2) return true;
    }
    return false;
  };

  const checkClubMatch = (rClub: string) => {
    if (!currentClub || !rClub) return false;
    if (currentClub.includes(rClub) || rClub.includes(currentClub)) return true;
    const rClubWords = rClub.split(/\s+/).filter(w => w.length > 2);
    return targetClubWords.some(w => rClubWords.includes(w));
  };

  let anchorRow: any = null;
  for (const entries of Object.values(algorithmData)) {
    if (!entries) continue;
    for (const e of entries) {
      const rowName = extractPlayerBaseName(e.row?.Player || e.row?.Player_ID || '');
      const rowClub = extractPlayerBaseName(e.row?.Team_Calc || e.row?.Team || '');
      if (checkNameMatch(rowName) && checkClubMatch(rowClub)) {
        anchorRow = e.row;
        break;
      }
    }
    if (anchorRow) break;
  }

  const anchorAge = anchorRow && !isNaN(Number(anchorRow.Age)) ? Number(anchorRow.Age) : playerAge;
  const rawAnchorH = Number(anchorRow?.Height);
  const anchorHeight = !isNaN(rawAnchorH) && rawAnchorH > 0 ? (rawAnchorH < 3 ? rawAnchorH * 100 : rawAnchorH) : playerHeight;

  const matchedEntries: any[] = [];
  for (const entries of Object.values(algorithmData)) {
    if (!entries) continue;
    for (const e of entries) {
      const rowName = extractPlayerBaseName(e.row?.Player || e.row?.Player_ID || '');
      const rowClub = extractPlayerBaseName(e.row?.Team_Calc || e.row?.Team || '');
      const rowAge = Number(e.row?.Age);
      const rawH = Number(e.row?.Height);
      const rowHeight = !isNaN(rawH) && rawH > 0 ? (rawH < 3 ? rawH * 100 : rawH) : 0;

      if (!checkNameMatch(rowName)) continue;
      const isClubMatch = checkClubMatch(rowClub);

      if (!isClubMatch) {
        if (!isNaN(anchorAge) && !isNaN(rowAge) && Math.abs(anchorAge - rowAge) > 1) continue;
        if (anchorHeight > 0 && rowHeight > 0 && Math.abs(anchorHeight - rowHeight) > 2) continue;
      } else {
        if (!isNaN(anchorAge) && !isNaN(rowAge) && Math.abs(anchorAge - rowAge) > 2) continue;
      }

      matchedEntries.push({ ...e, isClubMatch });
    }
  }

  const groupedByTag: Record<string, any[]> = {};
  for (const item of matchedEntries) {
    const tag = item.tag || 'Geral';
    if (!groupedByTag[tag]) groupedByTag[tag] = [];
    groupedByTag[tag].push(item);
  }

  const finalRows: any[] = [];
  for (const tagRows of Object.values(groupedByTag)) {
    if (tagRows.length === 1) {
      finalRows.push(tagRows[0]);
    } else {
      const clubMatch = tagRows.find(r => r.isClubMatch);
      if (clubMatch) {
        finalRows.push(clubMatch);
      } else {
        const closest = tagRows.sort((a, b) => {
           const diffA = isNaN(Number(a.row?.Age)) ? 99 : Math.abs(anchorAge - Number(a.row?.Age));
           const diffB = isNaN(Number(b.row?.Age)) ? 99 : Math.abs(anchorAge - Number(b.row?.Age));
           return diffA - diffB;
        })[0];
        finalRows.push(closest);
      }
    }
  }

  return finalRows.sort((a, b) => b.tag.localeCompare(a.tag));
}