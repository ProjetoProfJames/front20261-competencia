const BASE_URL = 'http://localhost:8080/api';

function getHeader() {
    const token = localStorage.getItem('API-KEY');
    let header = {
        'Content-Type': 'application/json'
    }

    if (token) {
        header = { ...header, 'Authorization': `Bearer ${token}` };
    }

    return header;
}

function redirectLogin() {
    localStorage.removeItem('API-KEY');
    localStorage.removeItem('USER');
    location.href = '/login';
}

function getMessage(message) {
    if (message === 'Email already exists') {
        return 'Email ja cadastrado';
    }

    if (message === 'Local numero already exists') {
        return 'Local ja cadastrado';
    }

    if (message === 'Cannot delete local with projeto linked') {
        return 'Nao e possivel excluir local vinculado a projeto';
    }

    if (message === 'User not found') {
        return 'Usuario nao encontrado';
    }

    if (message === 'Local not found') {
        return 'Local nao encontrado';
    }

    return message || 'Erro ao processar solicitacao';
}

async function handleResponse(res) {
    if (res.status === 401) {
        redirectLogin();
        throw new Error('Sessao expirada');
    }

    if (res.status === 403) {
        location.href = '/nao-autorizado';
        throw new Error('Acesso nao autorizado');
    }

    const obj = await res.json();

    if (!res.ok) {
        throw new Error(getMessage(obj.message));
    }

    return obj.data;
}

async function get(uri) {
    const res = await fetch(`${BASE_URL}${uri}`, {
        method: 'GET',
        headers: getHeader(),
    });

    return handleResponse(res);
}

async function post(uri, body) {
    const res = await fetch(`${BASE_URL}${uri}`, {
        method: 'POST',
        headers: getHeader(),
        body: JSON.stringify(body)
    });

    return handleResponse(res);
}

async function put(uri, body) {
    const res = await fetch(`${BASE_URL}${uri}`, {
        method: 'PUT',
        headers: getHeader(),
        body: JSON.stringify(body)
    });

    return handleResponse(res);
}

async function del(uri) {
    const res = await fetch(`${BASE_URL}${uri}`, {
        method: 'DELETE',
        headers: getHeader(),
    });

    return handleResponse(res);
}

const api = {
    get,
    post,
    put,
    del
}

export default api
