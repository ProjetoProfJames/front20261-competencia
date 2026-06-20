# Task 2 — CRUD de Cursos, Períodos Letivos e Turmas

## Status: ✅ Concluída

## Objetivo
Criar a listagem e o formulário de cadastro/edição de Cursos, Períodos
Letivos (Semestres) e Turmas.

## Requisitos e onde foram implementados

### 1. CRUD de Cursos
- **Arquivo:** `src/app/cursos/page.js`
- Tabela com listagem de cursos (`GET /api/cursos`).
- Modal de formulário para criar (`POST /api/cursos`) e editar
  (`PUT /api/cursos/:id`) cursos, com campo de nome do curso.
- Exclusão de curso (`DELETE /api/cursos/:id`) com confirmação.
- Ações de criar/editar/excluir restritas a quem tem permissão
  `manageCursos` (perfil `ADMIN`).

### 2. CRUD de Períodos Letivos (Semestres)
- **Arquivo:** `src/app/semestres/page.js`
- Tabela com listagem de semestres/períodos letivos
  (`GET /api/semestres`).
- Modal de formulário para criar (`POST /api/semestres`) e editar
  (`PUT /api/semestres/:id`) períodos letivos.
- Exclusão de período letivo (`DELETE /api/semestres/:id`) com
  confirmação.
- Ações de criar/editar/excluir restritas a quem tem permissão
  `manageSemestres` (perfil `ADMIN`).

### 3. CRUD de Turmas
- **Arquivo:** `src/app/turmas/page.js`
- Tabela com listagem de turmas (`GET /api/turmas`).
- Modal de formulário para criar (`POST /api/turmas`) e editar
  (`PUT /api/turmas/:id`) turmas, relacionando:
  - Curso(s) (`cursoIds`, carregado de `GET /api/cursos`)
  - Disciplina (`disciplinaId`, carregado de `GET /api/disciplinas`)
  - Período letivo/Semestre (`semestreId`, carregado de
    `GET /api/semestres`)
  - Professor(es) responsáveis (`professorIds`, carregado de
    `GET /api/users` filtrando perfil `PROFESSOR`)
- Exclusão de turma (`DELETE /api/turmas/:id`) com confirmação.
- Ações de criar/editar/excluir restritas a quem tem permissão
  `manageTurmas` (perfis `PROFESSOR` e `ADMIN`).

## Componentes de apoio usados nesta task
- `src/components/Table` — tabela genérica reaproveitada por todos os CRUDs.
- `src/components/Modal` — modal genérico para os formulários.
- `src/components/Button` e `src/components/FormInput` — elementos de UI
  reaproveitados em todas as telas.
- `src/lib/api.js` — cliente HTTP (`api.get/post/put/delete`) e regras de
  permissão (`canDo`), reaproveitados da Task 1.
- `src/components/Menu` — navegação para as três telas desta task
  (`Cursos`, `Semestres`, `Turmas`), já implementado na Task 1.

## Backend consumido (já existente em `piemanager/`)
- `GET /POST /PUT /DELETE /api/cursos`
- `GET /POST /PUT /DELETE /api/semestres`
- `GET /POST /PUT /DELETE /api/turmas`
- `GET /api/disciplinas` (consumido apenas como combo de seleção na tela
  de Turmas; não possui CRUD próprio no frontend ainda)

## Pendências / próximos passos sugeridos
- Não há tela de CRUD própria para Disciplinas (apenas leitura, usada como
  combo em Turmas). Caso seja necessário um cadastro completo de
  disciplinas, criar `src/app/disciplinas/page.js` seguindo o mesmo padrão
  das demais páginas (ver `src/app/cursos/page.js` como referência).
