import { useState, useEffect } from "react";
import { apiRequest } from "@/services/api";

const HEADERS_JSON = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
};

export function useTurmas() {
    const [turmas, setTurmas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchId, setSearchId] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [alunoIdForm, setAlunoIdForm] = useState("");

    const [cursos, setCursos] = useState([]);
    const [disciplinas, setDisciplinas] = useState([]);
    const [disciplinasFiltradas, setDisciplinasFiltradas] = useState([]);
    const [semestres, setSemestres] = useState([]);
    const [professores, setProfessores] = useState([]);

    const [formData, setFormData] = useState({
        nome: "",
        cursoIds: [],
        disciplinaId: 0,
        semestreId: 0,
        professorIds: []
    });

    const fetchTurmas = async () => {
        setLoading(true);
        try {
            const result = await apiRequest("/turmas", {
                method: "GET",
                headers: HEADERS_JSON
            });
            const listaTurmas = result?.data || result;
            setTurmas(Array.isArray(listaTurmas) ? listaTurmas : []);
        } catch (e) {
            console.error(`Erro ao listar turmas: ${e}`);
            setTurmas([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchOpcoesFormulario = async () => {
        try {
            const [resCursos, resDisciplinas, resSemestres, resUsers] = await Promise.all([
                apiRequest("/cursos", { method: "GET", headers: HEADERS_JSON }).catch(() => []),
                apiRequest("/disciplinas", { method: "GET", headers: HEADERS_JSON }).catch(() => []),
                apiRequest("/semestres", { method: "GET", headers: HEADERS_JSON }).catch(() => []),
                apiRequest("/users", { method: "GET", headers: HEADERS_JSON }).catch(() => [])
            ]);

            setCursos(resCursos?.data || resCursos || []);
            const todasDisciplinas = resDisciplinas?.data || resDisciplinas || [];
            setDisciplinas(todasDisciplinas);
            setSemestres(resSemestres?.data || resSemestres || []);

            const todosUsuarios = resUsers?.data || resUsers || [];
            if (Array.isArray(todosUsuarios)) {
                setProfessores(todosUsuarios.filter(user => user.profile === 'PROFESSOR'));
            }
        } catch (e) {
            console.error(`Erro ao carregar opções reais dos selects: ${e}`);
        }
    };

    useEffect(() => {
        fetchTurmas();
        fetchOpcoesFormulario();
    }, []);

    useEffect(() => {
        const cursoId = formData.cursoIds[0];
        if (cursoId && cursoId !== 0) {
            const filtradas = disciplinas.filter(d => {
                const disciplinaCursoId = d.cursoId || d.curso?.id;
                return disciplinaCursoId === cursoId;
            });
            setDisciplinasFiltradas(filtradas);
        } else {
            setDisciplinasFiltradas([]);
        }
    }, [formData.cursoIds, disciplinas]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "cursoIds") {
            const novoCursoId = value === "0" ? [] : [Number(value)];
            setFormData(prev => ({
                ...prev,
                cursoIds: novoCursoId,
                disciplinaId: 0
            }));
        } else if (name === "professorIds") {
            setFormData(prev => ({
                ...prev,
                [name]: value === "0" ? [] : [Number(value)]
            }));
        } else if (name === "nome") {
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
            const result = await apiRequest(`/turmas/${searchId}`, {
                method: "GET",
                headers: HEADERS_JSON
            });
            const turmaEncontrada = result?.data || result;
            if (turmaEncontrada && turmaEncontrada.id) {
                setTurmas([turmaEncontrada]);
            } else {
                setTurmas([]);
            }
        } catch (e) {
            console.error(`Erro ao buscar turma por ID: ${e}`);
            setTurmas([]);
        } finally {
            setLoading(false);
        }
    };

    const clearSearch = () => {
        setSearchId("");
        fetchTurmas();
    };

    const submit = async (e) => {
        e.preventDefault();

        const cursoIdSelecionado = formData.cursoIds[0];
        const professorIdSelecionado = formData.professorIds[0];

        if (!formData.nome.trim()) {
            alert("Por favor, insira o nome da turma!");
            return;
        }
        if (!cursoIdSelecionado || cursoIdSelecionado === 0) {
            alert("Por favor, selecione um Curso real!");
            return;
        }
        if (!formData.disciplinaId || formData.disciplinaId === 0) {
            alert("Por favor, selecione uma Disciplina real!");
            return;
        }
        if (!formData.semestreId || formData.semestreId === 0) {
            alert("Por favor, selecione um Semestre real!");
            return;
        }
        if (!professorIdSelecionado || professorIdSelecionado === 0) {
            alert("Por favor, selecione um Professor real!");
            return;
        }

        setLoading(true);
        try {
            if (editingId) {
                await apiRequest(`/turmas/${editingId}`, {
                    method: "PUT",
                    headers: HEADERS_JSON,
                    body: JSON.stringify(formData)
                });
                alert("Turma atualizada com sucesso!");
                cancelEdit();
            } else {
                await apiRequest("/turmas", {
                    method: "POST",
                    headers: HEADERS_JSON,
                    body: JSON.stringify(formData)
                });
                alert("Turma criada com sucesso!");
                setFormData({ nome: "", cursoIds: [], disciplinaId: 0, semestreId: 0, professorIds: [] });
            }
            fetchTurmas();
        } catch (e) {
            alert(`Erro ao salvar: ${e.message || e}`);
            console.error(`Erro ao salvar turma: ${e}`);
        } finally {
            setLoading(false);
        }
    };

    const editClick = (turma) => {
        setEditingId(turma.id);
        setFormData({
            nome: turma.nome,
            cursoIds: turma.cursos ? turma.cursos.map(c => c.id) : (turma.cursoIds || []),
            disciplinaId: turma.disciplina?.id || turma.disciplinaId || 0,
            semestreId: turma.semestre?.id || turma.semestreId || 0,
            professorIds: turma.professores ? turma.professores.map(p => p.id) : (turma.professorIds || [])
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const cancelEdit = () => {
        setEditingId(null);
        setFormData({ nome: "", cursoIds: [], disciplinaId: 0, semestreId: 0, professorIds: [] });
    };

    const deleteTurma = async (id) => {
        if (!id || !confirm("Tem certeza que deseja deletar esta turma?")) return;
        setLoading(true);
        try {
            await apiRequest(`/turmas/${id}`, {
                method: "DELETE",
                headers: HEADERS_JSON
            });
            alert("Turma deletada com sucesso!");
            fetchTurmas();
        } catch (e) {
            console.error(`Erro ao deletar turma: ${e}`);
        } finally {
            setLoading(false);
        }
    };

    const handleAddAluno = async (e, turmaId) => {
        e.preventDefault();
        if (!alunoIdForm) {
            alert("Digite o ID do aluno!");
            return;
        }
        setLoading(true);
        try {
            await apiRequest(`/turmas/${turmaId}/alunos`, {
                method: "POST",
                headers: HEADERS_JSON,
                body: JSON.stringify({ alunoId: Number(alunoIdForm) })
            });
            alert("Aluno matriculado com sucesso!");
            setAlunoIdForm("");
            fetchTurmas();
        } catch (e) {
            console.error(`Erro ao matricular aluno: ${e}`);
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveAluno = async (turmaId, alunoId) => {
        if (!confirm("Tem certeza que deseja remover este aluno da turma?")) return;
        setLoading(true);
        try {
            await apiRequest(`/turmas/${turmaId}/alunos/${alunoId}`, {
                method: "DELETE",
                headers: HEADERS_JSON
            });
            alert("Aluno removido com sucesso!");
            fetchTurmas();
        } catch (e) {
            console.error(`Erro ao remover aluno: ${e}`);
        } finally {
            setLoading(false);
        }
    };

    return {
        turmas,
        loading,
        formData,
        searchId,
        editingId,
        alunoIdForm,
        cursos,
        disciplinas,
        disciplinasFiltradas,
        semestres,
        professores,
        setSearchId,
        setAlunoIdForm,
        handleChange,
        searchById,
        clearSearch,
        submit,
        editClick,
        cancelEdit,
        deleteTurma,
        handleAddAluno,
        handleRemoveAluno
    };
}