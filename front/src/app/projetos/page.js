'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { listarProjetos, deletarProjeto } from '@/services/projetoService'
import LayoutComponent from '@/components/Layout'

export default function ProjetosPage() {
  const router = useRouter()
  const [projetos, setProjetos] = useState([])
  const [erro, setErro] = useState(null)
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    carregarProjetos()
  }, [])

  async function carregarProjetos() {
    try {
      setCarregando(true)
      const dados = await listarProjetos()
      setProjetos(dados)
    } catch (e) {
      setErro(e.message)
    } finally {
      setCarregando(false)
    }
  }

  async function handleDeletar(id) {
    const confirmado = confirm('Tem certeza que deseja excluir este projeto?')
    if (!confirmado) return
    try {
      await deletarProjeto(id)
      await carregarProjetos()
    } catch (e) {
      alert(e.message)
    }
  }

  if (carregando) return <LayoutComponent><p>Carregando...</p></LayoutComponent>
  if (erro) return <LayoutComponent><p className="mensagem-erro">Erro: {erro}</p></LayoutComponent>

  return (
    <LayoutComponent>
      <div className="pagina-cabecalho">
        <h1>Projetos</h1>
        <button onClick={() => router.push('/projetos/novo')}>
          Novo Projeto
        </button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Turma</th>
            <th>Professor Orientador</th>
            <th>Integrantes</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {projetos.length === 0 && (
            <tr>
              <td colSpan={5}>Nenhum projeto cadastrado.</td>
            </tr>
          )}
          {projetos.map((projeto) => (
            <tr key={projeto.id}>
              <td>{projeto.nome}</td>
              <td>{projeto.turma?.nome ?? '-'}</td>
              <td>{projeto.professorOrientador?.username ?? '-'}</td>
              <td>{projeto.integrantes?.length ?? 0} aluno(s)</td>
              <td>
                <div className="botoes-acao">
                  <button onClick={() => router.push(`/projetos/${projeto.id}`)}>
                    Editar
                  </button>
                  <button
                    onClick={() =>
                      router.push(`/projetos/${projeto.id}/avaliacoes`)
                    }
                  >
                    Avaliações
                  </button>
                  <button
                    className="botao-perigo"
                    onClick={() => handleDeletar(projeto.id)}
                  >
                    Excluir
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </LayoutComponent>
  )
}