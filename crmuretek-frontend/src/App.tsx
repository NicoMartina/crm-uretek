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

// 1. Updated Map to handle your specific Enums
const STATUS_MAP: Record<string, { label: string; color: string }> = {
  QUOTED: { label: "Presupuestado", color: "bg-orange-100 text-orange-700" },
  IN_PROGRESS: { label: "En Obra", color: "bg-amber-100 text-amber-700" },
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
      console.error("Error:", error);
    }
  };

  const handleUpdateStatus = async (jobId: number, newStatus: string) => {
    try {
      await axios.patch(
        `http://localhost:8080/api/jobs/${jobId}/status`,
        newStatus,
        {
          headers: { "Content-Type": "text/plain" },
        }
      );
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

  const handleCreateJob = async (formData: any) => {
    try {
      await axios.post("http://localhost:8080/api/jobs", {
        ...formData,
        customer: { id: selectedLead.id },
        jobStatus: "QUOTED", // Default status when creating from a lead
      });
      setSelectedLead(null);
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- LOGIC ---
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
        <h1 className="text-4xl font-black text-slate-800">
          Uretek <span className="text-orange-600">Argentina</span>
        </h1>
        <p className="text-slate-500 font-medium">Administración de Obras</p>
      </header>

      {/* --- STATS --- */}
      <section className="max-w-5xl mx-auto mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border-b-4 border-orange-500">
          <span className="text-slate-400 text-xs font-bold uppercase">
            Presupuestado
          </span>
          <h3 className="text-3xl font-black">
            ${totalQuoted.toLocaleString()}
          </h3>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border-b-4 border-emerald-500">
          <span className="text-slate-400 text-xs font-bold uppercase">
            En Obra
          </span>
          <h3 className="text-3xl font-black">
            ${totalActive.toLocaleString()}
          </h3>
        </div>
        <div className="bg-orange-600 p-6 rounded-2xl shadow-md text-white flex flex-col justify-center">
          <span className="text-orange-100 text-xs font-bold uppercase">
            Visitas
          </span>
          <h3 className="text-2xl font-black">
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
            placeholder="Buscar..."
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-orange-500"
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
          <Archive size={20} />{" "}
          {showArchived ? "Viendo Historial" : "Ver Archivados"}
        </button>
      </div>

      <div className="max-w-5xl mx-auto">
        <LeadForm onRefresh={fetchData} />

        {/* --- LEADS --- */}
        {!showArchived && (
          <section className="mb-12 mt-10">
            <h2 className="text-xl font-bold text-slate-700 mb-6 flex items-center gap-2">
              <UserPlus className="text-orange-500" size={20} /> Prospectos (
              {filteredLeads.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {filteredLeads.map((lead) => (
                <div
                  key={lead.id}
                  className="bg-white border-t-4 border-orange-500 p-5 rounded-2xl shadow-sm"
                >
                  <div className="mb-4">
                    <p className="font-bold text-lg">{lead.name}</p>
                    <a
                      href={`tel:${lead.phoneNumber}`}
                      className="text-slate-500 text-sm flex items-center gap-2 hover:text-orange-600 transition-colors"
                    >
                      <Phone size={14} /> {lead.phoneNumber || "Sin teléfono"}
                    </a>
                    {lead.visitDate && (
                      <div className="mt-2">
                        <p className="text-xs font-bold text-orange-600 bg-orange-50 p-1 rounded inline-block">
                          📅 Visita: {lead.visitDate}
                        </p>
                        <button
                          onClick={() => handleConvertVisit(lead)}
                          className="w-full mt-3 bg-emerald-600 text-white py-2 rounded-lg font-bold text-sm"
                        >
                          🏁 Finalizar Visita
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 border-t pt-4">
                    <div className="flex gap-2">
                      <a
                        href={`https://wa.me/${lead.phoneNumber?.replace(
                          /\D/g,
                          ""
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 bg-emerald-500 text-white py-2 rounded-lg font-bold text-sm flex items-center justify-center gap-2"
                      >
                        WhatsApp
                      </a>
                      <div className="flex gap-1 flex-1">
                        <input
                          type="date"
                          id={`date-${lead.id}`}
                          className="text-xs border p-2 rounded-lg flex-1 min-w-0"
                        />
                        <button
                          onClick={() =>
                            handleScheduleVisit(
                              lead,
                              (
                                document.getElementById(
                                  `date-${lead.id}`
                                ) as HTMLInputElement
                              ).value
                            )
                          }
                          className="bg-slate-800 text-white p-2 rounded-lg"
                        >
                          <Calendar size={16} />
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedLead(lead)}
                      className="w-full bg-orange-600 text-white py-2 rounded-lg font-bold text-sm flex items-center justify-center gap-1"
                    >
                      <Plus size={16} /> Crear Trabajo
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* --- PROJECTS --- */}
        <h2 className="text-xl font-bold text-slate-700 mb-6 flex items-center gap-2">
          <Briefcase className="text-orange-500" size={20} />{" "}
          {showArchived ? "Finalizadas" : "Activos"}
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
                    <h3 className="font-bold text-xl">Obra #{job.id}</h3>
                    <p className="text-sm font-semibold text-orange-600 uppercase">
                      {job.customerName}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {/* DROPDOWN STATUS UPDATE */}
                  <select
                    value={job.jobStatus}
                    onChange={(e) => handleUpdateStatus(job.id, e.target.value)}
                    className={`px-3 py-1 rounded-full text-xs font-black uppercase outline-none cursor-pointer border-none shadow-sm ${
                      STATUS_MAP[job.jobStatus]?.color || "bg-slate-100"
                    }`}
                  >
                    <option value="QUOTED">Presupuestado</option>
                    <option value="IN_PROGRESS">En Obra</option>
                    <option value="COMPLETED">Finalizado</option>
                  </select>
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
                    Precio
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
                    Fecha
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
