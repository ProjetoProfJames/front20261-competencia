import { grupoService } from "@/utils/projeto/api";

export async function avaliarGrupo({
  id,
  nota,
  setGrupoParaAvaliar,
  setNotaAvaliacao,
  carregarDados,
}) {
  try {
    await grupoService.evaluate(id, nota);

    setGrupoParaAvaliar(null);
    setNotaAvaliacao("");

    await carregarDados();
  } catch (error) {
    alert(error.message || "Erro ao avaliar grupo.");
  }
}

export function validarSubmitAvaliacao({
  notaAvaliacao,
  grupoParaAvaliar,
  handleAvaliar,
}) {
  const notaNum = parseFloat(notaAvaliacao);

  if (isNaN(notaNum) || notaNum < 0 || notaNum > 10) {
    alert("A nota deve estar entre 0 e 10!");
    return;
  }

  handleAvaliar(grupoParaAvaliar.id, notaNum);
}