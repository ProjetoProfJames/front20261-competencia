const API_URL = 'http://localhost:8080/periodos';

export const periodosService = {
  
  listar: async () => {
    return [
      { id: 1, ano: '2026', semestre: '1', status: 'CONCLUÍDO' },
      { id: 2, ano: '2026', semestre: '2', status: 'EM ANDAMENTO' }
    ];
  },

  salvar: async (dadosPeriodo) => {
    return { id: Math.random(), ...dadosPeriodo };
  },

  excluir: async (id) => {
    return true;
  }
};