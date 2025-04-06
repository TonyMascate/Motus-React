import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ClassementTable from "../components/ClassementTable";
import { motion } from "framer-motion";
import { Card } from "primereact/card";
import { useApi } from "../utils/hooks";
import { ProgressSpinner } from "primereact/progressspinner";
import GameSettings from "../components/GameSettings";

function Home() {
  const { get, post } = useApi();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [newGame, setNewGame] = useState<boolean>(false);
  const [difficulte, setDifficulte] = useState<number>(1);
  const [longueur, setLongueur] = useState<number>(6);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await get("/auth/check");
        setIsAuthenticated(true);
      } catch {
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, [get]);

  const handleLogout = async () => {
    try {
      await post("/logout", {});
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Erreur pendant la déconnexion", error);
    }
  };

  const startNewGame = () => {
    // Redirige vers /game avec les réglages dans la query string
    navigate(`/game?length=${longueur}&difficulty=${difficulte}`);
  };

  return (
    <div className="flex w-full min-h-dvh flex-col-reverse lg:flex-row">
      <div className="flex-1 p-3 sm:p-10 flex items-center justify-center lg:order-first">
        <Card className="w-full">
          <h2 className="font-bold text-3xl mb-3">Classement</h2>
          <ClassementTable />
        </Card>
      </div>

      <div className="flex-1 bg-neutral-50 lg:rounded-tl-[150px] rounded-bl-[50px] lg:rounded-bl-[150px] rounded-br-[50px] lg:rounded-br-[0px] p-10 flex flex-col items-center justify-center gap-6">
        {isAuthenticated === null ? (
          <ProgressSpinner style={{ width: "50px", height: "50px" }} strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s" />
        ) : !newGame ? (
          <>
            <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} whileHover={{ scale: 1.1, rotate: -2 }} transition={{ duration: 0.3 }}>
              <button type="button" className="cursor-pointer bg-indigo-500 px-6 py-4 rounded-lg font-bold uppercase text-white text-xl" onClick={() => setNewGame(true)}>
                Nouvelle partie
              </button>
            </motion.div>
            <div className="flex flex-col gap-4">
              <button onClick={isAuthenticated ? handleLogout : undefined} className={`cursor-pointer font-semibold underline text-lg ${isAuthenticated ? "text-red-500" : "text-indigo-500"}`}>
                {isAuthenticated ? "Se déconnecter" : <Link to="/login">Se connecter</Link>}
              </button>
              {!isAuthenticated && (
                <button className="cursor-pointer font-semibold underline text-lg text-indigo-500">
                  <Link to="/register">Créer un compte</Link>
                </button>
              )}
            </div>
          </>
        ) : (
          <>
            <GameSettings difficulte={difficulte} longueur={longueur} setDifficulte={setDifficulte} setLongueur={setLongueur} />
            <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} transition={{ duration: 0.3 }} className="flex flex-col gap-3">
              <button onClick={startNewGame} className="cursor-pointer bg-indigo-500 px-6 py-4 rounded-lg font-bold uppercase text-white text-xl">
                Démarrer la partie
              </button>
              <button onClick={() => setNewGame(false)} className="cursor-pointer underline text-neutral-800 text-xl">
                Retour
              </button>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}

export default Home;
