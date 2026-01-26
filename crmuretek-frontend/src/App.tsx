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
} from "lucide-react";
import LeadForm from "./components/leadForm";
import { QuoteForm } from "./components/QuoteForm";

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  QUOTED: { label: "Presupuestado", color: "bg-orange-100 text-orange-700" },
  PENDIENTE: { label: "Pendiente", color: "bg-amber-100 text-amber-700" },
  COMPLETED: { label: "Finalizado", color: "bg-green-100 text-green-700" },
};

function App() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [selectedLead, setSelectedLead] = useState<any | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showArchived, setShowArchived] = useState(false);

  const fetchData = async () => {
    try {
      const jobsRes = await getJobs();
      setJobs(jobsRes);
      const custRes = await axios.get("http://localhost:8080/api/customers");
      const newLeads = custRes.data.filter(
        (c: any) => !c.jobs || c.jobs.length === 0
      );
      setLeads(newLeads);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleScheduleVisit = async (lead: any, date: string) => {
    if (!date) return alert("Selecciona una fecha primero");
    try {
      // Logic: Update the customer with the new visit date
      await axios.put(`http://localhost:8080/api/customers/${lead.id}`, {
        ...lead,
        visitDate: date,
      });
      fetchData();
      alert(`Visita programada con ${lead.name} para el ${date}`);
    } catch (error) {
      console.error("Error scheduling visit:", error);
      alert("Error al programar visita. ¿Tienes el @PutMapping en Java?");
    }
  };

  const handleDeleteJob = async (id: number) => {
    if (window.confirm("¿Eliminar solo este trabajo?")) {
      await axios.delete(`http://localhost:8080/api/jobs/${id}`);
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
      setSelectedLead(null);
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  const handleConvertVisit = (lead: any) => {
    // 1. We select the lead to open the form
    setSelectedLead(lead);

    // 2. We "clean" the visit date since it's done
    handleScheduleVisit(lead, null as any);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- STATS CALCULATIONS ---
  const totalQuoted = jobs
    .filter((j) => j.jobStatus === "QUOTED")
    .reduce((sum, j) => sum + (j.totalAmount || 0), 0);

  const totalActive = jobs
    .filter((j) => j.jobStatus === "PENDIENTE")
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

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-10 text-slate-900 font-sans">
      {selectedLead && (
        <QuoteForm
          lead={selectedLead}
          onCancel={() => setSelectedLead(null)}
          onCreate={handleCreateJob}
        />
      )}

      <header className="max-w-5xl mx-auto mb-10">
        <h1 className="text-4xl font-black tracking-tight text-slate-800">
          Uretek <span className="text-orange-600">Argentina</span>
        </h1>
        <p className="text-slate-500 font-medium tracking-wide">
          Administración de Obras
        </p>
      </header>

      {/* --- STATS CARDS --- */}
      <section className="max-w-5xl mx-auto mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border-b-4 border-orange-500">
          <span className="text-slate-400 text-xs font-bold uppercase">
            Presupuestado
          </span>
          <h3 className="text-3xl font-black text-slate-800 mt-1">
            ${totalQuoted.toLocaleString()}
          </h3>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border-b-4 border-emerald-500">
          <span className="text-slate-400 text-xs font-bold uppercase">
            Proyectado
          </span>
          <h3 className="text-3xl font-black text-slate-800 mt-1">
            ${totalActive.toLocaleString()}
          </h3>
        </div>
        <div className="bg-orange-600 p-6 rounded-2xl shadow-md text-white flex flex-col justify-center">
          <span className="text-orange-100 text-xs font-bold uppercase">
            Visitas Pendientes
          </span>
          <h3 className="text-2xl font-black mt-1">
            {upcomingVisits.length} para esta semana
          </h3>
        </div>
      </section>

      {/* --- TOOLBAR --- */}
      <div className="max-w-5xl mx-auto mb-8 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Buscar por nombre..."
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 shadow-sm outline-none focus:ring-2 focus:ring-orange-500 bg-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button
          onClick={() => setShowArchived(!showArchived)}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all shadow-sm ${
            showArchived
              ? "bg-orange-600 text-white"
              : "bg-white text-slate-600 border border-slate-200"
          }`}
        >
          <Archive size={20} />
          {showArchived ? "Viendo Historial" : "Ver Archivados"}
        </button>
      </div>

      <div className="max-w-5xl mx-auto">
        <LeadForm onRefresh={fetchData} />

        {/* --- LEADS --- */}
        {!showArchived && (
          <section className="mb-12 mt-10">
            <h2 className="text-xl font-bold text-slate-700 mb-6 flex items-center gap-2">
              <UserPlus className="text-orange-500" size={20} />
              Prospectos ({filteredLeads.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {filteredLeads.map((lead) => (
                <div
                  key={lead.id}
                  className="bg-white border-t-4 border-orange-500 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all"
                >
                  <div className="mb-4">
                    <p className="font-bold text-lg text-slate-800">
                      {lead.name}
                    </p>
                    <p className="text-slate-500 text-sm flex items-center gap-2">
                      <Phone size={14} className="text-slate-400" />
                      {lead.phoneNumber || "Sin teléfono"}
                    </p>
                    {lead.visitDate && (
                      <p className="mt-2 text-xs font-bold text-orange-600 bg-orange-50 p-1 rounded inline-block">
                        📅 Visita: {lead.visitDate}
                      </p>
                    )}
                    <button
                      onClick={() => handleConvertVisit(lead)}
                      className="w-full mt-2 bg-emerald-600 text-white py-2 rounded-lg font-bold text-sm hover:bg-emerald-700 transition-colors flex items-center justify-center gap-1"
                    >
                      🏁 Finalizar Visita y Presupuestar
                    </button>
                  </div>

                  {/* Visit Scheduler Row */}
                  <div className="flex flex-col gap-2 border-t pt-4">
                    <div className="flex gap-1">
                      <input
                        type="date"
                        id={`date-${lead.id}`}
                        className="text-xs border p-2 rounded-lg flex-1 outline-none focus:ring-1 focus:ring-orange-500"
                      />
                      <button
                        onClick={() => {
                          const val = (
                            document.getElementById(
                              `date-${lead.id}`
                            ) as HTMLInputElement
                          ).value;
                          handleScheduleVisit(lead, val);
                        }}
                        className="bg-slate-800 text-white p-2 rounded-lg hover:bg-black transition-colors"
                      >
                        <Calendar size={16} />
                      </button>
                    </div>
                    <button
                      onClick={() => setSelectedLead(lead)}
                      className="w-full bg-orange-600 text-white py-2 rounded-lg font-bold text-sm hover:bg-orange-700 transition-colors flex items-center justify-center gap-1"
                    >
                      <Plus size={16} /> Crear Trabajo
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* --- ACTIVE PROJECTS --- */}
        <h2 className="text-xl font-bold text-slate-700 mb-6 flex items-center gap-2">
          <Briefcase className="text-orange-500" size={20} />
          {showArchived ? "Obras Finalizadas" : "Proyectos Activos"} (
          {filteredJobs.length})
        </h2>

        <main className="grid gap-6">
          {filteredJobs.map((job) => (
            <div
              key={job.id}
              className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className="bg-orange-100 p-3 rounded-xl text-orange-600">
                    <Briefcase size={28} />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-slate-800">
                      Obra #{job.id}
                    </h3>
                    <p className="text-sm font-semibold text-orange-600 uppercase">
                      {job.customerName}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`px-4 py-1 rounded-full text-xs font-black uppercase ${
                      STATUS_MAP[job.jobStatus]?.color ||
                      "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {STATUS_MAP[job.jobStatus]?.label || job.jobStatus}
                  </span>
                  <button
                    onClick={() => handleDeleteJob(job.id)}
                    className="text-slate-300 hover:text-red-500 p-1"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 border-t border-slate-50 pt-6">
                <div className="flex flex-col">
                  <span className="text-slate-400 text-xs font-bold uppercase mb-1">
                    Precio Total
                  </span>
                  <span className="text-2xl font-black text-slate-800">
                    ${job.totalAmount?.toLocaleString()}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-slate-400 text-xs font-bold uppercase mb-1">
                    Material
                  </span>
                  <span className="text-2xl font-black text-slate-700">
                    {job.estimateMaterialKg} kg
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-slate-400 text-xs font-bold uppercase mb-1">
                    Fecha de Obra
                  </span>
                  <span className="text-xl font-bold text-slate-800">
                    {job.workDate || "Pendiente"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </main>
      </div>
    </div>
  );
}

export default App;
