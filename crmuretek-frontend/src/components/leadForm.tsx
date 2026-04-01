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
  onRefresh,
  onSubmit,
  onCancel,
}: LeadFormProps) {
  const [formData, setFormData] = useState({
    customerId: initialData?.customer?.id || initialData?.customerId || "",
    problemDescription: initialData?.problemDescription || "", // Default to today's date
    // Customer fields for edit mode
    name: initialData?.customer?.name || "",
    phoneNumber: initialData?.customer?.phoneNumber || "",
    email: initialData?.customer?.email || "",
    address: initialData?.customer?.address || "",
    contactChannel: initialData?.customer?.contactChannel || "",
    source: initialData?.customer?.source || "",
    title: initialData?.customer?.title || "",
    contactDate: initialData?.customer?.contactDate || "", // Default to today's date
    observations: initialData?.customer?.observations || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (initialData?.id) {
        // Edit mode - send both customer and consulta data
        await onSubmit({
          problemDescription: formData.problemDescription,
          customer: {
            id: initialData.customer.id,
            name: formData.name,
            phoneNumber: formData.phoneNumber,
            email: formData.email,
            address: formData.address,
            contactChannel: formData.contactChannel || null,
            source: formData.source || null,
            title: formData.title || null,
            contactDate: formData.contactDate,
            observations: formData.observations,
          },
        });
      } else {
        // Create mode - just link existing customer
        await onSubmit({
          problemDescription: formData.problemDescription,
          customer: {
            name: formData.name,
            phone: formData.phoneNumber,
            email: formData.email || null,
            address: formData.address || null,
            contactChannel: formData.contactChannel || null,
            source: formData.source || null,
            title: formData.title || null,
            contactDate: formData.contactDate,
            observations: formData.observations || null,
          },
        });
      }
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
      {initialData?.id ? (
        // EDIT MODE - show customer fields
        <>
          <div>
            <label className="text-[10px] font-bold uppercase text-slate-400">
              Nombre
            </label>
            <input
              className="w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-orange-500"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>
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
          <div>
            <label className="text-[10px] font-bold uppercase text-slate-400">
              Email
            </label>
            <input
              className="w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-orange-500"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase text-slate-400">
              Dirección
            </label>
            <input
              className="w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-orange-500"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
            />
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase text-slate-400">
              Título
            </label>
            <select
              className="w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-orange-500 bg-white"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            >
              <option value="">Seleccione una opción</option>
              <option value="DUENO">Dueño</option>
              <option value="ARQUITECTO">Arquitecto</option>
              <option value="INGENIERO">Ingeniero</option>
              <option value="OTRO">Otro</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase text-slate-400">
              Canal de Contacto
            </label>
            <select
              className="w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-orange-500 bg-white"
              value={formData.contactChannel}
              onChange={(e) =>
                setFormData({ ...formData, contactChannel: e.target.value })
              }
            >
              <option value="">Seleccione una opción</option>
              <option value="WHATSAPP">WhatsApp</option>
              <option value="TELEFONO">Teléfono</option>
              <option value="EMAIL">Email</option>
              <option value="PAGINA_WEB">Página Web</option>
              <option value="REDES">Redes Sociales</option>
              <option value="TECNICO">Técnico</option>
              <option value="OTRO">Otro</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase text-slate-400">
              ¿Cómo nos conoció?
            </label>
            <select
              className="w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-orange-500 bg-white"
              value={formData.source}
              onChange={(e) =>
                setFormData({ ...formData, source: e.target.value })
              }
            >
              <option value="">Seleccione una opción</option>
              <option value="GOOGLE">Google</option>
              <option value="REDES_SOCIALES">Redes Sociales</option>
              <option value="LINKEDIN">LinkedIn</option>
              <option value="RECOMENDACION">Recomendación</option>
              <option value="TRABAJO_ANTERIOR">Trabajo Anterior</option>
              <option value="CONSULTA_ANTERIOR">Consulta Anterior</option>
              <option value="CAMION">Camión</option>
              <option value="OFICINA">Oficina</option>
              <option value="BATEV">BATEV</option>
              <option value="OTRO">Otro</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase text-slate-400">
              Fecha de Contacto
            </label>
            <input
              type="date"
              className="w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-orange-500"
              value={formData.contactDate}
              onChange={(e) =>
                setFormData({ ...formData, contactDate: e.target.value })
              }
            />
          </div>
          <div className="md:col-span-2">
            <label className="text-[10px] font-bold uppercase text-slate-400">
              Observaciones del Cliente
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
        </>
      ) : (
        // CREATE MODE - show customer dropdown
        <>
          <div>
            <label className="text-[10px] font-bold uppercase text-slate-400">
              Nombre
            </label>
            <input
              className="w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-orange-500"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>
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
          <div>
            <label className="text-[10px] font-bold uppercase text-slate-400">
              Email
            </label>
            <input
              className="w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-orange-500"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase text-slate-400">
              Dirección
            </label>
            <input
              className="w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-orange-500"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
            />
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase text-slate-400">
              Título
            </label>
            <select
              className="w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-orange-500 bg-white"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            >
              <option value="">Seleccione una opción</option>
              <option value="DUENO">Dueño</option>
              <option value="ARQUITECTO">Arquitecto</option>
              <option value="INGENIERO">Ingeniero</option>
              <option value="OTRO">Otro</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase text-slate-400">
              Canal de Contacto
            </label>
            <select
              className="w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-orange-500 bg-white"
              value={formData.contactChannel}
              onChange={(e) =>
                setFormData({ ...formData, contactChannel: e.target.value })
              }
            >
              <option value="">Seleccione una opción</option>
              <option value="WHATSAPP">WhatsApp</option>
              <option value="TELEFONO">Teléfono</option>
              <option value="EMAIL">Email</option>
              <option value="PAGINA_WEB">Página Web</option>
              <option value="REDES">Redes Sociales</option>
              <option value="TECNICO">Técnico</option>
              <option value="OTRO">Otro</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase text-slate-400">
              ¿Cómo nos conoció?
            </label>
            <select
              className="w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-orange-500 bg-white"
              value={formData.source}
              onChange={(e) =>
                setFormData({ ...formData, source: e.target.value })
              }
            >
              <option value="">Seleccione una opción</option>
              <option value="GOOGLE">Google</option>
              <option value="REDES_SOCIALES">Redes Sociales</option>
              <option value="LINKEDIN">LinkedIn</option>
              <option value="RECOMENDACION">Recomendación</option>
              <option value="TRABAJO_ANTERIOR">Trabajo Anterior</option>
              <option value="CONSULTA_ANTERIOR">Consulta Anterior</option>
              <option value="CAMION">Camión</option>
              <option value="OFICINA">Oficina</option>
              <option value="BATEV">BATEV</option>
              <option value="OTRO">Otro</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase text-slate-400">
              Fecha de Contacto
            </label>
            <input
              type="date"
              className="w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-orange-500"
              value={formData.contactDate}
              onChange={(e) =>
                setFormData({ ...formData, contactDate: e.target.value })
              }
            />
          </div>
          <div className="md:col-span-2">
            <label className="text-[10px] font-bold uppercase text-slate-400">
              Observaciones del Cliente
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
        </>
      )}

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
          {initialData?.id ? "Guardar Cambios" : "Crear Consulta"}
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
