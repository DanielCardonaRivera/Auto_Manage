"use client";

import React, { useEffect, useState } from "react";

interface ContributionDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

const colorMap = {
  0: "bg-zinc-800 border-zinc-900/50", 
  1: "bg-emerald-900 border-emerald-950", 
  2: "bg-emerald-700 border-emerald-800",
  3: "bg-emerald-500 border-emerald-600",
  4: "bg-emerald-300 border-emerald-400",
};

export default function Grid() {
  const [contributions, setContributions] = useState<ContributionDay[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGridData() {
      try {
        const response = await fetch("/api/grid"); // Tu ruta de API
        const json = await response.json();
        if (json.success) {
          setContributions(json.data);
        }
      } catch (error) {
        console.error("Error cargando el mosaico:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchGridData();
  }, []);

  if (loading) {
    return <div className="text-zinc-400 text-sm animate-pulse">Cargando mosaico...</div>;
  }

  return (
    <div className="p-6 bg-zinc-950 border border-zinc-800 rounded-xl max-w-fit">
      <h3 className="text-zinc-200 text-sm font-medium mb-4">Mapeo de Actividad</h3>
      
      {}
      <div className="grid grid-flow-col grid-rows-7 gap-1 bg-zinc-950 p-2 rounded-lg">
        {contributions.map((day) => (
          <div
            key={day.date}
            title={`${day.count} actividades el ${day.date}`} // Tooltip nativo al pasar el mouse
            className={`w-3 h-3 rounded-[2px] border transition-all hover:scale-125 ${colorMap[day.level]}`}
          />
        ))}
      </div>

      {}
      <div className="flex items-center justify-end gap-1 mt-3 text-xs text-zinc-500">
        <span>Menos</span>
        <div className="w-2.5 h-2.5 rounded-[1px] bg-zinc-800" />
        <div className="w-2.5 h-2.5 rounded-[1px] bg-emerald-900" />
        <div className="w-2.5 h-2.5 rounded-[1px] bg-emerald-700" />
        <div className="w-2.5 h-2.5 rounded-[1px] bg-emerald-500" />
        <div className="w-2.5 h-2.5 rounded-[1px] bg-emerald-300" />
        <span>Más</span>
      </div>
    </div>
  );
}
