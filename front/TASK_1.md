# Task 1 — Tela de Login, Menu e CRUD de Usuários e Locais de Apresentação

## Status: ✅ Concluída

## Objetivo
Criar a tela de login, o menu principal da aplicação e os CRUDs de Usuários
e de Locais de apresentação dos projetos.

## Requisitos e onde foram implementados

### 1. Tela de login com campo de e-mail e senha
- **Arquivo:** `src/app/login/page.js`
- Formulário com campos `email` e `password`, validação básica de
  preenchimento, chamada para `POST /api/auth/login` e exibição de erro
  quando as credenciais são inválidas.
- Ao autenticar com sucesso, o token (`accessToken`) e os dados do usuário
  são salvos via `saveSession()` (`src/lib/api.js`) e o usuário é
  redirecionado para `/dashboard`.
- Link "Criar conta" leva à tela de cadastro público (`/register`).

### 1.1. Tela de criação de conta (cadastro público)
- **Arquivo:** `src/app/register/page.js`
- Formulário com campos `username`, `email`, `password` e confirmação de
  senha, sem necessidade de login prévio.
- Chama `POST /api/auth/register` (endpoint público, liberado em
  `SecurityConfig`), que cria a conta com perfil padrão `ALUNO` e já
  retorna um token de acesso, logando o usuário automaticamente após o
  cadastro.
- Perfis diferentes de `ALUNO` (Professor, Coordenador, Admin, Avaliador
  Externo) continuam sendo atribuídos apenas por um `ADMIN`, pelo CRUD de
  Usuários — o cadastro público nunca permite escolher o próprio perfil,
  por segurança.
- A sessão local é validada contra o backend (`GET /api/auth/me`, via
  `validateSession()` em `src/lib/api.js`) antes de qualquer tela
  protegida considerar o usuário autenticado, evitando que um token salvo
  antigo/expirado dê acesso indevido.

### 2. Menu com nome do usuário, logout e links restritos por perfil
- **Arquivo:** `src/components/Menu/index.js`
- Exibe o nome de usuário (`user.username`) e o perfil (`user.profile`) no
  rodapé do menu.
- Botão "Sair" chama `clearSession()` (limpa o token/usuário do
  armazenamento local) e redireciona para `/login`.
- Os links de navegação (`Usuários`, `Locais`, `Cursos`, `Semestres`,
  `Turmas`) são filtrados conforme o perfil do usuário logado, usando a
  função `canDo()` definida em `src/lib/api.js`:
  - `Usuários` → visível apenas para `ADMIN` e `PROFESSOR` (`viewUsers`).
  - Demais módulos (`Locais`, `Cursos`, `Semestres`, `Turmas`) ficam sempre
    visíveis no menu; o controle de quem pode **criar/editar/excluir** em
    cada um é feito dentro de cada página (botões de ação só aparecem para
    quem tem permissão).

### 3. Listagem e formulário de cadastro/edição de Usuários
- **Arquivo:** `src/app/usuarios/page.js`
- Tabela com listagem de usuários (`GET /api/users`).
- Modal de formulário para criar (`POST /api/users`) e editar
  (`PUT /api/users/:id`) usuários, com campos de nome, e-mail, senha e
  perfil (`ADMIN`, `COORDENADOR`, `PROFESSOR`, `ALUNO`,
  `AVALIADOR_EXTERNO`).
- Exclusão de usuário (`DELETE /api/users/:id`) com confirmação.
- Ações de criar/editar/excluir restritas a quem tem permissão
  `manageUsers` (perfil `ADMIN`).

### 4. Cadastro de Locais possíveis para apresentação dos projetos
- **Arquivo:** `src/app/locais/page.js`
- Tabela com listagem de locais (`GET /api/locais`).
- Modal de formulário para criar (`POST /api/locais`) e editar
  (`PUT /api/locais/:id`) locais, com campo de identificação (número/nome
  do espaço, ex.: "Estande 01", "Sala A").
- Exclusão de local (`DELETE /api/locais/:id`) com confirmação.
- Ações de criar/editar/excluir restritas a quem tem permissão
  `manageLocais` (perfis `ADMIN` e `COORDENADOR`).

## Componentes de apoio usados nesta task
- `src/components/Table` — tabela genérica reaproveitada por todos os CRUDs.
- `src/components/Modal` — modal genérico para os formulários.
- `src/components/Button` e `src/components/FormInput` — elementos de UI
  reaproveitados em todas as telas.
- `src/lib/api.js` — cliente HTTP (`api.get/post/put/delete`), gestão de
  sessão (`saveSession`, `getSession`, `clearSession`) e regras de
  permissão (`canDo`).

## Backend consumido (já existente em `piemanager/`)
- `POST /api/auth/login`
- `POST /api/auth/register` (cadastro público, perfil padrão `ALUNO`)
- `GET /api/auth/me` (validação de sessão)
- `GET /POST /PUT /DELETE /api/users`
- `GET /POST /PUT /DELETE /api/locais`
