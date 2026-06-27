# Delta for Peças

## ADDED Requirements

### Requirement: Lançamento de peças pela admin
A admin DEVE poder registrar uma ou mais peças prontas em um único lançamento, selecionando a aluna uma vez e informando peso e foto (opcional) para cada peça individualmente.

#### Scenario: Admin lança uma única peça
- GIVEN a admin está autenticada em `/admin/pecas`
- WHEN preenche aluna, peso de uma peça e clica em "Lançar peça"
- THEN uma nova peça é criada com status `pendente`
- AND a peça aparece na lista da admin

#### Scenario: Admin lança múltiplas peças de uma vez
- GIVEN a admin está no formulário de lançamento
- WHEN seleciona uma aluna, preenche peso para a primeira peça e clica em "Adicionar outra peça"
- THEN um novo item é adicionado ao formulário com seus próprios campos de peso e foto
- AND ao salvar, cada item gera uma linha separada em `pecas` com status `pendente`
- AND o botão exibe a contagem ("Lançar 2 peças", "Lançar 3 peças", etc.)

#### Scenario: Tentativa sem selecionar aluna
- GIVEN a admin está no formulário de nova peça
- WHEN tenta salvar sem selecionar uma aluna
- THEN o formulário não é submetido
- AND uma mensagem de validação é exibida

#### Scenario: Tentativa com peso inválido em algum item
- GIVEN o formulário tem múltiplos itens
- WHEN algum item está sem peso ou com peso zero
- THEN o formulário não é submetido
- AND uma mensagem indica que todos os pesos precisam ser preenchidos

---

### Requirement: Visualização de peças pela aluna
A aluna DEVE poder visualizar suas peças prontas, incluindo foto (quando disponível), peso e status do pagamento.

#### Scenario: Aluna com peças
- GIVEN a aluna está autenticada em `/pecas`
- WHEN acessa a página
- THEN vê uma lista com suas peças (foto, peso, status)

#### Scenario: Aluna sem peças
- GIVEN a aluna não tem peças lançadas
- WHEN acessa `/pecas`
- THEN vê uma mensagem indicando que não há peças prontas

---

### Requirement: Envio de comprovante pela aluna
A aluna DEVE poder enviar um comprovante de pagamento para peças com status `pendente`.

#### Scenario: Upload de comprovante
- GIVEN uma peça com status `pendente`
- WHEN a aluna faz upload de um arquivo de comprovante
- THEN o status da peça muda para `comprovante_enviado`
- AND o botão de upload é desabilitado

#### Scenario: Peça já com comprovante enviado
- GIVEN uma peça com status `comprovante_enviado`
- WHEN a aluna visualiza a peça
- THEN o status exibido é "Comprovante enviado"
- AND não há botão de upload disponível

---

### Requirement: Confirmação de pagamento pela admin
A admin DEVE poder confirmar o pagamento de uma peça com status `comprovante_enviado`.

#### Scenario: Admin confirma pagamento
- GIVEN uma peça com status `comprovante_enviado`
- WHEN a admin clica em "Confirmar pagamento"
- THEN o status da peça muda para `confirmado`
- AND o botão de confirmação deixa de aparecer

---

### Requirement: Exclusão de peça pendente pela admin
A admin DEVE poder excluir peças com status `pendente`, com confirmação antes da ação.

#### Scenario: Admin exclui peça pendente
- GIVEN uma peça com status `pendente`
- WHEN a admin clica em "Excluir" e confirma o diálogo
- THEN a peça é removida permanentemente
- AND some da lista imediatamente

#### Scenario: Exclusão bloqueada para outros status
- GIVEN uma peça com status `comprovante_enviado` ou `confirmado`
- WHEN a admin visualiza a peça
- THEN o botão "Excluir" não está disponível

---

### Requirement: Isolamento por aluna
O sistema DEVE garantir que cada aluna acesse apenas suas próprias peças.

#### Scenario: RLS no banco
- GIVEN duas alunas distintas com peças no sistema
- WHEN cada uma acessa `/pecas`
- THEN cada aluna vê somente suas próprias peças
- AND não há risco de vazamento via API direta (RLS ativo)
