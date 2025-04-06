import React, { useEffect, useState } from "react";
import { useApi } from "../utils/hooks";
import { FilterMatchMode } from "primereact/api";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

interface Score {
  id: number;
  score: number;
  user: string;
}

interface RankedScore extends Score {
  rank: number;
}

function ClassementTable() {
  const { get, loading } = useApi();
  const [scores, setScores] = useState<Score[]>([]);
  const [filters, setFilters] = useState({
    global: { value: "", matchMode: FilterMatchMode.CONTAINS }, // Utilisation d'un filtre global
  });
  const [globalFilterValue, setGlobalFilterValue] = useState("");

  useEffect(() => {
    async function fetchScores() {
      try {
        const response = await get<{ message: string; data: Score[] }>("/scores");
        // Trie les scores et ajoute la position (rank)
        const sortedScores: RankedScore[] = response.data
          .sort((a, b) => b.score - a.score)
          .map((score, index) => ({
            ...score,
            rank: index + 1,
          }));

        setScores(sortedScores);
      } catch (err) {
        console.error("Erreur lors de la récupération des scores", err);
      }
    }
    fetchScores();
  }, []);

  // Gestion du filtre global
  const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    let _filters = { ...filters };

    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const renderHeader = () => {
    return (
      <div className="flex justify-content-end w-full">
        <IconField iconPosition="left" className="w-full max-w-[300px]">
          <InputIcon className="pi pi-search" />
          <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Rechercher" className="w-full" />
        </IconField>
      </div>
    );
  };

  const header = renderHeader();

  return (
    <DataTable value={scores} paginator rows={10} dataKey="id" filters={filters} loading={loading} globalFilterFields={["user.pseudo", "score"]} header={header} emptyMessage="Aucun score trouvé.">
      <Column field="rank" header="Position" />
      <Column field="user.pseudo" header="Joueur" />
      <Column field="score" header="Score" />
    </DataTable>
  );
}

export default ClassementTable;
