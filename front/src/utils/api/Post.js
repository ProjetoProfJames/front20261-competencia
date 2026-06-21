import { formatarUrl } from "./Config";

export default async function Post(url, data, options = {}) {
    try {
        const urlCompleta = formatarUrl(url)

        const response = await fetch(urlCompleta, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            body: JSON.stringify(data),
        });
    
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    
        return await response.json();
    } catch (error) {
      console.log("Erro no POST ", error)
      throw error  
    }
}