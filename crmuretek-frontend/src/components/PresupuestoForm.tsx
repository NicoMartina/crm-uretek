import React, { useState, useEffect } from "react";
import type { Presupuesto } from "../types/Presupuesto";
import type { PresupuestoFormData } from "../types/PresupuestoFormData";
import type { Visit } from "../types/Visit";

interface PresupuestoFormProps {
  initialData?: Presupuesto | null;
  defaultVisitId?: number | null;
  visits: Visit[];
  onCancel: () => void;
  onSubmit: (formData: PresupuestoFormData) => Promise<void>;
  onRefresh: () => Promise<void> | void;
}

export default function PresupuestoForm({
  initialData,
  visits,
  onRefresh,
  onSubmit,
  onCancel,
  defaultVisitId,
}: PresupuestoFormProps) {
  const [formData, setFormData] = useState<PresupuestoFormData>({
    presupuestoNumber: initialData?.presupuestoNumber || "",
    visitId: initialData?.visitId || defaultVisitId || undefined,
    date: initialData?.visitDate || "",
    amount: initialData?.amount || undefined,
    acceptanceForm: initialData?.acceptanceForm || "",
    observations: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        presupuestoNumber: initialData.presupuestoNumber || "",
        visitId: initialData.visitId || undefined,
        date: initialData.visitDate || "",
        amount: initialData.amount || undefined,
        acceptanceForm: initialData.acceptanceForm || "",
        observations: initialData.observations || "",
      });
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const dataToSend = {
        ...formData,
      };
      await onSubmit(dataToSend);
      onRefresh();

      alert("✅ Procesado con éxito");
    } catch (error) {
      console.error("Error al procesar el formulario:", error);
      alert("❌ Error al procesar el formulario");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
    >
      {/* Input Group 1 */}
      <div>
        <label className="text-[10px] font-bold uppercase text-slate-400">
          Numero de Presupuesto
        </label>
        <input
          className="w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-orange-500"
          value={formData.presupuestoNumber}
          onChange={(e) =>
            setFormData({
              ...formData,
              presupuestoNumber: e.target.value,
            })
          }
        />
      </div>

      {/* Input Group 2 */}
      <div>
        <label className="text-[10px] font-bold uppercase text-slate-400">
          Visita
        </label>
        <select
          className="w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-orange-500 bg-white"
          value={formData.visitId || ""}
          onChange={(e) =>
            setFormData({
              ...formData,
              visitId: e.target.value
                ? parseInt(e.target.value, 10)
                : undefined,
            })
          }
        >
          <option value="">Seleccione una visita</option>
          {visits.map((v) => (
            <option key={v.id} value={v.id}>
              {v.consulta?.customer?.name || "Sin nombre"} -{" "}
              {v.visitDate || "Sin fecha"}
            </option>
          ))}
        </select>
      </div>

      {/* Input Group 3 */}
      <div>
        <label className="text-[10px] font-bold uppercase text-slate-400">
          Nombre del Cliente
        </label>
        <input
          className="w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-orange-500"
          value={formData.customerName || ""}
          onChange={(e) =>
            setFormData({
              ...formData,
              customerName: e.target.value,
            })
          }
        />
      </div>

      {/* Input Group 4 */}
      <div>
        <label className="text-[10px] font-bold uppercase text-slate-400">
          Fecha
        </label>
        <input
          type="date"
          className="w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-orange-500"
          value={formData.date || ""}
          onChange={(e) =>
            setFormData({
              ...formData,
              date: e.target.value,
            })
          }
        />
      </div>
      {/* Input Group 5 */}
      <div>
        <label className="text-[10px] font-bold uppercase text-slate-400">
          Monto
        </label>
        <input
          className="w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-orange-500"
          value={formData.amount || ""}
          onChange={(e) =>
            setFormData({
              ...formData,
              amount: e.target.value ? parseInt(e.target.value, 10) : undefined,
            })
          }
        />
      </div>
      {/* Input Group 6 */}
      <div>
        <label className="text-[10px] font-bold uppercase text-slate-400">
          Formulario de Aceptación
        </label>
        <input
          className="w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-orange-500"
          value={formData.acceptanceForm || ""}
          onChange={(e) =>
            setFormData({
              ...formData,
              acceptanceForm: e.target.value,
            })
          }
        />
      </div>

      {/* Input Group 7 */}
      <div>
        <label className="text-[10px] font-bold uppercase text-slate-400">
          Observaciones
        </label>
        <input
          className="w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-orange-500"
          value={formData.observations || ""}
          onChange={(e) =>
            setFormData({
              ...formData,
              observations: e.target.value,
            })
          }
        />
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          className="flex-1 bg-orange-500 text-white font-bold py-3 rounded-xl hover:bg-orange-600 transition"
        >
          {initialData ? "Guardar Cambios" : "Crear Presupuesto"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-slate-200 text-slate-700 font-bold py-3 rounded-xl hover:bg-slate-300 transition"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
