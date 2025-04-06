// src/components/GameSettings.tsx
import React from "react";
import { InputNumber } from "primereact/inputnumber";
import { Slider } from "primereact/slider";

interface GameSettingsProps {
  difficulte: number;
  longueur: number;
  setDifficulte: (value: number) => void;
  setLongueur: (value: number) => void;
}

export default function GameSettings({ difficulte, longueur, setDifficulte, setLongueur }: GameSettingsProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <label htmlFor="difficulte" className="font-semibold">
          Difficulté
        </label>
        <InputNumber id="difficulte" value={difficulte} onChange={(e) => setDifficulte(e.value ?? 1)} min={1} max={3} />
        <Slider value={difficulte} onChange={(e) => setDifficulte(Number(e.value ?? 1))} step={1} min={1} max={3} />
      </div>

      <div className="flex flex-col gap-3">
        <label htmlFor="longueur" className="font-semibold">
          Longueur du mot
        </label>
        <InputNumber id="longueur" value={longueur} onChange={(e) => setLongueur(e.value ?? 6)} min={6} max={10} />
        <Slider value={longueur} onChange={(e) => setLongueur(Number(e.value ?? 6))} step={1} min={6} max={10} />
      </div>
    </div>
  );
}
