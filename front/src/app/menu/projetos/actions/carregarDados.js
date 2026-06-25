import { grupoService } from "@/utils/projeto/api";
import { listarTurmas } from "@/utils/services/turmaService";
import { listarUsuarios } from "@/utils/services/userService";
import { apiFetch } from "@/utils/services/api";

export async function carregarDadosPage({
  setGrupos,
  setTurmas,
  setLocais,
  setProfessores,
  setAlunosDisponiveis,
  normalizarTurma,
}) {
  try {
    const [gruposRes, turmasRes, usuariosRes, locaisRes] = await Promise.all([
      grupoService.getAll(),
      listarTurmas(),
      listarUsuarios(),
      apiFetch("/api/locais"),
    ]);

    const turmasNormalizadas = Array.isArray(turmasRes)
      ? turmasRes.map(normalizarTurma)
      : [];

    const usuarios = Array.isArray(usuariosRes) ? usuariosRes : [];

    setGrupos(gruposRes || []);
    setTurmas(turmasNormalizadas);
    setLocais(Array.isArray(locaisRes) ? locaisRes : []);
    setProfessores(usuarios.filter((usuario) => usuario.profile === "PROFESSOR"));
    setAlunosDisponiveis(usuarios.filter((usuario) => usuario.profile === "ALUNO"));
  } catch (error) {
    console.error(error);
    alert(error.message || "Erro ao carregar dados.");
  }
}