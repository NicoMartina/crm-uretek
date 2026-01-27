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
  const [activeTab, setActiveTab] = useState<"leads" | "jobs" | "stats">(
    "leads"
  );

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

  const handleScheduleVisit = async (lead: any, date: string | null) => {
    if (date === "" && date !== null)
      return alert("Selecciona una fecha primero");
    try {
      await axios.put(`http://localhost:8080/api/customers/${lead.id}`, {
        ...lead,
        visitDate: date,
      });
      fetchData();
    } catch (error) {
      console.error("Error scheduling visit:", error);
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
      setActiveTab("jobs"); // Move to jobs tab automatically
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
    <div className="min-h-screen bg-slate-50 md:flex">
      {/* --- SIDEBAR NAVIGATION --- */}
      <nav className="fixed bottom-0 left-0 w-full bg-white border-t md:relative md:w-64 md:h-screen md:border-r md:border-t-0 p-4 z-50 flex md:flex-col gap-2">
        <div className="hidden md:block mb-8 px-4">
          <h1 className="text-2xl font-black text-slate-800">
            Uretek <span className="text-orange-600">CRM</span>
          </h1>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
            Argentina
          </p>
        </div>

        <button
          onClick={() => setActiveTab("leads")}
          className={`flex-1 md:flex-none flex items-center justify-center md:justify-start gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
            activeTab === "leads"
              ? "bg-orange-600 text-white shadow-lg shadow-orange-200"
              : "text-slate-500 hover:bg-slate-100"
          }`}
        >
          <UserPlus size={20} />{" "}
          <span className="hidden md:block">Prospectos</span>
        </button>

        <button
          onClick={() => setActiveTab("jobs")}
          className={`flex-1 md:flex-none flex items-center justify-center md:justify-start gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
            activeTab === "jobs"
              ? "bg-orange-600 text-white shadow-lg shadow-orange-200"
              : "text-slate-500 hover:bg-slate-100"
          }`}
        >
          <Briefcase size={20} /> <span className="hidden md:block">Obras</span>
        </button>
      </nav>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 p-4 md:p-10 pb-24 md:pb-10 overflow-y-auto">
        {/* Modal Logic */}
        {selectedLead && (
          <QuoteForm
            lead={selectedLead}
            onCancel={() => setSelectedLead(null)}
            onCreate={handleCreateJob}
          />
        )}

        <header className="max-w-5xl mx-auto mb-10 flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-black text-slate-800">
              {activeTab === "leads"
                ? "Gestión de Prospectos"
                : "Panel de Obras"}
            </h2>
            <p className="text-slate-500 font-medium">
              Uretek Argentina Workflow
            </p>
          </div>
          <div className="hidden md:block text-right">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">
              Estado de Sistema
            </p>
            <span className="flex items-center gap-2 text-emerald-500 font-bold text-sm">
              ● Online
            </span>
          </div>
        </header>

        {/* --- DYNAMIC VIEW: LEADS --- */}
        {activeTab === "leads" && (
          <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Lead Stats */}
            <div className="bg-orange-600 p-6 rounded-2xl shadow-md text-white inline-block w-full md:w-auto min-w-[300px]">
              <span className="text-orange-100 text-xs font-bold uppercase">
                Visitas Pendientes
              </span>
              <h3 className="text-2xl font-black mt-1">
                {upcomingVisits.length} para esta semana
              </h3>
            </div>

            <LeadForm onRefresh={fetchData} />

            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Buscar prospecto..."
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 shadow-sm focus:ring-2 focus:ring-orange-500 outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredLeads.map((lead) => (
                <div
                  key={lead.id}
                  className="bg-white border-t-4 border-orange-500 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all"
                >
                  <div className="mb-4">
                    <p className="font-bold text-lg text-slate-800">
                      {lead.name}
                    </p>
                    <a
                      href={`tel:${lead.phoneNumber}`}
                      className="text-slate-500 text-sm flex items-center gap-2 hover:text-orange-600 transition-colors"
                    >
                      <Phone size={14} /> {lead.phoneNumber || "Sin teléfono"}
                    </a>
                    {lead.visitDate && (
                      <div className="mt-2 bg-orange-50 p-2 rounded-lg border border-orange-100">
                        <p className="text-xs font-bold text-orange-600 inline-block">
                          📅 Visita: {lead.visitDate}
                        </p>
                        <button
                          onClick={() => handleConvertVisit(lead)}
                          className="w-full mt-2 bg-emerald-600 text-white py-2 rounded-lg font-bold text-sm"
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
          </div>
        )}

        {/* --- DYNAMIC VIEW: JOBS --- */}
        {activeTab === "jobs" && (
          <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Money Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border-b-4 border-orange-500">
                <span className="text-slate-400 text-xs font-bold uppercase">
                  Presupuestado
                </span>
                <h3 className="text-3xl font-black text-slate-800">
                  ${totalQuoted.toLocaleString()}
                </h3>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border-b-4 border-emerald-500">
                <span className="text-slate-400 text-xs font-bold uppercase">
                  En Obra (Proyectado)
                </span>
                <h3 className="text-3xl font-black text-slate-800">
                  ${totalActive.toLocaleString()}
                </h3>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <button
                onClick={() => setShowArchived(!showArchived)}
                className={`flex items-center gap-2 px-6 py-2 rounded-xl font-bold transition-all ${
                  showArchived
                    ? "bg-orange-600 text-white"
                    : "bg-white text-slate-600 border border-slate-200"
                }`}
              >
                <Archive size={18} />{" "}
                {showArchived ? "Viendo Finalizados" : "Ver Archivados"}
              </button>
            </div>

            <div className="grid gap-6">
              {filteredJobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:border-orange-200 transition-colors"
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
                          STATUS_MAP[job.jobStatus]?.color || "bg-slate-100"
                        }`}
                      >
                        {STATUS_MAP[job.jobStatus]?.label || job.jobStatus}
                      </span>
                      <button
                        onClick={() => handleDeleteJob(job.id)}
                        className="text-slate-300 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 border-t pt-6">
                    <div className="flex flex-col">
                      <span className="text-slate-400 text-xs font-bold uppercase mb-1">
                        Total
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
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
