# Modo de Visualização Specification

## Purpose

Switch explícito de modo de visualização (Desktop / Mobile) presente em toda a navegação. Permite que a professora/admin use o layout mais adequado ao seu dispositivo e que as alunas tenham uma experiência otimizada para celular por padrão.

## Requirements

### Requirement: Switch de modo por perfil
O sistema DEVE oferecer um switch explícito de modo de visualização (Desktop / Mobile) na barra de navegação, com padrão diferente por perfil de usuária.

#### Scenario: Padrão desktop para a admin
- GIVEN a admin acessa qualquer página do painel admin pela primeira vez
- WHEN não há preferência salva no localStorage
- THEN o modo ativo é Desktop

#### Scenario: Padrão mobile para a aluna
- GIVEN a aluna acessa qualquer página da área de alunas pela primeira vez
- WHEN não há preferência salva no localStorage
- THEN o modo ativo é Mobile

### Requirement: Persistência da preferência
O sistema DEVE persistir a preferência de modo no localStorage (`finaterra_view_mode`) para que a usuária não precise trocar a cada visita.

#### Scenario: Preferência salva após troca
- GIVEN a usuária está no modo padrão do seu perfil
- WHEN troca para o outro modo pelo switch na nav
- THEN a preferência é salva no localStorage
- AND ao recarregar a página, o modo salvo é restaurado

#### Scenario: Preferência sobrepõe o padrão do perfil
- GIVEN uma aluna que trocou para modo Desktop e saiu
- WHEN ela acessa o app novamente
- THEN o modo Desktop é restaurado (não o padrão Mobile do perfil)

### Requirement: Layout adaptado por modo
O sistema DEVE renderizar variantes de layout distintas para cada modo.

#### Scenario: Modo Mobile
- GIVEN o modo ativo é Mobile
- WHEN a usuária visualiza listas ou grids
- THEN os itens são exibidos em coluna única
- AND botões de ação ocupam largura total
- AND o espaçamento vertical é maior para facilitar o toque

#### Scenario: Modo Desktop
- GIVEN o modo ativo é Desktop
- WHEN a usuária visualiza listas ou grids
- THEN os itens são exibidos em múltiplas colunas (2–3)
- AND botões de ação têm tamanho natural (inline)
- AND o layout é mais compacto horizontalmente

### Requirement: Switch sempre visível na nav
O controle de modo DEVE estar acessível na barra de navegação em todas as páginas da área correspondente.

#### Scenario: Switch visível em todas as páginas da admin
- GIVEN a admin está em qualquer página do painel (`/admin/*`)
- WHEN visualiza a nav
- THEN o switch Desktop/Mobile está presente e funcional

#### Scenario: Switch visível em todas as páginas da aluna
- GIVEN a aluna está em qualquer página da área de alunas (`/agenda/*`, `/pecas`)
- WHEN visualiza a nav
- THEN o switch Desktop/Mobile está presente e funcional
