# Finaterra Agenda

Sistema de agendamento de aulas construído com Next.js 15, Supabase e shadcn/ui.

## Setup

### 1. Clone e instale dependências

```bash
npm install
```

### 2. Configure as variáveis de ambiente

```bash
cp .env.example .env.local
```

Preencha com suas credenciais do Supabase:
- `NEXT_PUBLIC_SUPABASE_URL`: URL do seu projeto Supabase
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Chave anônima do projeto

### 3. Configure o banco de dados no Supabase

1. Acesse [supabase.com](https://supabase.com) e crie um projeto
2. Vá em **SQL Editor** e execute o conteúdo de `supabase/schema.sql`
3. Em **Authentication > URL Configuration**, adicione `http://localhost:3000` em Site URL

### 4. Configure o Auth (Magic Link)

No Supabase dashboard:
1. Vá em **Authentication > Providers**
2. Certifique-se que **Email** está habilitado
3. Em **Authentication > Email Templates**, personalize se quiser

### 5. Rode o projeto

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

## Acessos

- **Admin** (`beatrimarcato@gmail.com`): gerencia todas as aulas
- **Alunas** (qualquer outro e-mail): visualizam e se inscrevem nas aulas

## Funcionalidades

- Login via Magic Link (e-mail sem senha)
- Admin: criar/visualizar aulas com data, horário e vagas
- Alunas: ver agenda de aulas disponíveis e se inscrever
- Controle automático de vagas via triggers no banco
- Cancelamento de agendamentos com liberação de vaga
- RLS garantindo que cada aluna vê apenas seus dados
