import { formatarUrl } from "./Config";

export default async function Get(endpoint, options = {}) {
    try{
        const urlCompleta = formatarUrl(endpoint)

        const response = await fetch(urlCompleta, {
            method: 'Get',
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
        } catch (erro) {
            console.log("Erro no GET: ", erro)
            throw erro
        }
}

