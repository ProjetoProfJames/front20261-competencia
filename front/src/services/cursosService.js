const API_URL = '/api/cursos';

export const cursosService = {
  
  listar: async () => {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Erro ao buscar cursos');
    return response.json();
  },

  
  salvar: async (dadosCurso) => {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dadosCurso),
    });
    if (!response.ok) throw new Error('Erro ao salvar curso');
    return response.json();
  },

  
  excluir: async (id) => {
    const response = await fetch(`${API_URL}?id=${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Erro ao excluir curso');
    return true;
  }
};