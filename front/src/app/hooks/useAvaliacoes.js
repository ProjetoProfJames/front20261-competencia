import { useState, useEffect } from "react";
import { apiRequest } from "@/services/api";

const HEADERS_JSON = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
};

export function useAvaliacoes() {
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [projetos, setProjetos] = useState([]);
  const [avaliadores, setAvaliadores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [loggedUser, setLoggedUser] = useState(null);

  const [formData, setFormData] = useState({
    projetoId: 0,
    avaliadorId: 0,
    nota: "",
    comentario: ""
  });

  const fetchAvaliacoes = async () => {
    setLoading(true);
    try {
      const result = await apiRequest("/avaliacoes", {
        method: "GET",
        headers: HEADERS_JSON
      });
      const lista = result?.data || result;
      setAvaliacoes(Array.isArray(lista) ? lista : []);
    } catch (e) {
      console.error(e);
      setAvaliacoes([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchProjetos = async () => {
    try {
      const result = await apiRequest("/projetos", {
        method: "GET",
        headers: HEADERS_JSON
      });
      const lista = result?.data || result;
      setProjetos(Array.isArray(lista) ? lista : []);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchAvaliadores = async () => {
    try {
      const result = await apiRequest("/users", {
        method: "GET",
        headers: HEADERS_JSON
      });
      const lista = result?.data || result;
      if (Array.isArray(lista)) {
        const filtrados = lista.filter(u => u.profile === "PROFESSOR" || u.profile === "AVALIADOR_EXTERNO");
        setAvaliadores(filtrados);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      const user = JSON.parse(stored);
      setLoggedUser(user);
      if (user.profile === "PROFESSOR" || user.profile === "AVALIADOR_EXTERNO") {
        setFormData(prev => ({ ...prev, avaliadorId: user.id }));
      }
    }
    fetchAvaliacoes();
    fetchProjetos();
    fetchAvaliadores();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "comentario" ? value : (name === "nota" ? (value === "" ? "" : Number(value)) : Number(value))
    }));
  };

  const submit = async (e) => {
    e.preventDefault();

    if (formData.projetoId === 0) {
      alert("Selecione um projeto!");
      return;
    }
    if (formData.avaliadorId === 0) {
      alert("Selecione um avaliador!");
      return;
    }
    if (formData.nota === "") {
      alert("Insira uma nota!");
      return;
    }
    const valorNota = Number(formData.nota);
    if (isNaN(valorNota) || valorNota < 0 || valorNota > 10) {
      alert("A nota deve ser um valor entre 0 e 10!");
      return;
    }
    if (!formData.comentario.trim()) {
      alert("Insira um comentário!");
      return;
    }

    const payload = {
      projetoId: formData.projetoId,
      avaliadorId: formData.avaliadorId,
      nota: valorNota,
      comentario: formData.comentario.trim()
    };

    setLoading(true);
    try {
      if (editingId) {
        const updatePayload = {
          nota: valorNota,
          comentario: formData.comentario.trim()
        };
        await apiRequest(`/avaliacoes/${editingId}`, {
          method: "PUT",
          headers: HEADERS_JSON,
          body: JSON.stringify(updatePayload)
        });
        alert("Avaliação atualizada com sucesso!");
        cancelEdit();
      } else {
        await apiRequest("/avaliacoes", {
          method: "POST",
          headers: HEADERS_JSON,
          body: JSON.stringify(payload)
        });
        alert("Avaliação criada com sucesso!");
        setFormData({
          projetoId: 0,
          avaliadorId: loggedUser?.profile === "PROFESSOR" || loggedUser?.profile === "AVALIADOR_EXTERNO" ? loggedUser.id : 0,
          nota: "",
          comentario: ""
        });
      }
      fetchAvaliacoes();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const editClick = (avaliacao) => {
    setEditingId(avaliacao.id);
    setFormData({
      projetoId: avaliacao.projeto?.id || 0,
      avaliadorId: avaliacao.avaliador?.id || 0,
      nota: String(avaliacao.nota),
      comentario: avaliacao.comentario
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({
      projetoId: 0,
      avaliadorId: loggedUser?.profile === "PROFESSOR" || loggedUser?.profile === "AVALIADOR_EXTERNO" ? loggedUser.id : 0,
      nota: "",
      comentario: ""
    });
  };

  const deleteAvaliacao = async (id) => {
    if (!id || !confirm("Tem certeza que deseja deletar esta avaliação?")) return;
    setLoading(true);
    try {
      await apiRequest(`/avaliacoes/${id}`, {
        method: "DELETE",
        headers: HEADERS_JSON
      });
      alert("Avaliação deletada com sucesso!");
      fetchAvaliacoes();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return {
    avaliacoes,
    projetos,
    avaliadores,
    loading,
    formData,
    editingId,
    handleChange,
    submit,
    editClick,
    cancelEdit,
    deleteAvaliacao
  };
}
