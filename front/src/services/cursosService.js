const API_URL = 'http://localhost:8080/cursos';

export const cursosService = {

  listar: async () => {
    /* COMENTADO PARA MODO DE TESTE
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Erro ao buscar cursos');
    return response.json();
    */

    // Retorno simulado para alimentar a tabela na apresentação:
    return [
      { id: 1, nome: 'Análise e Desenvolvimento de Sistemas', codigo: 'TADS' },
      { id: 2, nome: 'Engenharia de Software', codigo: 'ENG' },
      { id: 3, nome: 'Sistemas de Informação', codigo: 'SI' }
    ];
  },

  salvar: async (dadosCurso) => {
    /* COMENTADO PARA MODO DE TESTE
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dadosCurso),
    });
    if (!response.ok) throw new Error('Erro ao salvar curso');
    return response.json();
    */

    // Simula o sucesso do salvamento retornando o objeto criado
    return { id: Math.random(), ...dadosCurso };
  },

  excluir: async (id) => {
    /* COMENTADO PARA MODO DE TESTE
    const response = await fetch(`${API_URL}?id=${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Erro ao excluir curso');
    return true;
    */

    // Simula a exclusão com sucesso
    return true;
  }
};