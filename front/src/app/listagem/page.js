"use client";
import { useEffect, useState, useCallback } from "react";
import FormInput from "@/components/FormInput";

export default function ListagemProjetos() {
  const [projetos, setProjetos] = useState([]);

  const [filtros, setFiltros] = useState({
    componente: "",
    professor: "",
    turma: "",
    curso: "",
    semestre: "",
  });

  const fetchProjetos = useCallback(async () => {
    const params = new URLSearchParams();
    if (filtros.componente) params.append("componente", filtros.componente);
    if (filtros.professor) params.append("professor", filtros.professor);
    if (filtros.turma) params.append("turmaNome", filtros.turma);
    if (filtros.curso) params.append("cursoNome", filtros.curso);
    if (filtros.semestre) params.append("semestre", filtros.semestre);

    try {
      const res = await fetch(`/api/projetos?${params.toString()}`);
      const data = await res.json();

      if (data.status === "SUCCESS") {
        setProjetos(data.data);
      }
    } catch (error) {
      console.error("Erro ao buscar projetos:", error);
    }
  }, [filtros]);

  useEffect(() => {
    fetchProjetos();
  }, [fetchProjetos]);

  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltros((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProjetos();
  };

  const handleDelete = async (id) => {
    if (confirm("Tem certeza que deseja excluir?")) {
      await fetch(`/api/projetos/${id}`, { method: "DELETE" });

      setProjetos(projetos.filter((p) => p.id !== id));
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold">Grupos de Projeto</h2>

      <form
        onSubmit={handleSearch}
        className="bg-gray-100 p-4 rounded-lg space-y-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <FormInput
            label="Componente"
            type="text"
            name="componente"
            value={filtros.componente}
            onChange={handleFiltroChange}
          />
          <FormInput
            label="Professor"
            type="text"
            name="professor"
            value={filtros.professor}
            onChange={handleFiltroChange}
          />
          <FormInput
            label="Turma"
            type="text"
            name="turma"
            value={filtros.turma}
            onChange={handleFiltroChange}
          />
          <FormInput
            label="Curso"
            type="text"
            name="curso"
            value={filtros.curso}
            onChange={handleFiltroChange}
          />
          <FormInput
            label="Semestre"
            type="text"
            name="semestre"
            value={filtros.semestre}
            onChange={handleFiltroChange}
          />
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
          >
            Pesquisar
          </button>
        </div>
      </form>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse bg-white shadow-sm rounded-lg overflow-hidden">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-4 border-b">Turma</th>
              <th className="p-4 border-b">Semestre</th>
              <th className="p-4 border-b">Professor Orientador</th>
              <th className="p-4 border-b">Alunos (Componentes)</th>
              <th className="p-4 border-b">Ações</th>
            </tr>
          </thead>
          <tbody>
            {projetos.length > 0 ? (
              projetos.map((projeto) => (
                <tr
                  key={projeto.id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="p-4">{projeto.turma.nome}</td>
                  <td className="p-4">{projeto.semestre.nome}</td>
                  <td className="p-4">
                    {projeto.professorOrientador.username}
                  </td>
                  <td className="p-4">
                    {projeto.integrantes.map((i) => i.username).join(", ")}
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => handleDelete(projeto.id)}
                      className="text-red-600 hover:text-red-800 font-medium"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-6 text-center text-gray-500">
                  Nenhum projeto encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
