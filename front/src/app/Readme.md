Rotas Api backend

Rota global: http://localhost:8080/

pointers

- user-controller

get - /api/users/{id}
param: id

put - /api/users/{id}
param: id
body:
{
  "username": "string",
  "password": "string",
  "profile": "ADMIN"
}

delete - /api/users/{id}
param: id

get - /api/users

post - /api/users
body:
{
  "username": "string",
  "email": "user@example.com",
  "password": "string",
  "profile": "ADMIN"
}

***************************************************
- turma-controller

get - /api/turmas/{id}
param: id

put - /api/turmas/{id}
param: id
body:
{
  "nome": "string",
  "cursoIds": [
    0
  ],
  "disciplinaId": 0,
  "semestreId": 0,
  "professorIds": [
    0
  ]
}

delete - /api/turmas/{id}
param: id

get - /api/turmas

post - /api/turmas
body:
{
  "nome": "string",
  "cursoIds": [
    0
  ],
  "disciplinaId": 0,
  "semestreId": 0,
  "professorIds": [
    0
  ]
}

post - /api/turmas/{id}/matriculas
param: id

post - /api/turmas/{id}/alunos
param: id
body:
{
  "alunoId": 0
}

delete - /api/turmas/{id}/alunos/{alunoId}
param: id, alunoId

***************************************************
- semestre-controller

get - /api/semestres/{id}
param: id

put - /api/semestres/{id}
param: id
body:
{
  "nome": "string",
  "dataInicio": "2026-06-22",
  "dataFim": "2026-06-22"
}

delete - /api/semestres/{id}
param: id

get - /api/semestres

post - /api/semestres
body: {
  "nome": "string",
  "dataInicio": "2026-06-22",
  "dataFim": "2026-06-22"
}

***************************************************
- projeto-controller

get - /api/projetos/{id}
param: id

put - /api/projetos/{id}
param: id
body: {
  "nome": "string",
  "descricao": "string",
  "turmaId": 0,
  "semestreId": 0,
  "professorOrientadorId": 0,
  "integranteIds": [
    0
  ],
  "localId": 0,
  "horarioInicio": "2026-06-22T15:38:50.584Z",
  "horarioFim": "2026-06-22T15:38:50.584Z"
}

delete - /api/projetos/{id}
param: id

put - /api/projetos/{id}/avaliacoes/{avaliacaoId}
param: id, avaliacaoId
body: {
  "nota": 10,
  "comentario": "string"
}

delete - /api/projetos/{id}/avaliacoes/{avaliacaoId}
param: id, avaliacaoId

get - /api/projetos
param: turmaId, semestreId, localId

post - /api/projetos
body: {
  "nome": "string",
  "descricao": "string",
  "turmaId": 0,
  "semestreId": 0,
  "professorOrientadorId": 0,
  "integranteIds": [
    0
  ],
  "localId": 0,
  "horarioInicio": "2026-06-22T15:40:55.128Z",
  "horarioFim": "2026-06-22T15:40:55.128Z"
}

post - /api/projetos/{id}/integrantes
param: id
body: {
  "alunoId": 0
}

post - /api/projetos/{id}/integrantes/me
param: id

delete - /api/projetos/{id}/integrantes/me
param: id

post - /api/projetos/{id}/avaliacoes
param: id
body: {
  "nota": 10,
  "comentario": "string"
}

delete - /api/projetos/{id}/integrantes/{alunoId}
param: id, alunoId

***************************************************
- local-controller

get - /api/locais/{id}
param: id

put - /api/locais/{id}
param: id

delete - /api/locais/{id}
param: id

get - /api/locais

post - /api/locais
body: {
  "numero": "string"
}

***************************************************
- disciplina-controller

get - /api/disciplinas/{id}
param: id

put - /api/disciplinas/{id}
param: id
body: {
  "nome": "string",
  "cursoId": 0
}

delete - /api/disciplinas/{id}
param: id

get - /api/disciplinas

post - /api/disciplinas
body: {
  "nome": "string",
  "cursoId": 0
}

***************************************************
- curso-controller

get - /api/cursos/{id}
param: id

put - /api/cursos/{id}
param: id
body: {
  "nome": "string",
  "coordenadorId": 0,
  "professorIds": [
    0
  ]
}

delete - /api/cursos/{id}
param: id

get - /api/cursos

post - /api/cursos
body: {
  "nome": "string",
  "coordenadorId": 0,
  "professorIds": [
    0
  ]
}

***************************************************
- avaliacao-controller

get - /api/avaliacoes/{id}
param: id

put - /api/avaliacoes/{id}
param: id
body: {
  "avaliadorId": 0,
  "nota": 10,
  "comentario": "string"
}

delete - /api/avaliacoes/{id}
param: id

get - /api/avaliacoes
param: projetoId, avaliadorId

post - /api/avaliacoes
body: {
  "projetoId": 0,
  "avaliadorId": 0,
  "nota": 10,
  "comentario": "string"
}

***************************************************
- bootstrap-controller

post - /api/public/bootstrap

***************************************************
- auth-controller

post - /api/auth/login
body: {
  "email": "user@example.com",
  "password": "string"
}




Rotas ainda sem uso:
- /api/users/{id} GET/PUT/DELETE
  - /api/turmas/{id} GET, /api/turmas/{id}/matriculas, /api/turmas/{id}/alunos, /api/turmas/{id}/alunos/{alunoId}
  - /api/semestres/{id} GET
  - /api/locais/{id} GET/PUT/DELETE
  - /api/disciplinas POST e /api/disciplinas/{id} GET/PUT/DELETE
  - /api/cursos/{id} GET