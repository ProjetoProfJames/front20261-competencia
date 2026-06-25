'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Button from '@/components/Button';
import FormInput from '@/components/FormInput';
import { api } from '@/services/api';

function CadastroSemestreContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const semestreId = searchParams.get('id');
  const isEditing = Boolean(semestreId);

  const [semestre, setSemestre] = useState({
    nome: '',
    dataInicio: '',
    dataFim: '',
  });

  const [generalError, setGeneralError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(isEditing);

  useEffect(() => {
    if (isEditing) {
      carregarSemestre();
    }
  }, [semestreId]);

  const carregarSemestre = async () => {
    try {
      const token =
        typeof window !== 'undefined'
          ? localStorage.getItem('token')
          : null;

      if (!token) {
        setGeneralError(
          'Você ainda não está logado. Os dados serão carregados após o login.'
        );
        return;
      }

      const response = await api.get(`/semestres/${semestreId}`);
      const data = response.data;

      setSemestre({
        nome: data?.nome || '',
        dataInicio: data?.dataInicio || '',
        dataFim: data?.dataFim || '',
      });
    } catch (err) {
      console.error('Erro ao carregar semestre:', err);
      setGeneralError('Não foi possível carregar os dados do semestre.');
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setSemestre((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    setGeneralError('');

    if (!semestre.nome.trim()) {
      setGeneralError('Informe o nome do semestre.');
      return;
    }

    if (semestre.nome.trim().length > 120) {
      setGeneralError(
        'O nome do semestre deve ter no máximo 120 caracteres.'
      );
      return;
    }

    if (!semestre.dataInicio) {
      setGeneralError('Informe a data de início.');
      return;
    }

    if (!semestre.dataFim) {
      setGeneralError('Informe a data de fim.');
      return;
    }

    if (semestre.dataFim < semestre.dataInicio) {
      setGeneralError(
        'A data de fim não pode ser anterior à data de início.'
      );
      return;
    }

    const payload = {
      nome: semestre.nome.trim(),
      dataInicio: semestre.dataInicio,
      dataFim: semestre.dataFim,
    };

    setIsLoading(true);

    try {
      if (isEditing) {
        await api.put(`/semestres/${semestreId}`, payload);
        alert('Semestre atualizado com sucesso!');
      } else {
        await api.post('/semestres', payload);
        alert('Semestre cadastrado com sucesso!');
      }

      router.back();
    } catch (err) {
      console.error('Erro ao salvar semestre:', err);
      setGeneralError(
        err.message || 'Erro ao tentar salvar semestre.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingData) {
    return (
      <main className="main">
        <section className="card">
          <p>Carregando dados do semestre...</p>
        </section>
      </main>
    );
  }

  return (
    <main className="main">
      <section className="card">
        <header>
          <h1>
            {isEditing
              ? 'Editar Semestre'
              : 'Cadastrar Semestre'}
          </h1>
        </header>

        {generalError && (
          <p
            className="error-message"
            style={{
              color: 'red',
              marginBottom: '10px',
            }}
          >
            {generalError}
          </p>
        )}

        <div className="form-group">
          <FormInput
            label="Nome"
            type="text"
            name="nome"
            value={semestre.nome}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <FormInput
            label="Data de início"
            type="date"
            name="dataInicio"
            value={semestre.dataInicio}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <FormInput
            label="Data de fim"
            type="date"
            name="dataFim"
            value={semestre.dataFim}
            onChange={handleChange}
          />
        </div>

        <div
          className="actions"
          style={{
            marginTop: '20px',
            display: 'flex',
            gap: '10px',
          }}
        >
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? 'Salvando...' : 'Salvar'}
          </Button>

          <Button
            type="button"
            onClick={() => router.back()}
            className="btn-danger"
          >
            Voltar
          </Button>
        </div>
      </section>
    </main>
  );
}

export default function CadastroSemestrePage() {
  return (
    <Suspense
      fallback={
        <main className="main">
          <section className="card">
            <p>Carregando dados do semestre...</p>
          </section>
        </main>
      }
    >
      <CadastroSemestreContent />
    </Suspense>
  );
}
