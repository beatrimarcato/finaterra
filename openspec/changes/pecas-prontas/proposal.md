# Proposal: Peças Prontas

## Intent

Alunas precisam saber quando suas peças de cerâmica estão prontas para retirada e precisam pagar pela queima. Hoje esse processo é manual (mensagem no WhatsApp), sem rastreabilidade nem controle de pagamento. A feature centraliza isso no sistema: a admin lança a peça com peso e foto, e a aluna recebe a informação e envia o comprovante de pagamento diretamente pela plataforma.

## Scope

**In scope:**
- Tabela `pecas` no banco com aluna, peso, foto, status de pagamento e comprovante
- Tela admin (`/admin/pecas`) para lançar peças e confirmar pagamentos
- Tela aluna (`/pecas`) para visualizar peças e enviar comprovante
- Três status de pagamento: `pendente`, `comprovante_enviado`, `confirmado`
- Storage buckets separados para fotos (público) e comprovantes (privado)

**Out of scope:**
- Notificações automáticas (e-mail, push) ao lançar peça
- Cálculo automático do valor com base no peso
- Histórico de preços ou relatórios financeiros
- Edição de peças após criação

## Approach

Seguir o padrão existente do projeto: Server Components para leitura, Client Components para formulários e uploads. Uploads direto para Supabase Storage via cliente browser. RLS garante isolamento por aluna.
