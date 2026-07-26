"use client";

import React, { useEffect, useState, useMemo } from "react";

interface ContributionDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

const colorMap = {
  0: "bg-zinc-800/60 border-zinc-900/50",
  1: "bg-emerald-900 border-emerald-950",
  2: "bg-emerald-700 border-emerald-800",
  3: "bg-emerald-500 border-emerald-600",
  4: "bg-emerald-300 border-emerald-400",
};

export default function Grid() {
  const [contributions, setContributions] = useState<ContributionDay[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados del formulario para agregar actividad
  const [activityText, setActivityText] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<0 | 1 | 2 | 3 | 4>(1);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );

  useEffect(() => {
    async function fetchGridData() {
      try {
        const response = await fetch("/api/grid");
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

  // Función para registrar la actividad al presionar el botón de Check
  const handleAddActivity = async (e: React.FormEvent) => {
    e.preventDefault();

    // Actualización local rápida en el estado
    setContributions((prev) => {
      const existingIndex = prev.findIndex((item) => item.date === selectedDate);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          count: updated[existingIndex].count + 1,
          level: selectedLevel,
        };
        return updated;
      } else {
        return [
          ...prev,
          {
            date: selectedDate,
            count: 1,
            level: selectedLevel,
          },
        ];
      }
    });

    // Opcional: Enviar el registro a tu API backend
    try {
      await fetch("/api/grid", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: selectedDate,
          activity: activityText,
          level: selectedLevel,
        }),
      });
    } catch (error) {
      console.error("Error guardando la actividad:", error);
    }

    // Limpiar input
    setActivityText("");
  };

  // Preprocesa los 365 días estructurados
  const fullYearData = useMemo(() => {
    const dataMap = new Map<string, ContributionDay>();
    contributions.forEach((item) => dataMap.set(item.date, item));

    const days: (ContributionDay | null)[] = [];
    const today = new Date();

    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 364);

    const startDayOfWeek = startDate.getDay();
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push(null);
    }

    const currentDate = new Date(startDate);
    while (currentDate <= today) {
      const dateStr = currentDate.toISOString().split("T")[0];
      const existing = dataMap.get(dateStr);

      days.push(
        existing || {
          date: dateStr,
          count: 0,
          level: 0,
        }
      );

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return days;
  }, [contributions]);

  if (loading) {
    return <div className="text-zinc-400 text-sm animate-pulse">Cargando mosaico...</div>;
  }

  return (
    <div className="p-6 bg-zinc-950 border border-zinc-800 rounded-xl max-w-fit space-y-6">
      <h3 className="text-zinc-200 text-sm font-medium">Mapeo de Actividad</h3>

      {/* Formulario de Inserción de Actividad */}
      <form
        onSubmit={handleAddActivity}
        className="flex flex-wrap items-center gap-3 p-3 bg-zinc-900/60 border border-zinc-800 rounded-lg"
      >
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="bg-zinc-950 border border-zinc-700 text-zinc-200 text-xs rounded-md px-2.5 py-1.5 focus:outline-none focus:border-emerald-500"
        />

        <input
          type="text"
          placeholder="Nombre de la actividad..."
          value={activityText}
          onChange={(e) => setActivityText(e.target.value)}
          required
          className="flex-1 min-w-[180px] bg-zinc-950 border border-zinc-700 text-zinc-200 text-xs rounded-md px-3 py-1.5 focus:outline-none focus:border-emerald-500"
        />

        {/* Lista de selección de nivel de intensidad */}
        <select
          value={selectedLevel}
          onChange={(e) => setSelectedLevel(Number(e.target.value) as 0 | 1 | 2 | 3 | 4)}
          className="bg-zinc-950 border border-zinc-700 text-zinc-200 text-xs rounded-md px-2.5 py-1.5 focus:outline-none focus:border-emerald-500 cursor-pointer"
        >
          <option value={0}>Nivel 0 (Sin actividad)</option>
          <option value={1}>Nivel 1 (Bajo)</option>
          <option value={2}>Nivel 2 (Medio)</option>
          <option value={3}>Nivel 3 (Alto)</option>
          <option value={4}>Nivel 4 (Muy Alto)</option>
        </select>

        {/* Botón de Check para confirmar */}
       

        {/* Botón de Check con SVG nativo sin dependencias */}
        <button
          type="submit"
          title="Guardar actividad"
          className="p-1.5 bg-emerald-600 hover:bg-emerald-500 text-zinc-950 rounded-md transition-colors flex items-center justify-center font-bold"
        >
          <svg
            className="w-4 h-4 stroke-[3]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="3"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </button>



      </form>

      {/* Grid estilo GitHub */}
      <div className="flex gap-2">
        {/* Días de la semana */}
        <div className="grid grid-rows-7 gap-[3px] text-[10px] text-zinc-500 select-none pr-1">
          <span className="h-3">Dom</span>
          <span className="h-3">Lun</span>
          <span className="h-3">Mar</span>
          <span className="h-3">Mié</span>
          <span className="h-3">Jue</span>
          <span className="h-3">Vie</span>
          <span className="h-3">Sáb</span>
        </div>

        {/* Celdas */}
        <div className="grid grid-flow-col grid-rows-7 gap-[3px] overflow-x-auto pb-2">
          {fullYearData.map((day, index) => {
            if (!day) {
              return <div key={`empty-${index}`} className="w-3 h-3" />;
            }

            const isSelected = day.date === selectedDate;

            return (
              <div
                key={day.date}
                onClick={() => setSelectedDate(day.date)}
                title={`${day.count} actividades el ${day.date}`}
                className={`w-3 h-3 rounded-[2px] border cursor-pointer transition-transform hover:scale-125 ${
                  colorMap[day.level]
                } ${isSelected ? "ring-2 ring-emerald-400 ring-offset-1 ring-offset-zinc-950" : ""}`}
              />
            );
          })}
        </div>
      </div>

      {/* Leyenda */}
      <div className="flex items-center justify-end gap-1.5 text-xs text-zinc-500">
        <span>Menos</span>
        <div className="w-2.5 h-2.5 rounded-[2px] bg-zinc-800/60 border border-zinc-900/50" />
        <div className="w-2.5 h-2.5 rounded-[2px] bg-emerald-900 border border-emerald-950" />
        <div className="w-2.5 h-2.5 rounded-[2px] bg-emerald-700 border border-emerald-800" />
        <div className="w-2.5 h-2.5 rounded-[2px] bg-emerald-500 border border-emerald-600" />
        <div className="w-2.5 h-2.5 rounded-[2px] bg-emerald-300 border border-emerald-400" />
        <span>Más</span>
      </div>
    </div>
  );
}