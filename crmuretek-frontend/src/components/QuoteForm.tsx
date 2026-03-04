import React, { useState, useEffect } from "react";
import { X } from "lucide-react"; // Nice to have an X icon

interface QuoteFormProps {
  consulta: any;
  onCancel: () => void;
  onCreate: (jobData: any) => void;
}

export const QuoteForm: React.FC<QuoteFormProps> = ({
  consulta,
  onCancel,
  onCreate,
}) => {
  const [material, setMaterial] = useState("");
  const [workDate, setWorkDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [description, setDescription] = useState("");

  // Inside QuoteForm.tsx, before the return
  useEffect(() => {
    console.log("consulta received in QuoteForm:", consulta);
    if (consulta?.existingAmount) {
      setMaterial(consulta.existingMaterial || "");
      setDescription(consulta.existingDescription || "");
    }
  }, [consulta]);

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-black text-slate-800">Crear Trabajo</h2>
          <button
            onClick={onCancel}
            className="text-slate-400 hover:text-slate-600"
          >
            <X size={24} />
          </button>
        </div>

        <p className="text-slate-500 mb-6">
          Cliente: <span className="font-bold text-slate-800">{consulta.name}</span>
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
              Descripción de Obra
            </label>
            <input
              type="text"
              className="w-full p-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-orange-500"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Quebraduras en las paredes..."
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
              Material Est. (kg)
            </label>
            <input
              type="number"
              className="w-full p-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-orange-500"
              value={material}
              onChange={(e) => setMaterial(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
              Fecha de Inicio
            </label>
            <input
              type="date"
              className="w-full p-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-orange-500"
              value={workDate}
              onChange={(e) => setWorkDate(e.target.value)}
            />
          </div>
        </div>

        <div className="flex gap-3 pt-8">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-3 font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={() =>
              onCreate({
                estimateMaterialKg: Number(material),
                workDate: workDate,
                observations: description,
              })
            }
            className="flex-1 py-3 bg-orange-600 text-white font-bold rounded-xl shadow-lg shadow-orange-200 hover:bg-orange-700 transition-all"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};
