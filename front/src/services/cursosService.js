const API_URL = 'http://localhost:8080/cursos';

export const cursosService = {
  listar: async () => {
    return [
      { id: 1, nome: 'Análise e Desenvolvimento de Sistemas', codigo: 'TADS' },
      { id: 2, nome: 'Engenharia de Software', codigo: 'ENG' },
      { id: 3, nome: 'Sistemas de Informação', codigo: 'SI' }
    ];
  },

  salvar: async (dadosCurso) => {
    return { id: Math.random(), ...dadosCurso };
  },

  excluir: async (id) => {
    return true;
  }
};