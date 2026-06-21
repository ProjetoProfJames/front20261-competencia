export const BASE_URL = 'http://localhost:8080'

export function formatarUrl(endpoint){
    const caminho = endpoint.startsWith('/') ? endpoint: `/${endpoint}`
    return `${BASE_URL}${caminho}`
}