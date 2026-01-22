import { useEffect, useState } from "react";
import { getJobs } from "./services/api";
import type { Job } from "./types/Job";
import { Briefcase, DollarSign, Activity } from "lucide-react"; // Icons!
import LeadForm from "./components/leadForm";

function App() {
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    getJobs().then(setJobs);
  }, []);

  return (
    // min-h-screen = take up the whole phone/monitor height
    // bg-slate-50 = a very professional "off-white" background
    <div className="min-h-screen bg-slate-50 p-4 md:p-10 text-slate-900">
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

      {/* The Jobs Grid */}
      <header className="max-w-5xl mx-auto mb-10 ..."> ... </header>

      <div className="max-w-5xl mx-auto">
        <LeadForm onRefresh={() => window.location.reload()} />
        {/* Note: Reloading the whole window is the "easiest" way to refresh for now! */}
      </div>
      <main className="max-w-5xl mx-auto grid gap-6">
        {jobs.map((job) => (
          // This is the "Card"
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

              {/* 1. Put the NAME here (The Title) */}
              <h3 className="font-bold text-lg">{job.customerName}</h3>

              {/* Status Badge */}
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

            {/* Money & Stats Grid */}
            {/* Money & Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 border-t border-slate-50 pt-6">
              <div className="flex flex-col">
                <span className="text-slate-400 text-xs font-bold uppercase mb-1">
                  Precio
                </span>
                {/* Use totalBudgetAmount here */}
                <span className="text-xl font-bold text-slate-800">
                  ${job.totalAmount?.toLocaleString() || "0.00"}
                </span>
              </div>

              <div className="flex flex-col">
                <span className="text-slate-400 text-xs font-bold uppercase mb-1">
                  Falta Pagar
                </span>
                {/* Show the balance in red if it's > 0, to remind Dad to collect it! */}
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
  );
}

export default App;
