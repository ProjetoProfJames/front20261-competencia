import { formatarUrl } from "./Config";

export default async function Put(url, data, options = {}) {
    try {
        const urlCompleta = formatarUrl(url)
        const response = await fetch(urlCompleta, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            body: JSON.stringify(data),
            ...options,
        });
    
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    
        return await ressponse.json();
    } catch (error) {
        console.log("Erro no PUT", error)
    }
}