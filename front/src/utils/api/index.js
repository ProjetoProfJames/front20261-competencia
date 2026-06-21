const BASE_URL = 'http://localhost:8080/api';

function getHeaders() {
    const headers = {
        'Content-Type': 'application/json'
    };
    
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('JWT');
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
    }
    
    return headers;
}

async function handleResponse(res) {
    if (res.status === 401 || res.status === 403) {
        alert('Não autorizado');
        return null;
    }

    if (res.status === 204) {
        return true;
    }

    if (!res.ok) {
        return null;
    }

    const obj = await res.json();
    return obj.data || obj;
}

export async function get(uri) {
    try {
        const res = await fetch(`${BASE_URL}${uri}`, {
            method: 'GET',
            headers: getHeaders(),
        });
        return await handleResponse(res);
    } catch (error) {
        return null;
    }
}

export async function post(uri, body) {
    try {
        const res = await fetch(`${BASE_URL}${uri}`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(body)
        });
        return await handleResponse(res);
    } catch (error) {
        return null;
    }
}

export async function put(uri, body) {
    try {
        const res = await fetch(`${BASE_URL}${uri}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(body)
        });
        return await handleResponse(res);
    } catch (error) {
        return null;
    }
}

export async function del(uri) {
    try {
        const res = await fetch(`${BASE_URL}${uri}`, {
            method: 'DELETE',
            headers: getHeaders(),
        });
        return await handleResponse(res);
    } catch (error) {
        return null;
    }
}

export async function register(name, email, password) {
    return await post('/auth/register', { name, email, password });
}

export async function login(email, password) {
    const res = await post('/auth/login', { email, password });
    if (res) {
        if (res.accessToken) {
            localStorage.setItem('JWT', res.accessToken);
        }
        if (res.user && res.user.username) {
            localStorage.setItem('user', res.user.username);
        }
    }

    return res;
}

export async function logout(router) {
    localStorage.removeItem('JWT');
    localStorage.removeItem('user');
    if (router) {
        router.push('/login');
    }
}


export async function listarCursos() {
    return await get('/cursos');
}

export async function obtenerCursoPorId(id) {
    return await get(`/cursos/${id}`);
}

export async function criarCurso(cursoData) {
    return await post('/cursos', cursoData);
}

export async function atualizarCurso(id, cursoData) {
    return await put(`/cursos/${id}`, cursoData);
}

export async function deletarCurso(id) {
    return await del(`/cursos/${id}`);
}

export async function listarSemestres() {
    return await get('/semestres');
}

export async function obtenerSemestrePorId(id) {
    return await get(`/semestres/${id}`);
}

export async function criarSemestre(semestreData) {
    return await post('/semestres', semestreData);
}

export async function atualizarSemestre(id, semestreData) {
    return await put(`/semestres/${id}`, semestreData);
}

export async function deletarSemestre(id) {
    return await del(`/semestres/${id}`);
}

export async function listarTurmas() {
    return await get('/turmas');
}

export async function obterTurmaPorId(id) {
    return await get(`/turmas/${id}`);
}

export async function criarTurma(turmaData) {
    return await post('/turmas', turmaData);
}

export async function atualizarTurma(id, turmaData) {
    return await put(`/turmas/${id}`, turmaData);
}

export async function deletarTurma(id) {
    return await del(`/turmas/${id}`);
}

export async function processarMatriculasTurma(id) {
    return await post(`/turmas/${id}/matriculas`, {});
}

export async function adicionarAlunoTurma(id, alunoData) {
    return await post(`/turmas/${id}/alunos`, alunoData);
}

export async function removerAlunoTurma(id, alunoId) {
    return await del(`/turmas/${id}/alunos/${alunoId}`);
}

// Grupos de Projeto
export async function listarGrupos() {
    return await get('/grupos');
}

export async function obterGrupoPorId(id) {
    return await get(`/grupos/${id}`);
}

export async function criarGrupo(grupoData) {
    return await post('/grupos', grupoData);
}

export async function atualizarGrupo(id, grupoData) {
    return await put(`/grupos/${id}`, grupoData);
}

export async function deletarGrupo(id) {
    return await del(`/grupos/${id}`);
}

// Auxiliares: professores, alunos, locais, projetos
export async function listarProfessores() {
    return await get('/professores');
}

export async function listarAlunos() {
    return await get('/alunos');
}

export async function listarLocais() {
    return await get('/locais');
}

export async function listarProjetos() {
    return await get('/projetos');
}