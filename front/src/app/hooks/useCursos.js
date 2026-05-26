/*import { useState, useEffect } from "react";
import { validarToken } from "@/app/utils/verificacao_jwt";

export function useCursos() {
    const [cursos, setCursos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const carregarDados = async () => {
            try {
                const dados = await validarToken("/api/cursos", { method: "GET" });
                setCursos(dados);
            } catch (e) {
                console.log(`Error: ${e}`);
            } finally {
                setLoading(false);
            }
        }

        carregarDados();
    }, []);

    return {
        cursos,
        loading
    };
}

export function form() {
    const [formData, setFormData] = useState({
        nome: "",
        coordenadorId: 0,
        professorIds: []
    });

    useEffect(() => {
        const enviarForm = async (e) => {
            e.preventDefault();

            if (formData.nome === "") {
                alert("Campo nome é obrigatório!");
                return;
            }

            if (formData.coordenadorId === 0) {
                alert("Seleção de coordenador é obrigatório!");
                return;
            }

            if (formData.professorIds === 0 || formData.professorIds[0] === 0) {
                alert("Seleção de professor é obrigatório!");
                return;
            }

            const payload = { ...formData };

            try {
                if (editingId) {
                    const result = await validarToken(`/api/cursos/${editingId}`, { method: "PUT" });

                    //const result = await fetchWithAuth(`/api/cursos/${editingId}`, {
                      //  method: "PUT",
                        //body: JSON.stringify(payload)
                    //});
                    if (result.success) {
                        alert("Curso atualizado com sucesso!");
                        setEditingId(null);
                        setFormData({ nome: "", coordenadorId: 0, professorIds: [] });
                        //fetchCursos();
                        carregarDados();
                    }
                } else {
                    const result = await validarToken(`/api/cursos`, { method: "POST" });

                    //const result = await fetchWithAuth("/api/cursos", {
                      //  method: "POST",
                        //body: JSON.stringify(payload)
                    //});
                    if (result.success) {
                        alert("Curso criado com sucesso!");
                        setFormData({ nome: "", coordenadorId: 0, professorIds: [] });
                        carregarDados();
                    }
                }
            } catch (e) {
                console.log(`Error: ${e}`);
            }
        }

        const editClick = (curso) => {
            setEditingId(curso.id);
            setFormData({
                nome: curso.nome,
                coordenadorId: curso.coordenador?.id || 0,
                professorIds: curso.professores && curso.professores.length > 0 ? [curso.professores[0].id] : []
            });
            window.scrollTo({ top: 0, behavior: 'smooth' });
        };

        const cancelEdit = () => {
            setEditingId(null);
            setFormData({ nome: "", coordenadorId: 0, professorIds: [] });
        };

        const deleteCurso = async (id) => {
            if (!id) return;
            if (!confirm("Tem certeza que deseja deletar este curso?")) return;

            try {
                const result = await validarToken(`/api/cursos/${id}`, { method: "DELETE" });

                if (result.success) {
                    alert("Curso deletado com sucesso!");
                    carregarDados();
                }

            } catch (e) {
                console.log(`Error: ${e}`);
            }
        };
    }, []);
}*/

import { useState, useEffect } from "react";
import { validarToken } from "@/app/utils/verificacao_jwt";

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
            const dados = await validarToken("/api/cursos", { method: "GET" });
            setCursos(dados);
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
            const result = await validarToken(`/api/cursos/${searchId}`, { method: "GET" });
            if (result && (result.success !== false)) {
                const dadosCurso = result.data || result;
                setCursos(Array.isArray(dadosCurso) ? dadosCurso : [dadosCurso]);
            } else {
                alert("Curso não encontrado!");
                setCursos([]);
            }
        } catch (error) {
            console.error("Erro ao pesquisar curso:", error.message);
            alert("Erro ao pesquisar curso. Verifique o ID e tente novamente.");
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

        if (formData.nome === "") {
            alert("Campo nome é obrigatório!");
            return;
        }

        if (formData.coordenadorId === 0) {
            alert("Seleção de coordenador é obrigatório!");
            return;
        }

        if (formData.professorIds.length === 0 || formData.professorIds[0] === 0) {
            alert("Seleção de professor é obrigatório!");
            return;
        }

        try {
            setLoading(true);
            if (editingId) {
                const result = await validarToken(`/api/cursos/${editingId}`, {
                    method: "PUT",
                    body: JSON.stringify(formData)
                });

                if (result) {
                    alert("Curso atualizado com sucesso!");
                    setEditingId(null);
                    setFormData({ nome: "", coordenadorId: 0, professorIds: [] });
                    fetchCursos();
                }
            } else {
                const result = await validarToken(`/api/cursos`, {
                    method: "POST",
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
        if (!id) return;
        if (!confirm("Tem certeza que deseja deletar este curso?")) return;

        try {
            setLoading(true);
            const result = await validarToken(`/api/cursos/${id}`, { method: "DELETE" });

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