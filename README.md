# 🎓 Sistema de Gestão de Competências (PieManager) - Frontend

Este é o frontend do sistema de Gestão de Competências (**PieManager**), desenvolvido em **Next.js (App Router)** e **React**. Ele consome uma API RESTful construída em **Spring Boot** e utiliza controle de acesso baseado em perfis (**RBAC**).

---

# 🚀 O que já construímos

## 1. Autenticação e Segurança

### 🔐 Login com JWT

O sistema autentica o usuário e armazena as seguintes informações no `localStorage`:

* `token`
* `userName`
* `userProfile`

### 🌐 Interceptor de Requisições (`api.js`)

Todas as requisições para o backend injetam automaticamente o Token JWT no cabeçalho:

```http
Authorization: Bearer <token>
```

### ⚠️ Tratamento de Erros Inteligente

Erros de validação do Spring Boot (exemplo: `@Valid`) são capturados e repassados diretamente para os campos de formulário no frontend.

### 🛡️ Controle de Acesso (`RoleGuard`)

Componente responsável por proteger elementos da interface, renderizando botões e menus apenas se o usuário possuir o perfil adequado:

* `ADMIN`
* `COORDENADOR`
* `PROFESSOR`
* `ALUNO`
* etc.

---

# 🧩 Componentes Reutilizáveis (Design System)

Para manter o código limpo e acelerar o desenvolvimento, foi criada uma biblioteca de componentes baseada no `global.css`.

## 📄 `PageLayout`

Estrutura padrão de todas as telas da aplicação.

### Recursos:

* Mensagem de boas-vindas dinâmica:

  ```txt
  Olá, Nome! 👋
  ```
* Título e subtítulo padronizados
* Áreas reservadas para botões de ação:

  * canto superior direito
  * canto inferior esquerdo

---

## 📊 `Table`

Tabela de dados inteligente com:

* Busca híbrida em tempo real:

  * Texto simples
* Injeção dinâmica de colunas baseada no JSON da API
* Botões acoplados para:

  * Editar
  * Excluir registros

---

## 🪟 Modal de Edição

Sistema de modal flutuante com:

* Fundo escurecido
* Padronização via CSS global
* Edição rápida (`PUT`) sem sair da tela de listagem

---

## 🔘 `Button` e `FormInput`

Componentes base padronizados para manter consistência visual e reaproveitamento de código.

---

# 🖥️ Telas e CRUDs Finalizados

## 📌 Menu Principal (`/menu`)

Grade de navegação inteligente que:

* Oculta módulos sem permissão
* Exibe funcionalidades conforme o perfil do usuário logado

---

## 👤 Cadastro Global de Usuários (`/cadastro`)

Tela mestra para criação de usuários (`ADMIN`).

### Recursos:

* Botão de **Voltar** dinâmico:

  ```js
  router.back()
  ```
* Retorna exatamente para a tela anterior

---

## 🎓 Gestão de Usuários (`/users`)

Listagem de usuários consumindo o endpoint:

```http
/users
```

### Funcionalidades:

* Filtro dinâmico pelo perfil
* Integração completa com:

  * Exclusão
  * Modal de edição

---

## 🏢 Gestão de Locais (`/locais`)

### Funcionalidades:

* Listagem de locais
* Exclusão de registros
* Edição via modal

### Subtela de Cadastro (`/locais/cadastro`)

Tela otimizada apenas para o campo:

```txt
Nome
```

### Regras aplicadas:

* Respeito aos limites da entidade Java:

  ```jsx
  maxLength={40}
  ```

---

# 🛠️ Tecnologias Utilizadas

* **Next.js (App Router)**
* **React**

  * `useState`
  * `useEffect`
  * Componentização baseada em `props`
* **Fetch API**

  * Wrapper customizado para requisições
* **CSS Global**

  * Abordagem pragmática e centralizada para estilização
  * Consistência visual entre:

    * Cards
    * Modais
    * Botões
    * Formulários

---
