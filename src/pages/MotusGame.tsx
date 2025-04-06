// src/pages/MotusGame.tsx
import React, { useEffect, useState, useRef } from "react";
import { useApi } from "../utils/hooks";
import { Link, useLocation } from "react-router-dom";
import { Card } from "primereact/card";

type LetterStatus = "correct" | "misplaced" | "absent" | null;

interface LetterBox {
  letter: string;
  status: LetterStatus;
}

type GameStatus = "playing" | "victory" | "defeat";

const MotusGame = () => {
  const { get, post } = useApi();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const difficultyParam = Number(queryParams.get("difficulty") || 1);

  const [targetWord, setTargetWord] = useState("");
  const [grid, setGrid] = useState<LetterBox[][]>([]);
  const [currentRow, setCurrentRow] = useState(0);
  const [activeCell, setActiveCell] = useState(1);
  const [gameStatus, setGameStatus] = useState<GameStatus>("playing");
  const gameRef = useRef<HTMLDivElement>(null);

  // Récupère le mot cible et initialise la grille
  const fetchWord = async () => {
    try {
      // On utilise les query params passés dans l'URL
      const data = await get<{ word: string }>("/game?" + queryParams.toString());
      if (data.word) {
        const word = data.word.toLowerCase();
        setTargetWord(word);
        // Créer la grille : 6 lignes, N colonnes (N = longueur du mot)
        const initialGrid = Array.from({ length: 6 }, () => Array.from({ length: word.length }, () => ({ letter: "", status: null as LetterStatus })));
        // Pré-remplir la première lettre dans la première ligne
        initialGrid[0][0] = { letter: word[0].toUpperCase(), status: "correct" };
        setGrid(initialGrid);
        setCurrentRow(0);
        setActiveCell(1);
        setGameStatus("playing");
        setTimeout(() => gameRef.current?.focus(), 0);
      }
    } catch (error) {
      console.error("Erreur lors du chargement du mot", error);
    }
  };

  useEffect(() => {
    fetchWord();
  }, [get, location.search]);

  const handleKey = (e: React.KeyboardEvent) => {
    if (gameStatus !== "playing" || targetWord === "") return;

    const key = e.key.toLowerCase();
    const updatedGrid = [...grid];
    const row = [...updatedGrid[currentRow]];

    // Saisie d'une lettre
    if (/^[A-Za-zÀ-ÖØ-öø-ÿ]$/u.test(key) && activeCell < targetWord.length) {
      if (currentRow === 0 && activeCell === 0) return;
      row[activeCell].letter = key.toUpperCase();
      updatedGrid[currentRow] = row;
      setGrid(updatedGrid);
      setActiveCell((prev) => Math.min(prev + 1, targetWord.length));
    }
    // Gestion de backspace
    else if (key === "backspace" && activeCell > 1) {
      row[activeCell - 1] = { letter: "", status: null };
      updatedGrid[currentRow] = row;
      setGrid(updatedGrid);
      setActiveCell((prev) => Math.max(prev - 1, currentRow === 0 ? 1 : 0));
    }
    // Validation avec Enter si la ligne est complète
    else if (key === "enter" && row.every((l) => l.letter !== "")) {
      const guess = row.map((l) => l.letter.toLowerCase()).join("");
      post<{ result: { letter: string; status: LetterStatus }[] }>("/game/guess", {
        guess,
        target: targetWord,
        attempt: currentRow + 1,
        difficulty: difficultyParam,
      }).then((response) => {
        const updatedRow = row.map((cell, i) => ({
          ...cell,
          status: response.result[i].status,
        }));
        updatedGrid[currentRow] = updatedRow;
        setGrid(updatedGrid);
        if (guess === targetWord) {
          setGameStatus("victory");
        } else if (currentRow === 5) {
          setGameStatus("defeat");
        } else {
          // On passe à la ligne suivante et on pré-remplit la première lettre de cette nouvelle ligne
          const newRow = currentRow + 1;
          updatedGrid[newRow] = updatedGrid[newRow].map((cell, index) => {
            if (index === 0) {
              return { letter: targetWord[0].toUpperCase(), status: "correct" };
            }
            return cell;
          });
          setGrid(updatedGrid);
          setCurrentRow(newRow);
          setActiveCell(1);
        }
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-2 sm:p-4">
      <Card className="w-full max-w-[600px]">
        <div className="flex flex-col items-center gap-4">
          <h1 className="text-3xl font-bold mb-4">Jeu du Motus</h1>
          {gameStatus === "victory" && (
            <div className="mb-4 p-4 bg-green-100 border border-green-500 rounded">
              <p className="text-green-700 font-semibold">🎉 Victoire !</p>
              <button onClick={fetchWord} className="mt-2 px-4 py-2 bg-green-500 text-white rounded">
                Nouvelle Partie
              </button>
            </div>
          )}
          {gameStatus === "defeat" && (
            <div className="mb-4 p-4 bg-red-100 border border-red-500 rounded">
              <p className="text-red-700 font-semibold">
                💀 Défaite ! Le mot était : <span className="font-bold">{targetWord.toUpperCase()}</span>
              </p>
              <button onClick={fetchWord} className="mt-2 px-4 py-2 bg-red-500 text-white rounded">
                Nouvelle Partie
              </button>
            </div>
          )}
          <div ref={gameRef} className="w-full max-w-full overflow-x-auto flex flex-col gap-2 outline-none" tabIndex={0} onKeyDown={handleKey}>
            {grid.map((row, rowIndex) => (
              <div key={rowIndex} className="flex justify-center gap-1">
                {row.map((cell, cellIndex) => (
                  <div
                    key={cellIndex}
                    className={`w-8 h-8 sm:w-12 sm:h-12 text-base sm:text-xl font-bold flex items-center justify-center rounded transition-all text-center ${(() => {
                      if (cell.status === "correct") return "border-2 border-red-400 bg-red-400 text-white";
                      if (cell.status === "misplaced") return "border-2 border-yellow-500 bg-yellow-500 text-white";
                      if (cell.status === "absent") return "bg-blue-500 text-white";
                      return "border bg-neutral-200 border-gray-300";
                    })()}`}>
                    {cell.letter}
                  </div>
                ))}
              </div>
            ))}
          </div>

          <p className="mt-4 text-gray-600 text-center">Tapez directement dans la grille. Appuyez sur Entrée pour valider votre essai.</p>
          <div className="mt-4 p-4 bg-neutral-100 border border-neutral-300 rounded">
            <h2 className="text-xl font-semibold">Explication des couleurs :</h2>
            <ul className="mt-2 text-gray-600">
              <li>
                <span className="text-red-400 font-bold">Rouge</span> : La lettre est correcte et bien placée.
              </li>
              <li>
                <span className="text-yellow-500 font-bold">Jaune</span> : La lettre est présente mais mal placée.
              </li>
              <li>
                <span className="text-blue-500 font-bold">Bleu</span> : La lettre n'est pas dans le mot.
              </li>
            </ul>
          </div>
          <Link to="/" className="cursor-pointer bg-indigo-500 px-6 py-4 rounded-lg font-bold uppercase text-white text-xl">
            Quitter
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default MotusGame;
