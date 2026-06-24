const API_URL = 'http://localhost:8080/turmas';

export const turmasService = {
  
  listar: async () => {
    /* COMENTADO PARA MODO DE TESTE
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Erro ao buscar turmas');
    return response.json();
    */

    // Dados fictícios para a listagem de turmas na apresentação
    return [
      { id: 1, nome: 'TADS - 1º Período', turno: 'Noturno' },
      { id: 2, nome: 'TADS - 2º Período', turno: 'Noturno' },
      { id: 3, nome: 'Engenharia - 4º Período', turno: 'Matutino' }
    ];
  },

  salvar: async (dadosTurma) => {
    /* COMENTADO PARA MODO DE TESTE
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dadosTurma),
    });
    if (!response.ok) throw new Error('Erro ao salvar turma');
    return response.json();
    */

    // Simula sucesso no salvamento da turma
    return { id: Math.random(), ...dadosTurma };
  },

  excluir: async (id) => {
    /* COMENTADO PARA MODO DE TESTE
    const response = await fetch(`${API_URL}?id=${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Erro ao excluir turma');
    return true;
    */

    // Simula sucesso na exclusão da turma
    return true;
  }
};