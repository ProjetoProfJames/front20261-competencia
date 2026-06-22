# TASK 1 - PIE Manager

## 📋 O que foi implementado

### 1. **Tela de Login** 
- Formulário com email e senha
- Validação básica de campos
- Botão para carregar dados de teste (bootstrap)
- Redirecionamento automático após login bem-sucedido
- Armazenamento do token JWT e dados do usuário no localStorage

### 2. **Menu Principal** (Header)
- Exibe nome do usuário logado
- Botão de logout que limpa a sessão
- Links dinâmicos baseados no tipo de usuário (perfil)
- Logo da aplicação

### 3. **Controle de Acesso**
O sistema controla quem acessa cada página baseado no perfil do usuário:

| Perfil | Usuários | Locais | Projetos |
|--------|----------|--------|----------|
| ADMIN | ✅ Listar/Editar/Deletar | ✅ Listar/Editar/Deletar | ✅ Visualizar |
| COORDENADOR | ❌ Não acessa | ✅ Listar/Editar/Deletar | ✅ Visualizar |
| PROFESSOR | ✅ Apenas Listar | ✅ Listar | ✅ Visualizar |
| ALUNO | ❌ Não acessa | ❌ Não acessa | ✅ Visualizar |
| AVALIADOR_EXTERNO | ❌ Não acessa | ❌ Não acessa | ✅ Visualizar |

### 4. **CRUD de Usuários**
- **Listar**: Tabela com todos os usuários (nome, email, perfil, data criação)
- **Cadastrar**: Formulário com validação
- **Editar**: Atualizar nome e senha
- **Deletar**: Remover usuário do sistema
- Campos: Nome, Email, Senha, Perfil

### 5. **CRUD de Locais**
- **Listar**: Tabela com todos os locais
- **Cadastrar**: Criar novo local
- **Editar**: Atualizar informações
- **Deletar**: Remover local
- Campo: Número/Identificação (Sala 101, Auditório, etc)

### 6. **Home/Dashboard**
- Página inicial após login
- Exibe perfil do usuário
- Cards de acesso rápido às páginas disponíveis
- Interface amigável com ícones

## 🎨 Design e CSS

### Identidade Visual
- **Cores principais**: 
  - Primária: `#6366f1` (Índigo)
  - Secundária: `#f97316` (Laranja)
  - Sucesso: `#22c55e` (Verde)
  - Erro: `#ef4444` (Vermelho)

### Componentes de UI
- Botões com estados hover
- Inputs com validação visual
- Tabelas com linhas alternadas
- Cards responsivos
- Alertas de sucesso, erro e informação
- Forms estruturados e validados

### Recursos CSS
- Variáveis CSS para fácil customização
- Responsive design (mobile-friendly)
- Sombras sutis
- Transições suaves
- Border-radius consistente

## 🔐 Segurança

### Autenticação JWT
- Token armazenado no localStorage
- Incluído automaticamente em todas as requisições
- Se expirado, usuário é redirecionado para login

### Autorização
- Cada endpoint verifica o perfil do usuário
- Menu e páginas se adaptam aos perfis
- Botões de ação desabilitados para usuários sem permissão

## 🛠️ Serviços Utilizados

### API Service (`/services/api.js`)
- Wrapper para fetch com suporte a JWT
- Metodos: GET, POST, PUT, DELETE
- Tratamento automático de erro 401 (não autorizado)

### Auth Service (`/services/authService.js`)
- `getUser()`: Retorna dados do usuário logado
- `getToken()`: Retorna JWT
- `logout()`: Remove dados de sessão
- `hasPermission(profiles)`: Verifica se usuário tem permissão
- `isAdmin()`, `isProfessor()`, etc: Atalhos para cada perfil

## 📁 Estrutura de Arquivos

```
front/src/
├── app/
│   ├── login/page.js          # Tela de login
│   ├── page.js                # Home/Dashboard
│   ├── usuarios/
│   │   ├── page.js            # Listar usuários
│   │   ├── novo/page.js       # Cadastrar usuário
│   │   └── [id]/page.js       # Editar usuário
│   ├── locais/
│   │   ├── page.js            # Listar locais
│   │   ├── novo/page.js       # Cadastrar local
│   │   └── [id]/page.js       # Editar local
│   ├── projetos/page.js       # Página de projetos
│   ├── layout.js              # Root layout
│   └── global.css             # Estilos globais
├── components/
│   ├── Layout/index.js        # Header com menu
│   ├── Button/index.js        # Componente botão
│   ├── FormInput/index.js     # Componente input
│   └── Table/index.js         # Componente tabela
└── services/
    ├── api.js                 # Cliente HTTP
    ├── authService.js         # Gerenciamento de autenticação
    └── projetoService.js      # Serviço de projetos
```

## 🚀 Como Usar

### 1. Iniciar Backend
```bash
cd piemanager
mvn spring-boot:run
```

### 2. Iniciar Frontend
```bash
cd front
npm install
npm run dev
```

### 3. Login
- Abra `http://localhost:3000`
- Clique em "Carregar Dados de Teste" para popular o banco
- Use um email e senha de teste para fazer login

### 4. Dados de Teste (após carregar bootstrap)
```
ADMIN:
Email: admin@unisales.br
Senha: admin@123

COORDENADOR:
Email: coordenador@unisales.br
Senha: 12345

PROFESSOR:
Email: prof.computacao@unisales.br
Senha: 12345

ALUNO:
Email: aluno.um@unisales.br
Senha: 12345
```

## ✅ Checklist da Task 1

- ✅ Tela de login com email e senha
- ✅ Menu com nome do usuário e botão logout
- ✅ Links do menu restritos por tipo de usuário
- ✅ Listagem de usuários
- ✅ Cadastro de usuários (CRUD Create)
- ✅ Edição de usuários (CRUD Update)
- ✅ Deleção de usuários (CRUD Delete)
- ✅ Leitura de usuários (CRUD Read)
- ✅ Listagem de locais
- ✅ Cadastro de locais (CRUD Create)
- ✅ Edição de locais (CRUD Update)
- ✅ Deleção de locais (CRUD Delete)
- ✅ Leitura de locais (CRUD Read)
- ✅ CSS da identidade visual
- ✅ Integração com backend via JWT
- ✅ Controle de acesso por perfil
- ✅ Validação básica de formulários
- ✅ Código organizado e limpo

## 📝 Notas Importantes

1. **Sem comentários no código**: Conforme requisitado, o código está limpo e legível
2. **Sem bibliotecas extras**: Apenas React/Next e CSS vanilla
3. **Código organizado**: Separação clara entre componentes, páginas e serviços
4. **Responsivo**: Funciona em desktop e mobile
5. **Fácil de explicar**: Design simples e intuitivo

## 🔄 Fluxos Principais

### Fluxo de Login
1. Usuário entra em `/login`
2. Preenche email e senha
3. API valida credenciais
4. Backend retorna JWT + dados do usuário
5. Frontend armazena no localStorage
6. Redireciona para home

### Fluxo de CRUD
1. Usuário navega para página (Ex: `/usuarios`)
2. Componente faz GET para listar dados
3. Exibe tabela com dados
4. Pode clicar em Novo, Editar ou Deletar
5. Formulário faz POST (novo) ou PUT (editar)
6. Após sucesso, retorna para listagem

### Fluxo de Controle de Acesso
1. Na home, verifica perfil do usuário
2. Mostra apenas cards que ele pode acessar
3. No menu, links aparecem conforme permissão
4. Se tenta acessar URL proibida, API retorna 403
5. Se token expirou, redireciona para login automaticamente

---

**Desenvolvido para**: PIE Manager - Sistema de Gestão de Projetos Integradores
**Versão**: 1.0.0
