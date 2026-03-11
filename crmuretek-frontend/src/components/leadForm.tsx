import React, { useState } from "react";

interface LeadFormProps {
  initialData?: any;
  customers: any[];
  onCancel: () => void;
  onSubmit: (formData: any) => Promise<void>;
  onRefresh: () => Promise<void> | void;
}

export default function LeadForm({
  initialData,
  customers,
  onRefresh,
  onSubmit,
  onCancel,
}: LeadFormProps) {
  const [formData, setFormData] = useState({
    customerId: initialData?.customer?.id || initialData?.customerId || "",
    problemDescription: initialData?.problemDescription || "", // Default to today's date
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // We call the function passed down from App.tsx
      await onSubmit({
        problemDescription: formData.problemDescription,
        customer: { id: formData.customerId },
      });
      // We tell App to refresh the list
      onRefresh();
      alert("✅ Procesado con éxito");
    } catch (error) {
      console.error("Error saving consulta:", error);
      alert("❌ Error al guardar");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 md:grid-cols-2 gap-4"
    >
      {/* Input Group 1 */}
      <div>
        <label className="text-[10px] font-bold uppercase text-slate-400">
          Cliente
        </label>
        <select
          className="w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-orange-500"
          value={formData.customerId}
          onChange={(e) =>
            setFormData({ ...formData, customerId: e.target.value })
          }
          required
        />
        <option value="">Seleccione un Cliente</option>
        {(customers || []).map((c) => (
          <option key={c.id} value={c.id}>
            {c.name} - {c.phoneNumber}
          </option>
        ))}
      </div>

      {/* Input Group 2 */}
      <div>
        <label className="text-[10px] font-bold uppercase text-slate-400">
          Problema del Cliente
        </label>
        <textarea
          className="w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-orange-500"
          value={formData.problemDescription}
          onChange={(e) =>
            setFormData({ ...formData, problemDescription: e.target.value })
          }
        />
      </div>

      <div className="md:col-span-2 pt-4 gap-3">
        <button
          type="submit"
          className="w-full bg-orange-500 text-white font-bold py-3 rounded-xl hover:bg-orange-600 transition"
        >
          {initialData?.id ? "Guardar Cambios" : "Crear Prospecto"}
        </button>
        <button
          type="button"
          onClick={onCancel} // This uses the "unused" prop
          className="w-full bg-slate-200 text-slate-700 font-bold py-3 rounded-xl hover:bg-slate-300 transition"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
