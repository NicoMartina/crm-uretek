import React, { useState, useEffect } from "react";
import { LayoutDashboard, Users, Calendar, Briefcase } from "lucide-react";

// Services
import { jobService } from "./services/jobService";
import { visitService } from "./services/visitService";
import { customerService } from "./services/customerService";

// Components
import { DashboardView } from "./components/DashboardView";
import { LeadsTable } from "./components/LeadsTable";
import { VisitsTable } from "./components/VisitsTable";
import { JobsTable } from "./components/JobsTable";
import LeadForm from "./components/leadForm";
import { QuoteForm } from "./components/QuoteForm";
import { VisitModal } from "./components/VisitModal";

const JOB_STATUS_MAP = {
  QUOTED: { label: "Presupuestado", color: "bg-blue-100 text-blue-700" },
  IN_PROGRESS: { label: "En Obra", color: "bg-orange-100 text-orange-700" },
  COMPLETED: { label: "Finalizado", color: "bg-emerald-100 text-emerald-700" },
};

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [jobs, setJobs] = useState<any[]>([]);
  const [visits, setVisits] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [dashboardData, setDashboardData] = useState<any>(null);

  // Modal Controls
  const [isAddingLead, setIsAddingLead] = useState(false);
  const [isAddingQuote, setIsAddingQuote] = useState(false);
  const [isSchedulingVisit, setIsSchedulingVisit] = useState(false);
  const [selectedLead, setSelectedLead] = useState<any>(null);

  // Visit Modal State
  const [visitDate, setVisitDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [visitNotes, setVisitNotes] = useState("");

  const syncAllData = async () => {
    try {
      const res = await Promise.allSettled([
        jobService.getAll(),
        visitService.getAll(),
        customerService.getAll(),
        jobService.getDashboardSummary(),
      ]);

      if (res[0].status === "fulfilled") setJobs(res[0].value || []);
      if (res[1].status === "fulfilled") setVisits(res[1].value || []);
      if (res[2].status === "fulfilled") {
        const all = res[2].value || [];
        setLeads(all.filter((c: any) => !c.jobs || c.jobs.length === 0));
      }
      if (res[3].status === "fulfilled") setDashboardData(res[3].value);
    } catch (e) {
      console.error("Sync Error:", e);
    }
  };

  useEffect(() => {
    syncAllData();
  }, []);

  return (
    <div className="flex h-screen bg-slate-100 w-full overflow-hidden">
      {/* Sidebar Navigation */}
      <nav className="w-64 bg-slate-900 text-white p-4 flex flex-col gap-2">
        <h1 className="text-xl font-bold p-4 text-orange-500">URETEK CRM</h1>
        <button
          onClick={() => setActiveTab("dashboard")}
          className={`flex p-3 rounded text-left transition ${
            activeTab === "dashboard" ? "bg-orange-600" : "hover:bg-slate-800"
          }`}
        >
          <LayoutDashboard className="mr-2" /> Dashboard
        </button>
        <button
          onClick={() => setActiveTab("leads")}
          className={`flex p-3 rounded text-left transition ${
            activeTab === "leads" ? "bg-orange-600" : "hover:bg-slate-800"
          }`}
        >
          <Users className="mr-2" /> Prospectos
        </button>
        <button
          onClick={() => setActiveTab("visits")}
          className={`flex p-3 rounded text-left transition ${
            activeTab === "visits" ? "bg-orange-600" : "hover:bg-slate-800"
          }`}
        >
          <Calendar className="mr-2" /> Visitas
        </button>
        <button
          onClick={() => setActiveTab("jobs")}
          className={`flex p-3 rounded text-left transition ${
            activeTab === "jobs" ? "bg-orange-600" : "hover:bg-slate-800"
          }`}
        >
          <Briefcase className="mr-2" /> Obras
        </button>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 p-8 overflow-auto">
        {activeTab === "dashboard" &&
          (dashboardData ? (
            <DashboardView
              data={dashboardData}
              inventory={{
                iso_stock: dashboardData.isoStock || 0,
                resina_stock: dashboardData.resinaStock || 0,
              }}
              totalPossibleMix={dashboardData.possibleMix || 0}
              onAddStock={() => {}}
              totalQuoted={dashboardData.totalQuoted || 0}
              totalActive={dashboardData.totalActive || 0}
              materialTotal={dashboardData.materialNeeded || 0}
            />
          ) : (
            <div className="text-slate-500 font-bold p-10 text-center">
              Cargando Dashboard...
            </div>
          ))}

        {activeTab === "leads" && (
          <LeadsTable
            leads={leads}
            onView={(l) => setSelectedLead(l)}
            onEdit={(l) => {
              setSelectedLead(l);
              setIsAddingLead(true);
            }}
            onDelete={async (id) => {
              if (window.confirm("¿Borrar?")) {
                await customerService.delete(id);
                syncAllData();
              }
            }}
            onScheduleVisit={(l) => {
              setSelectedLead(l);
              setIsSchedulingVisit(true);
            }}
            onQuote={(l) => {
              setSelectedLead(l);
              setIsAddingQuote(true);
            }}
          />
        )}

        {activeTab === "visits" && (
          <VisitsTable
            visits={visits}
            onConvert={(cust) => {
              setSelectedLead(cust);
              setIsAddingQuote(true);
            }}
            onUpdateStatus={async (id, s) => {
              await visitService.updateStatus(id, s);
              syncAllData();
            }}
            onDelete={async (id) => {
              if (window.confirm("¿Borrar visita?")) {
                await visitService.delete(id);
                syncAllData();
              }
            }}
          />
        )}

        {activeTab === "jobs" && (
          <JobsTable
            jobs={jobs}
            statusMap={JOB_STATUS_MAP}
            onUpdateStatus={async (id, s) => {
              await jobService.updateStatus(id, s);
              syncAllData();
            }}
            onDelete={async (id) => {
              if (window.confirm("¿Borrar obra?")) {
                await jobService.delete(id);
                syncAllData();
              }
            }}
            onEdit={(job) => {
              setSelectedLead(job);
              setIsAddingQuote(true);
            }}
            onRefresh={syncAllData}
          />
        )}

        {/* --- MODALS --- */}

        {/* LeadForm Modal Wrapper */}
        {isAddingLead && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl">
              <h2 className="text-2xl font-black mb-4">Gestión de Prospecto</h2>
              <LeadForm
                initialData={selectedLead}
                onCancel={() => {
                  setIsAddingLead(false);
                  setSelectedLead(null);
                }}
                onRefresh={() => {
                  setIsAddingLead(false);
                  setSelectedLead(null);
                  syncAllData();
                }}
              />
            </div>
          </div>
        )}

        {/* QuoteForm handles its own background */}
        {isAddingQuote && selectedLead && (
          <QuoteForm
            lead={selectedLead}
            onCancel={() => {
              setIsAddingQuote(false);
              setSelectedLead(null);
            }}
            onCreate={async (data) => {
              await jobService.create({
                ...data,
                customer: { id: selectedLead.id },
              });
              setIsAddingQuote(false);
              syncAllData();
            }}
          />
        )}

        {/* VisitModal handles its own background */}
        {isSchedulingVisit && selectedLead && (
          <VisitModal
            lead={selectedLead}
            visitDate={visitDate}
            setVisitDate={setVisitDate}
            visitNotes={visitNotes}
            setVisitNotes={setVisitNotes}
            onClose={() => setIsSchedulingVisit(false)}
            onConfirm={async () => {
              await visitService.create({
                customer: { id: selectedLead.id },
                visitDate,
                notes: visitNotes,
              });
              setIsSchedulingVisit(false);
              syncAllData();
            }}
          />
        )}
      </main>
    </div>
  );
}
