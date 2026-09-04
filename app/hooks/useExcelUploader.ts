'use client';

import { useState } from 'react';
import * as XLSX from 'xlsx';
import localforage from 'localforage';
import { supabase } from './useScoutingData';

export function useExcelUploader(
  setAlgorithmData: React.Dispatch<React.SetStateAction<Record<string, any[]>>>,
  showToast: (msg: string) => void,
  extractPlayerBaseName: (str: string) => string,
  extractContextTag: (row: any) => string
) {
  const [uploadingExcel, setUploadingExcel] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingExcel(true);
    const reader = new FileReader();

    reader.onload = async (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsName = wb.SheetNames[0];
        const ws = wb.Sheets[wsName];
        const rawData: any[] = XLSX.utils.sheet_to_json(ws);

        const newAlgoData: Record<string, { tag: string; row: any }[]> = {};
        rawData.forEach((row) => {
          const rawPlayerStr = row.Player || row.Player_ID || '';
          const teamStr = row.Team_Calc || row.Team || row.Equipa || '';
          const cleanName = extractPlayerBaseName(rawPlayerStr);
          const cleanTeam = extractPlayerBaseName(teamStr);
          const baseTag = extractContextTag(row);
          const tag = teamStr ? `${baseTag} (${teamStr})` : baseTag;

          if (cleanName) {
            const cleanRow: Record<string, any> = {};
            Object.keys(row).forEach((k) => {
              if (row[k] !== null && row[k] !== undefined && row[k] !== '') cleanRow[k] = row[k];
            });

            const topAttrsArr = [];
            for (let i = 1; i <= 5; i++) {
              if (row[`Top_Attr_${i}_Name`]) topAttrsArr.push(row[`Top_Attr_${i}_Name`]);
            }
            if (topAttrsArr.length > 0) cleanRow['Top_5_Atributos'] = topAttrsArr.join(', ');

            const isGK = (row.Position || row.Setor_Avaliacao || '').toLowerCase().includes('gk');
            const posSuffix = isGK ? '_gk' : '_field';

            const uniqueKeyWithTeam = `${cleanName}_${cleanTeam}${posSuffix}`;
            if (!newAlgoData[uniqueKeyWithTeam]) newAlgoData[uniqueKeyWithTeam] = [];
            newAlgoData[uniqueKeyWithTeam].push({ tag, row: cleanRow });

            const genericKey = `${cleanName}${posSuffix}`;
            if (!newAlgoData[genericKey]) newAlgoData[genericKey] = [];
            newAlgoData[genericKey].push({ tag, row: cleanRow });
          }
        });

        setAlgorithmData(newAlgoData);
        await localforage.setItem('leca_algo_data', newAlgoData);

        const jsonString = JSON.stringify(newAlgoData);
        const jsonBlob = new Blob([jsonString], { type: 'application/json' });
        const compressedStream = jsonBlob.stream().pipeThrough(new CompressionStream('gzip'));
        const compressedBlob = await new Response(compressedStream).blob();

        const { error } = await supabase.storage.from('Scouting').upload('algo-data.json.gz', compressedBlob, { contentType: 'application/gzip', upsert: true });
        if (error) throw error;

        showToast("Ficheiro processado com sucesso!");
      } catch (error: any) {
        console.error("Erro no upload:", error);
        showToast("Erro ao sincronizar dados.");
      } finally {
        setUploadingExcel(false);
      }
    };
    reader.readAsBinaryString(file);
  };

  return { uploadingExcel, handleFileUpload };
}