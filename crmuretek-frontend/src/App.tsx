import { useEffect, useState } from "react";
import { getJobs } from "./services/api";
import axios from "axios";
import type { Job } from "./types/Job";
import {
  Briefcase,
  UserPlus,
  Phone,
  Plus,
  Trash2,
  Search,
  Archive,
  Calendar,
  LayoutDashboard,
  Package,
  Edit,
} from "lucide-react";
import LeadForm from "./components/leadForm";
import { QuoteForm } from "./components/QuoteForm";
import type { Visit } from "./types/Visit";
import type { Inventory } from "./types/Inventory";

// Change this at the top of App.tsx
const STATUS_MAP: Record<string, { label: string; color: string }> = {
  QUOTED: { label: "Presupuestado", color: "bg-orange-100 text-orange-700" },
  IN_PROGRESS: { label: "En Obra", color: "bg-amber-100 text-amber-700" }, // Changed from PENDIENTE
  COMPLETED: { label: "Finalizado", color: "bg-green-100 text-green-700" },
};

function App() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [selectedLead, setSelectedLead] = useState<any | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showArchived, setShowArchived] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "leads" | "jobs" | "visits"
  >("leads");
  const [materialTotal, setMaterialTotal] = useState<number>(0);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [schedulingVisitLead, setSchedulingVisitLead] = useState<any | null>(
    null
  );
  const [visitDate, setVisitDate] = useState("");
  const [visitNotes, setVisitNotes] = useState("");
  const [stockInStorage, setStockInStorage] = useState(1500);
  const [inventory, setInventory] = useState<Inventory | null>(null);
  const [isAddingLead, setIsAddingLead] = useState(false);
  const [viewingLead, setViewingLead] = useState<any | null>(null);
  const [editingJob, setEditingJob] = useState<any>(null);

  const fetchInventory = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/inventory");
      setInventory(response.data);
    } catch (error) {
      console.error("Error fetching inventory:", error);
    }
  };
  const fetchData = async () => {
    try {
      const jobsRes = await getJobs();
      setJobs(jobsRes);

      const custRes = await axios.get("http://localhost:8080/api/customers");
      const newLeads = custRes.data.filter(
        (c: any) => !c.jobs || c.jobs.length === 0
      );
      setLeads(newLeads);

      // --- ADD THIS PART ---
      const visitsRes = await axios.get("http://localhost:8080/api/visits");
      setVisits(visitsRes.data);
      // ---------------------

      const materialRes = await axios.get(
        "http://localhost:8080/api/jobs/stats/material-total"
      );
      setMaterialTotal(materialRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleUpdateStatus = async (jobId: number, newStatus: string) => {
    try {
      await axios.patch(`http://localhost:8080/api/jobs/${jobId}/status`, {
        status: newStatus,
      });
      fetchData();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleUpdateVisitStatus = async (
    visitId: number,
    newStatus: string
  ) => {
    try {
      await axios.patch(`http://localhost:8080/api/visits/${visitId}/status`, {
        status: newStatus,
      });
      fetchData();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleScheduleVisit = async (lead: any, date: string | null) => {
    if (date === "" && date !== null) return alert("Selecciona una fecha");
    try {
      await axios.put(`http://localhost:8080/api/customers/${lead.id}`, {
        ...lead,
        visitDate: date,
      });
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  const handleConfirmVisit = async () => {
    if (!visitDate) return alert("Por favor selecciona una fecha");

    try {
      await axios.post("http://localhost:8080/api/visits", {
        customer: { id: schedulingVisitLead.id }, // Link to the customer
        visitDate: visitDate,
        observations: visitNotes,
        status: "SCHEDULED",
      });

      setSchedulingVisitLead(null); // Close modal
      setVisitDate("");
      setVisitNotes("");
      fetchData(); // Refresh the counts
      setActiveTab("visits"); // Take dad to the visits tab to see it!
    } catch (error) {
      console.error("Error scheduling visit:", error);
    }
  };

  const handleConvertVisit = (lead: any) => {
    setSelectedLead(lead);
    handleScheduleVisit(lead, null);
  };

  const handleDeleteJob = async (id: number) => {
    if (window.confirm("¿Eliminar este trabajo?")) {
      await axios.delete(`http://localhost:8080/api/jobs/${id}`);
      fetchData();
    }
  };

  const handleDeleteVisit = async (id: number) => {
    if (window.confirm("¿Eliminar esta visita?")) {
      await axios.delete(`http://localhost:8080/api/visits/${id}`);
      fetchData();
    }
  };

  const handleCreateJob = async (formData: any) => {
    try {
      await axios.post("http://localhost:8080/api/jobs", {
        ...formData,
        customer: { id: selectedLead.id },
        jobStatus: "QUOTED",
      });

      setSelectedLead(null); // Close the modal
      fetchData(); // Refresh the lists (this removes the lead from the list!)

      // THE PRO MOVE: Switch the tab so dad sees the new job instantly
      setActiveTab("jobs");
    } catch (error) {
      console.error("Error creating job:", error);
    }
  };

  const handleAddStock = async (type: "iso" | "resina") => {
    const amount = window.prompt(
      `¿Cuántos kg de ${type.toUpperCase()} compraste?`
    );

    if (amount && !isNaN(Number(amount))) {
      try {
        // Remember your Java endpoint is /api/inventory/add-iso or /add-resina
        await axios.post(`http://localhost:8080/api/inventory/add-${type}`, {
          amount: Number(amount),
        });
        fetchInventory(); // Refresh the numbers on the screen!
      } catch (error) {
        alert("Error al cargar stock");
      }
    }
  };

  const handleDeleteLead = async (id: number) => {
    if (window.confirm("¿Seguro que quieres borrar este prospecto?")) {
      try {
        await axios.delete(`http://localhost:8080/api/customers/${id}`);
        fetchData(); // Refresh the list
      } catch (error: any) {
        if (error.response?.status == 409) {
          alert(
            "No se puede eliminar el prospecto porque tiene visitas o trabajos asociados."
          );
        } else {
          alert("Hubo un error al intentar borrar el prospecto.");
        }
      }
    }
  };

  useEffect(() => {
    fetchData();
    fetchInventory();
  }, []);

  useEffect(() => {
    setSearchTerm("");
  }, [activeTab]);

  const totalQuoted = jobs
    .filter((j) => j.jobStatus === "QUOTED")
    .reduce((sum, j) => sum + (j.totalAmount || 0), 0);
  const totalActive = jobs
    .filter((j) => j.jobStatus === "IN_PROGRESS")
    .reduce((sum, j) => sum + (j.totalAmount || 0), 0);
  const upcomingVisits = leads.filter((l) => l.visitDate != null);

  const filteredLeads = leads.filter((l) =>
    l.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredJobs = jobs.filter((j) => {
    const matchesSearch = j.customerName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const isCompleted = j.jobStatus === "COMPLETED";
    return matchesSearch && (showArchived ? isCompleted : !isCompleted);
  });

  const filteredVisits = visits.filter(
    (v) =>
      (v.status === "SCHEDULED" || v.status === "VISITED") &&
      v.customer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const maxMixFromIso = inventory?.iso_stock ? inventory.iso_stock / 0.63 : 0;
  const maxMixFromResina = inventory?.resina_stock
    ? inventory.resina_stock / 0.37
    : 0;
  const totalPossibleMix = Math.min(maxMixFromIso, maxMixFromResina);

  return (
    <div className="min-h-screen bg-slate-50 md:flex text-slate-900">
      {/* --- SIDEBAR --- */}
      <nav className="fixed bottom-0 left-0 w-full bg-white border-t md:relative md:w-64 md:h-screen md:border-r md:border-t-0 p-4 z-50 flex md:flex-col gap-2">
        <div className="hidden md:block mb-8 px-4">
          <h1 className="text-2xl font-black text-slate-800">
            Uretek <span className="">CRM</span>
          </h1>
        </div>
        <button
          onClick={() => setActiveTab("dashboard")}
          className={`flex-1 md:flex-none flex items-center justify-center md:justify-start gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
            activeTab === "dashboard"
              ? "bg-orange-400 hover:bg-orange-500 text-white shadow-lg"
              : "text-slate-500 hover:bg-slate-100"
          }`}
        >
          <LayoutDashboard size={20} />{" "}
          <span className="hidden md:block">Inicio</span>
        </button>
        <button
          onClick={() => setActiveTab("leads")}
          className={`flex-1 md:flex-none flex items-center justify-center md:justify-start gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
            activeTab === "leads"
              ? "bg-orange-400 hover:bg-orange-500 text-white shadow-lg"
              : "text-slate-500 hover:bg-slate-100"
          }`}
        >
          <UserPlus size={20} />{" "}
          <span className="hidden md:block">Prospectos</span>
        </button>

        <button
          onClick={() => setActiveTab("visits")}
          className={`flex-1 md:flex-none flex items-center justify-center md:justify-start gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
            activeTab === "visits"
              ? "bg-orange-400 hover:bg-orange-500 text-white shadow-lg"
              : "text-slate-500 hover:bg-slate-100"
          }`}
        >
          <Calendar size={20} />{" "}
          <span className="hidden md:block">Visitas</span>
        </button>

        <button
          onClick={() => setActiveTab("jobs")}
          className={`flex-1 md:flex-none flex items-center justify-center md:justify-start gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
            activeTab === "jobs"
              ? "bg-orange-400 hover:bg-orange-500 text-white shadow-lg"
              : "text-slate-500 hover:bg-slate-100"
          }`}
        >
          <Briefcase size={20} />{" "}
          <span className="hidden md:block">Trabajos</span>
        </button>
      </nav>

      {/* --- CONTENT --- */}
      <main className="flex-1 p-4 md:p-10 pb-24 md:pb-10">
        {selectedLead && (
          <QuoteForm
            lead={selectedLead}
            onCancel={() => setSelectedLead(null)}
            onCreate={handleCreateJob}
          />
        )}

        {schedulingVisitLead && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
              <h3 className="text-2xl font-black mb-2">Agendar Visita</h3>
              <p className="text-slate-500 mb-6">
                Cliente: {schedulingVisitLead.name}
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                    Fecha de Visita
                  </label>
                  <input
                    type="date"
                    className="w-full p-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
                    value={visitDate}
                    onChange={(e) => setVisitDate(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                    Observaciones
                  </label>
                  <textarea
                    className="w-full p-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-orange-500"
                    rows={3}
                    value={visitNotes}
                    onChange={(e) => setVisitNotes(e.target.value)}
                    placeholder="Ej: Revisar grietas en el garaje..."
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setSchedulingVisitLead(null)}
                    className="flex-1 py-3 font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleConfirmVisit}
                    className="flex-1 py-3 bg-orange-400 text-white font-bold rounded-xl shadow-lg shadow-orange-200 hover:bg-orange-500 transition-all"
                  >
                    Confirmar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="relative max-w-md mx-auto mb-8">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-orange-500 bg-white shadow-sm"
          />
        </div>

        {/* --- LEADS VIEW --- */}
        {activeTab === "leads" && (
          <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
            <header>
              <div>
                <h2 className="text-3xl font-black">Prospectos</h2>
                <p className="text-slate-500">
                  Gestión de nuevas visitas y clientes
                </p>
              </div>
              <button
                onClick={() => setIsAddingLead(true)}
                className="bg-orange-400 hover:bg-orange-500 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-orange-200 transition-all active:scale-95"
              >
                <Plus size={20} />
                Nuevo Prospecto
              </button>
            </header>

            {/* MODAL POPUP */}
            {isAddingLead && (
              <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                  <div className="p-8">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-black text-slate-800">
                        {selectedLead
                          ? "Editar Cliente"
                          : "Registrar Nuevo Cliente"}
                      </h2>
                      <button
                        onClick={() => {
                          setIsAddingLead(false);
                          setSelectedLead(null); // IMPORTANT: Clear selection when closing
                        }}
                        className="text-slate-400 hover:text-slate-600"
                      >
                        <Trash2 size={24} />
                      </button>
                    </div>

                    <LeadForm
                      initialData={selectedLead} // Pass the lead data if we are editing
                      onRefresh={() => {
                        fetchData();
                        setIsAddingLead(false);
                        setSelectedLead(null); // Clear selection after saving
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* VIEW LEAD DETAILS MODAL */}
            {viewingLead && (
              <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
                <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
                  <div className="p-8">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <span className="text-[10px] font-black bg-slate-100 text-slate-500 px-2 py-1 rounded-md uppercase">
                          Ficha del Cliente
                        </span>
                        <h2 className="text-3xl font-black text-slate-800 mt-2">
                          {viewingLead.name}
                        </h2>
                      </div>
                      <button
                        onClick={() => setViewingLead(null)}
                        className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                      >
                        <Plus size={24} className="rotate-45 text-slate-400" />
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-50 p-4 rounded-2xl">
                          <p className="text-[10px] font-bold text-slate-400 uppercase">
                            Teléfono
                          </p>
                          <p className="font-bold">
                            {viewingLead.phoneNumber || "---"}
                          </p>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-2xl">
                          <p className="text-[10px] font-bold text-slate-400 uppercase">
                            Email
                          </p>
                          <p className="font-bold text-sm truncate">
                            {viewingLead.email || "---"}
                          </p>
                        </div>
                      </div>

                      <div className="bg-slate-50 p-4 rounded-2xl">
                        <p className="text-[10px] font-bold text-slate-400 uppercase">
                          Dirección de Obra
                        </p>
                        <p className="font-bold">
                          {viewingLead.address || "---"}
                        </p>
                      </div>

                      <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100">
                        <p className="text-[10px] font-bold text-orange-400 uppercase">
                          Problema Reportado
                        </p>
                        <p className="text-sm font-medium text-slate-700 mt-1">
                          {viewingLead.problemDescription || "No especificado"}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase">
                            Origen
                          </p>
                          <p className="text-sm font-bold">
                            {viewingLead.source || "---"}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase">
                            Medio de Contacto
                          </p>
                          <p className="text-sm font-bold">
                            {viewingLead.contactChannel || "---"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => setViewingLead(null)}
                      className="w-full mt-8 py-4 bg-orange-400 text-white font-bold rounded-2xl hover:bg-orange-500 transition-all"
                    >
                      Cerrar
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-500">
                        Fecha
                      </th>
                      <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-500">
                        Nombre
                      </th>
                      <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-500">
                        Teléfono
                      </th>
                      <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-500 text-right">
                        Acciones Rápidas
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredLeads.map((lead) => (
                      <tr
                        key={lead.id}
                        className="hover:bg-slate-50/50 transition-colors group"
                      >
                        <td className="p-4 text-xs font-medium text-slate-400">
                          {/* If your backend doesn't have contactDate yet, we can use a placeholder */}
                          {lead.contactDate || "---"}
                        </td>
                        <td className="p-4 font-black text-slate-800">
                          {/* CLICKABLE NAME */}
                          <button
                            onClick={() => {
                              setViewingLead(lead);
                            }}
                            className="font-black text-slate-800 hover:text-orange-500 text-left transition-colors"
                          >
                            {lead.name}
                          </button>
                        </td>
                        <td className="p-4 text-slate-500 font-medium">
                          {lead.phoneNumber}
                        </td>
                        <td className="p-4">
                          <div className="flex justify-end gap-2">
                            <a
                              href={`https://wa.me/${lead.phoneNumber?.replace(
                                /\D/g,
                                ""
                              )}`}
                              target="_blank"
                              className="px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-lg font-bold text-[10px] uppercase hover:bg-emerald-200 transition-all flex items-center gap-1"
                            >
                              WhatsApp
                            </a>
                            <button
                              onClick={() => setSchedulingVisitLead(lead)}
                              className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg font-bold text-[10px] uppercase hover:bg-blue-200 transition-all flex items-center gap-1"
                            >
                              <Calendar size={12} /> Visita
                            </button>
                            <button
                              onClick={() => setSelectedLead(lead)}
                              className="px-3 py-1.5 bg-orange-100 text-orange-700 rounded-lg font-bold text-[10px] uppercase hover:bg-orange-200 transition-all"
                            >
                              + Obra
                            </button>
                            {/* NEW EDIT BUTTON */}
                            <button
                              onClick={() => {
                                setSelectedLead(lead); // Set the lead to be edited
                                setIsAddingLead(true); // Open the modal
                              }}
                              className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-all"
                              title="Editar Datos"
                            >
                              <Edit size={18} />{" "}
                              {/* Or use an Edit icon if you prefer */}
                            </button>
                            <button
                              onClick={() => handleDeleteLead(lead.id)}
                              className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                              title="Eliminar Prospecto"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* --- JOBS VIEW --- */}
        {activeTab === "jobs" && (
          <>
            <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
              <header>
                <h2 className="text-3xl font-black">Trabajos Activos</h2>
                <p className="text-slate-500">
                  Control de producción y estados
                </p>
              </header>

              {/* STATS ROW */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border-b-4 border-orange-500">
                  <span className="text-slate-400 text-xs font-bold uppercase">
                    Presupuestado
                  </span>
                  <h3 className="text-2xl font-black">
                    ${totalQuoted.toLocaleString()}
                  </h3>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border-b-4 border-emerald-500">
                  <span className="text-slate-400 text-xs font-bold uppercase">
                    En Obra
                  </span>
                  <h3 className="text-2xl font-black">
                    ${totalActive.toLocaleString()}
                  </h3>
                </div>
                <div className="bg-slate-800 p-6 rounded-2xl shadow-sm border-b-4 border-slate-500 text-white">
                  <span className="text-slate-400 text-xs font-bold uppercase">
                    Stock Necesario
                  </span>
                  <h3 className="text-2xl font-black">
                    {materialTotal.toLocaleString()} kg
                  </h3>
                </div>
              </div>

              {/* SEARCH & ARCHIVE BAR */}
              <div className="flex justify-between items-center mb-6 gap-4">
                <div className="relative flex-1">
                  <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    type="text"
                    placeholder="Buscar por cliente..."
                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <button
                  onClick={() => setShowArchived(!showArchived)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-sm transition-all whitespace-nowrap"
                >
                  {showArchived ? "Ver Activos" : "Ver Historial"}
                </button>
              </div>

              {/* NEW TABLE VIEW */}
              <div className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[600px]">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-500">
                          ID
                        </th>
                        <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-500">
                          Cliente
                        </th>
                        <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-500">
                          Estado
                        </th>
                        <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-500 text-right">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredJobs.map((job) => (
                        <tr
                          key={job.id}
                          className="hover:bg-slate-50/50 transition-colors group"
                        >
                          <td className="p-4 text-xs font-bold text-slate-400">
                            #{job.id}
                          </td>
                          <td className="p-4">
                            <div className="font-bold text-slate-800">
                              {job.customer?.name || "Sin nombre"}
                            </div>
                            <div className="text-[10px] text-slate-500">
                              {job.customer?.phoneNumber}
                            </div>
                          </td>
                          <td className="p-4">
                            <select
                              value={job.jobStatus}
                              onChange={(e) =>
                                handleUpdateStatus(job.id, e.target.value)
                              }
                              className={`text-[10px] font-black uppercase px-2 py-1 rounded-md outline-none cursor-pointer border-none ${
                                STATUS_MAP[job.jobStatus]?.color
                              }`}
                            >
                              <option value="QUOTED">Presupuestado</option>
                              <option value="IN_PROGRESS">En Obra</option>
                              <option value="COMPLETED">Finalizado</option>
                            </select>
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => setEditingJob(job)}
                                className="p-2 text-slate-400 hover:text-blue-500 transition-colors"
                              >
                                <Edit size={16} />
                              </button>
                              <button
                                onClick={() => handleDeleteJob(job.id)}
                                className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}

        {/* --- VISITS VIEW --- */}
        {activeTab === "visits" && (
          <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
            <header>
              <h2 className="text-3xl font-black">Visitas Activas</h2>
              <p className="text-slate-500">Control de Visitas y Estados</p>
            </header>

            <div className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-500">
                        Fecha
                      </th>
                      <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-500">
                        Cliente
                      </th>
                      <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-500">
                        Estado
                      </th>
                      <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-500 text-right">
                        Gestión
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredVisits.map((visit) => (
                      <tr
                        key={visit.id}
                        className="hover:bg-slate-50/50 transition-colors group"
                      >
                        <td className="p-4">
                          <div className="font-bold text-slate-800">
                            {new Date(visit.visitDate).toLocaleDateString()}
                          </div>
                          <div className="text-[10px] text-slate-400 font-bold uppercase">
                            Visita #{visit.id}
                          </div>
                        </td>
                        <td className="p-4 font-black text-slate-700">
                          {visit.customer.name}
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-2 py-1 rounded-md text-[10px] font-black uppercase ${
                              visit.status === "VISITED"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-orange-100 text-orange-700"
                            }`}
                          >
                            {visit.status}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex justify-end gap-2">
                            {visit.status === "SCHEDULED" && (
                              <button
                                onClick={() =>
                                  handleUpdateVisitStatus(visit.id, "VISITED")
                                }
                                className="px-3 py-1.5 bg-blue-600 text-white rounded-lg font-bold text-[10px] uppercase hover:bg-blue-700 transition-all"
                              >
                                Marcar Visitado
                              </button>
                            )}
                            <button
                              onClick={() => setSelectedLead(visit.customer)}
                              className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg font-bold text-[10px] uppercase hover:bg-emerald-700 transition-all flex items-center gap-1"
                            >
                              <Briefcase size={12} /> Convertir
                            </button>
                            <button
                              onClick={() => handleDeleteVisit(visit.id)}
                              className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
        {/* --- DASHBOARD VIEW --- */}
        {activeTab === "dashboard" && (
          <div className="bg-slate-900 p-8 rounded-[2rem] shadow-xl text-white col-span-1 md:col-span-2 border-b-8 border-orange-500">
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="text-slate-400 text-xs font-black uppercase tracking-[0.2em]">
                  Capacidad de Obra Total
                </span>
                <h3 className="text-5xl font-black mt-2 leading-none">
                  {Math.floor(totalPossibleMix).toLocaleString()}{" "}
                  <span className="text-xl text-slate-500 uppercase">kg</span>
                </h3>
              </div>
              <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-sm">
                <Package size={32} className="text-orange-500" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/10">
              <div>
                <p className="text-slate-500 text-xs font-bold uppercase mb-1">
                  Stock ISO (63%)
                </p>
                <p className="text-xl font-black text-blue-400">
                  {inventory?.iso_stock.toLocaleString()} kg
                </p>
              </div>
              <div>
                <p className="text-slate-500 text-xs font-bold uppercase mb-1">
                  Stock Resina (37%)
                </p>
                <p className="text-xl font-black text-emerald-400">
                  {inventory?.resina_stock.toLocaleString()} kg
                </p>
              </div>
            </div>
            <div className="mt-8 flex gap-4 border-t border-white/10 pt-6">
              <button
                onClick={() => handleAddStock("iso")}
                className="flex-1 bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 py-3 rounded-2xl font-bold text-sm transition-all border border-blue-500/30"
              >
                + Cargar ISO
              </button>
              <button
                onClick={() => handleAddStock("resina")}
                className="flex-1 bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-400 py-3 rounded-2xl font-bold text-sm transition-all border border-emerald-500/30"
              >
                + Cargar RESINA
              </button>
            </div>
          </div>
        )}
        {editingJob && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[200] p-4">
            <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md">
              <h2 className="text-xl font-bold mb-4 text-slate-800">
                Editar Trabajo
              </h2>

              <div className="space-y-4">
                {/* Observations Field */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                    Observaciones
                  </label>
                  <textarea
                    className="w-full border rounded-lg p-2 h-24 focus:ring-2 focus:ring-blue-500 outline-none"
                    value={editingJob.observations || ""}
                    onChange={(e) =>
                      setEditingJob({
                        ...editingJob,
                        observations: e.target.value,
                      })
                    }
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase">
                        Kg Estimados
                      </label>
                      <input
                        type="number"
                        className="w-full border rounded-lg p-2"
                        value={editingJob.estimateMaterialKg || ""}
                        onChange={(e) =>
                          setEditingJob({
                            ...editingJob,
                            estimateMaterialKg: Number(e.target.value),
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase">
                        Precio por Kg
                      </label>
                      <input
                        type="number"
                        className="w-full border rounded-lg p-2"
                        value={editingJob.pricePerKilo || ""}
                        onChange={(e) =>
                          setEditingJob({
                            ...editingJob,
                            pricePerKilo: Number(e.target.value),
                          })
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => setEditingJob(null)}
                    className="flex-1 py-2 bg-slate-100 text-slate-600 rounded-lg font-semibold"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={async () => {
                      try {
                        // We use editingJob.id directly here
                        await axios.put(
                          `http://localhost:8080/api/jobs/${editingJob.id}`,
                          editingJob
                        );
                        setEditingJob(null);
                        fetchData();
                        alert("✅ Guardado con éxito");
                      } catch (err) {
                        console.error(err);
                        alert(
                          "❌ Error: No se pudo guardar. Revisa la consola."
                        );
                      }
                    }}
                    className="flex-1 py-2 bg-orange-400 hover:bg-orange-500 text-white rounded-lg font-semibold"
                  >
                    Guardar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
