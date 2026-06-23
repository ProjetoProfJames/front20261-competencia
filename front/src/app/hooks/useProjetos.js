import { useState, useEffect } from "react";
import { apiRequest } from "@/services/api";

const HEADERS_JSON = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
};

export function useProjetos() {
  const [projetos, setProjetos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchId, setSearchId] = useState("");
  const [filtroTexto, setFiltroTexto] = useState("");
  const [editingId, setEditingId] = useState(null);

  const [turmas, setTurmas] = useState([]);
  const [semestres, setSemestres] = useState([]);
  const [locais, setLocais] = useState([]);
  const [professores, setProfessores] = useState([]);
  const [alunos, setAlunos] = useState([]);

  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    turmaId: 0,
    semestreId: 0,
    professorOrientadorId: 0,
    integranteIds: [],
    localId: 0,
    horarioInicio: "",
    horarioFim: ""
  });

  const fetchProjetos = async () => {
    setLoading(true);
    try {
      const result = await apiRequest("/projetos", {
        method: "GET",
        headers: HEADERS_JSON
      });
      const lista = result?.data || result;
      setProjetos(Array.isArray(lista) ? lista : []);
    } catch (e) {
      console.error(e);
      setProjetos([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchOpcoes = async () => {
    try {
      const [resTurmas, resSemestres, resLocais, resUsers] = await Promise.all([
        apiRequest("/turmas", { method: "GET", headers: HEADERS_JSON }).catch(() => []),
        apiRequest("/semestres", { method: "GET", headers: HEADERS_JSON }).catch(() => []),
        apiRequest("/locais", { method: "GET", headers: HEADERS_JSON }).catch(() => []),
        apiRequest("/users", { method: "GET", headers: HEADERS_JSON }).catch(() => [])
      ]);

      setTurmas(resTurmas?.data || resTurmas || []);
      setSemestres(resSemestres?.data || resSemestres || []);
      setLocais(resLocais?.data || resLocais || []);

      const todosUsuarios = resUsers?.data || resUsers || [];
      if (Array.isArray(todosUsuarios)) {
        setProfessores(todosUsuarios.filter(user => user.profile === 'PROFESSOR'));
        setAlunos(todosUsuarios.filter(user => user.profile === 'ALUNO'));
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchProjetos();
    fetchOpcoes();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "integranteIds") {
      const options = e.target.options;
      const selecionados = [];
      for (let i = 0; i < options.length; i++) {
        if (options[i].selected) selecionados.push(Number(options[i].value));
      }
      setFormData(prev => ({ ...prev, integranteIds: selecionados }));
    } else if (name === "nome" || name === "descricao" || name === "horarioInicio" || name === "horarioFim") {
      setFormData(prev => ({ ...prev, [name]: value }));
    } else {
      setFormData(prev => ({ ...prev, [name]: Number(value) }));
    }
  };

  const searchById = async (e) => {
    e.preventDefault();
    if (!searchId || Number(searchId) <= 0) {
      alert("Digite um ID válido para pesquisar!");
      return;
    }
    setLoading(true);
    try {
      const result = await apiRequest(`/projetos/${searchId}`, {
        method: "GET",
        headers: HEADERS_JSON
      });
      const encontrado = result?.data || result;
      if (encontrado && encontrado.id) setProjetos([encontrado]);
      else setProjetos([]);
    } catch (e) {
      console.error(e);
      setProjetos([]);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchId("");
    fetchProjetos();
  };

  const submit = async (e) => {
    e.preventDefault();

    if (!formData.nome.trim()) {
      alert("Por favor, insira o nome do projeto!");
      return;
    }
    if (!formData.descricao.trim()) {
      alert("Por favor, insira a descrição!");
      return;
    }
    if (formData.turmaId === 0) {
      alert("Por favor, selecione uma turma!");
      return;
    }
    if (formData.semestreId === 0) {
      alert("Por favor, selecione um período letivo!");
      return;
    }
    if (formData.professorOrientadorId === 0) {
      alert("Por favor, selecione um professor orientador!");
      return;
    }
    if (formData.localId === 0) {
      alert("Por favor, selecione um local!");
      return;
    }
    if (!formData.horarioInicio) {
      alert("Por favor, insira o horário de início!");
      return;
    }
    if (!formData.horarioFim) {
      alert("Por favor, insira o horário de fim!");
      return;
    }
    if (new Date(formData.horarioInicio) >= new Date(formData.horarioFim)) {
      alert("O horário de início deve ser anterior ao horário de fim!");
      return;
    }
    if (formData.integranteIds.length < 3 || formData.integranteIds.length > 7) {
      alert("O grupo de projeto deve possuir entre 3 e 7 alunos!");
      return;
    }

    const payload = {
      ...formData,
      horarioInicio: new Date(formData.horarioInicio).toISOString(),
      horarioFim: new Date(formData.horarioFim).toISOString()
    };

    setLoading(true);
    try {
      if (editingId) {
        await apiRequest(`/projetos/${editingId}`, {
          method: "PUT",
          headers: HEADERS_JSON,
          body: JSON.stringify(payload)
        });
        alert("Grupo de projeto atualizado com sucesso!");
        cancelEdit();
      } else {
        await apiRequest("/projetos", {
          method: "POST",
          headers: HEADERS_JSON,
          body: JSON.stringify(payload)
        });
        alert("Grupo de projeto criado com sucesso!");
        setFormData({
          nome: "",
          descricao: "",
          turmaId: 0,
          semestreId: 0,
          professorOrientadorId: 0,
          integranteIds: [],
          localId: 0,
          horarioInicio: "",
          horarioFim: ""
        });
      }
      fetchProjetos();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const editClick = (projeto) => {
    setEditingId(projeto.id);
    const parseDate = (isoStr) => {
      if (!isoStr) return "";
      const date = new Date(isoStr);
      const tzOffset = date.getTimezoneOffset() * 60000;
      const localISOTime = (new Date(date - tzOffset)).toISOString().slice(0, 16);
      return localISOTime;
    };
    setFormData({
      nome: projeto.nome,
      descricao: projeto.descricao,
      turmaId: projeto.turma?.id || 0,
      semestreId: projeto.semestre?.id || 0,
      professorOrientadorId: projeto.professorOrientador?.id || 0,
      integranteIds: projeto.integrantes ? projeto.integrantes.map(i => i.id) : [],
      localId: projeto.local?.id || 0,
      horarioInicio: parseDate(projeto.horarioInicio),
      horarioFim: parseDate(projeto.horarioFim)
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({
      nome: "",
      descricao: "",
      turmaId: 0,
      semestreId: 0,
      professorOrientadorId: 0,
      integranteIds: [],
      localId: 0,
      horarioInicio: "",
      horarioFim: ""
    });
  };

  const deleteProjeto = async (id) => {
    if (!id || !confirm("Tem certeza que deseja deletar este grupo de projeto?")) return;
    setLoading(true);
    try {
      await apiRequest(`/projetos/${id}`, {
        method: "DELETE",
        headers: HEADERS_JSON
      });
      alert("Grupo de projeto deletado com sucesso!");
      fetchProjetos();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const projetosFiltrados = projetos.filter(p => {
    if (!filtroTexto.trim()) return true;
    const busca = filtroTexto.toLowerCase();
    const nomeIntegrantes = p.integrantes ? p.integrantes.map(i => i.username.toLowerCase()).join(" ") : "";
    const orientador = p.professorOrientador?.username?.toLowerCase() || "";
    const turmaNome = p.turma?.nome?.toLowerCase() || "";
    const semestreNome = p.semestre?.nome?.toLowerCase() || "";
    const nomeProjeto = p.nome?.toLowerCase() || "";
    return nomeIntegrantes.includes(busca) ||
      orientador.includes(busca) ||
      turmaNome.includes(busca) ||
      semestreNome.includes(busca) ||
      nomeProjeto.includes(busca);
  });

  return {
    projetos: projetosFiltrados,
    loading,
    formData,
    searchId,
    filtroTexto,
    editingId,
    turmas,
    semestres,
    locais,
    professores,
    alunos,
    setSearchId,
    setFiltroTexto,
    handleChange,
    searchById,
    clearSearch,
    submit,
    editClick,
    cancelEdit,
    deleteProjeto
  };
}
