# LEÇA FC Scouting App - Mapa do Projeto

## Arquitetura de Ficheiros
- `app/types/index.ts`: Tipos do TypeScript (Player, Match, Team, Scout, MarketOpportunity).
- `app/constants/options.ts`: Constantes globais e opções de formulários.
- `app/components/RadarChart.tsx`: Gráfico estatístico comparativo.
- `app/components/ui/`: Seletores e inputs personalizados (CustomSelect, CustomMultiSelect).
- `app/components/modals/`: Modais de criação e edição (Mercado, Veto, Perfil, Agendamento).
- `app/components/tabs/`: Vistas das abas principais.
- `app/api/`: Rotas Next.js de integração com Airtable (`/market`, `/players`, `/teams`, `/matches`, `/scouts`, `/highlights`).

## Estilo e Temas Visuais
- **Modo Escuro Primário**: `bg-[#0d131f]`
- **Cartões**: `bg-[#151c2c]` com bordas `border-slate-800`
- **Destaques de Mercado**: Acentos `pink-500` e `pink-600`
- **Destaques Principais**: `blue-500` e `emerald-500`