# LEÇA FC Scouting App — Mapa do Projeto

## Arquitetura de Ficheiros

- `app/types/index.ts`: Definições globais de TypeScript (`Player`, `Match`, `Team`, `Scout`, `MarketOpportunity`, etc.).
- `app/constants/options.ts`: Opções estáticas de formulários, táticas e constantes do departamento.
- `app/constants/theme.ts`: Sistema de temas centralizado (`getTheme`) para garantir as cores `#151c2c` e `#0d131f`.
- `app/utils/helpers.tsx`: Funções utilitárias de formatação, correspondência do algoritmo e limpeza de nomes.
- `app/hooks/`:
  - `useScoutingData.ts`: Gestão de estado global, chamadas às APIs e autenticação.
  - `useExcelUploader.ts`: Leitura, conversão, compressão Gzip e upload de ficheiros XLSX para o Supabase.
- `app/components/ui/`: Componentes genéricos de interface (`CustomSelect.tsx`, `CustomMultiSelect.tsx`).
- `app/components/modals/`:
  - `MarketModal.tsx`, `MarketDecisionModal.tsx`, `NewTeamModal.tsx`, `NewPlayerModal.tsx`, `PillarDetailModal.tsx`.
  - `PlayerProfileModal.tsx`: Ficha central do atleta, orquestrada pelas suas sub-abas.
  - `app/components/modals/playerProfileTabs/`: Sub-abas do perfil (`ProfileTimelineTab.tsx`, `ProfileAlgoTab.tsx`, `ProfileReportsTab.tsx`, `ProfileMarketTab.tsx`).
- `app/components/tabs/`: Vistas dos separadores principais (`DashboardTab`, `MarketTab`, `PlayersTab`, `TeamsTab`, `StatsTab`, `MatchesTab`, `ScoutsTab`, `AdminTab`).
- `app/page.tsx`: Maestro principal da aplicação (~300 linhas) responsável por orquestrar a navegação e modais.

## Estilo e Temas Visuais (Centralizado)
- **Fundo Principal**: `#0d131f` (`bg-[#0d131f]`)
- **Cartões e Modais**: `#151c2c` (`bg-[#151c2c]`)
- **Destaques e Mercado**: Rosa (`pink-500` / `pink-600`)
- **Estatísticas e Ratings**: Ciano (`cyan-400` / `cyan-500`)
- **Ações Gerais**: Azul (`blue-500` / `blue-600`) e Verde (`emerald-500` / `emerald-600`)