const API_URL = '/api/turmas';

export const turmasService = {
  
  listar: async () => {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Erro ao buscar turmas');
    return response.json();
  },

 
  salvar: async (dadosTurma) => {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dadosTurma),
    });
    if (!response.ok) throw new Error('Erro ao salvar turma');
    return response.json();
  },

  
  excluir: async (id) => {
    const response = await fetch(`${API_URL}?id=${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Erro ao excluir turma');
    return true;
  }
};