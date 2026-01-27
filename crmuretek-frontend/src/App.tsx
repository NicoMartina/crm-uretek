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
  IN_PROGRESS: { label: "En Obra", color: "bg-amber-100 text-amber-700" },
  COMPLETED: { label: "Finalizado", color: "bg-green-100 text-green-700" },
};

function App() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [selectedLead, setSelectedLead] = useState<any | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showArchived, setShowArchived] = useState(false);
  const [activeTab, setActiveTab] = useState<"leads" | "jobs">("leads");
  const [materialTotal, setMaterialTotal] = useState<number>(0);

  const fetchData = async () => {
    try {
      const jobsRes = await getJobs();
      setJobs(jobsRes);
      const custRes = await axios.get("http://localhost:8080/api/customers");
      const newLeads = custRes.data.filter(
        (c: any) => !c.jobs || c.jobs.length === 0
      );
      setLeads(newLeads);

      // Fetch the new Java Query data
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

  useEffect(() => {
    fetchData();
  }, []);

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
    <div className="min-h-screen bg-slate-50 md:flex text-slate-900">
      {/* --- SIDEBAR --- */}
      <nav className="fixed bottom-0 left-0 w-full bg-white border-t md:relative md:w-64 md:h-screen md:border-r md:border-t-0 p-4 z-50 flex md:flex-col gap-2">
        <div className="hidden md:block mb-8 px-4">
          <h1 className="text-2xl font-black text-slate-800">
            Uretek <span className="text-orange-600">CRM</span>
          </h1>
        </div>

        <button
          onClick={() => setActiveTab("leads")}
          className={`flex-1 md:flex-none flex items-center justify-center md:justify-start gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
            activeTab === "leads"
              ? "bg-orange-600 text-white shadow-lg"
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
              ? "bg-orange-600 text-white shadow-lg"
              : "text-slate-500 hover:bg-slate-100"
          }`}
        >
          <Briefcase size={20} /> <span className="hidden md:block">Obras</span>
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

        {/* --- LEADS VIEW --- */}
        {activeTab === "leads" && (
          <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
            <header>
              <h2 className="text-3xl font-black">Prospectos</h2>
              <p className="text-slate-500">
                Gestión de nuevas visitas y clientes
              </p>
            </header>

            <div className="bg-orange-600 p-6 rounded-2xl shadow-md text-white inline-block">
              <span className="text-orange-100 text-xs font-bold uppercase">
                Visitas
              </span>
              <h3 className="text-2xl font-black">
                {upcomingVisits.length} pendientes
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
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {filteredLeads.map((lead) => (
                <div
                  key={lead.id}
                  className="bg-white border-t-4 border-orange-500 p-5 rounded-2xl shadow-sm"
                >
                  <p className="font-bold text-lg">{lead.name}</p>
                  <a
                    href={`tel:${lead.phoneNumber}`}
                    className="text-slate-500 text-sm flex items-center gap-2 mb-4"
                  >
                    <Phone size={14} />
                    {lead.phoneNumber}
                  </a>

                  <div className="flex flex-col gap-2 border-t pt-4">
                    <a
                      href={`https://wa.me/${lead.phoneNumber?.replace(
                        /\D/g,
                        ""
                      )}`}
                      target="_blank"
                      className="bg-emerald-500 text-white py-2 rounded-lg font-bold text-center text-sm"
                    >
                      WhatsApp
                    </a>
                    <button
                      onClick={() => setSelectedLead(lead)}
                      className="bg-orange-600 text-white py-2 rounded-lg font-bold text-sm"
                    >
                      Crear Trabajo
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- JOBS VIEW --- */}
        {activeTab === "jobs" && (
          <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
            <header>
              <h2 className="text-3xl font-black">Obras Activas</h2>
              <p className="text-slate-500">Control de producción y estados</p>
            </header>

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

            <main className="grid gap-6">
              {filteredJobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-xl">Obra #{job.id}</h3>
                      <p className="text-orange-600 font-bold uppercase text-xs">
                        {job.customerName}
                      </p>
                    </div>
                    <select
                      value={job.jobStatus}
                      onChange={(e) =>
                        handleUpdateStatus(job.id, e.target.value)
                      }
                      className={`px-3 py-1 rounded-full text-xs font-black border-none ${
                        STATUS_MAP[job.jobStatus]?.color
                      }`}
                    >
                      <option value="QUOTED">Presupuestado</option>
                      <option value="IN_PROGRESS">En Obra</option>
                      <option value="COMPLETED">Finalizado</option>
                    </select>
                  </div>
                </div>
              ))}
            </main>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
