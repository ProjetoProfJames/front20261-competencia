# 🔐 Credenciais de Teste - PIE Manager

## ⚡ Quick Access

### Admin (Acesso Total)
```
Email: admin@unisales.br
Senha: admin@123
```

### Outros Usuários (Senha: 12345)
```
COORDENADOR:
admin@unisales.br → admin@123

PROFESSOR:
prof.computacao@unisales.br → 12345

ALUNO:
aluno.um@unisales.br → 12345

AVALIADOR EXTERNO:
avaliador.externo@unisales.br → 12345
```

---

## 📋 Todos os Usuários Criados no Bootstrap

| Email | Nome | Perfil | Senha |
|-------|------|--------|-------|
| admin@unisales.br | admin | ADMIN | admin@123 |
| coordenador@unisales.br | coordenador | COORDENADOR | 12345 |
| prof.computacao@unisales.br | prof.computacao | PROFESSOR | 12345 |
| prof.engenharia@unisales.br | prof.engenharia | PROFESSOR | 12345 |
| aluno.um@unisales.br | aluno.um | ALUNO | 12345 |
| aluno.dois@unisales.br | aluno.dois | ALUNO | 12345 |
| aluno.tres@unisales.br | aluno.tres | ALUNO | 12345 |
| avaliador.externo@unisales.br | avaliador.externo | AVALIADOR_EXTERNO | 12345 |

---

## 🎯 O Que Cada Perfil Pode Fazer

### ADMIN (admin@unisales.br)
✅ Visualizar todos os usuários  
✅ Criar novo usuário  
✅ Editar qualquer usuário  
✅ Deletar usuário  
✅ Visualizar e gerenciar locais  
✅ Acesso total ao sistema

### PROFESSOR (prof.computacao@unisales.br)
✅ Visualizar listagem de usuários (leitura apenas)  
✅ Visualizar e gerenciar locais  
✅ Visualizar projetos

### COORDENADOR (coordenador@unisales.br)
❌ Não acessa listagem de usuários  
✅ Criar, editar e deletar locais  
✅ Visualizar projetos

### ALUNO (aluno.um@unisales.br)
❌ Não acessa usuários  
❌ Não acessa locais  
✅ Apenas visualiza projetos

### AVALIADOR_EXTERNO (avaliador.externo@unisales.br)
❌ Não acessa usuários  
❌ Não acessa locais  
✅ Apenas visualiza projetos

---

## 🚀 Como Testar Cada Perfil

### 1. Testar ADMIN
```
1. Abrir http://localhost:3000/login
2. Logar com: admin@unisales.br / admin@123
3. Menu deve mostrar: Projetos, Locais, Usuários
4. Botões + Novo aparecem em Usuários e Locais
5. Pode editar e deletar tudo
```

### 2. Testar PROFESSOR
```
1. Logar com: prof.computacao@unisales.br / 12345
2. Menu deve mostrar: Projetos, Locais (sem Usuários)
3. Usuários: Menu desaparece (sem acesso)
4. Locais: Pode ver mas botão + Novo não aparece
5. Botões Editar/Deletar não aparecem
```

### 3. Testar COORDENADOR
```
1. Logar com: coordenador@unisales.br / 12345
2. Menu deve mostrar: Projetos, Locais (sem Usuários)
3. Locais: Pode criar, editar e deletar
4. Usuários: Link não aparece no menu
```

### 4. Testar ALUNO
```
1. Logar com: aluno.um@unisales.br / 12345
2. Menu deve mostrar apenas: Projetos
3. Usuários: Link não aparece
4. Locais: Link não aparece
5. Só pode visualizar Projetos
```

### 5. Testar AVALIADOR_EXTERNO
```
1. Logar com: avaliador.externo@unisales.br / 12345
2. Menu deve mostrar apenas: Projetos
3. Acesso igual ao ALUNO
```

---

## 🔧 Para Resetar o Banco

Se os dados ficarem inconsistentes, pode resetar fazendo:

1. Parar o backend (Ctrl+C)
2. Deletar banco de dados (se usando H2 ou arquivo)
3. Reiniciar backend
4. Clicar novamente em "Carregar Dados de Teste"

Isso vai recriar todos os usuários e dados.

---

## ⚠️ Importante

- **Admin** é o único com senha diferente: `admin@123`
- Todos os outros têm senha: `12345`
- As credenciais são criadas automaticamente ao clicar "Carregar Dados de Teste"
- Se "Carregar Dados de Teste" retornar mensagem que já existe, significa que os dados já foram carregados
- Para criar novos usuários, é necessário ser ADMIN

---

**Ultima atualização**: 2026-06-21
