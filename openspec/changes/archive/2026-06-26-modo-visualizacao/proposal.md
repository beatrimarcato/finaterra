# Proposal: Modo de Visualização (Desktop / Mobile)

## Intent

O sistema é acessado via navegador, mas os perfis de uso são distintos: alunas usam quase exclusivamente pelo celular, enquanto a professora/admin usa principalmente no computador mas ocasionalmente no celular. O layout atual não distingue esses contextos, o que pode prejudicar a usabilidade em cada dispositivo.

A solução é oferecer um switch explícito de modo de visualização — Desktop ou Mobile — acessível pela nav, com um padrão sensato para cada perfil:
- **Admin:** padrão Desktop
- **Aluna:** padrão Mobile

A preferência é persistida localmente (localStorage) para que a usuária não precise trocar toda vez que abre o app.

## Scope

**In scope:**
- Switch de modo na barra de navegação (AdminNav e AlunaNav)
- Layout Desktop: mais espaço horizontal, tabelas, grids maiores
- Layout Mobile: cards empilhados, tipografia maior, botões mais fáceis de tocar
- Persistência da preferência via localStorage
- Padrão por perfil: Desktop para admin, Mobile para aluna

**Out of scope:**
- Detecção automática do dispositivo (o switch é sempre manual e explícito)
- Modo específico por página (o modo se aplica a todo o app)
- Sincronização da preferência entre dispositivos

## Approach

Context React (`ViewModeContext`) provido no layout raiz de cada área (admin e aluna). O valor inicial é lido do localStorage (com fallback para o padrão do perfil). O switch na nav grava no localStorage e atualiza o contexto. Componentes de layout consomem o contexto para renderizar a variante correta.
