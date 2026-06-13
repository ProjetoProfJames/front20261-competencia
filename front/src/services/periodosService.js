const API_URL = '/api/periodos';

export const periodosService = {
 
  listar: async () => {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Erro ao buscar períodos letivos');
    return response.json();
  },

 
  salvar: async (dadosPeriodo) => {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dadosPeriodo),
    });
    if (!response.ok) throw new Error('Erro ao salvar período letivo');
    return response.json();
  },

  
  excluir: async (id) => {
    const response = await fetch(`${API_URL}?id=${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Erro ao excluir período');
    return true;
  }
};