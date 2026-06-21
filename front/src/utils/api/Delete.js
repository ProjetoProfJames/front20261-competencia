import { formatarUrl } from "./Config";

export default async function Delete(url, options = {}) {
    try {
        const urlCompleta = formatarUrl(url)
        const response = await fetch(urlCompleta, {
            method: 'DELETE',
            headers: {
                ...options.headers,
            },
            ...options
        });
    
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    
        return await response.json();
    } catch (error) {
        console.log("Erro no DELETE", error)
        throw error
    }
}