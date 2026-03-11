import React, { useState, useEffect } from "react";

interface customerFormProps {
  initialData?: any;
  onCancel: () => void;
  onSubmit: (formData: any) => Promise<void>; // Add this line
  // If you have onRefresh, you can keep it or remove it if we use onSubmit
  onRefresh: () => Promise<void> | void;
}

export default function CustomerForm({
  initialData,
  onRefresh,
  onSubmit,
  onCancel,
}: customerFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    phoneNumber: initialData?.phoneNumber || "",
    email: initialData?.email || "",
    address: initialData?.address || "",
    title: initialData?.title || "",
    source: initialData?.source || "WHATSAPP",
    contactChannel: initialData?.contactChannel || "",
    contactDate:
      initialData?.contactDate || new Date().toISOString().split("T")[0],
    observations: initialData?.observations || "", // Default to today's date
  });

  // When the component opens, if we have initialData, fill the form
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // We call the function passed down from App.tsx
      await onSubmit(formData);

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
          Nombre
        </label>
        <input
          className="w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-orange-500"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </div>

      {/* Input Group 2 */}
      <div>
        <label className="text-[10px] font-bold uppercase text-slate-400">
          Teléfono
        </label>
        <input
          className="w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-orange-500"
          value={formData.phoneNumber}
          onChange={(e) =>
            setFormData({ ...formData, phoneNumber: e.target.value })
          }
        />
      </div>
      {/* Input Group 3 */}
      <div>
        <label className="text-[10px] font-bold uppercase text-slate-400">
          Email
        </label>
        <input
          className="w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-orange-500"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
      </div>
      {/* Input Group 4 */}
      <div>
        <label className="text-[10px] font-bold uppercase text-slate-400">
          Direccion
        </label>
        <input
          className="w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-orange-500"
          value={formData.address}
          onChange={(e) =>
            setFormData({ ...formData, address: e.target.value })
          }
        />
      </div>
      {/* Input Group 5 */}
      <div>
        <label className="text-[10px] font-bold uppercase text-slate-400">
          Titulo del Cliente
        </label>
        <input
          className="w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-orange-500"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
      </div>
      {/* Input Group 6 - Production Grade Select */}
      <div>
        <label className="text-[10px] font-bold uppercase text-slate-400">
          Como nos conocio
        </label>
        <select
          className="w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-orange-500 bg-white"
          value={formData.source}
          onChange={(e) => setFormData({ ...formData, source: e.target.value })}
        >
          <option value="">Seleccione una opción</option>
          <option value="GOOGLE">Google</option>
          <option value="PAGINA_WEB">Pagina Web</option>
          <option value="REDES_SOCIALES">Redes Sociales</option>
          <option value="LINKEDIN">LinkedIn</option>
          <option value="RECOMENDACION">Recomendacion</option>
          <option value="TRABAJO_ANTERIOR">Trabajo Anterior</option>
          <option value="CONSULTA_ANTERIOR">Consulta Anterior</option>
          <option value="CAMION">Camion</option>
          <option value="OFICINA">Oficina</option>
          <option value="BATEV">BATEV</option>
          <option value="OTRO">Otro</option>
        </select>
      </div>
      {/* Input Group 7 */}
      <div>
        <label className="text-[10px] font-bold uppercase text-slate-400">
          Como se contacto
        </label>
        <select
          className="w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-orange-500 bg-white"
          value={formData.contactChannel}
          onChange={(e) =>
            setFormData({ ...formData, contactChannel: e.target.value })
          }
        >
          <option value="">Seleccione una opción</option>
          <option value={"WHATSAPP"}>WhatsApp</option>
          <option value={"GOOGLE"}>Google</option>
          <option value={"PAGINA_WEB"}>Sitio Web</option>
          <option value={"REDES_SOCIALES"}>Redes Sociales</option>
          <option value={"EMAIL"}>Email</option>
          <option value={"TECNICO"}>Tecnico</option>
          <option value={"TELEFONO"}>Llamada</option>
          <option value={"RECOMENDACION"}>Recomendacion</option>
          <option value={"OTRO"}>Trabajo Previo</option>
        </select>
      </div>
      {/* Input Group 8 */}
      <div>
        <label className="text-[10px] font-bold uppercase text-slate-400">
          Fecha de Contacto
        </label>
        <input
          className="w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-orange-500"
          value={formData.contactDate}
          onChange={(e) =>
            setFormData({ ...formData, contactDate: e.target.value })
          }
        />
      </div>
      <div className="md:col-span-2">
        <label className="text-[10px] font-bold uppercase text-slate-400">
          Observaciones
        </label>
        <textarea
          className="w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-orange-500"
          value={formData.observations}
          onChange={(e) =>
            setFormData({ ...formData, observations: e.target.value })
          }
          rows={3}
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
