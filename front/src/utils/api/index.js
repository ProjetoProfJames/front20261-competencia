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
        if (typeof window !== 'undefined') {
            window.location.href = '/menu';
        }
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
        if (res.user && res.user.profile) {
            localStorage.setItem('profile', JSON.stringify(res.user.profile));
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

export function getUsername() {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('user');
    }
}
export function getProfile() {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('profile');
    }
}

export async function listarUsuarios() {
    return await get('/users');
}

export async function obterUsuarioPorId(id) {
    return await get(`/users/${id}`);
}

export async function criarUsuario(usuarioData) {
    return await post('/users', usuarioData);
}

export async function atualizarUsuario(id, usuarioData) {
    return await put(`/users/${id}`, usuarioData);
}

export async function deletarUsuario(id) {
    return await del(`/users/${id}`);
}

export async function listarLocais() {
    return await get('/locais');
}

export async function obterLocalPorId(id) {
    return await get(`/locais/${id}`);
}

export async function criarLocal(localData) {
    return await post('/locais', localData);
}

export async function atualizarLocal(id, localData) {
    return await put(`/locais/${id}`, localData);
}

export async function deletarLocal(id) {
    return await del(`/locais/${id}`);
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