'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

import Menu from '@/components/Menu';

import { getLocais, deleteLocal } from '@/services/localService';

export default function LocaisPage() {
  const [locais, setLocais] = useState([]);

  async function loadLocais() {
    try {
      const response = await getLocais();
      setLocais(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleDelete(id) {
    if (!confirm('Deseja excluir este local?')) return;

    try {
      await deleteLocal(id);
      loadLocais();
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    loadLocais();
  }, []);

  return (
    <div>
      <Menu />

      <h1>Locais de Apresentação</h1>

      <Link href='/locais/create'>
        Novo Local
      </Link>

      <table border='1'>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Ações</th>
          </tr>
        </thead>

        <tbody>
          {locais.map((local) => (
            <tr key={local.id}>
              <td>{local.numero}</td>

              <td>
                <Link href={`/locais/${local.id}`}>
                  Editar
                </Link>

                <button onClick={() => handleDelete(local.id)}>
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}