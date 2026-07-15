# Frontend - Task 1

Este frontend faz a Task 1 da competencia:

- Login com email e senha.
- Menu com nome do usuario, perfil, links por permissao e logout.
- CRUD de usuarios.
- CRUD de locais de apresentacao.
- Integracao com o backend usando JWT.

## O que precisa estar funcionando

Antes de abrir o frontend, o backend precisa estar rodando em `http://localhost:8080`.

O frontend usa estas rotas da API:

- `POST /api/auth/login`
- `GET /api/users`
- `POST /api/users`
- `GET /api/users/{id}`
- `PUT /api/users/{id}`
- `DELETE /api/users/{id}`
- `GET /api/locais`
- `POST /api/locais`
- `GET /api/locais/{id}`
- `PUT /api/locais/{id}`
- `DELETE /api/locais/{id}`

## Como rodar o backend

Entre na pasta do backend:

```powershell
cd ..\piemanager
```

Suba a API:

```powershell
.\mvnw.cmd spring-boot:run
```

Com a API ligada, crie os dados iniciais:

```powershell
Invoke-WebRequest -Method POST http://localhost:8080/api/public/bootstrap
```

Usuario admin inicial:

- Email: `admin@unisales.br`
- Senha: `12345`

Outros usuarios criados pelo bootstrap usam senha `12345`.

## Como rodar o frontend

Entre na pasta do frontend:

```powershell
cd ..\front
```

Instale as dependencias, se ainda nao tiver instalado:

```powershell
npm.cmd install
```

Rode o projeto:

```powershell
npm.cmd run dev
```

Abra:

```text
http://localhost:3000
```

No Windows, use `npm.cmd` se o PowerShell bloquear o comando `npm`.

## Permissoes usadas

- `ADMIN`: acessa usuarios e locais, cria, edita e exclui.
- `PROFESSOR`: acessa a listagem de usuarios.
- `COORDENADOR`: acessa locais.
- `ALUNO` e `AVALIADOR_EXTERNO`: acessam a home.

## Comparacao com as aulas do professor

O projeto segue o mesmo estilo das aulas do repositorio `Jamesasj/unisales.front.20261`:

- Next.js com pasta `src/app`.
- Componentes simples em `src/components`.
- `useState` e `useEffect` nas telas com interacao.
- `fetch` para comunicacao com backend.
- CSS global simples.
- Sem bibliotecas novas alem das que ja estavam no `package.json`.

## Comandos de verificacao

Para verificar se o frontend compila:

```powershell
npm.cmd run build
```

Para testar no navegador, rode:

```powershell
npm.cmd run dev
```

Depois faca login, entre em Usuarios e Locais, e teste criar, editar e excluir registros.
