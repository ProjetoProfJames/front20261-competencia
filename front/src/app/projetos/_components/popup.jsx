'use client';

import FormInput from "@/components/FormInput";
import { useState } from "react";

export default function Popup(props) {

    const turmas = [{ id: 1, nome: "Turma de Flutter" }, { id: 2, nome: "Turma de Java" }];
    const semestres = [{ id: 20261, nome: "2026/1" }, { id: 20252, nome: "2025/2" }];
    const orientadores = [{id: 1, nome: "Romildo"}, {id: 2, nome: "Julio"}];
    const integrantes = [{id:1, nome:"Ruan"},{id:2,nome:"Farney"},{id:3,nome:"João"}];
    const locais = [{id:1,nome:"Pátio 4"}];

    const [busca, setBusca] = useState('');
    const [message, setMessage] = useState('');
    const [load, setload] = useState(true);

    const obterDadosFiltrados = () => {
        if (!busca) return [];
        switch (props.campo) {
            case 'turmaId': return turmas.filter(t => t.id.toString().includes(busca));
            case 'semestreId': return semestres.filter(s => s.id.toString().includes(busca));
            case 'professorOrientadorId': return orientadores.filter(o => o.id.toString().includes(busca));
            case 'integranteIds': return integrantes.filter(i => i.id.toString().includes(busca));
            case 'localId': return locais.filter(l => l.id.toString().includes(busca));
            default: return [];
        }
    }

    const resultadoFiltro = obterDadosFiltrados();

    const renderizarInput = () => {
        switch(props.campo) {
            case 'turmaId':
                return (
                    <FormInput
                        label="Buscar ID da Turma:"
                        type="number"
                        name="turmaId"
                        value={busca}
                        onChange={(e) => setBusca(e.target.value)}
                    />
                );
            case 'semestreId':
                return (
                    <FormInput
                        label="Buscar ID do Semestre:"
                        type="number"
                        name="semestreId"
                        value={busca}
                        onChange={(e) => setBusca(e.target.value)}
                    />
                );
            case 'professorOrientadorId':
                return (
                    <FormInput
                        label="Buscar ID do Professor Orientador:"
                        type="number"
                        name="professorOrientadorId"
                        value={busca}
                        onChange={(e) => setBusca(e.target.value)}
                    />
                );
            case 'integranteIds':
                return (
                    <FormInput
                        label="Buscar ID dos Integrantes:"
                        type="number"
                        name="integranteIds"
                        value={busca}
                        onChange={(e) => setBusca(e.target.value)}
                    />
                );
            case 'localId':
                return (
                    <FormInput
                        label="Buscar ID do Local:"
                        type="number"
                        name="localId"
                        value={busca}
                        onChange={(e) => setBusca(e.target.value)}
                    />
                );
            default: return null;
        }
    }

    return (
        <>
            <div>
                {renderizarInput()}
                {resultadoFiltro.length > 0 && (
                    <ul>
                        {resultadoFiltro.map((item) => (
                            <li
                                key={item.id}
                                style={{ cursor: "pointer", padding: "5px" }}
                                onClick={() => {
                                    if (props.onSelect) {
                                        props.onSelect(item.id);
                                    }
                                    setBusca('');
                                }}
                            >
                                {item.nome} (ID: {item.id})
                            </li>
                        ))}
                    </ul>
                )}
                {busca && resultadoFiltro.length === 0 && (
                    <p>Nenhum dado encontrado!</p>
                )}
            </div>
        </>
    );
}