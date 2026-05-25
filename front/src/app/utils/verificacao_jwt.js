export const getToken = () => {
    if (typeof window !== "undefined") {
        return localStorage.getItem("jwt_token") || "";
    }
    
    return "";
};


export const validarToken = async(url, opcao = {}) => {
    const token = getToken();

    if (!token) {
        alert("Sessão inválida");
        window.location.href = "/login";
        console.log("Token jwt não encontrado");
        throw new Error("Token JWT não encontrado");
    }

    const response = await fetch(url, {
        ...opcao,
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
            ...opcao.headers
        }
    });

    const contentType = response.headers.get("content-type");
    const isJson = contentType && contentType.includes("application/json");

    if (!isJson) {
        console.log(`Resposta inesperada: ${url} ~> não é JSON`);
        throw new Error(`Resposta inesperada: ${url} ~> não é JSON`);
    }

    return response.json();
};