const BASE_URL = "http://localhost:8080";

function joinURL(endpoint) {
    try {
        const url = endpoint.startsWith("/") 
            ? `${BASE_URL}${endpoint}`
            : `${BASE_URL}/${endpoint}`;
        return url;
    } catch (e) {
        console.log(`Houve uma excessão () => ${e}`);
    }
}

async function handleFetch(endpoint, options = {}) {
    const url = joinURL(endpoint);
    const defaultHeaders = {
        "Content-Type": "application/json",
        "Accept": "application/json"
    };

    const config = {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers,
        },
    };

    try {
        const response = await fetch(url, config);

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error || `Erro na requisição: ${response.status}`);
        }

        if (response.status === 204) return null;
        else return await response.json();

    } catch (exception) {
        console.log(`Houve uma excessão () => ${exception}`);
        throw exception;
    }
}

export const api = {
    get: (endpoint, params = {}, options = {}) => {

        let finalEndpoint = endpoint;

        if (params && Object.keys(params).length > 0) {
            const dadosFiltrados = Object.fromEntries(
                Object.entries(params).filter(
                    ([_, v]) => v !== null && v !== undefined && v !== ""
                ),
            );

            const queryString = new URLSearchParams(dadosFiltrados).toString();
            if (queryString) finalEndpoint = `${endpoint}?${queryString}`;
        }
        
        return handleFetch(finalEndpoint, {
            method: "GET",
            ...options
        });
    },

    post: (endpoint, body, options) => handleFetch(endpoint, {
        method: "POST",
        body: JSON.stringify(body),
        ...options
    }),

    put: (endpoint, body, options) => handleFetch(endpoint, {
        method: "PUT",
        body: JSON.stringify(body),
        ...options
    }),

    delete: (endpoint, options) => handleFetch(endpoint, {
        method: "DELETE",
        ...options
    }),
}