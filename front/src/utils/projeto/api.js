import { apiFetch } from '@/utils/services/api';

const unwrap = (payload) => {
  if (payload && typeof payload === 'object' && 'data' in payload) {
    return payload.data;
  }

  return payload;
};

const normalizarId = (valor) => {
  const numero = Number(valor);
  return Number.isNaN(numero) ? null : numero;
};

const toIsoString = (valor) => {
  if (!valor) return null;

  if (valor instanceof Date) {
    return valor.toISOString();
  }

  const data = new Date(valor);

  if (isNaN(data.getTime())) {
    return null;
  }

  return data.toISOString();
};

const mapProjetoToGrupo = (projeto = {}) => ({
  id: normalizarId(projeto.id),
  nome: projeto.nome || '',
  turmaId: normalizarId(projeto.turma?.id ?? projeto.turmaId),
  professorId: normalizarId(
    projeto.professorOrientador?.id ?? projeto.professorOrientadorId
  ),
  alunos: Array.isArray(projeto.integrantes)
    ? projeto.integrantes
        .map((integrante) => normalizarId(integrante?.id))
        .filter((id) => id !== null)
    : [],
  localApresentacao: projeto.local?.nome || projeto.localApresentacao || '',
  horarioInicio: projeto.horarioInicio || '',
  horarioFim: projeto.horarioFim || '',
  nota:
    projeto.nota !== undefined && projeto.nota !== null
      ? Number(projeto.nota)
      : undefined,
  projetoId: normalizarId(projeto.projetoId ?? projeto.id),
});

const mapGrupoToProjetoPayload = (grupo = {}) => ({
  nome: grupo.nome || '',
  descricao:
    grupo.descricao ||
    grupo.localApresentacao ||
    `Projeto ${grupo.nome || 'sem nome'}`,
  turmaId: normalizarId(grupo.turmaId ?? grupo.turma?.id),
  semestreId: normalizarId(grupo.semestreId),
  professorOrientadorId:
    normalizarId(grupo.professorOrientadorId ?? grupo.professorId),
  integranteIds: Array.isArray(grupo.alunos)
    ? grupo.alunos.map((id) => normalizarId(id)).filter((id) => id !== null)
    : [],
  localId: normalizarId(grupo.localId),

  horarioInicio: toIsoString(grupo.horarioInicio),
  horarioFim: toIsoString(grupo.horarioFim),
});

export const grupoService = {
  async getAll() {
    const response = await apiFetch('/api/projetos');
    const dados = unwrap(response);

    return Array.isArray(dados)
      ? dados.map(mapProjetoToGrupo)
      : [];
  },

  async getById(id) {
    const response = await apiFetch(`/api/projetos/${id}`);
    const dados = unwrap(response);

    return dados ? mapProjetoToGrupo(dados) : null;
  },

  async save(grupo) {
    const grupoNormalizado = mapGrupoToProjetoPayload(grupo);

    console.log("GRUPO RECEBIDO DO FORM:", grupo);

    console.log("PAYLOAD ENVIADO PARA /api/projetos:", grupoNormalizado);

    const isUpdate = grupo?.id !== undefined && grupo?.id !== null;

    const response = await apiFetch(
      isUpdate ? `/api/projetos/${grupo.id}` : '/api/projetos',
      {
        method: isUpdate ? 'PUT' : 'POST',
        body: JSON.stringify(grupoNormalizado),
      }
    );

    return mapProjetoToGrupo(unwrap(response));
  },

  async delete(id) {
    await apiFetch(`/api/projetos/${id}`, {
      method: 'DELETE',
    });

    return true;
  },

  async evaluate(id, nota) {
    const response = await apiFetch(`/api/projetos/${id}/avaliacoes`, {
      method: 'POST',
      body: JSON.stringify({
        nota: Number(nota),
        comentario: 'Avaliação registrada pelo sistema.',
      }),
    });

    return unwrap(response);
  },
};