import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Users,
  Calendar,
  Briefcase,
  Plus,
} from "lucide-react";

// Services
import { jobService } from "./services/jobService";
import { visitService } from "./services/visitService";
import { leadsService } from "./services/leadsService";

// Components
import { DashboardView } from "./components/DashboardView";
import { LeadsTable } from "./components/LeadsTable";
import { VisitsTable } from "./components/VisitsTable";
import { JobsTable } from "./components/JobsTable";
import LeadForm from "./components/leadForm";
import { QuoteForm } from "./components/QuoteForm";
import { VisitModal } from "./components/VisitModal";
import { inventoryService } from "./services/inventoryService";

const JOB_STATUS_MAP = {
  QUOTED: { label: "Presupuestado", color: "bg-orange-100 text-orange-700" },
  DEPOSIT_PAID: {
    label: "Pago Adelanto",
    color: "bg-green-100 text-green-300",
  },
  BALANCE_PAID: { label: "Pago Saldo", color: "bg-green-100 text-green-300" },
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
  const [viewingLead, setViewingLead] = useState<any>(null);
  const [isAddingStock, setIsAddingStock] = useState(false);
  const [stockType, setStockType] = useState<"iso" | "resina">("iso");
  const [stockAmount, setStockAmount] = useState("");
  const [leadSearch, setLeadSearch] = useState("");
  const [visitSearch, setVisitSearch] = useState("");
  const [jobSearch, setJobSearch] = useState("");
  const [statsData, setStatsData] = useState<any>(null);
  const [viewingJob, setViewingJob] = useState<any>(null);
  const [viewingVisit, setViewingVisit] = useState<any>(null);
  const [visitObservations, setVisitObservations] = useState("");

  // Filter leads based on search input
  const filteredLeads = leads.filter(
    (lead) =>
      lead.name?.toLowerCase().includes(leadSearch.toLowerCase()) ||
      lead.phoneNumber?.toLowerCase().includes(leadSearch.toLowerCase()) ||
      lead.address?.toLowerCase().includes(leadSearch.toLowerCase()) ||
      lead.problemDescription
        ?.toLowerCase()
        .includes(leadSearch.toLowerCase()) ||
      lead.source?.toLowerCase().includes(leadSearch.toLowerCase())
  );
  const visitStatusMap: Record<string, string> = {
    SCHEDULED: "programada",
    VISITED: "visitada",
  };

  const filteredVisits = visits.filter((visit) => {
    const translatedStatus = visitStatusMap[visit.status] || visit.status;
    return (
      visit.lead?.name?.toLowerCase().includes(visitSearch.toLowerCase()) ||
      translatedStatus.toLowerCase().includes(visitSearch.toLowerCase()) ||
      visit.observations?.toLowerCase().includes(visitSearch.toLowerCase())
    );
  });

  const jobStatusMap: Record<string, string> = {
    QUOTED: "presupuestado",
    DEPOSIT_PAID: "adelanto pagado",
    BALANCE_PAID: "saldo pagado",
    COMPLETED: "finalizado",
  };

  const filteredJobs = jobs.filter((job) => {
    const translatedStatus = jobStatusMap[job.jobStatus] || job.jobStatus;
    return (
      job.lead?.name?.toLowerCase().includes(jobSearch.toLowerCase()) ||
      translatedStatus.toLowerCase().includes(jobSearch.toLowerCase()) ||
      job.observations?.toLowerCase().includes(jobSearch.toLowerCase())
    );
  });

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
        leadsService.getAll(),
        jobService.getDashboardSummary(),
        jobService.getStats(),
      ]);

      if (res[0].status === "fulfilled") setJobs(res[0].value || []);
      if (res[1].status === "fulfilled") setVisits(res[1].value || []);
      if (res[2].status === "fulfilled") {
        const all = res[2].value || [];
        // Filtering leads that don't have active jobs
        setLeads(all);
      }
      if (res[3].status === "fulfilled") setDashboardData(res[3].value);
      if (res[4].status === "fulfilled") setStatsData(res[4].value);
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
          <LayoutDashboard className="mr-2" /> Inicio
        </button>
        <button
          onClick={() => setActiveTab("leads")}
          className={`flex p-3 rounded text-left transition ${
            activeTab === "leads" ? "bg-orange-600" : "hover:bg-slate-800"
          }`}
        >
          <Users className="mr-2" /> Consultas
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
              inventory={{
                isoStock: dashboardData.isoStock || 0,
                resinaStock: dashboardData.resinaStock || 0,
              }}
              totalPossibleMix={dashboardData.possibleMix || 0}
              onAddStock={(type) => {
                setStockType(type);
                setIsAddingStock(true);
              }}
              materialTotal={dashboardData.materialNeededTotal || 0}
              statsData={statsData}
            />
          ) : (
            <div className="text-slate-500 font-bold p-10 text-center">
              Cargando Dashboard...
            </div>
          ))}

        {activeTab === "leads" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-black text-slate-800">Consultas</h2>
              <button
                onClick={() => {
                  setSelectedLead(null);
                  setIsAddingLead(true);
                }}
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-2xl font-black flex items-center gap-2 shadow-lg transition-all active:scale-95"
              >
                <Plus size={20} /> Nueva Consulta
              </button>
            </div>
            <input
              type="text"
              placeholder="Buscar por nombre, teléfono o email..."
              className="w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 mb-4"
              value={leadSearch}
              onChange={(e) => setLeadSearch(e.target.value)}
            />
            <LeadsTable
              leads={filteredLeads}
              onView={(l) => {
                setViewingLead(l);
                setSelectedLead(l);
              }}
              onEdit={(l) => {
                setSelectedLead(l);
                setIsAddingLead(true);
              }}
              onDelete={async (id) => {
                if (window.confirm("¿Borrar?")) {
                  try {
                    await leadsService.delete(id);
                    syncAllData();
                  } catch (error) {
                    alert(
                      "No se puede eliminar un prospecto con visitas u obras asociadas."
                    );
                  }
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
          </div>
        )}

        {activeTab === "visits" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-black text-slate-800">Visitas</h2>
              <button
                onClick={() => {
                  setSelectedLead(null);
                  setIsAddingLead(true);
                }}
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-2xl font-black flex items-center gap-2 shadow-lg transition-all active:scale-95"
              >
                <Plus size={20} /> Nueva Consulta
              </button>
            </div>
            <input
              type="text"
              placeholder="Buscar por nombre, teléfono o email..."
              className="w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 mb-4"
              value={visitSearch}
              onChange={(e) => setVisitSearch(e.target.value)}
            />
            <VisitsTable
              visits={filteredVisits}
              onView={(v) => {
                setViewingVisit(v);
                setVisitObservations(v.observations || "");
              }}
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
          </div>
        )}

        {activeTab === "jobs" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-black text-slate-800">Trabajos</h2>
              <button
                onClick={() => {
                  setSelectedLead(null);
                  setIsAddingLead(true);
                }}
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-2xl font-black flex items-center gap-2 shadow-lg transition-all active:scale-95"
              >
                <Plus size={20} /> Nueva Consulta
              </button>
            </div>
            <input
              type="text"
              placeholder="Buscar por nombre, teléfono o email..."
              className="w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 mb-4"
              value={jobSearch}
              onChange={(e) => setJobSearch(e.target.value)}
            />
            <JobsTable
              jobs={filteredJobs}
              statusMap={JOB_STATUS_MAP}
              onView={(job) => setViewingJob(job)}
              onUpdateStatus={async (id, s) => {
                try {
                  await jobService.updateStatus(id, s);
                  syncAllData();
                } catch (error) {
                  console.error("Error updating job status:", error);
                }
              }}
              onDelete={async (id) => {
                if (window.confirm("¿Borrar obra?")) {
                  await jobService.delete(id);
                  syncAllData();
                }
              }}
              onEdit={(id) => {
                const jobToEdit = jobs.find((j) => j.id === id);
                if (jobToEdit) {
                  setSelectedLead({
                    jobId: jobToEdit.id,
                    existingAmount: jobToEdit.totalAmount,
                    existingMaterial: jobToEdit.estimateMaterialKg,
                    existingDescription: jobToEdit.observations,
                    ...jobToEdit.lead,
                  });
                  setIsAddingQuote(true);
                }
              }}
              onRefresh={syncAllData}
            />
          </div>
        )}

        {/* --- MODALS --- */}

        {isAddingLead && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl overflow-y-auto max-h-[90vh]">
              <h2 className="text-2xl font-black mb-4">Gestión de Consultas</h2>
              <LeadForm
                initialData={selectedLead}
                onCancel={() => {
                  setIsAddingLead(false);
                  setSelectedLead(null);
                }}
                onSubmit={async (formData: any) => {
                  try {
                    if (selectedLead?.id) {
                      // Call your update logic
                      await leadsService.update(selectedLead.id, formData);
                    } else {
                      // Call your create logic
                      await leadsService.create(formData);
                    }
                    await syncAllData();
                    setIsAddingLead(false);
                    setSelectedLead(null);
                  } catch (error) {
                    console.error("Error saving lead:", error);
                  }
                }}
                onRefresh={syncAllData}
              />
            </div>
          </div>
        )}

        {viewingLead && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative">
              <button
                onClick={() => setViewingLead(null)}
                className="absolute top-4 right-4 text-slate-400"
              >
                ✕
              </button>
              <h2 className="text-2xl font-black mb-4">
                Detalles de la Consulta
              </h2>
              <div className="space-y-3 text-sm">
                <p>
                  <strong>Nombre:</strong> {viewingLead.name}
                </p>
                <p>
                  <strong>Teléfono:</strong> {viewingLead.phoneNumber}
                </p>
                <p>
                  <strong>Dirección:</strong> {viewingLead.address}
                </p>
                <p>
                  <strong>Problema:</strong> {viewingLead.problemDescription}
                </p>
                <p>
                  <strong>Origen:</strong> {viewingLead.source}
                </p>
                <p>
                  <strong>Fecha Contacto:</strong>{" "}
                  {viewingLead.contactDate || "Sin fecha"}
                </p>
              </div>
              <button
                onClick={() => setViewingLead(null)}
                className="w-full mt-6 bg-slate-900 text-white py-3 rounded-xl font-bold"
              >
                Cerrar
              </button>
            </div>
          </div>
        )}

        {viewingVisit && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative">
              <button
                onClick={() => setViewingVisit(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 transition-colors"
              >
                ✕
              </button>

              <h2 className="text-2xl font-black mb-1">
                Detalles de la Visita
              </h2>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-6">
                #{viewingVisit.id}
              </p>

              {/* Visit info */}
              <div className="space-y-3 text-sm mb-6">
                <p>
                  <strong>Cliente:</strong>{" "}
                  {viewingVisit.lead?.name || "Sin nombre"}
                </p>
                <p>
                  <strong>Teléfono:</strong>{" "}
                  {viewingVisit.lead?.phoneNumber || "Sin teléfono"}
                </p>
                <p>
                  <strong>Dirección:</strong>{" "}
                  {viewingVisit.lead?.address || "Sin dirección"}
                </p>
                <p>
                  <strong>Fecha:</strong>{" "}
                  {viewingVisit.visitDate?.split("-").reverse().join("/") ||
                    "Sin fecha"}
                </p>
                <p>
                  <strong>Estado:</strong>{" "}
                  {viewingVisit.status === "SCHEDULED"
                    ? "Programada"
                    : "Visitada"}
                </p>
              </div>

              {/* Divider */}
              <div className="border-t border-slate-100 pt-4 mb-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">
                  Observaciones
                </label>
                <textarea
                  value={visitObservations}
                  onChange={(e) => setVisitObservations(e.target.value)}
                  rows={4}
                  placeholder="Agregar observaciones..."
                  className="w-full border border-slate-200 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setViewingVisit(null)}
                  className="flex-1 py-3 font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={async () => {
                    await visitService.updateObservations(
                      viewingVisit.id,
                      visitObservations
                    );
                    setViewingVisit(null);
                    syncAllData();
                  }}
                  className="flex-1 py-3 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition-colors"
                >
                  Guardar
                </button>
              </div>
            </div>
          </div>
        )}

        {viewingJob && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative">
              <button
                onClick={() => setViewingJob(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 transition-colors"
              >
                ✕
              </button>

              <h2 className="text-2xl font-black mb-1">Detalles de la Obra</h2>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-6">
                #{viewingJob.id}
              </p>

              {/* Job Info */}
              <div className="space-y-3 text-sm mb-6">
                <p>
                  <strong>Estado:</strong>{" "}
                  {JOB_STATUS_MAP[
                    viewingJob.jobStatus as keyof typeof JOB_STATUS_MAP
                  ]?.label || viewingJob.jobStatus}
                </p>
                <p>
                  <strong>Fecha de Obra:</strong>{" "}
                  {viewingJob.workDate?.split("-").reverse().join("/") ||
                    "Sin fecha"}
                </p>
                <p>
                  <strong>Material Estimado:</strong>{" "}
                  {viewingJob.estimateMaterialKg
                    ? `${viewingJob.estimateMaterialKg} kg`
                    : "Sin dato"}
                </p>
                <p>
                  <strong>Observaciones:</strong>{" "}
                  {viewingJob.observations || "Sin observaciones"}
                </p>
              </div>

              {/* Divider */}
              <div className="border-t border-slate-100 pt-4 mb-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">
                  Datos del Cliente
                </p>
                <div className="space-y-3 text-sm">
                  <p>
                    <strong>Nombre:</strong>{" "}
                    {viewingJob.lead?.name || "Sin nombre"}
                  </p>
                  <p>
                    <strong>Teléfono:</strong>{" "}
                    {viewingJob.lead?.phoneNumber || "Sin teléfono"}
                  </p>
                  <p>
                    <strong>Dirección:</strong>{" "}
                    {viewingJob.lead?.address || "Sin dirección"}
                  </p>
                  <p>
                    <strong>Problema:</strong>{" "}
                    {viewingJob.lead?.problemDescription || "Sin descripción"}
                  </p>
                  <p>
                    <strong>Origen:</strong>{" "}
                    {viewingJob.lead?.source || "Sin origen"}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setViewingJob(null)}
                className="w-full mt-2 bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        )}

        {isAddingQuote && selectedLead && (
          <QuoteForm
            lead={selectedLead}
            onCancel={() => {
              setIsAddingQuote(false);
              setSelectedLead(null);
            }}
            onCreate={async (data) => {
              if (selectedLead.jobId) {
                await jobService.update(selectedLead.jobId, data);
              } else {
                await jobService.create({
                  ...data,
                  lead: { id: selectedLead.id },
                });
              }
              setIsAddingQuote(false);
              syncAllData();
            }}
          />
        )}

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
                lead: { id: selectedLead.id },
                visitDate,
                observations: visitNotes,
              });
              setIsSchedulingVisit(false);
              syncAllData();
            }}
          />
        )}
        {isAddingStock && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl">
              <h2 className="text-2xl font-black mb-4">
                Cargar {stockType === "iso" ? "ISO" : "Resina"}
              </h2>
              <input
                type="number"
                className="w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Cantidad en kg"
                value={stockAmount}
                onChange={(e) => setStockAmount(e.target.value)}
              />
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setIsAddingStock(false)}
                  className="flex-1 py-3 font-bold text-slate-500 hover:bg-slate-100 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  onClick={async () => {
                    await inventoryService.addStock(
                      stockType,
                      Number(stockAmount)
                    );
                    setIsAddingStock(false);
                    setStockAmount("");
                    syncAllData();
                  }}
                  className="flex-1 py-3 bg-orange-500 text-white font-bold rounded-xl"
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
