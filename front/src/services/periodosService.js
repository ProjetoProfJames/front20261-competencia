const API_URL = 'http://localhost:8080/api/semestres';

const periodosService = {
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

    const locais = localStorage.getItem("periodos_locais");
    return locais ? JSON.parse(locais) : [];
  },

  salvar: async (dadosPeriodo) => {
    const token = localStorage.getItem("token");

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { "Authorization": `Bearer ${token}` })
      },
      body: JSON.stringify(dadosPeriodo)
    });
    
    if (!response.ok) {
      throw new Error(`Erro no POST: ${response.status}`);
    }

    const resJson = await response.json();
    return resJson.data || resJson;
  },

  atualizar: async (id, dadosPeriodo) => {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT", 
      headers: {
        "Content-Type": "application/json",
        ...(token && { "Authorization": `Bearer ${token}` })
      },
      body: JSON.stringify(dadosPeriodo)
    });

    if (!response.ok) {
      throw new Error(`Erro no PUT: ${response.status}`);
    }

    const resJson = await response.json();
    return resJson.data || resJson;
  },

  excluir: async (id) => {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: { ...(token && { "Authorization": `Bearer ${token}` }) }
    });

    if (!response.ok) {
      throw new Error(`Erro ao excluir: ${response.status}`);
    }

    return true;
  }
};

export default periodosService;