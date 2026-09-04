export const TACTICS_OPTIONS = [
    '1-4-3-3', '1-4-4-2', '1-4-2-4', '1-4-1-3-2', '1-4-1-4-1', '1-4-2-3-1', 
    '1-3-5-2', '1-3-4-3', '1-5-4-1', '1-5-3-2'
  ];
  
  export const POSITIONS_OPTIONS = [
    'Center Back', 'Center Midfielder', 'Defensive Midfielder', 'Forward', 
    'Goalkeeper', 'Left Back', 'Left Winger', 'Ofensive Midfielder', 
    'Right Back', 'Right Winger', 'Striker'
  ];
  
  export const METRIC_LEVELS = ['Low', 'Medium', 'High'];
  
  export const DEPT_PASSWORD = 'LECA';
  
  export const MARKET_TARGET_OPTIONS = [
    { value: 'Época 26/27 (Verão)', label: 'Época 26/27 (Verão)' },
    { value: 'Época 26/27 (Inverno)', label: 'Época 26/27 (Inverno)' },
    { value: 'Época 27/28 (Verão)', label: 'Época 27/28 (Verão)' },
    { value: 'Época 27/28 (Inverno)', label: 'Época 27/28 (Inverno)' }
  ];
  
  export const PILLAR_METRICS_MAP: Record<string, { label: string; statKey: string; pctKey: string; weight: string }[]> = {
    'GK Defesa': [
      { label: 'GK xG Prevented / 90', statKey: 'GK xG Prevented per 90', pctKey: 'GK xG Prevented per 90 Pct', weight: '40%' },
      { label: 'GK Save Rate %', statKey: 'GK Save Rate %', pctKey: 'GK Save Rate % Pct', weight: '25%' },
      { label: 'Aerial Duels Won %', statKey: 'Aerial Duels Won %', pctKey: 'Aerial Duels Won % Pct', weight: '15%' },
      { label: 'GK Exits / 90', statKey: 'GK Exits per 90', pctKey: 'GK Exits per 90 Pct', weight: '10%' },
      { label: 'GK Conceded / 90', statKey: 'GK Conceded per 90', pctKey: 'GK Conceded per 90 Pct', weight: '10%' },
    ],
    'GK Distribuicao': [
      { label: 'Passes Accuracy %', statKey: 'Passes Accuracy %', pctKey: 'Passes Accuracy % Pct', weight: '45%' },
      { label: 'Long Passes Accuracy %', statKey: 'Long Passes Accuracy %', pctKey: 'Long Passes Accuracy % Pct', weight: '30%' },
      { label: 'Passes / 90', statKey: 'Passes per 90', pctKey: 'Passes per 90 Pct', weight: '25%' },
    ],
    'Jogo Aéreo': [
      { label: 'Aerial Duels Won %', statKey: 'Aerial Duels Won %', pctKey: 'Aerial Duels Won % Pct', weight: '65%' },
      { label: 'Aerial Duels / 90', statKey: 'Aerial Duels per 90', pctKey: 'Aerial Duels per 90 Pct', weight: '35%' },
    ],
    'Defesa': [
      { label: 'Defensive Duels Won %', statKey: 'Defensive Duels Won %', pctKey: 'Defensive Duels Won % Pct', weight: '35%' },
      { label: 'Interceptions PAdj', statKey: 'Interceptions PAdj', pctKey: 'Interceptions PAdj Pct', weight: '25%' },
      { label: 'Successful Defensive Actions / 90', statKey: 'Successful Defensive Actions per 90', pctKey: 'Successful Defensive Actions per 90 Pct', weight: '20%' },
      { label: 'Defensive Duels / 90', statKey: 'Defensive Duels per 90', pctKey: 'Defensive Duels per 90 Pct', weight: '15%' },
      { label: 'Sliding Tackles PAdj', statKey: 'Sliding Tackles PAdj', pctKey: 'Sliding Tackles PAdj Pct', weight: '5%' },
    ],
    'Construção': [
      { label: 'Passes Accuracy %', statKey: 'Passes Accuracy %', pctKey: 'Passes Accuracy % Pct', weight: '25%' },
      { label: 'Passes / 90', statKey: 'Passes per 90', pctKey: 'Passes per 90 Pct', weight: '20%' },
      { label: 'Progressive Passes Accuracy %', statKey: 'Progressive Passes Accuracy %', pctKey: 'Progressive Passes Accuracy % Pct', weight: '20%' },
      { label: 'Progressive Passes / 90', statKey: 'Progressive Passes per 90', pctKey: 'Progressive Passes per 90 Pct', weight: '15%' },
      { label: 'Forward Passes / 90', statKey: 'Forward Passes per 90', pctKey: 'Forward Passes per 90 Pct', weight: '10%' },
      { label: 'Long Passes Accuracy %', statKey: 'Long Passes Accuracy %', pctKey: 'Long Passes Accuracy % Pct', weight: '10%' },
    ],
    'Criação': [
      { label: 'xA / 90', statKey: 'xA per 90', pctKey: 'xA per 90 Pct', weight: '25%' },
      { label: 'Key Passes / 90', statKey: 'Key Passes per 90', pctKey: 'Key Passes per 90 Pct', weight: '25%' },
      { label: 'Passes to Final Third / 90', statKey: 'Passes to Final Third per 90', pctKey: 'Passes to Final Third per 90 Pct', weight: '20%' },
      { label: 'Passes to Penalty Area / 90', statKey: 'Passes to Penalty Area per 90', pctKey: 'Passes to Penalty Area per 90 Pct', weight: '15%' },
      { label: 'Progressive Passes / 90', statKey: 'Progressive Passes per 90', pctKey: 'Progressive Passes per 90 Pct', weight: '10%' },
      { label: 'Smart Passes / 90', statKey: 'Smart Passes per 90', pctKey: 'Smart Passes per 90 Pct', weight: '5%' },
    ],
    'Cruzamento': [
      { label: 'Crosses Accuracy %', statKey: 'Crosses Accuracy %', pctKey: 'Crosses Accuracy % Pct', weight: '60%' },
      { label: 'Crosses / 90', statKey: 'Crosses per 90', pctKey: 'Crosses per 90 Pct', weight: '40%' },
    ],
    'Capacidade 1v1': [
      { label: 'Dribbles Success %', statKey: 'Dribbles Success %', pctKey: 'Dribbles Success % Pct', weight: '30%' },
      { label: 'Offensive Duels Won %', statKey: 'Offensive Duels Won %', pctKey: 'Offensive Duels Won % Pct', weight: '25%' },
      { label: 'Dribbles / 90', statKey: 'Dribbles per 90', pctKey: 'Dribbles per 90 Pct', weight: '20%' },
      { label: 'Offensive Duels / 90', statKey: 'Offensive Duels per 90', pctKey: 'Offensive Duels per 90 Pct', weight: '15%' },
      { label: 'Progressive Runs / 90', statKey: 'Progressive Runs per 90', pctKey: 'Progressive Runs per 90 Pct', weight: '10%' },
    ],
    'Profundidade': [
      { label: 'Received Through Passes / 90', statKey: 'Received Through Passes per 90', pctKey: 'Received Through Passes per 90 Pct', weight: '40%' },
      { label: 'Accelerations / 90', statKey: 'Accelerations per 90', pctKey: 'Accelerations per 90 Pct', weight: '35%' },
      { label: 'Touches in Box / 90', statKey: 'Touches in Box per 90', pctKey: 'Touches in Box per 90 Pct', weight: '25%' },
    ],
    'Finalização': [
      { label: 'Non-Penalty Goals / 90', statKey: 'Non-Penalty Goals per 90', pctKey: 'Non-Penalty Goals per 90 Pct', weight: '40%' },
      { label: 'xG / 90', statKey: 'xG per 90', pctKey: 'xG per 90 Pct', weight: '25%' },
      { label: 'Shots on Target %', statKey: 'Shots on Target %', pctKey: 'Shots on Target % Pct', weight: '20%' },
      { label: 'Head Goals / 90', statKey: 'Head Goals per 90', pctKey: 'Head Goals per 90 Pct', weight: '15%' },
    ],
  };