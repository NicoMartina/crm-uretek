import { useEffect, useState } from "react";
import { jobService } from "./services/jobService";
import { customerService } from "./services/customerService";

import type { Job } from "./types/Job";
import {
  Briefcase,
  UserPlus,
  Plus,
  Trash2,
  Search,
  Calendar,
  LayoutDashboard,
  Package,
  Edit,
} from "lucide-react";
import LeadForm from "./components/leadForm";
import { QuoteForm } from "./components/QuoteForm";
import type { Visit } from "./types/Visit";
import type { Inventory } from "./types/Inventory";
import { VisitModal } from "./components/VisitModal";
import { visitService } from "./services/visitService";
import { LeadsTable } from "./components/LeadsTable";
import { JobsTable } from "./components/JobsTable";
import { VisitsTable } from "./components/VisitsTable";
import { inventoryService } from "./services/inventoryService";
import { DashboardView } from "./components/DashboardView";

// Change this at the top of App.tsx
const STATUS_MAP: Record<string, { label: string; color: string }> = {
  QUOTED: { label: "Presupuestado", color: "bg-orange-100 text-orange-700" },
  IN_PROGRESS: { label: "En Obra", color: "bg-amber-100 text-amber-700" }, // Changed from PENDIENTE
  COMPLETED: { label: "Finalizado", color: "bg-green-100 text-green-700" },
};

function App() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [selectedLead, setSelectedLead] = useState<any | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showArchived, setShowArchived] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "leads" | "jobs" | "visits"
  >("leads");
  const [materialTotal, setMaterialTotal] = useState<number>(0);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [schedulingVisitLead, setSchedulingVisitLead] = useState<any | null>(
    null
  );
  const [visitDate, setVisitDate] = useState("");
  const [visitNotes, setVisitNotes] = useState("");
  const [inventory, setInventory] = useState<Inventory | null>(null);
  const [isAddingLead, setIsAddingLead] = useState(false);
  const [viewingLead, setViewingLead] = useState<any | null>(null);
  const [totalQuoted, setTotalQuoted] = useState<number>(0);
  const [totalActive, setTotalActive] = useState<number>(0);
  const [totalPossibleMix, setTotalPossibleMix] = useState<number>(0);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [isAddingJob, setIsAddingJob] = useState(false);

  const fetchData = async () => {
    try {
      // 1. Get the lists for the tables
      setJobs(await jobService.getAll());
      setVisits(await visitService.getAll());

      const customers = await customerService.getAll();
      setLeads(customers.filter((c: any) => !c.jobs || c.jobs.length === 0));

      // 2. GET THE DASHBOARD SUMMARY (The Java Brain)
      const summary = await jobService.getDashboardSummary();

      // Update the UI with the pre-calculated numbers from Java
      setInventory({
        iso_stock: summary.isoStock,
        resina_stock: summary.resinaStock,
      });

      setMaterialTotal(summary.materialNeededTotal);
      setTotalQuoted(summary.totalQuoted);
      setTotalActive(summary.totalActive);
      setTotalPossibleMix(summary.possibleMix);
    } catch (error) {
      console.error("Error syncing with Backend:", error);
    }
  };

  // You can now delete the old fetchInventory function entirely!
  // Everything comes through fetchData now.

  const handleUpdateStatus = async (jobId: number, newStatus: string) => {
    try {
      await jobService.updateStatus(jobId, newStatus);
      fetchData();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleUpdateVisitStatus = async (
    visitId: number,
    newStatus: string
  ) => {
    try {
      await visitService.updateStatus(visitId, newStatus);
      fetchData(); // Always refresh after a change!
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleScheduleVisit = async (lead: any, date: string | null) => {
    if (date === "" && date !== null) return alert("Selecciona una fecha");
    try {
      // Uses customerService.update instead of axios.put
      await customerService.update(lead.id, { ...lead, visitDate: date });
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  const handleConfirmVisit = async () => {
    if (!visitDate) return alert("Por favor selecciona una fecha");

    try {
      await visitService.create({
        customer: { id: schedulingVisitLead.id },
        visitDate: visitDate,
        observations: visitNotes,
        status: "SCHEDULED",
      });

      setSchedulingVisitLead(null); // Close modal
      setVisitDate("");
      setVisitNotes("");
      fetchData(); // Refresh the counts
      setActiveTab("visits"); // Take dad to the visits tab to see it!
    } catch (error) {
      console.error("Error scheduling visit:", error);
    }
  };

  const handleConvertVisit = (lead: any) => {
    setSelectedLead(lead);
    handleScheduleVisit(lead, null);
  };

  const handleDeleteJob = async (id: number) => {
    if (window.confirm("¿Eliminar este trabajo?")) {
      await jobService.delete(id); // Uses jobService
      fetchData();
    }
  };

  const handleDeleteVisit = async (id: number) => {
    if (window.confirm("¿Eliminar esta visita?")) {
      await visitService.delete(id); // Uses visitService
      fetchData();
    }
  };

  const handleCreateJob = async (formData: any) => {
    try {
      await jobService.create({
        ...formData,
        customer: { id: selectedLead.id },
        jobStatus: "QUOTED",
      });
      setSelectedLead(null);
      fetchData();
      setActiveTab("jobs");
    } catch (error) {
      console.error("Error creating job:", error);
    }
  };

  const handleAddStock = async (type: "iso" | "resina") => {
    const amount = window.prompt(
      `¿Cuántos kg de ${type.toUpperCase()} compraste?`
    );

    if (amount && !isNaN(Number(amount))) {
      try {
        await inventoryService.addStock(type, Number(amount));
        fetchData();
      } catch (error) {
        alert("Error al cargar stock");
      }
    }
  };

  const handleDeleteLead = async (id: number) => {
    if (window.confirm("¿Seguro que quieres borrar este prospecto?")) {
      try {
        await customerService.delete(id); // Using the service!
        fetchData(); // Refresh the list
      } catch (error: any) {
        if (error.response?.status == 409) {
          alert(
            "No se puede eliminar el prospecto porque tiene visitas o trabajos asociados."
          );
        } else {
          alert("Hubo un error al intentar borrar el prospecto.");
        }
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setSearchTerm("");
  }, [activeTab]);

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

  const filteredVisits = visits.filter(
    (v) =>
      (v.status === "SCHEDULED" || v.status === "VISITED") &&
      v.customer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 md:flex text-slate-900">
      {/* --- SIDEBAR --- */}
      <nav className="fixed bottom-0 left-0 w-full bg-white border-t md:relative md:w-64 md:h-screen md:border-r md:border-t-0 p-4 z-50 flex md:flex-col gap-2">
        <div className="hidden md:block mb-8 px-4">
          <h1 className="text-2xl font-black text-slate-800">
            Uretek <span className="">CRM</span>
          </h1>
        </div>
        <button
          onClick={() => setActiveTab("dashboard")}
          className={`flex-1 md:flex-none flex items-center justify-center md:justify-start gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
            activeTab === "dashboard"
              ? "bg-orange-400 hover:bg-orange-500 text-white shadow-lg"
              : "text-slate-500 hover:bg-slate-100"
          }`}
        >
          <LayoutDashboard size={20} />{" "}
          <span className="hidden md:block">Inicio</span>
        </button>
        <button
          onClick={() => setActiveTab("leads")}
          className={`flex-1 md:flex-none flex items-center justify-center md:justify-start gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
            activeTab === "leads"
              ? "bg-orange-400 hover:bg-orange-500 text-white shadow-lg"
              : "text-slate-500 hover:bg-slate-100"
          }`}
        >
          <UserPlus size={20} />{" "}
          <span className="hidden md:block">Prospectos</span>
        </button>

        <button
          onClick={() => setActiveTab("visits")}
          className={`flex-1 md:flex-none flex items-center justify-center md:justify-start gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
            activeTab === "visits"
              ? "bg-orange-400 hover:bg-orange-500 text-white shadow-lg"
              : "text-slate-500 hover:bg-slate-100"
          }`}
        >
          <Calendar size={20} />{" "}
          <span className="hidden md:block">Visitas</span>
        </button>

        <button
          onClick={() => setActiveTab("jobs")}
          className={`flex-1 md:flex-none flex items-center justify-center md:justify-start gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
            activeTab === "jobs"
              ? "bg-orange-400 hover:bg-orange-500 text-white shadow-lg"
              : "text-slate-500 hover:bg-slate-100"
          }`}
        >
          <Briefcase size={20} />{" "}
          <span className="hidden md:block">Trabajos</span>
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

        <VisitModal
          lead={schedulingVisitLead}
          visitDate={visitDate}
          setVisitDate={setVisitDate}
          visitNotes={visitNotes}
          setVisitNotes={setVisitNotes}
          onClose={() => setSchedulingVisitLead(null)}
          onConfirm={handleConfirmVisit}
        />

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
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-orange-500 bg-white shadow-sm"
          />
        </div>

        {/* --- LEADS VIEW --- */}
        {activeTab === "leads" && (
          <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
            <header>
              <div>
                <h2 className="text-3xl font-black">Prospectos</h2>
                <p className="text-slate-500">
                  Gestión de nuevas visitas y clientes
                </p>
              </div>
              <button
                onClick={() => setIsAddingLead(true)}
                className="bg-orange-400 hover:bg-orange-500 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-orange-200 transition-all active:scale-95"
              >
                <Plus size={20} />
                Nuevo Prospecto
              </button>
            </header>

            {/* MODAL POPUP */}
            {isAddingLead && (
              <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                  <div className="p-8">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-black text-slate-800">
                        {selectedLead
                          ? "Editar Cliente"
                          : "Registrar Nuevo Cliente"}
                      </h2>
                      <button
                        onClick={() => {
                          setIsAddingLead(false);
                          setSelectedLead(null); // IMPORTANT: Clear selection when closing
                        }}
                        className="text-slate-400 hover:text-slate-600"
                      >
                        <Trash2 size={24} />
                      </button>
                    </div>

                    <LeadForm
                      initialData={selectedLead} // Pass the lead data if we are editing
                      onRefresh={() => {
                        fetchData();
                        setIsAddingLead(false);
                        setSelectedLead(null); // Clear selection after saving
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* VIEW LEAD DETAILS MODAL */}
            {viewingLead && (
              <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
                <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
                  <div className="p-8">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <span className="text-[10px] font-black bg-slate-100 text-slate-500 px-2 py-1 rounded-md uppercase">
                          Ficha del Cliente
                        </span>
                        <h2 className="text-3xl font-black text-slate-800 mt-2">
                          {viewingLead.name}
                        </h2>
                      </div>
                      <button
                        onClick={() => setViewingLead(null)}
                        className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                      >
                        <Plus size={24} className="rotate-45 text-slate-400" />
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-50 p-4 rounded-2xl">
                          <p className="text-[10px] font-bold text-slate-400 uppercase">
                            Teléfono
                          </p>
                          <p className="font-bold">
                            {viewingLead.phoneNumber || "---"}
                          </p>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-2xl">
                          <p className="text-[10px] font-bold text-slate-400 uppercase">
                            Email
                          </p>
                          <p className="font-bold text-sm truncate">
                            {viewingLead.email || "---"}
                          </p>
                        </div>
                      </div>

                      <div className="bg-slate-50 p-4 rounded-2xl">
                        <p className="text-[10px] font-bold text-slate-400 uppercase">
                          Dirección de Obra
                        </p>
                        <p className="font-bold">
                          {viewingLead.address || "---"}
                        </p>
                      </div>

                      <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100">
                        <p className="text-[10px] font-bold text-orange-400 uppercase">
                          Problema Reportado
                        </p>
                        <p className="text-sm font-medium text-slate-700 mt-1">
                          {viewingLead.problemDescription || "No especificado"}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase">
                            Origen
                          </p>
                          <p className="text-sm font-bold">
                            {viewingLead.source || "---"}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase">
                            Medio de Contacto
                          </p>
                          <p className="text-sm font-bold">
                            {viewingLead.contactChannel || "---"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => setViewingLead(null)}
                      className="w-full mt-8 py-4 bg-orange-400 text-white font-bold rounded-2xl hover:bg-orange-500 transition-all"
                    >
                      Cerrar
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="overflow-x-auto">
                <LeadsTable
                  leads={filteredLeads}
                  onView={(lead) => setViewingLead(lead)}
                  onEdit={(lead) => {
                    setSelectedLead(lead);
                    setIsAddingLead(true);
                  }}
                  onDelete={handleDeleteLead}
                  onScheduleVisit={(lead) => setSchedulingVisitLead(lead)}
                  onQuote={(lead) => setSelectedLead(lead)}
                />
              </div>
            </div>
          </div>
        )}

        {/* --- JOBS VIEW --- */}
        {activeTab === "jobs" && (
          <>
            <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
              <header>
                <h2 className="text-3xl font-black">Trabajos Activos</h2>
                <p className="text-slate-500">
                  Control de producción y estados
                </p>
              </header>

              {/* STATS ROW */}
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

              {/* SEARCH & ARCHIVE BAR */}
              <div className="flex justify-between items-center mb-6 gap-4">
                <div className="relative flex-1">
                  <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    type="text"
                    placeholder="Buscar por cliente..."
                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <button
                  onClick={() => setShowArchived(!showArchived)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-sm transition-all whitespace-nowrap"
                >
                  {showArchived ? "Ver Activos" : "Ver Historial"}
                </button>
              </div>

              {/* NEW TABLE VIEW */}
              <JobsTable
                jobs={filteredJobs}
                statusMap={STATUS_MAP}
                onUpdateStatus={handleUpdateStatus}
                onDelete={handleDeleteJob}
                onEdit={(id) => {
                  // 1. Find the actual job object from your list using the ID
                  const jobToEdit = jobs.find((j) => j.id === id);
                  // 2. Set it as the "selected" item so the form knows what to show
                  setSelectedJob(jobToEdit);
                  // 3. Open the modal/form
                  setIsAddingJob(true);
                }}
              />
            </div>
          </>
        )}

        {/* --- VISITS VIEW --- */}
        {activeTab === "visits" && (
          <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
            <header>
              <h2 className="text-3xl font-black">Visitas Activas</h2>
              <p className="text-slate-500">Control de Visitas y Estados</p>
            </header>

            <div className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="overflow-x-auto">
                <VisitsTable
                  visits={filteredVisits}
                  onUpdateStatus={handleUpdateVisitStatus}
                  onConvert={(customer) => setSelectedLead(customer)}
                  onDelete={handleDeleteVisit}
                />
              </div>
            </div>
          </div>
        )}
        {/* --- DASHBOARD VIEW --- */}
        {activeTab === "dashboard" && (
          <DashboardView
            inventory={inventory}
            totalPossibleMix={totalPossibleMix} // This now comes from Java!
            onAddStock={handleAddStock}
            totalQuoted={totalQuoted} // This now comes from Java!
            totalActive={totalActive} // This now comes from Java!
            materialTotal={materialTotal} // This now comes from Java!
          />
        )}
      </main>
    </div>
  );
}

export default App;
