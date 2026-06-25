const API_URL = 'http://localhost:8080/turmas';

export const turmasService = {
  listar: async () => {
    return [
      { id: 1, nome: 'TADS - 1º Período', turno: 'Noturno' },
      { id: 2, nome: 'TADS - 2º Período', turno: 'Noturno' },
      { id: 3, nome: 'Engenharia - 4º Período', turno: 'Matutino' }
    ];
  },

  salvar: async (dadosTurma) => {
    return { id: Math.random(), ...dadosTurma };
  },

  excluir: async (id) => {
    return true;
  }
};