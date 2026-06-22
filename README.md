# 🎓 Sistema de Gestão de Competências — PieManager Frontend

Este é o frontend do sistema de Gestão de Competências **PieManager**, desenvolvido com **Next.js App Router** e **React**.

A aplicação consome uma API RESTful construída em **Spring Boot** e utiliza controle de acesso baseado em perfis, também conhecido como **Roles**.

---

# 🚀 O que já construímos

## 1. Autenticação e Inicialização do Sistema

### 🔐 Login com JWT

O sistema autentica o usuário e armazena as seguintes informações no `localStorage`:

* `token`
* `userName`
* `userProfile`

---

### ⚙️ Inicialização do Sistema — Bootstrap

A tela de login conta com uma mecânica inteligente de inicialização do banco de dados, chamada de **Bootstrap**.

#### Funcionamento

* Um botão exclusivo aciona o endpoint:

```http
/public/bootstrap
```

* Após a execução bem-sucedida, o estado é salvo no `localStorage`:

```js
bootstrapLoaded
```

* Depois disso, o botão é ocultado permanentemente para melhorar a experiência do usuário.

---

### 🌐 Interceptor de Requisições — `api.js`

Todas as requisições para o backend injetam automaticamente o token JWT no cabeçalho:

```http
Authorization: Bearer <token>
```

---

### 🛡️ Controle de Acesso — RoleGuard / Filtros de Rota

O sistema possui controle de acesso baseado em perfis de usuário.

Esse mecanismo é responsável por proteger elementos da interface, renderizando botões, menus e funcionalidades apenas quando o usuário possui o perfil adequado.

#### Perfis suportados

* `ADMIN`
* `COORDENADOR`
* `PROFESSOR`
* `ALUNO`
* Entre outros perfis definidos pelo backend.

---

# 🧩 Componentes Reutilizáveis — Design System

Para manter o código limpo, reutilizável e escalável, foi criada uma biblioteca de componentes e um sistema de design centralizado no arquivo:

```txt
global.css
```

O objetivo é aplicar o princípio **DRY** — *Don't Repeat Yourself* — e acelerar o desenvolvimento das telas.
Além disso, regras globais garantem que:

* Botões;
* Inputs;
* Formulários;
* Elementos interativos;

herdem corretamente a fonte base do sistema, evitando discrepâncias visuais.

---

## 📄 PageLayout

O componente `PageLayout` define a estrutura padrão de todas as telas da aplicação.

### Recursos

* Mensagem de boas-vindas dinâmica:

```txt
Olá, Nome! 👋
```

* Título padronizado;
* Subtítulo padronizado;
* Área reservada para botões de ação no canto superior direito;
* Área reservada para botões de ação no canto inferior esquerdo.

---

## 📊 Table

O componente `Table` funciona como uma tabela inteligente para exibição de dados.

### Funcionalidades

* Busca em tempo real por texto simples;
* Injeção dinâmica de colunas baseada no JSON retornado pela API;
* Botões acoplados para:

  * Edição;
  * Exclusão.

---

## 🪟 Modal de Edição Global

Foi criado um sistema de modal flutuante padronizado para edição de registros via requisição `PUT`.

---

## 📌 Menu Principal — `/menu`

O menu principal funciona como um painel de navegação inteligente e adaptativo.

#### Grid responsivo

Os botões são distribuídos em um layout de grade fixa com 4 colunas:

```css
grid-template-columns: repeat(4, 1fr);
```

#### Segurança visual

O menu oculta módulos sem permissão e exibe funcionalidades estritamente baseadas no perfil do usuário logado.

---

## 👤 Cadastro Global de Usuários — `/cadastro`

Tela principal para criação de usuários.

### Características

* Acesso restrito ao perfil `ADMIN`;
* Formulário centralizado para cadastro de usuários;
* Botão de voltar dinâmico usando:

```js
router.back()
```

Esse botão retorna exatamente para a tela de gestão anterior.

---

## 🎓 Gestão Especializada de Usuários

Foram criadas telas dedicadas para listagem e gerenciamento de usuários, filtrando a rota `/users` conforme o perfil.

### Rotas disponíveis

| Rota             | Finalidade                     |
| ---------------- | ------------------------------ |
| `/alunos`        | Gestão de alunos               |
| `/professores`   | Gestão de professores          |
| `/coordenadores` | Gestão de coordenadores        |
| `/avaliadores`   | Gestão de avaliadores externos |

### Funcionalidades

* Integração completa com botão de exclusão;
* Confirmação antes de excluir registros;
* Integração com modal flutuante para edição rápida;
* Listagem filtrada conforme o perfil do usuário.

---

## 🏢 Gestão de Locais — `/locais`

Tela destinada ao gerenciamento dos locais disponíveis para apresentação de projetos.

### Funcionalidades

* Listagem de locais cadastrados;
* Edição via modal;
* Exclusão direta;
* Integração com backend via API.

---

# 🛠️ Tecnologias Utilizadas

## Frameworks e Bibliotecas

* **Next.js**
* **React**
* **App Router**
* **Fetch API**

---

## Hooks Utilizados

* `useState`
* `useEffect`

---

## Arquitetura e Organização

* Componentização baseada em `props`;
* Wrapper customizado de serviços;
* Interceptação e padronização de requisições;
* Separação de responsabilidades por componentes;
* Reutilização de componentes globais.

---

# ✅ Resumo Geral

Até o momento, o frontend do **PieManager** conta com:

* Autenticação via JWT;
* Bootstrap inteligente do sistema;
* Interceptor de requisições;
* Tratamento visual de erros;
* Controle de acesso por perfil;
* Design System reutilizável;
* Layout padrão de páginas;
* Tabelas dinâmicas;
* Modal global de edição;
* CRUDs de usuários;
* CRUD de locais;
* Estrutura escalável com Next.js e React.

O sistema já possui uma base sólida para expansão de novos módulos, mantendo consistência visual, organização de código e segurança de acesso.
