# PIE Manager — Projeto Integrado

Este repositório reúne os dois projetos do PIE Manager em um único workspace:

```
front20261-competencia-main/
├── piemanager/   -> API REST em Spring Boot (Java 17)
└── front/        -> Frontend em Next.js (React 19)
```

Antes desta integração, o `front/` continha apenas um esqueleto inicial
(gerado pelo `create-next-app`, com login simples e componentes básicos),
enquanto a versão completa do frontend (dashboard, autenticação real,
CRUDs de Usuários, Cursos, Locais, Semestres e Turmas) estava em um projeto
separado (`piemanager-front`). Os dois já eram **compatíveis em nível de
API** (mesma URL base, mesmos endpoints, mesmo formato de resposta e
mesmas regras de perfil), mas viviam em pastas/projetos distintos.

Nesta integração, o conteúdo do frontend completo (`piemanager-front`)
substituiu o esqueleto antigo da pasta `front/`, ficando agora no mesmo
repositório que a API.

## Como tudo se conecta

- A API roda por padrão em `http://localhost:8080` (`piemanager/src/main/resources/application.properties`).
- O frontend aponta para `http://localhost:8080/api` em `front/src/lib/api.js`.
- O CORS da API está liberado para qualquer origem (`piemanager/src/main/java/com/unisales/piemanager/config/CorsConfig.java`), então o Next.js (porta 3000) consegue chamar a API sem problemas.
- As respostas da API seguem o formato `ApiResponse { success, message, data, timestamp }`, e o `front/src/lib/api.js` já trata isso, devolvendo `data.data` automaticamente.
- O login (`/api/auth/login`) retorna `accessToken` + `user`, que o frontend salva no `localStorage` e usa em todas as próximas requisições via header `Authorization: Bearer <token>`.

Endpoints consumidos pelo frontend e já existentes na API:

| Frontend (`front/src/app`) | Endpoint da API                          |
|-----------------------------|-------------------------------------------|
| `/login`                     | `POST /api/auth/login`                    |
| `/usuarios`                  | `GET/POST/PUT/DELETE /api/users`          |
| `/cursos`                    | `GET/POST/PUT/DELETE /api/cursos`         |
| `/locais`                     | `GET/POST/PUT/DELETE /api/locais`         |
| `/semestres`                  | `GET/POST/PUT/DELETE /api/semestres`      |
| `/turmas`                      | `GET/POST/PUT/DELETE /api/turmas` (+ `/disciplinas`) |

## Como executar

### 1. Backend (API)

```bash
cd piemanager
./mvnw spring-boot:run
```

A API sobe em `http://localhost:8080`. Documentação Swagger em
`http://localhost:8080/swagger-ui.html`.

Crie o usuário administrador inicial (necessário para o primeiro login):

```bash
curl -X POST http://localhost:8080/api/public/bootstrap
```

### 2. Frontend

```bash
cd front
npm install
npm run dev
```

O frontend sobe em `http://localhost:3000` e redireciona automaticamente
para `/login`. Após autenticar, o usuário é levado ao `/dashboard`, de onde
acessa Usuários, Cursos, Locais, Semestres e Turmas conforme seu perfil
(`ADMIN`, `COORDENADOR`, `PROFESSOR`, `ALUNO`, `AVALIADOR_EXTERNO`).

## Observações

- Módulos do backend ainda sem tela correspondente no frontend:
  `disciplinas` (usado apenas como combo na tela de Turmas),
  `projetos` e `avaliações`. Podem ser adicionados como novas páginas em
  `front/src/app/` seguindo o mesmo padrão das páginas existentes
  (ver `front/src/app/cursos/page.js` como referência de CRUD completo).
- O banco de dados é SQLite local (`piemanager/piemanager.db`), criado
  automaticamente na primeira execução do backend.
