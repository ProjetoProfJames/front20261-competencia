const API_URL = 'http://localhost:8080/api/cursos';

const cursosService = {
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
      if (response.ok) {
        const resJson = await response.json();
        return resJson.data || resJson;
      }
    } catch (e) {
      console.warn("Backend indisponível, buscando dados locais.");
    }

    const locais = localStorage.getItem("cursos_locais");
    return locais ? JSON.parse(locais) : [
      { id: 1, nome: 'Análise e Desenvolvimento de Sistemas', codigo: 'TADS' },
      { id: 2, nome: 'Engenharia de Software', codigo: 'ENG' },
      { id: 3, nome: 'Sistemas de Informação', codigo: 'SI' }
    ];
  },

  salvar: async (dadosCurso) => {
    const token = localStorage.getItem("token");
    const novoCurso = { id: Date.now(), ...dadosCurso };

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { "Authorization": `Bearer ${token}` })
        },
        body: JSON.stringify(dadosCurso)
      });
      if (response.ok) {
        const resJson = await response.json();
        return resJson.data || resJson;
      }
    } catch (e) {
      console.warn("Backend recusou ou está offline, salvando localmente.");
    }
    
    const locais = localStorage.getItem("cursos_locais");
    const listaAtualizada = locais ? JSON.parse(locais) : [
      { id: 1, nome: 'Análise e Desenvolvimento de Sistemas', codigo: 'TADS' },
      { id: 2, nome: 'Engenharia de Software', codigo: 'ENG' },
      { id: 3, nome: 'Sistemas de Informação', codigo: 'SI' }
    ];
    
    listaAtualizada.push(novoCurso);
    localStorage.setItem("cursos_locais", JSON.stringify(listaAtualizada));
    return novoCurso;
  },

  // 👇 MÉTODO ATUALIZAR ADICIONADO AQUI 👇
  atualizar: async (id, dadosCurso) => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token && { "Authorization": `Bearer ${token}` })
        },
        body: JSON.stringify(dadosCurso)
      });
      if (response.ok) {
        const resJson = await response.json();
        return resJson.data || resJson;
      }
    } catch (e) {
      console.warn("Backend falhou ao atualizar, atualizando localmente.");
    }

    const locais = localStorage.getItem("cursos_locais");
    if (locais) {
      const lista = JSON.parse(locais);
      const index = lista.findIndex(c => c.id === id);
      if (index !== -1) {
        lista[index] = { ...lista[index], ...dadosCurso };
        localStorage.setItem("cursos_locais", JSON.stringify(lista));
        return lista[index];
      }
    }
    return null;
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
      console.warn("Backend falhou ao excluir, removendo localmente.");
    }

    const locais = localStorage.getItem("cursos_locais");
    if (locais) {
      const lista = JSON.parse(locais);
      const filtrada = lista.filter(c => c.id !== id);
      localStorage.setItem("cursos_locais", JSON.stringify(filtrada));
    }
    return true;
  }
};

export default cursosService;