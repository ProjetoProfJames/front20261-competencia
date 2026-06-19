import { useState, useEffect } from "react";
import { apiRequest } from "@/services/api";

export function useCursos() {
    const [cursos, setCursos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchId, setSearchId] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        nome: "",
        coordenadorId: 0,
        professorIds: []
    });

    const fetchCursos = async () => {
        setLoading(true);
        try {
            const result = await apiRequest("/cursos", {
                method: "GET", headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
            });
            const listaCursos = result?.data || result;
            setCursos(Array.isArray(listaCursos) ? listaCursos : []);
        } catch (e) {
            console.error(`Error: ${e}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCursos();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === "professorIds" ? [Number(value)] : (name === "nome" ? value : Number(value))
        }));
    };

    const searchById = async (e) => {
        e.preventDefault();
        if (searchId === "" || Number(searchId) === 0) {
            alert("Digite um ID válido para pesquisar!");
            return;
        }

        setLoading(true);
        try {
            const result = await apiRequest(`/cursos/${searchId}`, {
                method: "GET", headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
            });
            if (result && (result.success !== false)) {
                const dadosCurso = result.data || result;
                setCursos(Array.isArray(dadosCurso) ? dadosCurso : [dadosCurso]);
            } else {
                alert("Curso não encontrado!");
                setCursos([]);
            }
        } catch (error) {
            console.error("Erro ao pesquisar curso:", error.message);
            alert("Curso não encontrado ou erro no servidor.");
            setCursos([]);
        } finally {
            setLoading(false);
        }
    };

    const clearSearch = () => {
        setSearchId("");
        fetchCursos();
    };

    const submit = async (e) => {
        e.preventDefault();
        if (formData.nome === "" || formData.coordenadorId === 0 || formData.professorIds.length === 0 || formData.professorIds[0] === 0) {
            alert("Preencha todos os campos obrigatórios!");
            return;
        }

        try {
            setLoading(true);
            if (editingId) {
                const result = await apiRequest(`/cursos/${editingId}`, {
                    method: "PUT",
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });
                if (result) {
                    alert("Curso atualizado com sucesso!");
                    setEditingId(null);
                    setFormData({ nome: "", coordenadorId: 0, professorIds: [] });
                    fetchCursos();
                }
            } else {
                const result = await apiRequest(`/cursos`, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });
                if (result) {
                    alert("Curso criado com sucesso!");
                    setFormData({ nome: "", coordenadorId: 0, professorIds: [] });
                    fetchCursos();
                }
            }
        } catch (e) {
            console.error(`Error: ${e}`);
        } finally {
            setLoading(false);
        }
    };

    const editClick = (curso) => {
        setEditingId(curso.id);
        setFormData({
            nome: curso.nome,
            coordenadorId: curso.coordenador?.id || 0,
            professorIds: curso.professores && curso.professores.length > 0 ? [curso.professores[0].id] : []
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const cancelEdit = () => {
        setEditingId(null);
        setFormData({ nome: "", coordenadorId: 0, professorIds: [] });
    };

    const deleteCurso = async (id) => {
        if (!id || !confirm("Tem certeza que deseja deletar este curso?")) return;

        try {
            setLoading(true);
            const result = await apiRequest(`/cursos/${id}`, {
                method: "DELETE", headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
            });
            if (result) {
                alert("Curso deletado com sucesso!");
                fetchCursos();
            }
        } catch (e) {
            console.error(`Error: ${e}`);
        } finally {
            setLoading(false);
        }
    };

    return {
        cursos,
        loading,
        formData,
        searchId,
        editingId,
        setSearchId,
        handleChange,
        searchById,
        clearSearch,
        submit,
        editClick,
        cancelEdit,
        deleteCurso
    };
}