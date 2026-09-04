# 🗺️ Mapeamento do Projeto - Leça FC Scouting

Este documento serve como mapa de arquitetura para localizar rapidamente a responsabilidade de cada ficheiro no projeto.

---

## 📁 Estrutura de Diretórios (`app/`)

### 1. Ficheiro Principal / Orquestrador
* **`app/page.tsx`**: Controlador principal de estado global (sessão, navegação entre abas e chamadas aos modais).

---

### 2. Modais & Janelas Pop-up (`app/components/modals/`)
* **`PlayerProfileModal.tsx`**: Janela completa de perfil do atleta (integra as sub-abas em `playerProfileTabs`).
* **`TeamProfileModal.tsx`**: Janela de perfil da equipa (jogadores associados e histórico de partidas).
* **`ScoutProfileModal.tsx`**: Janela de perfil do scout (mercados atribuídos e histórico de jogos).
* **`MarketModal.tsx`**: Formulário para registar novas oportunidades de mercado.
* **`MarketDecisionModal.tsx`**: Formulário para registar decisões, pareceres e vetos de mercado.
* **`NewTeamModal.tsx`**: Formulário rápido para criação de novas equipas.
* **`NewPlayerModal.tsx`**: Formulário rápido para criação de novos atletas.
* **`PillarDetailModal.tsx`**: Janela com o detalhe de métricas e percentis por pilar de desempenho.

#### 📂 Sub-abas do Perfil de Jogador (`app/components/modals/playerProfileTabs/`)
* **`ProfileTimelineTab.tsx`**: Lista sequencial e cronológica de relatórios/observações do jogador.
* **`ProfileAlgoTab.tsx`**: Apresentação de ratings, notas, pilares e top atributos do Excel.
* **`ProfileReportTab.tsx`**: Exibição do relatório consolidado em Markdown.
* **`ProfileMarketTab.tsx`**: Histórico de propostas e estado de negociação do jogador.

---

### 3. Abas Principais da App (`app/components/tabs/`)
* **`DashboardTab.tsx`**: Painel inicial (KPIs gerais, atalhos rápidos e cobertura de observação).
* **`PlayersTab.tsx`**: Base de dados de jogadores (pesquisa isolada, filtros por posição, estado de observação, ano e barra de idades).
* **`TeamsTab.tsx`**: Lista e pesquisa isolada de equipas mapeadas.
* **`MatchesTab.tsx`**: Match Center (agendamento e edição de relatórios de jogos).
* **`MarketTab.tsx`**: Grelha global de oportunidades e alvos de mercado.
* **`ScoutsTab.tsx`**: Lista da equipa de observadores e contadores de jogos.
* **`StatsTab.tsx`**: Comparador Head-to-Head (H2H) com gráfico Radar (2 a 3 atletas).
* **`AdminTab.tsx`**: Upload do ficheiro Excel de algoritmos e gestão de mercados alvo.

---

### 4. Componentes de UI Reutilizáveis (`app/components/ui/`)
* **`CustomSelect.tsx`**: Dropdown único com pesquisa interna.
* **`CustomMultiSelect.tsx`**: Dropdown de seleção múltipla (usado para atribuir scouts/mercados).
* **`RadarChart.tsx`**: Gráfico vetorial SVG para comparação H2H no separador Stats.

---

### 5. Suporte, Hooks & Utilitários
* **`app/hooks/useScoutingData.ts`**: Hook que gere o fetch inicial de dados (Airtable/Supabase) e autenticação.
* **`app/hooks/useExcelUploader.ts`**: Hook com o motor de leitura e descompactação de ficheiros `.xlsx`.
* **`app/utils/helpers.ts`**: Funções auxiliares (normalização de nomes, extração de datas e renderização de Markdown).
* **`app/types/index.ts`**: Declarações de interfaces TypeScript do projeto (`Player`, `Team`, `Scout`, `Match`, etc.).
* **`app/constants/theme.ts`**: Definições de cores e estilos para alternância de Modo Claro / Modo Escuro.