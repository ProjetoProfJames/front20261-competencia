import { useState, useEffect } from "react";
import { apiRequest } from "@/services/api";

const HEADERS_JSON = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
};

export function useDisciplinas() {
    const [disciplinas, setDisciplinas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchId, setSearchId] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [cursos, setCursos] = useState([]);

    const [formData, setFormData] = useState({
        nome: "",
        cursoId: 0
    });

    const fetchDisciplinas = async () => {
        setLoading(true);
        try {
            const result = await apiRequest("/disciplinas", {
                method: "GET",
                headers: HEADERS_JSON
            });
            const listaDisciplinas = result?.data || result;
            setDisciplinas(Array.isArray(listaDisciplinas) ? listaDisciplinas : []);
        } catch (e) {
            console.error(`Erro ao listar disciplinas: ${e}`);
        } finally {
            setLoading(false);
        }
    };

    const fetchCursos = async () => {
        try {
            const result = await apiRequest("/cursos", {
                method: "GET",
                headers: HEADERS_JSON
            });
            const listaCursos = result?.data || result;
            setCursos(Array.isArray(listaCursos) ? listaCursos : []);
        } catch (e) {
            console.error(`Erro ao carregar cursos: ${e}`);
        }
    };

    useEffect(() => {
        fetchDisciplinas();
        fetchCursos();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === "nome" ? value : Number(value)
        }));
    };

    const searchById = async (e) => {
        e.preventDefault();
        if (!searchId || Number(searchId) <= 0) {
            alert("Digite um ID válido para pesquisar!");
            return;
        }

        setLoading(true);
        try {
            const result = await apiRequest(`/disciplinas/${searchId}`, {
                method: "GET",
                headers: HEADERS_JSON
            });
            const disciplinaEncontrada = result?.data || result;
            if (disciplinaEncontrada && disciplinaEncontrada.id) {
                setDisciplinas([disciplinaEncontrada]);
            } else {
                setDisciplinas([]);
            }
        } catch (e) {
            console.error(`Erro ao buscar disciplina por ID: ${e}`);
            setDisciplinas([]);
        } finally {
            setLoading(false);
        }
    };

    const clearSearch = () => {
        setSearchId("");
        fetchDisciplinas();
    };

    const submit = async (e) => {
        e.preventDefault();

        if (!formData.nome.trim()) {
            alert("Por favor, insira o nome da disciplina!");
            return;
        }
        if (!formData.cursoId || formData.cursoId === 0) {
            alert("Por favor, selecione um Curso!");
            return;
        }

        setLoading(true);
        try {
            if (editingId) {
                await apiRequest(`/disciplinas/${editingId}`, {
                    method: "PUT",
                    headers: HEADERS_JSON,
                    body: JSON.stringify(formData)
                });
                alert("Disciplina atualizada com sucesso!");
                cancelEdit();
            } else {
                await apiRequest("/disciplinas", {
                    method: "POST",
                    headers: HEADERS_JSON,
                    body: JSON.stringify(formData)
                });
                alert("Disciplina criada com sucesso!");
                setFormData({ nome: "", cursoId: 0 });
            }
            fetchDisciplinas();
        } catch (e) {
            alert(`Erro ao salvar: ${e.message || e}`);
            console.error(`Erro ao salvar disciplina: ${e}`);
        } finally {
            setLoading(false);
        }
    };

    const editClick = (disciplina) => {
        setEditingId(disciplina.id);
        setFormData({
            nome: disciplina.nome,
            cursoId: disciplina.cursoId || disciplina.curso?.id || 0
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const cancelEdit = () => {
        setEditingId(null);
        setFormData({ nome: "", cursoId: 0 });
    };

    const deleteDisciplina = async (id) => {
        if (!id || !confirm("Tem certeza que deseja deletar esta disciplina?")) return;
        setLoading(true);
        try {
            await apiRequest(`/disciplinas/${id}`, {
                method: "DELETE",
                headers: HEADERS_JSON
            });
            alert("Disciplina deletada com sucesso!");
            fetchDisciplinas();
        } catch (e) {
            console.error(`Erro ao deletar disciplina: ${e}`);
        } finally {
            setLoading(false);
        }
    };

    return {
        disciplinas,
        loading,
        formData,
        searchId,
        editingId,
        cursos,
        setSearchId,
        handleChange,
        searchById,
        clearSearch,
        submit,
        editClick,
        cancelEdit,
        deleteDisciplina
    };
}