import React, { useEffect, useState } from "react";
import { jobService } from "./services/jobService";
import { customerService } from "./services/customerService";
import { visitService } from "./services/visitService";
import { inventoryService } from "./services/inventoryService";

// UI Components
import { DashboardView } from "./components/DashboardView";
import { LeadsTable } from "./components/LeadsTable";
import { VisitsTable } from "./components/VisitsTable";
import { JobsTable } from "./components/JobsTable";
import { QuoteForm } from "./components/QuoteForm";
import { VisitModal } from "./components/VisitModal";
import LeadForm from "./components/leadForm";

// Icons & Types
import {
  Briefcase,
  UserPlus,
  Plus,
  Trash2,
  Search,
  Calendar,
  LayoutDashboard,
} from "lucide-react";
import type { Job } from "./types/Job";
import type { Visit } from "./types/Visit";
// Ensure this import matches your file structure
import type { Inventory } from "./types/Inventory";

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  QUOTED: { label: "Presupuestado", color: "bg-orange-100 text-orange-700" },
  IN_PROGRESS: { label: "En Obra", color: "bg-amber-100 text-amber-700" },
  COMPLETED: { label: "Finalizado", color: "bg-green-100 text-green-700" },
};

function App() {
  // --- INITIAL STATES (Initialized as empty arrays [] to prevent .filter crashes) ---
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "leads" | "jobs" | "visits"
  >("dashboard");
  const [searchTerm, setSearchTerm] = useState("");
  const [showArchived, setShowArchived] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [inventory, setInventory] = useState<Inventory | null>(null);
  const [dashboardData, setDashboardData] = useState<any>(null);

  // Modal States
  const [selectedLead, setSelectedLead] = useState<any | null>(null);
  const [isAddingLead, setIsAddingLead] = useState(false);
  const [viewingLead, setViewingLead] = useState<any | null>(null);
  const [schedulingVisitLead, setSchedulingVisitLead] = useState<any | null>(
    null
  );
  const [visitDate, setVisitDate] = useState("");
  const [visitNotes, setVisitNotes] = useState("");

  /**
   * syncAllData: The main "Brain" function.
   * It fetches everything at once. If one fails, the others still load.
   */
  const syncAllData = async () => {
    try {
      // Promise.allSettled is safer; it won't crash if the Dashboard returns 500
      const results = await Promise.allSettled([
        jobService.getAll(),
        visitService.getAll(),
        customerService.getAll(),
        jobService.getDashboardSummary(),
      ]);

      if (results[0].status === "fulfilled") {
        // Array.isArray checks if it's actually a list. If not, we use []
        const data = results[0].value;
        setJobs(Array.isArray(data) ? data : []);
      }
      if (results[1].status === "fulfilled") {
        const data = results[1].value;
        setVisits(Array.isArray(data) ? data : []);
      }

      if (results[2].status === "fulfilled") {
        const data = results[2].value;
        const custs = Array.isArray(data) ? data : []; // THIS IS THE FIX FOR LINE 78
        setLeads(custs.filter((c: any) => !c.jobs || c.jobs.length === 0));
      }
      if (results[3].status === "fulfilled") {
        const data = results[3].value;
        setDashboardData(data);
        setInventory({
          iso_stock: data.isoStock,
          resina_stock: data.resinaStock,
        });
      }
    } catch (error) {
      console.error("Critical Sync Error:", error);
    }
  };

  useEffect(() => {
    syncAllData();
  }, []);
  useEffect(() => {
    setSearchTerm("");
  }, [activeTab]);

  // --- FILTERS (With Safety Checks '|| []') ---
  const filteredLeads = (leads || []).filter((l) =>
    l.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredJobs = (jobs || []).filter((j) => {
    const matches = j.customerName
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    return (
      matches &&
      (showArchived ? j.jobStatus === "COMPLETED" : j.jobStatus !== "COMPLETED")
    );
  });

  const filteredVisits = (visits || []).filter((v) =>
    v.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 md:flex text-slate-900">
      {/* SIDEBAR */}
      <nav className="fixed bottom-0 left-0 w-full bg-white border-t md:relative md:w-64 md:h-screen md:border-r p-4 z-50 flex md:flex-col gap-2">
        <h1 className="hidden md:block text-2xl font-black mb-8 px-4 italic">
          URETEK <span className="text-orange-500">CRM</span>
        </h1>

        {["dashboard", "leads", "visits", "jobs"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`flex-1 md:flex-none flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
              activeTab === tab
                ? "bg-orange-500 text-white shadow-lg"
                : "text-slate-500 hover:bg-slate-100"
            }`}
          >
            {tab === "dashboard" && <LayoutDashboard size={20} />}
            {tab === "leads" && <UserPlus size={20} />}
            {tab === "visits" && <Calendar size={20} />}
            {tab === "jobs" && <Briefcase size={20} />}
            <span className="hidden md:block capitalize">
              {tab === "dashboard" ? "Inicio" : tab}
            </span>
          </button>
        ))}
      </nav>

      {/* MAIN */}
      <main className="flex-1 p-4 md:p-10 pb-24">
        {/* Search */}
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
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-orange-500 bg-white"
          />
        </div>

        {/* View Switcher */}
        {activeTab === "dashboard" &&
          (dashboardData ? (
            <DashboardView
              inventory={inventory}
              totalPossibleMix={dashboardData.possibleMix}
              totalQuoted={dashboardData.totalQuoted}
              totalActive={dashboardData.totalActive}
              materialTotal={dashboardData.metarialNeededTotal}
              onAddStock={async (type) => {
                const amt = window.prompt(`Kg de ${type.toUpperCase()}:`);
                if (amt) {
                  await inventoryService.addStock(type, Number(amt));
                  syncAllData();
                }
              }}
            />
          ) : (
            <div className="text-center p-10 font-bold text-slate-400">
              Cargando Dashboard...
            </div>
          ))}

        {activeTab === "leads" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-black">Prospectos</h2>
              <button
                onClick={() => setIsAddingLead(true)}
                className="bg-orange-500 text-white px-6 py-3 rounded-xl font-bold"
              >
                + Nuevo
              </button>
            </div>
            <LeadsTable
              leads={filteredLeads}
              onView={setViewingLead}
              onDelete={async (id) => {
                if (window.confirm("¿Borrar?")) {
                  await customerService.delete(id);
                  syncAllData();
                }
              }}
              onScheduleVisit={setSchedulingVisitLead}
              onQuote={setSelectedLead}
              onEdit={(l) => {
                setSelectedLead(l);
                setIsAddingLead(true);
              }}
            />
          </div>
        )}

        {/* Visitas & Trabajos would follow the same pattern... */}
        {activeTab === "visits" && (
          <VisitsTable
            visits={filteredVisits}
            onUpdateStatus={() => {}}
            onConvert={setSelectedLead}
            onDelete={() => {}}
          />
        )}
        {activeTab === "jobs" && (
          <JobsTable
            jobs={filteredJobs}
            statusMap={STATUS_MAP}
            onUpdateStatus={() => {}}
            onDelete={() => {}}
            onEdit={() => {}}
          />
        )}

        {/* Lead Modal */}
        {isAddingLead && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-8 w-full max-w-2xl">
              <LeadForm
                onRefresh={() => {
                  syncAllData();
                  setIsAddingLead(false);
                }}
                initialData={selectedLead}
              />
              <button
                onClick={() => {
                  setIsAddingLead(false);
                  setSelectedLead(null);
                }}
                className="mt-4 text-slate-400 font-bold w-full"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
