import { useEffect, useState } from "react";
import { useApi } from "../utils/hooks";

interface Score {
  // Adaptez cette interface aux données renvoyées par votre endpoint
  id: number;
  value: number;
  // ... autres propriétés
}

function Home() {
  const { get, loading, error } = useApi();
  const [scores, setScores] = useState<Score[]>([]);

  useEffect(() => {
    async function fetchScores() {
      try {
        fetch("https://127.0.0.1:8000/api/verify", {
          method: "GET",
          credentials: "include",
        })
          .then((response) => response.json())
          .then((data) => console.log("Cookies reçus:", data));
      } catch (err) {
        console.error("Erreur lors de la récupération des scores", err);
      }
    }
    fetchScores();
  }, []);

  return (
    <div className="flex w-full min-h-dvh">
      <div className="flex-1 p-4">
        {loading && <p>Chargement...</p>}
        {error && <p className="text-red-500">{error.message}</p>}
        {scores.length > 0 ? (
          <ul>
            {scores.map((score) => (
              <li key={score.id}>
                Score: {score.value}
                {/* Vous pouvez afficher d'autres propriétés ici */}
              </li>
            ))}
          </ul>
        ) : (
          !loading && <p>Aucun score trouvé.</p>
        )}
      </div>
      <div className="flex-1 bg-neutral-50 rounded-tl-[150px] rounded-bl-[150px]">{/* Autre contenu ou mise en page */}</div>
    </div>
  );
}

export default Home;
