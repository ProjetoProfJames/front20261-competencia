# 🧪 Guia de Testes - TASK 1

## ✅ Checklist de Funcionalidades

### 🔐 Autenticação

- [ ] **Login com credenciais válidas**
  1. Abrir http://localhost:3000/login
  2. Clicar "Carregar Dados de Teste"
  3. Usar: admin@unisales.br / admin@123
  4. Verificar redirecionamento para home

- [ ] **Login com credenciais inválidas**
  1. Ir para /login
  2. Colocar email errado ou senha errada
  3. Verificar mensagem de erro "Email ou senha inválidos"

- [ ] **Campos vazios**
  1. Deixar campos em branco
  2. Clicar Entrar
  3. Verificar mensagem "Preencha o email e a senha"

- [ ] **Logout**
  1. Estar logado
  2. Clicar botão "Logout" no header
  3. Confirmar diálogo
  4. Verificar redirecionamento para /login
  5. Verificar localStorage limpo

---

### 📱 Menu e Navegação

- [ ] **Menu exibe nome do usuário**
  1. Logar como admin
  2. Verificar nome "Admin User" no header

- [ ] **Links do menu aparecem conforme perfil**
  
  **ADMIN**: Vê Projetos, Locais, Usuários
  1. Logar como admin@unisales.br / admin@123
  2. Verificar links no menu
  
  **PROFESSOR**: Vê Projetos, Locais (sem Usuários)
  1. Logar como prof.computacao@unisales.br / 12345
  2. Verificar Usuários NÃO aparece
  
  **COORDENADOR**: Vê Projetos, Locais (sem Usuários)
  
  **ALUNO**: Vê apenas Projetos

- [ ] **Navegar entre páginas**
  1. Clicar em "Usuários" no menu
  2. Verificar redirecionamento para /usuarios
  3. Clicar em "Locais"
  4. Verificar redirecionamento para /locais

---

### 🏠 Home/Dashboard

- [ ] **Home exibe perfil do usuário**
  1. Logar como admin
  2. Verificar seção "Seu perfil: ADMIN"

- [ ] **Cards de acesso rápido aparecem corretamente**
  1. Logar como admin
  2. Verificar cards: Locais, Usuários, Projetos
  3. Logar como aluno
  4. Verificar apenas card Projetos aparece

- [ ] **Cards clicáveis redirecionam**
  1. Clicar no card "Locais"
  2. Verificar redirecionamento para /locais

---

### 👥 CRUD de Usuários

#### **Listar**
- [ ] Abrir /usuarios
- [ ] Verificar tabela com colunas: ID, Nome, Email, Perfil, Criado em, Ações
- [ ] Verificar dados corretos dos usuários

#### **Criar Novo**
- [ ] Clicar "+ Novo Usuário"
- [ ] Preencher formulário:
  - Nome: "João Silva"
  - Email: "joao@test.com"
  - Senha: "senha123"
  - Perfil: "PROFESSOR"
- [ ] Clicar "Criar Usuário"
- [ ] Verificar sucesso
- [ ] Voltar para listagem
- [ ] Verificar novo usuário na tabela

#### **Editar**
- [ ] Na listagem, clicar "Editar" em um usuário
- [ ] Alterar nome para "João Silva 2"
- [ ] Deixar senha vazia
- [ ] Clicar "Salvar Alterações"
- [ ] Voltar para listagem
- [ ] Verificar nome atualizado

#### **Deletar**
- [ ] Na listagem, clicar "Deletar"
- [ ] Confirmar diálogo
- [ ] Verificar usuário removido da tabela

#### **Validações**
- [ ] Tentar criar usuário sem nome
- [ ] Verificar mensagem de erro
- [ ] Tentar com email inválido
- [ ] Verificar validação

---

### 📍 CRUD de Locais

#### **Listar**
- [ ] Abrir /locais
- [ ] Verificar tabela com colunas: ID, Número/Identif., Criado em, Criado por, Ações
- [ ] Verificar dados corretos

#### **Criar Novo**
- [ ] Clicar "+ Novo Local"
- [ ] Preencher "Número/Identificação": "Sala 101"
- [ ] Clicar "Criar Local"
- [ ] Verificar sucesso
- [ ] Voltar para listagem
- [ ] Verificar novo local na tabela

#### **Editar**
- [ ] Na listagem, clicar "Editar"
- [ ] Alterar número para "Sala 102"
- [ ] Clicar "Salvar Alterações"
- [ ] Voltar para listagem
- [ ] Verificar alteração

#### **Deletar**
- [ ] Na listagem, clicar "Deletar"
- [ ] Confirmar
- [ ] Verificar local removido

---

### 🔐 Controle de Acesso

- [ ] **ADMIN pode CRUD Usuários e Locais**
  1. Logar como admin
  2. Acessar /usuarios - ✅ Funciona
  3. Acessar /locais - ✅ Funciona
  4. Clicar botões de ação - ✅ Aparecem

- [ ] **PROFESSOR pode VER Usuários, não CRUD**
  1. Logar como professor
  2. Acessar /usuarios - ✅ Funciona
  3. Verificar botões Editar/Deletar - ❌ Não aparecem
  4. Botão "+ Novo Usuário" - ❌ Não aparece

- [ ] **COORDENADOR pode CRUD Locais**
  1. Logar como coordenador
  2. Acessar /locais - ✅ Funciona
  3. Clicar "+ Novo Local" - ✅ Funciona
  4. Acessar /usuarios - ❌ Link não aparece

- [ ] **ALUNO não acessa Admin**
  1. Logar como aluno
  2. Acessar /usuarios - ❌ Sem permissão
  3. Acessar /locais - ❌ Sem permissão
  4. Acessar /projetos - ✅ Funciona

---

### 🎨 Design e UX

- [ ] **Layout responsive**
  1. Abrir em desktop
  2. Verificar menu horizontal
  3. Abrir F12 (dev tools)
  4. Colocar em mobile (375px)
  5. Verificar menu adaptado

- [ ] **Cores consistentes**
  1. Buttons primários: Índigo (#6366f1)
  2. Buttons perigo: Vermelho (#ef4444)
  3. Buttons secundário: Cinza
  4. Verificar hover em buttons

- [ ] **Formulários validados**
  1. Clicar em input
  2. Verificar border muda para primária
  3. Verificar padding consistente
  4. Verificar label aligned corretamente

- [ ] **Tabelas legíveis**
  1. Verificar header em cor primária
  2. Verificar linhas com espaço
  3. Verificar hover nas linhas
  4. Verificar alinhamento de texto

- [ ] **Alerts funcionam**
  1. Provocar erro (deletar sem confirmar)
  2. Verificar alert vermelho
  3. Logar com sucesso
  4. Verificar alert de sucesso aparece

---

### 🔧 Integração com Backend

- [ ] **JWT Token armazenado**
  1. Logar
  2. F12 → Application → Local Storage
  3. Verificar "token" existe
  4. Verificar "user" tem dados

- [ ] **Requisições incluem token**
  1. F12 → Network
  2. Fazer ação (listar usuários)
  3. Verificar request headers
  4. Verificar "Authorization: Bearer ..."

- [ ] **Token expirado redireciona para login**
  1. Logar
  2. Esperar token expirar
  3. Fazer ação (listar usuários)
  4. Verificar redirecionamento para /login

---

## 📊 Matriz de Testes

| Funcionalidade | ADMIN | PROFESSOR | COORDENADOR | ALUNO |
|---|---|---|---|---|
| Login | ✅ | ✅ | ✅ | ✅ |
| Ver Menu | ✅ | ✅ | ✅ | ✅ |
| Logout | ✅ | ✅ | ✅ | ✅ |
| Listar Usuários | ✅ | ✅ | ❌ | ❌ |
| Criar Usuário | ✅ | ❌ | ❌ | ❌ |
| Editar Usuário | ✅ | ❌ | ❌ | ❌ |
| Deletar Usuário | ✅ | ❌ | ❌ | ❌ |
| Listar Locais | ✅ | ✅ | ✅ | ❌ |
| Criar Local | ✅ | ❌ | ✅ | ❌ |
| Editar Local | ✅ | ❌ | ✅ | ❌ |
| Deletar Local | ✅ | ❌ | ✅ | ❌ |
| Ver Projetos | ✅ | ✅ | ✅ | ✅ |

---

## 🐛 Possíveis Problemas e Soluções

### Problema: "Backend não conecta"
**Solução**:
1. Verificar se backend está rodando: `mvn spring-boot:run`
2. Verificar URL: `http://localhost:8080`
3. Verificar CORS está habilitado
4. Limpar cache: F12 → Application → Clear Storage

### Problema: "JWT expirado"
**Solução**:
1. Fazer logout
2. Fazer login novamente
3. Novo token será gerado

### Problema: "Página em branco"
**Solução**:
1. F12 → Console
2. Verificar erros
3. Hard refresh: Ctrl + Shift + R
4. Verificar localStorage não está corrompido

### Problema: "Usuário não aparece no menu"
**Solução**:
1. Verificar localStorage tem "user"
2. Fazer logout e login novamente
3. Verificar JSON está válido

---

## ✨ Casos de Sucesso

### Fluxo Completo Admin
```
1. Abrir http://localhost:3000/login
2. Carregar dados de teste
3. Logar com admin@unisales.br / admin@123
4. Dashboard exibe "ADMIN"
5. Clicar "Usuários" no menu
6. Listar usuários da tabela
7. Clicar "+ Novo Usuário"
8. Criar: "Teste User" / test@email.com / senha123 / PROFESSOR
9. Voltar para listagem
10. Novo usuário aparece na tabela
11. Clicar "Editar"
12. Alterar nome para "Teste User 2"
13. Salvar
14. Verificar alteração
15. Clicar "Deletar"
16. Confirmar
17. Usuário desaparece
18. Clicar "Locais"
19. Criar novo local "Sala 201"
20. Verificar em listagem
21. Logout
22. Volta para login
```

### Fluxo Aluno
```
1. Logar como aluno
2. Home mostra apenas "Projetos"
3. Menu mostra apenas "Projetos"
4. Tentar acessar /usuarios
5. Sem permissão (API retorna 403)
6. Logout
```

---

## 📝 Notas para Arguição

- Explicar estrutura de pastas
- Demonstrar controle de acesso por perfil
- Mostrar integração com backend (Network tab)
- Explicar JWT Token no localStorage
- Demonstrar CRUD completo
- Mostrar CSS responsivo
- Falar sobre segurança (tokens, autorização)

---

**Data de Testes**: _________________
**Testado por**: _________________
**Status**: ⭕ Passou | ⭕ Falhou | ⭕ Com Ressalvas

