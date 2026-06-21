'use client';
import { useState, useEffect } from 'react';
import RotaProtegida from '@/app/framework/components/RotaProtegida';
import Container from '@/app/framework/components/Layouts/Container';
import Row from '@/app/framework/components/Layouts/Row';
import Col from '@/app/framework/components/Layouts/Col';
import Table from '@/app/framework/components/Table';
import Modal from '@/app/framework/components/Modal';
import Button from '@/app/framework/components/Button';
import FormInput from '@/app/framework/components/FormInput';
import Get from '@/utils/api/Get';
import Post from '@/utils/api/Post';
import Put from '@/utils/api/Put';
import Delete from '@/utils/api/Delete';
import { obterToken } from '@/utils/api/Auth';

export default function Locais() {
  const [locais, setLocais] = useState([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [modalExcluir, setModalExcluir] = useState(false);
  const [editando, setEditando] = useState(null);
  const [excluindo, setExcluindo] = useState(null);

  const [numero, setNumero] = useState('');
  const [erro, setErro] = useState('');

  const headers = {
    headers: { Authorization: `Bearer ${obterToken()}` },
  };

  async function carregarLocais() {
    try {
      const res = await Get('/api/locais', headers);
      setLocais(res.data || []);
    } catch (e) {
      console.log('Erro ao carregar locais', e);
    }
  }

  useEffect(() => {
    carregarLocais();
  }, []);

  function abrirModalCriar() {
    setEditando(null);
    setNumero('');
    setErro('');
    setModalAberto(true);
  }

  function abrirModalEditar(local) {
    setEditando(local);
    setNumero(local.numero || '');
    setErro('');
    setModalAberto(true);
  }

  function fecharModal() {
    setModalAberto(false);
    setEditando(null);
    setErro('');
  }

  function abrirModalExcluir(local) {
    setExcluindo(local);
    setModalExcluir(true);
  }

  function fecharModalExcluir() {
    setModalExcluir(false);
    setExcluindo(null);
  }

  async function salvarLocal() {
    setErro('');

    if (!numero.trim()) {
      setErro('O número do local é obrigatório.');
      return;
    }

    if (numero.length > 40) {
      setErro('O número deve ter no máximo 40 caracteres.');
      return;
    }

    try {
      if (editando) {
        await Put(`/api/locais/${editando.id}`, { numero }, headers);
      } else {
        await Post('/api/locais', { numero }, headers);
      }
      fecharModal();
      carregarLocais();
    } catch (e) {
      setErro('Erro ao salvar local. Verifique os dados e tente novamente.');
      console.log('Erro ao salvar', e);
    }
  }

  async function confirmarExclusao() {
    try {
      await Delete(`/api/locais/${excluindo.id}`, headers);
      fecharModalExcluir();
      carregarLocais();
    } catch (e) {
      console.log('Erro ao excluir', e);
    }
  }

  const colunas = [
    { label: 'ID', key: 'id' },
    { label: 'Número', key: 'numero' },
    { label: 'Ações', key: 'acoes' },
  ];

  const dadosTabela = locais.map((l) => ({
    ...l,
    acoes: (
      <Row align="center" justify="evenly">
        <Button type="laranja" onClick={() => abrirModalEditar(l)}>Editar</Button>
        <Button type="vermelho" onClick={() => abrirModalExcluir(l)}>Excluir</Button>
      </Row>
    ),
  }));

  return (
    <RotaProtegida roles={['ADMIN', 'COORDENADOR']}>
      <Container>
        <Row align="center" justify="between">
          <Col>
            <h2 style={{ margin: 'var(--margin-md) 0' }}>Gerenciamento de Locais</h2>
          </Col>
          <Col>
            <Row align="center" justify="end">
              <Button type="azul" onClick={abrirModalCriar}>+ Novo Local</Button>
            </Row>
          </Col>
        </Row>

        <Table columns={colunas} data={dadosTabela} />

        {modalAberto && (
          <Modal title={editando ? 'Editar Local' : 'Novo Local'}>
            <h3 style={{ marginBottom: 'var(--margin-md)' }}>
              {editando ? 'Editar Local' : 'Novo Local'}
            </h3>

            <FormInput
              type="form-group"
              label="Número do Local"
              name="numero"
              placeholder="Ex: Sala 101, Lab 03, Auditório A"
              value={numero}
              onChange={(e) => setNumero(e.target.value)}
            />

            {erro && (
              <p style={{ color: 'var(--error)', fontSize: '14px', marginBottom: 'var(--spacing-md)' }}>
                {erro}
              </p>
            )}

            <Row align="center" justify="evenly">
              <Button type="azul" onClick={salvarLocal}>Salvar</Button>
              <Button type="vermelho" onClick={fecharModal}>Cancelar</Button>
            </Row>
          </Modal>
        )}

        {modalExcluir && excluindo && (
          <Modal title="Confirmar Exclusão">
            <h3 style={{ marginBottom: 'var(--margin-md)' }}>Confirmar Exclusão</h3>
            <p style={{ marginBottom: 'var(--margin-lg)', fontFamily: 'sans-serif' }}>
              Tem certeza que deseja excluir o local <strong>{excluindo.numero}</strong>?
            </p>
            <Row align="center" justify="evenly">
              <Button type="vermelho" onClick={confirmarExclusao}>Confirmar</Button>
              <Button type="azul" onClick={fecharModalExcluir}>Cancelar</Button>
            </Row>
          </Modal>
        )}
      </Container>
    </RotaProtegida>
  );
}
