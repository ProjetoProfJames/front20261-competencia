const API_URL = 'http://localhost:8080/api/turmas';

const turmasService = {
  listar: async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token && { "Authorization": `Bearer ${token}` })
        }
      });
      if (response.ok) return response.json();
    } catch (e) {
      console.warn("Backend indisponível, buscando turmas locais.");
    }

    const locais = localStorage.getItem("turmas_locais");
    return locais ? JSON.parse(locais) : [
      { id: 1, nome: 'Turma A', turno: 'Matutino' },
      { id: 2, nome: 'Turma B', turno: 'Noturno' }
    ];
  },

  salvar: async (dadosTurma) => {
    const token = localStorage.getItem("token");
    const novaTurma = { id: Date.now(), ...dadosTurma };

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { "Authorization": `Bearer ${token}` })
        },
        body: JSON.stringify(dadosTurma)
      });
      if (response.ok) return response.json();
    } catch (e) {
      console.warn("Backend offline, salvando turma localmente.");
    }

    const locais = localStorage.getItem("turmas_locais");
    const listaAtualizada = locais ? JSON.parse(locais) : [
      { id: 1, nome: 'Turma A', turno: 'Matutino' },
      { id: 2, nome: 'Turma B', turno: 'Noturno' }
    ];
    
    listaAtualizada.push(novaTurma);
    localStorage.setItem("turmas_locais", JSON.stringify(listaAtualizada));
    return novaTurma;
  },
adicionarAluno: async (turmaId, alunoId) => {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/${turmaId}/alunos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { "Authorization": `Bearer ${token}` })
      },
      body: JSON.stringify({ alunoId: parseInt(alunoId) }) 
    });

    if (!response.ok) {
      throw new Error(`Erro ao matricular aluno: ${response.status}`);
    }

    const resJson = await response.json();
    return resJson.data || resJson;
  },
  atualizar: async (id, dadosTurma) => {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(token && { "Authorization": `Bearer ${token}` })
      },
      body: JSON.stringify(dadosTurma)
    });

    if (!response.ok) {
      throw new Error(`Erro no PUT: ${response.status}`);
    }

    const resJson = await response.json();
    return resJson.data || resJson;
  },

  excluir: async (id) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: { ...(token && { "Authorization": `Bearer ${token}` }) }
      });
      if (response.ok) return true;
    } catch (e) {
      console.warn("Falha ao excluir turma, removendo localmente.");
    }

    const locais = localStorage.getItem("turmas_locais");
    if (locais) {
      const lista = JSON.parse(locais);
      const filtrada = lista.filter(t => t.id !== id);
      localStorage.setItem("turmas_locais", JSON.stringify(filtrada));
    }
    return true;
  }
};

export default turmasService;