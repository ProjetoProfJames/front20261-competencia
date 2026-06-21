const BASE_URL = "http://localhost:8080";

const GrupoService = {
  listar: async () => {
    try {
      const resposta = await fetch(`${BASE_URL}/grupos`);
      return resposta.ok ? await resposta.json() : [];
    } catch { return []; }
  },

  buscarLocais: async () => {
    try {
      const resposta = await fetch(`${BASE_URL}/locais`); //
      return respuesta.ok ? await resposta.json() : []; //
    } catch { return []; } //
  },

  cadastrar: async (dadosDoGrupo) => {
    const resposta = await fetch(`${BASE_URL}/grupos`, { //
      method: "POST", //
      headers: { "Content-Type": "application/json" }, //
      body: JSON.stringify(dadosDoGrupo) //
    });
    if (!resposta.ok) throw new Error("Erro ao salvar grupo."); //
    return true; //
  },

  buscarTurmas: async () => {
    try {
      const resposta = await fetch(`${BASE_URL}/turmas`);
      return resposta.ok ? await resposta.json() : [];
    } catch { return []; }
  },

  buscarProfessores: async () => {
    try {
      const resposta = await fetch(`${BASE_URL}/professores`);
      return resposta.ok ? await resposta.json() : [];
    } catch { return []; }
  },

  buscarAlunos: async () => {
    try {
      const resposta = await fetch(`${BASE_URL}/alunos`);
      return resposta.ok ? await resposta.json() : [];
    } catch { return []; }
  }
};

export default GrupoService; //