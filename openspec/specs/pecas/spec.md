# Peças Specification

## Purpose

Gerenciamento de peças de cerâmica prontas para retirada. Inclui lançamento pela admin, visualização pela aluna e fluxo de confirmação de pagamento via comprovante.

## Requirements

### Requirement: Lançamento de peça pela admin
A admin DEVE poder registrar uma peça pronta informando a aluna (selecionada da lista de cadastradas), o peso em gramas ou quilos e uma foto opcional da peça.

#### Scenario: Admin lança peça com sucesso
- GIVEN a admin está autenticada em `/admin/pecas`
- WHEN preenche aluna, peso e clica em "Lançar peça"
- THEN uma nova peça é criada com status `pendente`
- AND a peça aparece na lista da admin

#### Scenario: Tentativa sem selecionar aluna
- GIVEN a admin está no formulário de nova peça
- WHEN tenta salvar sem selecionar uma aluna
- THEN o formulário não é submetido
- AND uma mensagem de validação é exibida

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

### Requirement: Confirmação de pagamento pela admin
A admin DEVE poder confirmar o pagamento de uma peça com status `comprovante_enviado`.

#### Scenario: Admin confirma pagamento
- GIVEN uma peça com status `comprovante_enviado`
- WHEN a admin clica em "Confirmar pagamento"
- THEN o status da peça muda para `confirmado`
- AND o botão de confirmação deixa de aparecer

### Requirement: Isolamento por aluna
O sistema DEVE garantir que cada aluna acesse apenas suas próprias peças.

#### Scenario: RLS no banco
- GIVEN duas alunas distintas com peças no sistema
- WHEN cada uma acessa `/pecas`
- THEN cada aluna vê somente suas próprias peças
- AND não há risco de vazamento via API direta (RLS ativo)
