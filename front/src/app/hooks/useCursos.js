import { useState, useEffect } from "react";
import { validarToken } from "@/app/utils/verificacao_jwt";

export function useCursos() {
    const [cursos, setCursos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const carregarDados = async () => {
            try {
                const dados = await validarToken("/api/cursos", {method: "GET"});
                setCursos(dados);
            } catch (e) {
                console.log(`Error: ${e}`);
            } finally {
                setLoading(false);
            }
        }

        carregarDados();
    }, []);

    return {
        cursos,
        loading
    };
}
