import { useEffect, useState } from "react";
import { getJobs } from "./services/api";
import axios from "axios";
import type { Job } from "./types/Job";
import { Briefcase, UserPlus, Phone, Plus } from "lucide-react";
import LeadForm from "./components/leadForm";
import QuoteForm from "./components/QuoteForm";

function App() {
  const [jobs, setJobs] = useState<Job[]>([]);
  // --- NEW STATE ---
  const [leads, setLeads] = useState<any[]>([]);
  const [selectedLead, setSelectedLead] = useState<any | null>(null);

  // --- NEW FETCH LOGIC (Replaces the old simple useEffect) ---
  const fetchData = async () => {
    const jobsRes = await getJobs();
    setJobs(jobsRes);

    // Get customers and filter for those without jobs (Leads)
    const custRes = await axios.get("http://localhost:8080/api/customers");
    const newLeads = custRes.data.filter(
      (c: any) => !c.jobs || c.jobs.length === 0
    );
    setLeads(newLeads);
  };

  // --- NEW CREATE JOB FUNCTION ---
  const handleCreateJob = async (jobData: any) => {
    try {
      await axios.post("http://localhost:8080/api/jobs", {
        ...jobData,
        customer: { id: selectedLead.id },
      });
      setSelectedLead(null);
      fetchData();
      alert("Quote created! Lead moved to Projects.");
    } catch (error) {
      console.error("Error creating job:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-10 text-slate-900">
      {/* --- NEW MODAL --- */}
      {selectedLead && (
        <QuoteForm
          lead={selectedLead}
          onCancel={() => setSelectedLead(null)}
          onCreate={handleCreateJob}
        />
      )}

      {/* Header Area */}
      <header className="max-w-5xl mx-auto mb-10 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-800">
            Uretek Argentina
          </h1>
          <p className="text-slate-500 font-medium">
            Administracion de Clientes
          </p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold shadow-md transition-all active:scale-95">
          + New Job
        </button>
      </header>

      <div className="max-w-5xl mx-auto">
        <LeadForm onRefresh={fetchData} />

        {/* --- NEW LEADS SECTION --- */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-slate-700 mb-4 flex items-center gap-2">
            <UserPlus className="text-blue-500" size={20} />
            Leads to Contact ({leads.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {leads.map((lead) => (
              <div
                key={lead.id}
                className="bg-white border-l-4 border-blue-500 p-4 rounded-xl shadow-sm flex justify-between items-center"
              >
                <div>
                  <p className="font-bold text-slate-800">{lead.name}</p>
                  <div className="flex items-center gap-2 text-slate-500 text-sm mt-1">
                    <Phone size={14} />
                    <span>{lead.phone || "No phone"}</span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedLead(lead)}
                  className="bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-600 p-2 rounded-lg transition-colors"
                >
                  <Plus size={20} />
                </button>
              </div>
            ))}
          </div>
        </section>

        <h2 className="text-xl font-bold text-slate-700 mb-4 flex items-center gap-2">
          <Briefcase className="text-amber-500" size={20} />
          Active Projects
        </h2>

        <main className="grid gap-6">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-3 rounded-lg text-blue-600">
                    <Briefcase size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Job #{job.id}</h3>
                    <span className="text-sm text-slate-400 font-medium uppercase tracking-wider">
                      Uretek Structural Repair
                    </span>
                  </div>
                </div>
                <h3 className="font-bold text-lg">{job.customerName}</h3>
                <span
                  className={`px-4 py-1 rounded-full text-xs font-black uppercase ${
                    job.jobStatus === "FINALIZADO"
                      ? "bg-green-100 text-green-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {job.jobStatus}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 border-t border-slate-50 pt-6">
                <div className="flex flex-col">
                  <span className="text-slate-400 text-xs font-bold uppercase mb-1">
                    Precio
                  </span>
                  <span className="text-xl font-bold text-slate-800">
                    ${job.totalAmount?.toLocaleString() || "0.00"}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-slate-400 text-xs font-bold uppercase mb-1">
                    Falta Pagar
                  </span>
                  <span className="text-xl font-bold text-red-600">
                    ${job.balanceAmount?.toLocaleString() || "0.00"}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-slate-400 text-xs font-bold uppercase mb-1">
                    Material Est.
                  </span>
                  <span className="text-xl font-bold">
                    {job.estimateMaterialKg} kg
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
