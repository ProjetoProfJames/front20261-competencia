"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Menu from "@/components/Menu";
import { fetchLocations, removeLocation } from "@/services/locationsApi";

const LocationsPage = () => {
  const [locations, setLocations] = useState([]);

  const reloadLocations = async () => {
    try {
      const { data } = await fetchLocations();
      setLocations(data);
    } catch (err) {
      console.error(err);
    }
  };

  const onDelete = async (id) => {
    if (!confirm("Deseja excluir este local?")) return;
    try {
      await removeLocation(id);
      reloadLocations();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    reloadLocations();
  }, []);

  return (
    <div className="page-wrapper">
      <Menu />
      <div className="page-content">
        <div className="page-header">
          <h1>Locais de Apresentação</h1>
          <Link href="/locais/create" className="link-btn">
            + Novo Local
          </Link>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {locations.map((local) => (
                <tr key={local.id}>
                  <td>{local.numero}</td>
                  <td>
                    <div className="td-actions">
                      <Link href={`/locais/${local.id}`} className="btn-edit">
                        Editar
                      </Link>
                      <button className="btn btn-danger" onClick={() => onDelete(local.id)}>
                        Excluir
                      </button>
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
};

export default LocationsPage;
