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

  useEffect(() => { loadLocais(); }, []);

  return (
    <div className='page-wrapper'>
      <Menu />
      <div className='page-content'>
        <div className='page-header'>
          <h1>Locais de Apresentação</h1>
          <Link href='/locais/create' className='link-btn'>
            + Novo Local
          </Link>
        </div>

        <div className='table-wrapper'>
          <table>
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
                    <div className='td-actions'>
                      <Link href={`/locais/${local.id}`} className='btn-edit'>Editar</Link>
                      <button className='btn btn-danger' onClick={() => handleDelete(local.id)}>Excluir</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}