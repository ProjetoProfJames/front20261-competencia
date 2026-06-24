# Guia Git — Branches por Task

## Árvore de arquivos do frontend

```
front/
├── task-1/                        ← Branch: task-1
│   ├── package.json
│   ├── next.config.mjs
│   ├── jsconfig.json
│   └── src/
│       ├── app/
│       │   ├── layout.js
│       │   ├── page.js            (redireciona: / → /login ou /dashboard)
│       │   ├── global.css
│       │   ├── crud.module.css
│       │   ├── login/
│       │   │   ├── page.js        ✅ Login com e-mail e senha
│       │   │   └── login.module.css
│       │   ├── register/
│       │   │   └── page.js        ✅ Criar conta + campo Matrícula (10 dígitos)
│       │   ├── dashboard/
│       │   │   ├── page.js        ✅ Dashboard pós-login
│       │   │   └── dashboard.module.css
│       │   ├── usuarios/
│       │   │   └── page.js        ✅ CRUD de Usuários (col. Matrícula)
│       │   └── locais/
│       │       └── page.js        ✅ CRUD de Locais de Apresentação
│       ├── components/
│       │   ├── Menu/              ✅ Nome, perfil, logout, links por perfil
│       │   ├── Table/
│       │   ├── Modal/
│       │   ├── Button/
│       │   └── FormInput/
│       └── lib/
│           └── api.js             ✅ Token JWT no header, validateSession()
│
├── task-2/                        ← Branch: task-2
│   ├── package.json
│   ├── next.config.mjs
│   ├── jsconfig.json
│   └── src/
│       ├── app/
│       │   ├── layout.js
│       │   ├── page.js
│       │   ├── global.css
│       │   ├── crud.module.css
│       │   ├── login/             (incluída para o app funcionar standalone)
│       │   ├── register/          (incluída para o app funcionar standalone)
│       │   ├── dashboard/
│       │   ├── cursos/
│       │   │   └── page.js        ✅ CRUD de Cursos
│       │   ├── semestres/
│       │   │   └── page.js        ✅ CRUD de Períodos Letivos
│       │   ├── turmas/
│       │   │   └── page.js        ✅ CRUD de Turmas (curso + período + professor)
│       │   └── meu-perfil/
│       │       └── page.js        ✅ Aluno declara seu Curso e Período Letivo
│       ├── components/
│       │   ├── Menu/              (com link "Meu Perfil")
│       │   ├── Table/
│       │   ├── Modal/
│       │   ├── Button/
│       │   └── FormInput/
│       └── lib/
│           └── api.js
│
└── GIT_GUIDE.md                   ← Este arquivo
```

---

## Passo a passo — Subir no GitHub em branches separadas

### 1. Crie o repositório no GitHub

Acesse https://github.com/new, crie um repositório vazio (sem README),
e copie a URL. Exemplo: `https://github.com/seu-usuario/pie-manager-front.git`

### 2. Abra o PowerShell na pasta do frontend

```powershell
cd caminho\para\front20261-competencia-main\front
```

### 3. Inicialize o Git e configure o remote

```powershell
git init
git remote add origin https://github.com/seu-usuario/pie-manager-front.git
```

### 4. Suba a Task 1 na branch `task-1`

```powershell
# Cria e entra na branch task-1
git checkout -b task-1

# Adiciona APENAS os arquivos da task-1
git add task-1/
git add GIT_GUIDE.md

git commit -m "task-1: Login, Registro com Matrícula, Menu, CRUD Usuários e Locais"

# Envia para o GitHub
git push -u origin task-1
```

### 5. Suba a Task 2 na branch `task-2`

```powershell
# Cria e entra na branch task-2 (a partir da task-1)
git checkout -b task-2

# Adiciona os arquivos da task-2
git add task-2/

git commit -m "task-2: CRUD Cursos, Períodos Letivos, Turmas e Meu Perfil (aluno)"

# Envia para o GitHub
git push -u origin task-2
```

### 6. (Opcional) Branch main com tudo junto

```powershell
git checkout -b main
git add .
git commit -m "chore: tasks 1 e 2 consolidadas"
git push -u origin main
```

---

## Como testar cada task localmente

**Task 1:**
```powershell
cd task-1
npm install
npm run dev   # http://localhost:3000
```

**Task 2:**
```powershell
cd task-2
npm install
npm run dev   # http://localhost:3000 (ou 3001 se 3000 estiver em uso)
```

Certifique-se de que o backend (`piemanager/`) está rodando em
`http://localhost:8080` antes de testar.
