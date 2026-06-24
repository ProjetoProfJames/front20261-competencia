# 🔧 Guia de Troubleshooting - PIE Manager

## ❌ Erros Comuns e Soluções

### "Unexpected server error" ao criar usuário

**Causas possíveis:**

1. **Email já existe**
   - Solução: Use um email diferente ou novo
   - Erro: "Email already exists"

2. **Perfil inválido ou não selecionado**
   - Solução: Certifique-se que selecionou um perfil no dropdown
   - Opções: ADMIN, PROFESSOR, COORDENADOR, ALUNO, AVALIADOR_EXTERNO

3. **Campos não preenchidos**
   - Solução: Preencha TODOS os campos (Nome, Email, Senha, Perfil)

4. **Validação de campos**
   - Nome: Mínimo 3 caracteres
   - Email: Deve ser válido (exemplo@dominio.com)
   - Senha: Mínimo 6 caracteres
   - Perfil: Obrigatório

### "Email ou senha inválidos" ao fazer login

**Possíveis problemas:**

1. **Não clicou em "Carregar Dados de Teste"**
   - Solução: Clique no botão antes de tentar fazer login
   - Os usuários só existem após carregar o bootstrap

2. **Email com espaços ou letras maiúsculas**
   - Solução: O sistema normaliza para minúsculas e sem espaços
   - Correto: `admin@unisales.br` (não `admin@unisales.br `)

3. **Senha errada**
   - Solução: Digite com cuidado (case-sensitive)
   - Admin: `admin@123`
   - Outros: `12345`

4. **Usuário não existe**
   - Solução: Verifique o email exato
   - Veja lista em CREDENCIAIS.md

### "Erro ao conectar com o servidor"

**Backend não está rodando:**

```bash
# Verificar se está rodando
netstat -ano | findstr :8080

# Se não estiver, inicie
cd piemanager
mvn spring-boot:run
```

**Verificar conectividade:**
- Abra http://localhost:8080 no navegador
- Deve retornar erro de "Whitelabel Error" (OK, significa que está rodando)

### "Usuário não aparece no menu após login"

**Possível problema no localStorage:**

1. F12 → Application → Local Storage → http://localhost:3000
2. Verifique se tem os keys: `token` e `user`
3. Se não tiver, faça logout e login novamente

**Resetar localStorage:**
```javascript
// No Console do F12
localStorage.clear()
window.location.reload()
```

### "Nenhum usuário encontrado" na listagem

**Possíveis causas:**

1. Você não tem permissão para visualizar
   - ADMIN: Pode visualizar todos
   - PROFESSOR: Pode visualizar todos
   - Outros: Não têm acesso

2. Bootstrap não foi executado
   - Solução: Clique novamente em "Carregar Dados de Teste" na login

3. Usuários foram deletados
   - Solução: Execute bootstrap novamente

### "Não autorizado" ou "Sem permissão"

**Você não tem permissão para esta ação:**

1. Verifique seu perfil (menu, canto superior)
2. Consulte tabela de permissões em CREDENCIAIS.md
3. Peça a um ADMIN para elevar seu perfil se necessário

### Página em branco após login

**Problemas possíveis:**

1. **Erro de carregamento:**
   - F12 → Console
   - Veja a mensagem de erro
   - Comum: "Cannot read properties of null"

2. **localStorage corrompido:**
   ```javascript
   localStorage.clear()
   location.reload()
   ```

3. **Token expirado:**
   - Faça logout e login novamente

### "CORS error" ao fazer requisição

**Backend não está configurado para aceitar requests:**

1. Verificar CORS no backend
2. Certificar que `http://localhost:3000` está na whitelist

Solução normalmente já aplicada no projeto, mas se aparecer:

```
Access to XMLHttpRequest at 'http://localhost:8080/...'
from origin 'http://localhost:3000' has been blocked by CORS policy
```

Então o CORS não está ativado no backend.

---

## 🔍 Como Debugar

### Verificar requisições HTTP

1. Abra F12 (Dev Tools)
2. Vá para aba "Network"
3. Faça a ação (criar usuário, fazer login, etc)
4. Clique na requisição
5. Veja:
   - **Headers**: Token está sendo enviado?
   - **Request**: Dados corretos?
   - **Response**: Status code e mensagem de erro?

### Ver logs do Backend

Terminal onde rodou `mvn spring-boot:run`:
```
[INFO] Tomcat started on port(s): 8080
ERROR: ...mensagem de erro...
```

Se ver erro, copie e Google (é comum ter solução)

### Ver console do Frontend

F12 → Console:
- Erros em vermelho
- Avisos em amarelo
- Clique em para expandir e ver stack trace

---

## ✅ Checklist de Verificação

Antes de assumir que há um bug, verifique:

- [ ] Backend está rodando? (`http://localhost:8080`)
- [ ] Frontend está rodando? (`http://localhost:3000`)
- [ ] Clicou em "Carregar Dados de Teste"?
- [ ] Fez login com credenciais corretas?
- [ ] localStorage tem token e user?
- [ ] O perfil tem permissão para a ação?
- [ ] F12 Console sem erros vermelhos?
- [ ] Network tab mostra response 200?

---

## 🆘 Se Ainda Não Funcionar

Colete informações:

1. **Print do erro** (screenshot)
2. **Console log** (F12 → Console, copie tudo)
3. **Network response** (F12 → Network, clique na requisição)
4. **Backend log** (terminal)
5. **Valores que preencheu** (dados exatos)

Exemplo de dados para reportar:

```
Erro ao criar usuário
Nome: João
Email: joao@test.com
Perfil: PROFESSOR
Mensagem de erro: "Unexpected server error"
Status HTTP: 500
```

---

## 🚀 Reset Total (Última Opção)

Se nada funcionar:

### 1. Parar tudo
```
Ctrl+C em todos os terminais (backend e frontend)
```

### 2. Limpar cache
```
# Frontend
cd front
npm cache clean --force
rm -r .next node_modules

# Reinstalar
npm install
npm run dev
```

### 3. Resetar banco (se usando arquivo)
```
# Deletar arquivo de banco se existir
# Depois reiniciar backend
mvn spring-boot:run
```

### 4. Limpar localStorage
```
# No Console (F12)
localStorage.clear()
```

### 5. Carregar dados novamente
- Faça login
- Clique "Carregar Dados de Teste"
- Faça login com `admin@unisales.br / admin@123`

---

## 📞 Informações Úteis

### Arquivos Importantes
- `front/CREDENCIAIS.md` - Usuários de teste
- `piemanager/src/main/resources/application.properties` - Config backend
- `front/src/services/api.js` - Cliente HTTP

### Portas Padrão
- Frontend: **3000**
- Backend: **8080**
- Banco de dados: **Depende da config** (H2 default)

### Variáveis de Ambiente
Se precisar mudar, edite:
- Frontend: `.env.local` (criar se não existir)
- Backend: `application.properties`

---

**Última atualização**: 2026-06-21
**Versão**: 1.0.0
