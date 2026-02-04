import React, { useState, useEffect } from "react";
import axios from "axios";

interface LeadFormProps {
  onRefresh: () => void;
  initialData?: any; // If this exists, we are in "Edit Mode"
}

export default function LeadForm({ onRefresh, initialData }: LeadFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    email: "",
    address: "",
    problemDescription: "",
    source: "",
    contactChannel: "",
    contactDate: new Date().toISOString().split("T")[0],
  });

  // When the component opens, if we have initialData, fill the form
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic frontend validation before even hitting the server
    if (!formData.name.trim()) return alert("El nombre no puede estar vacío");

    try {
      if (initialData?.id) {
        await axios.put(
          `http://localhost:8080/api/customers/${initialData.id}`,
          formData
        );
        alert("✅ ¡Cambios guardados con éxito!");
      } else {
        await axios.post("http://localhost:8080/api/customers", formData);
        alert("✅ ¡Nuevo prospecto registrado!");
      }
      onRefresh();
    } catch (error: any) {
      // If Java returns a 400 Bad Request (Validation failed)
      if (error.response?.status === 400) {
        alert("❌ Error: Datos inválidos. Revisa que el nombre esté completo.");
      } else {
        alert("❌ Ups! Algo salió mal en el servidor.");
      }
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
          required
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
          required
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
          required
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
          required
        />
      </div>
      {/* Input Group 5 */}
      <div>
        <label className="text-[10px] font-bold uppercase text-slate-400">
          Problema del Cliente
        </label>
        <input
          className="w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-orange-500"
          value={formData.problemDescription}
          onChange={(e) =>
            setFormData({ ...formData, problemDescription: e.target.value })
          }
          required
        />
      </div>
      {/* Input Group 6 */}
      <div>
        <label className="text-[10px] font-bold uppercase text-slate-400">
          Como nos conocio
        </label>
        <input
          className="w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-orange-500"
          value={formData.source}
          onChange={(e) => setFormData({ ...formData, source: e.target.value })}
          required
        />
      </div>
      {/* Input Group 7 */}
      <div>
        <label className="text-[10px] font-bold uppercase text-slate-400">
          Como se contacto
        </label>
        <input
          className="w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-orange-500"
          value={formData.contactChannel}
          onChange={(e) =>
            setFormData({ ...formData, contactChannel: e.target.value })
          }
          required
        />
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
          required
        />
      </div>

      <div className="md:col-span-2 pt-4">
        <button
          type="submit"
          className="w-full bg-orange-500 text-white font-bold py-3 rounded-xl hover:bg-orange-600 transition"
        >
          {initialData?.id ? "Guardar Cambios" : "Crear Prospecto"}
        </button>
      </div>
    </form>
  );
}
