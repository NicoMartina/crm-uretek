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

  // --- NEW DASHBOARD STATE ---
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

  const handleDeleteJob = async (id: number) => {
    if (
      window.confirm(
        "¿Eliminar solo este trabajo? El cliente seguirá existiendo."
      )
    ) {
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

  useEffect(() => {
    fetchData();
  }, []);

  // --- FILTERING LOGIC (Must be before the return!) ---
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

      <header className="max-w-5xl mx-auto mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-slate-800">
            Uretek <span className="text-orange-600">Argentina</span>
          </h1>
          <p className="text-slate-500 font-medium">Panel de Control</p>
        </div>
      </header>

      {/* --- DASHBOARD TOOLBAR --- */}
      <div className="max-w-5xl mx-auto mb-8 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Buscar por nombre de cliente..."
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
              : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          <Archive size={20} />
          {showArchived ? "Viendo Archivados" : "Ver Archivados"}
        </button>
      </div>

      <div className="max-w-5xl mx-auto">
        <LeadForm onRefresh={fetchData} />

        {/* --- LEADS SECTION --- */}
        {!showArchived && (
          <section className="mb-10">
            <h2 className="text-xl font-bold text-slate-700 mb-4 flex items-center gap-2">
              <UserPlus className="text-orange-500" size={20} />
              Prospectos ({filteredLeads.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {filteredLeads.map((lead) => (
                <div
                  key={lead.id}
                  className="bg-white border-l-4 border-orange-500 p-4 rounded-xl shadow-sm flex justify-between items-center"
                >
                  <div>
                    <p className="font-bold text-slate-800">{lead.name}</p>
                    <p className="text-slate-500 text-sm flex items-center gap-1">
                      <Phone size={12} />
                      {lead.phoneNumber}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedLead(lead)}
                    className="bg-orange-50 text-orange-600 px-3 py-2 rounded-lg font-bold text-sm border border-orange-100"
                  >
                    + Trabajo
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* --- JOBS SECTION --- */}
        <h2 className="text-xl font-bold text-slate-700 mb-4 flex items-center gap-2">
          <Briefcase className="text-orange-500" size={20} />
          {showArchived ? "Historial de Obras" : "Proyectos Activos"} (
          {filteredJobs.length})
        </h2>

        <main className="grid gap-6">
          {filteredJobs.map((job) => (
            <div
              key={job.id}
              className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-orange-100 p-3 rounded-lg text-orange-600">
                    <Briefcase size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Obra #{job.id}</h3>
                    <p className="text-sm text-slate-400 uppercase">
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
                  {/* DELETE JOB ONLY BUTTON */}
                  <button
                    onClick={() => handleDeleteJob(job.id)}
                    className="text-slate-300 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 border-t border-slate-50 pt-6">
                <div className="flex flex-col">
                  <span className="text-slate-400 text-xs font-bold uppercase">
                    Precio
                  </span>
                  <span className="text-xl font-bold text-slate-800">
                    ${job.totalAmount?.toLocaleString()}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-slate-400 text-xs font-bold uppercase">
                    Material
                  </span>
                  <span className="text-xl font-bold">
                    {job.estimateMaterialKg} kg
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-slate-400 text-xs font-bold uppercase">
                    Fecha
                  </span>
                  <span className="text-xl font-bold">{job.workDate}</span>
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
