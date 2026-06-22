'use client'

import { buscarProjeto, criarAvaliacao, editarAvaliacao, deletarAvaliacao, listarAvaliacoesPorProjeto } from '@/services/projetoService'
import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Button from '@/components/Button'
import FormInput from '@/components/FormInput'

export default function AvaliacoesPage() {
  const router = useRouter()
  const { id } = useParams()
  const [projeto, setProjeto] = useState(null)
  const [avaliacoes, setAvaliacoes] = useState([])
  const [erro, setErro] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [editandoId, setEditandoId] = useState(null)

  const [form, setForm] = useState({ nota: '', comentario: '' })

  useEffect(() => {
    carregarProjeto()
  }, [])

  async function carregarProjeto() {
    try {
      setCarregando(true)
      const dados = await buscarProjeto(id)
      const listaAvaliacoes = await listarAvaliacoesPorProjeto(id)
      setProjeto(dados)
      setAvaliacoes(listaAvaliacoes)
    } catch (e) {
      setErro(e.message)
    } finally {
      setCarregando(false)
    }
  }

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  function handleEditar(avaliacao) {
    setEditandoId(avaliacao.id)
    setForm({ nota: avaliacao.nota, comentario: avaliacao.comentario })
  }

  function handleCancelarEdicao() {
    setEditandoId(null)
    setForm({ nota: '', comentario: '' })
  }

  async function handleSalvar() {
    if (!form.nota || !form.comentario) {
      setErro('Preencha a nota e o comentário.')
      return
    }

    if (Number(form.nota) < 0 || Number(form.nota) > 10) {
      setErro('A nota deve ser entre 0 e 10.')
      return
    }

    try {
      setErro(null)
      if (editandoId) {
        await editarAvaliacao(id, editandoId, { nota: Number(form.nota), comentario: form.comentario })
      } else {
        await criarAvaliacao(id, { nota: Number(form.nota), comentario: form.comentario })
      }
      setEditandoId(null)
      setForm({ nota: '', comentario: '' })
      await carregarProjeto()
    } catch (e) {
      setErro(e.message)
    }
  }

  async function handleDeletar(avaliacaoId) {
    const confirmado = confirm('Tem certeza que deseja excluir esta avaliação?')
    if (!confirmado) return

    try {
      await deletarAvaliacao(id, avaliacaoId)
      await carregarProjeto()
    } catch (e) {
      alert(e.message)
    }
  }

  if (carregando) return <p>Carregando...</p>
  if (erro) return <p>Erro: {erro}</p>

  return (
    <main>
      <div className="pagina-cabecalho">
        <h1>Avaliações — {projeto.nome}</h1>
        <button className="botao-secundario" onClick={() => router.push('/projetos')}>Voltar</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Avaliador</th>
            <th>Nota</th>
            <th>Comentário</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {avaliacoes.length === 0 && (
            <tr>
              <td colSpan={4}>Nenhuma avaliação cadastrada.</td>
            </tr>
          )}
          {avaliacoes.map((avaliacao) => (
            <tr key={avaliacao.id}>
              <td>{avaliacao.avaliador?.username ?? '-'}</td>
              <td>{avaliacao.nota}</td>
              <td>{avaliacao.comentario}</td>
              <td>
                <div className="botoes-acao">
                  <button onClick={() => handleEditar(avaliacao)}>Editar</button>
                  <button className="botao-perigo" onClick={() => handleDeletar(avaliacao.id)}>Excluir</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <br />

      <div className="formulario">
        <h2>{editandoId ? 'Editar Avaliação' : 'Nova Avaliação'}</h2>
        {erro && <p className="mensagem-erro">{erro}</p>}

        <FormInput label="Nota (0 a 10)" type="number" name="nota" value={form.nota} onChange={handleChange} />
        <FormInput label="Comentário" type="text" name="comentario" value={form.comentario} onChange={handleChange} />

        <div className="formulario-rodape">
          {editandoId && (
            <button className="botao-secundario" onClick={handleCancelarEdicao}>Cancelar</button>
          )}
          <button onClick={handleSalvar}>
            {editandoId ? 'Salvar Alterações' : 'Adicionar Avaliação'}
          </button>
        </div>
      </div>
    </main>
  )
}