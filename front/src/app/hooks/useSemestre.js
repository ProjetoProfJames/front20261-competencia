import { useState, useEffect } from "react";
import { apiRequest } from "@/services/api";

export function useSemestre() {
    const [semestres, setSemestres] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchId, setSearchId] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        nome: "",
        dataInicio: "",
        dataFim: ""
    });

    const fetchSemestres = async () => {
        setLoading(true);
        try {
            const result = await apiRequest("/semestres", {
                method: "GET", 
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
            });
            const listaSemestres = result?.data || result;
            setSemestres(Array.isArray(listaSemestres) ? listaSemestres : []);
        } catch (e) {
            console.error(`Erro ao listar semestres: ${e}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSemestres();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const searchById = async (e) => {
        e.preventDefault();
        if (searchId === "" || Number(searchId) === 0) {
            alert("Digite um ID válido para pesquisar!");
            return;
        }

        setLoading(true);
        try {
            const result = await apiRequest(`/semestres/${searchId}`, {
                method: "GET", headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
            });
            if (result && result.success !== false) {
                const dadosSemestre = result.data || result;
                setSemestres(Array.isArray(dadosSemestre) ? dadosSemestre : [dadosSemestre]);
            } else {
                alert("Semestre não encontrado!");
                setSemestres([]);
            }
        } catch (error) {
            console.error("Erro ao pesquisar semestre:", error.message);
            alert("Semestre não encontrado ou erro no servidor.");
            setSemestres([]);
        } finally {
            setLoading(false);
        }
    };

    const clearSearch = () => {
        setSearchId("");
        fetchSemestres();
    };

    const submit = async (e) => {
        e.preventDefault();
        if (!formData.nome || !formData.dataInicio || !formData.dataFim) {
            alert("Preencha todos os campos obrigatórios!");
            return;
        }

        try {
            setLoading(true);
            if (editingId) {
                const result = await apiRequest(`/semestres/${editingId}`, {
                    method: "PUT",
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });
                if (result) {
                    alert("Semestre atualizado com sucesso!");
                    cancelEdit();
                    fetchSemestres();
                }
            } else {
                const result = await apiRequest(`/semestres`, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });
                if (result) {
                    alert("Semestre criado com sucesso!");
                    cancelEdit();
                    fetchSemestres();
                }
            }
        } catch (e) {
            console.error(`Erro ao salvar semestre: ${e}`);
        } finally {
            setLoading(false);
        }
    };

    const editClick = (semestre) => {
        setEditingId(semestre.id);
        setFormData({
            nome: semestre.nome,
            dataInicio: semestre.dataInicio,
            dataFim: semestre.dataFim
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const cancelEdit = () => {
        setEditingId(null);
        setFormData({ nome: "", dataInicio: "", dataFim: "" });
    };

    const deleteSemestre = async (id) => {
        if (!id || !confirm("Tem certeza que deseja deletar este semestre?")) return;

        try {
            setLoading(true);
            const result = await apiRequest(`/semestres/${id}`, {
                method: "DELETE", headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
            });
            if (result) {
                alert("Semestre deletado com sucesso!");
                fetchSemestres();
            }
        } catch (e) {
            console.error(`Erro ao deletar semestre: ${e}`);
        } finally {
            setLoading(false);
        }
    };

    return {
        semestres,
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
        deleteSemestre
    };
}