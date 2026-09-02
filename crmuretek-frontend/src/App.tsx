import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Users,
  Calendar,
  Briefcase,
  Plus,
  FileText,
} from "lucide-react";

// Services
import { jobService } from "./services/jobService";
import { visitService } from "./services/visitService";
import { leadsService } from "./services/leadsService";
import { presupuestoService } from "./services/presupuestoService";

// Components
import { DashboardView } from "./components/DashboardView";
import { LeadsTable } from "./components/LeadsTable";
import { VisitsTable } from "./components/VisitsTable";
import { JobsTable } from "./components/JobsTable";
import LeadForm from "./components/LeadForm";
import { QuoteForm } from "./components/QuoteForm";
import { VisitModal } from "./components/VisitModal";
import { customerService } from "./services/customerService";
import { CustomerTable } from "./components/CustomerTable";
import CustomerForm from "./components/CustomerForm";
import { formatDisplayDate } from "./utils/date";

// Types
import type { Lead } from "./types/Lead";
import type { Job } from "./types/Job";
import type { Visit } from "./types/Visit";
import type { StatsData } from "./types/StatsData";
import type { LeadFormData } from "./types/LeadFormData";
import type { Customer } from "./types/Customer";
import type { SelectedLead } from "./types/SelectedLead";

// Login Component
import { Login } from "./components/Login";

// Additional Types
import type { DashboardSummary } from "./types/DashboardSummary";
import type { VisitCreateData } from "./types/VisitCreateData";
import { authService } from "./services/authService";
import type { Presupuesto } from "./types/Presupuesto";
import PresupuestoForm from "./components/PresupuestoForm";

type VisitApiResponse = {
  visitId: number;
  consultaId: number;
  customerId?: number;
  visitDate?: string;
  hasPaidVisitFee?: boolean;
  visitFeeStatus?: Visit["visitFeeStatus"];
  visitFeeAmount?: number;
  paymentMethod?: string;
  invoiceNumber?: string;
  status: Visit["status"];
  observations?: string;
};

type JobApiResponse = {
  jobId: number;
  consultaId: number;
  customerId?: number;
  workDate?: string;
  estimateMaterialKg?: number;
  observations?: string;
  jobStatus: Job["jobStatus"];
};

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
  const [jobs, setJobs] = useState<Job[]>([]);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [dashboardData, setDashboardData] = useState<DashboardSummary | null>(
    null
  );

  // Modal Controls
  const [isAddingLead, setIsAddingLead] = useState(false);
  const [isAddingQuote, setIsAddingQuote] = useState(false);
  const [isSchedulingVisit, setIsSchedulingVisit] = useState(false);
  const [selectedLead, setSelectedLead] = useState<SelectedLead | null>(null);
  const [viewingLead, setViewingLead] = useState<Lead | null>(null);
  const [leadSearch, setLeadSearch] = useState("");
  const [visitSearch, setVisitSearch] = useState("");
  const [jobSearch, setJobSearch] = useState("");
  const [statsData, setStatsData] = useState<StatsData | null>(null);
  const [viewingJob, setViewingJob] = useState<Job | null>(null);
  const [viewingVisit, setViewingVisit] = useState<Visit | null>(null);
  const [visitObservations, setVisitObservations] = useState("");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [viewingCustomer, setViewingCustomer] = useState<Customer | null>(null);
  const [customerSearch, setCustomerSearch] = useState("");
  const [isEditingCustomer, setIsEditingCustomer] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [isAddingPresupuesto, setIsAddingPresupuesto] = useState(false);
  const [selectedPresupuesto, setSelectedPresupuesto] =
    useState<Presupuesto | null>(null);

  const [presupuestos, setPresupuestos] = useState<Presupuesto[]>([]);
  const [convertingVisitId, setConvertingVisitId] = useState<number | null>(
    null
  );

  const [selectedStatsMonth, setSelectedStatsMonth] = useState(
    new Date().toISOString().slice(0, 7) // "2026-07"
  );

  // login state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = async () => {
    try {
      await authService.login(loginUsername, loginPassword);
      setIsAuthenticated(true);
    } catch (e) {
      setLoginError("Usuario o contraseña incorrectos");
    }
  };

  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // Filter customers based on search input
  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name?.toLowerCase().includes(customerSearch.toLowerCase()) ||
      customer.phoneNumber
        ?.toLowerCase()
        .includes(customerSearch.toLowerCase()) ||
      customer.email?.toLowerCase().includes(customerSearch.toLowerCase())
  );

  // Filter leads based on search input
  const filteredLeads = leads.filter(
    (consulta) =>
      consulta.name?.toLowerCase().includes(leadSearch.toLowerCase()) ||
      consulta.phoneNumber?.toLowerCase().includes(leadSearch.toLowerCase()) ||
      consulta.email?.toLowerCase().includes(leadSearch.toLowerCase()) ||
      consulta.problemDescription
        ?.toLowerCase()
        .includes(leadSearch.toLowerCase())
  );

  const visitStatusMap: Record<string, string> = {
    SCHEDULED: "programada",
    VISITED: "visitada",
  };
  // Filter visits based on search input
  const filteredVisits = visits.filter((visit) => {
    const translatedStatus = visitStatusMap[visit.status] || visit.status;
    return (
      visit.consulta?.customer?.name
        ?.toLowerCase()
        .includes(visitSearch.toLowerCase()) ||
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

  // Filter jobs based on search input
  const filteredJobs = jobs.filter((job) => {
    const translatedStatus = jobStatusMap[job.jobStatus] || job.jobStatus;
    return (
      job.consulta?.customer?.name
        ?.toLowerCase()
        .includes(jobSearch.toLowerCase()) ||
      translatedStatus.toLowerCase().includes(jobSearch.toLowerCase()) ||
      job.observations?.toLowerCase().includes(jobSearch.toLowerCase())
    );
  });

  // Visit Modal State
  const [visitDate, setVisitDate] = useState("");
  const [visitNotes, setVisitNotes] = useState("");

  const mapVisitResponseToVisit = (
    visit: VisitApiResponse,
    allLeads: Lead[]
  ): Visit => {
    const matchingLead = allLeads.find(
      (lead) => lead.consultaId === visit.consultaId
    );

    return {
      id: visit.visitId,
      visitDate: visit.visitDate,
      hasPaidVisitFee: visit.hasPaidVisitFee,
      visitFeeStatus: visit.visitFeeStatus,
      visitFeeAmount: visit.visitFeeAmount,
      paymentMethod: visit.paymentMethod,
      invoiceNumber: visit.invoiceNumber,
      status: visit.status,
      observations: visit.observations,
      visited: visit.status === "VISITED",
      consulta: matchingLead
        ? {
            id: matchingLead.consultaId,
            problemDescription: matchingLead.problemDescription,
            requestDate: matchingLead.requestDate || "",
            customer: {
              id: matchingLead.customerId || visit.customerId || 0,
              name: matchingLead.name,
              email: matchingLead.email,
              phoneNumber: matchingLead.phoneNumber,
              address: matchingLead.address,
              contactChannel: matchingLead.contactChannel,
              source: matchingLead.source,
              contactDate: matchingLead.contactDate,
              title: matchingLead.title ?? null,
              observations: matchingLead.observations ?? null,
            },
          }
        : {
            id: visit.consultaId,
            requestDate: "",
            customer: {
              id: visit.customerId || 0,
            },
          },
    };
  };

  const mapJobResponseToJob = (job: JobApiResponse, allLeads: Lead[]): Job => {
    const matchingLead = allLeads.find(
      (lead) => lead.consultaId === job.consultaId
    );

    return {
      id: job.jobId,
      workDate: job.workDate,
      estimateMaterialKg: job.estimateMaterialKg,
      observations: job.observations,
      jobStatus: job.jobStatus,
      consulta: matchingLead
        ? {
            id: matchingLead.consultaId,
            problemDescription: matchingLead.problemDescription,
            requestDate: matchingLead.requestDate || "",
            customer: {
              id: matchingLead.customerId || job.customerId || 0,
              name: matchingLead.name,
              email: matchingLead.email,
              phoneNumber: matchingLead.phoneNumber,
              address: matchingLead.address,
              source: matchingLead.source,
              contactDate: matchingLead.contactDate,
              title: matchingLead.title ?? null,
              observations: matchingLead.observations ?? null,
            },
          }
        : {
            id: job.consultaId,
            customer: {
              id: job.customerId || 0,
            },
          },
    };
  };

  const syncAllData = async () => {
    try {
      const res = await Promise.allSettled([
        jobService.getAll(),
        visitService.getAll(),
        leadsService.getAll(),
        jobService.getDashboardSummary(),
        jobService.getStats(),
        customerService.getAll(),
        presupuestoService.getAll(),
      ]);

      const allLeads = res[2].status === "fulfilled" ? res[2].value || [] : [];
      if (res[0].status === "fulfilled") {
        const normalizedJobs = (
          res[0].value as unknown as JobApiResponse[]
        ).map((job) => mapJobResponseToJob(job, allLeads));
        const sorted = normalizedJobs.sort((a: Job, b: Job) => {
          const order: Record<string, number> = {
            QUOTED: 0,
            DEPOSIT_PAID: 1,
            BALANCE_PAID: 2,
            COMPLETED: 3,
          };
          return (order[a.jobStatus] ?? 4) - (order[b.jobStatus] ?? 4);
        });
        setJobs(sorted);
      }
      if (res[1].status === "fulfilled") {
        const normalizedVisits = (
          res[1].value as unknown as VisitApiResponse[]
        ).map((visit) => mapVisitResponseToVisit(visit, allLeads));
        const sorted = normalizedVisits.sort((a: Visit, b: Visit) => {
          const order: Record<string, number> = {
            SOLICITADA: 0,
            SCHEDULED: 1,
            VISITED: 2,
          };
          return (order[a.status] ?? 3) - (order[b.status] ?? 3);
        });
        setVisits(sorted);
      }
      if (res[2].status === "fulfilled") {
        // Filtering leads that don't have active jobs
        setLeads(allLeads);
      }
      if (res[3].status === "fulfilled") setDashboardData(res[3].value);
      if (res[4].status === "fulfilled") setStatsData(res[4].value);
      if (res[5].status === "fulfilled") setCustomers(res[5].value || []);
      if (res[6].status === "fulfilled") setPresupuestos(res[6].value || []);
    } catch (e) {
      console.error("Sync Error:", e);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      syncAllData();
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <Login
        loginUsername={loginUsername}
        setLoginUsername={setLoginUsername}
        loginPassword={loginPassword}
        setLoginPassword={setLoginPassword}
        loginError={loginError}
        handleLogin={handleLogin}
      />
    );
  }

  return (
    <div className="flex h-screen bg-slate-100 w-full overflow-hidden">
      {/* Sidebar Navigation */}
      <nav className="w-64 bg-slate-900 text-white p-4 flex flex-col gap-2">
        <h1 className="text-xl font-bold p-4 text-orange-500">URETEK CRM</h1>
        <button
          onClick={() => {
            localStorage.clear();
            setIsAuthenticated(false);
          }}
          className="flex p-3 rounded text-left transition text-red-400 hover:bg-slate-800"
        >
          Cerrar Sesión
        </button>
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
          onClick={() => setActiveTab("presupuestos")}
          className={`flex p-3 rounded text-left transition ${
            activeTab === "presupuestos"
              ? "bg-orange-600"
              : "hover:bg-slate-800"
          }`}
        >
          <FileText className="mr-2" /> Presupuestos
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
            <>
              <div className="mb-4">
                <input
                  type="month"
                  value={selectedStatsMonth}
                  onChange={(e) => setSelectedStatsMonth(e.target.value)}
                  className="border p-2 rounded-xl outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-2xl p-6 shadow">
                  <p className="text-xs font-black uppercase text-slate-400 mb-1">
                    Consultas
                  </p>
                  <p className="text-3xl font-black text-slate-800">
                    {
                      leads.filter((l) =>
                        l.contactDate?.startsWith(selectedStatsMonth)
                      ).length
                    }
                  </p>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow">
                  <p className="text-xs font-black uppercase text-slate-400 mb-1">
                    Visitas
                  </p>
                  <p className="text-3xl font-black text-slate-800">
                    {
                      visits.filter((v) =>
                        v.visitDate?.startsWith(selectedStatsMonth)
                      ).length
                    }
                  </p>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow">
                  <p className="text-xs font-black uppercase text-slate-400 mb-1">
                    Presupuestos
                  </p>
                  <p className="text-3xl font-black text-slate-800">
                    {
                      presupuestos.filter((p) =>
                        p.visitDate?.startsWith(selectedStatsMonth)
                      ).length
                    }
                  </p>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow">
                  <p className="text-xs font-black uppercase text-slate-400 mb-1">
                    Obras Completadas
                  </p>
                  <p className="text-3xl font-black text-orange-500">
                    {
                      jobs.filter(
                        (j) =>
                          j.jobStatus === "COMPLETED" &&
                          j.workDate?.startsWith(selectedStatsMonth)
                      ).length
                    }
                  </p>
                </div>
              </div>
              <DashboardView statsData={statsData} />
            </>
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
                console.log("scheduling visit for:", l);
                setSelectedLead(l);
                setIsSchedulingVisit(true);
                setVisitDate("");
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
                  setIsSchedulingVisit(true);
                }}
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-2xl font-black flex items-center gap-2 shadow-lg transition-all active:scale-95"
              >
                <Plus size={20} /> Nueva Visita
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
              onConvert={(visit) => {
                setSelectedPresupuesto(null);
                setIsAddingPresupuesto(true);
                setConvertingVisitId(visit.id);
              }}
              onUpdateStatus={async (id, s) => {
                await visitService.updateStatus(id, s);
                syncAllData();
              }}
              onUpdatePayment={async (id, paymentData) => {
                await visitService.updatePayment(id, paymentData);
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

        {activeTab === "presupuestos" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-black text-slate-800">
                Presupuestos
              </h2>
              <button
                onClick={() => {
                  setSelectedPresupuesto(null);
                  setIsAddingPresupuesto(true);
                }}
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-2xl font-black flex items-center gap-2 shadow-lg transition-all active:scale-95"
              >
                <Plus size={20} /> Nuevo Presupuesto
              </button>
            </div>
            <div className="bg-white rounded-2xl shadow overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-slate-500 uppercase text-xs">
                  <tr>
                    <th className="p-4 text-left">N° Presupuesto</th>
                    <th className="p-4 text-left">Cliente</th>
                    <th className="p-4 text-left">Fecha</th>
                    <th className="p-4 text-left">Monto</th>
                    <th className="p-4 text-left">Enviado</th>
                    <th className="p-4 text-left">Recibido</th>
                    <th className="p-4 text-left">Aceptado</th>
                    <th className="p-4 text-left">Observaciones</th>
                    <th className="p-4 text-left">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {presupuestos.map((p) => (
                    <tr
                      key={p.presupuestoId}
                      className="border-t hover:bg-slate-50"
                    >
                      <td className="p-4">{p.presupuestoNumber}</td>
                      <td className="p-4">{p.customerName}</td>
                      <td className="p-4">{p.visitDate}</td>
                      <td className="p-4">${p.amount?.toLocaleString()}</td>
                      <td className="p-4">
                        <button
                          onClick={() =>
                            presupuestoService
                              .updateStatus(p.presupuestoId, "sent", !p.sent)
                              .then(syncAllData)
                          }
                          className={`px-3 py-1 rounded-full text-xs font-bold ${
                            p.sent
                              ? "bg-green-100 text-green-700"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {p.sent ? "Sí" : "No"}
                        </button>
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() =>
                            presupuestoService
                              .updateStatus(
                                p.presupuestoId,
                                "received",
                                !p.received
                              )
                              .then(syncAllData)
                          }
                          className={`px-3 py-1 rounded-full text-xs font-bold ${
                            p.received
                              ? "bg-green-100 text-green-700"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {p.received ? "Sí" : "No"}
                        </button>
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() =>
                            presupuestoService
                              .updateStatus(
                                p.presupuestoId,
                                "accepted",
                                !p.accepted
                              )
                              .then(syncAllData)
                          }
                          className={`px-3 py-1 rounded-full text-xs font-bold ${
                            p.accepted
                              ? "bg-green-100 text-green-700"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {p.accepted ? "Sí" : "No"}
                        </button>
                      </td>
                      <td className="p-4">{p.observations || "—"}</td>
                      <td className="p-4 flex gap-2">
                        <button
                          onClick={() => {
                            setSelectedPresupuesto(p);
                            setIsAddingPresupuesto(true);
                          }}
                          className="px-3 py-1 rounded-lg text-xs font-bold bg-blue-100 text-blue-700"
                        >
                          Editar
                        </button>
                        <button
                          onClick={async () => {
                            if (window.confirm("¿Borrar presupuesto?")) {
                              await presupuestoService.delete(p.presupuestoId);
                              syncAllData();
                            }
                          }}
                          className="px-3 py-1 rounded-lg text-xs font-bold bg-red-100 text-red-700"
                        >
                          Borrar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "jobs" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-black text-slate-800">Trabajos</h2>
              <button
                onClick={() => {
                  setSelectedCustomer(null);
                  setIsEditingCustomer(true);
                }}
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-2xl font-black flex items-center gap-2 shadow-lg transition-all active:scale-95"
              >
                <Plus size={20} /> Nuevo Cliente
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
                    existingDescription: jobToEdit.observations,
                    ...jobToEdit.consulta,
                  });
                  setIsAddingQuote(true);
                }
              }}
              onRefresh={syncAllData}
            />
          </div>
        )}

        {activeTab === "customers" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-black text-slate-800">Clientes</h2>
              <button
                onClick={() => {
                  setSelectedCustomer(null);
                  setIsEditingCustomer(true);
                }}
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-2xl font-black flex items-center gap-2 shadow-lg transition-all active:scale-95"
              >
                <Plus size={20} /> Nuevo Cliente
              </button>
            </div>
            <input
              type="text"
              placeholder="Buscar por nombre, teléfono o email..."
              className="w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 mb-4"
              value={customerSearch}
              onChange={(e) => setCustomerSearch(e.target.value)}
            />
            <CustomerTable
              customers={filteredCustomers}
              onView={(c) => setViewingCustomer(c)}
              onEdit={(c) => {
                setSelectedCustomer(c);
                setIsEditingCustomer(true);
              }}
              onDelete={async (id) => {
                if (window.confirm("¿Borrar cliente?")) {
                  try {
                    await customerService.delete(id);
                    syncAllData();
                  } catch (error) {
                    alert(
                      "No se puede eliminar un cliente con consultas asociadas."
                    );
                  }
                }
              }}
              onAddConsulta={(c) => {
                setSelectedLead({ customer: { id: c.id }, customerId: c.id });
                setIsAddingLead(true);
              }}
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
                customers={customers}
                onCancel={() => {
                  setIsAddingLead(false);
                  setSelectedLead(null);
                }}
                onSubmit={async (formData: LeadFormData) => {
                  try {
                    if (selectedLead?.consultaId) {
                      // Update consulta
                      if (!selectedLead?.consultaId) return;
                      await leadsService.update(selectedLead.consultaId, {
                        ...formData,
                        email: formData.email ?? "",
                        address: formData.address ?? "",
                        title: formData.title ?? "",
                        source: formData.source ?? "",
                        contactChannel: formData.contactChannel ?? "",
                        contactDate: formData.contactDate ?? "",
                        observations: formData.observations ?? "",
                        problemDescription: formData.problemDescription,
                        customer: { id: selectedLead.customerId },
                      });
                    } else {
                      await leadsService.create(formData);
                    }
                    await syncAllData();
                    setIsAddingLead(false);
                    setSelectedLead(null);
                  } catch (error) {
                    console.error("Error saving consulta:", error);
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
                  <strong>Titulo:</strong> {viewingLead.title || "Sin título"}
                </p>
                <p>
                  <strong>Nombre:</strong> {viewingLead.name}
                </p>
                <p>
                  <strong>Teléfono:</strong> {viewingLead.phoneNumber}
                </p>
                <p>
                  <strong>Email:</strong> {viewingLead.email || "Sin email"}
                </p>
                <p>
                  <strong>Dirección:</strong> {viewingLead.address}
                </p>
                <p>
                  <strong>Problema:</strong> {viewingLead.problemDescription}
                </p>
                <p>
                  <strong>Observaciones:</strong>{" "}
                  {viewingLead.observations || "Sin observaciones"}
                </p>
                <p>
                  <strong>Como nos conoció:</strong> {viewingLead.source}
                </p>
                <p>
                  <strong>Por que medio se contactó:</strong>{" "}
                  {viewingLead.contactChannel}
                </p>
                <p>
                  <strong>Fecha Contacto:</strong>{" "}
                  {formatDisplayDate(viewingLead.contactDate)}
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
                  {viewingVisit.consulta?.customer?.name || "Sin nombre"}
                </p>
                <p>
                  <strong>Teléfono:</strong>{" "}
                  {viewingVisit.consulta?.customer?.phoneNumber ||
                    "Sin teléfono"}
                </p>
                <p>
                  <strong>Dirección:</strong>{" "}
                  {viewingVisit.consulta?.customer?.address || "Sin dirección"}
                </p>
                <p>
                  <strong>Fecha:</strong>{" "}
                  {formatDisplayDate(viewingVisit.visitDate)}
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
                  Fecha de Visita
                </label>
                <input
                  type="date"
                  className="w-full border border-slate-200 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-orange-500 mb-4"
                  value={viewingVisit.visitDate || ""}
                  onChange={(e) =>
                    setViewingVisit({
                      ...viewingVisit,
                      visitDate: e.target.value,
                    })
                  }
                />
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
                    if (viewingVisit.visitDate) {
                      await visitService.updateDate(
                        viewingVisit.id,
                        viewingVisit.visitDate
                      );
                    }
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
                  {formatDisplayDate(viewingJob.workDate)}
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
                    {viewingJob.consulta?.customer?.name || "Sin nombre"}
                  </p>
                  <p>
                    <strong>Teléfono:</strong>{" "}
                    {viewingJob.consulta?.customer?.phoneNumber ||
                      "Sin teléfono"}
                  </p>
                  <p>
                    <strong>Dirección:</strong>{" "}
                    {viewingJob.consulta?.customer?.address || "Sin dirección"}
                  </p>
                  <p>
                    <strong>Problema:</strong>{" "}
                    {viewingJob.consulta?.problemDescription ||
                      "Sin descripción"}
                  </p>
                  <p>
                    <strong>Origen:</strong>{" "}
                    {viewingJob.consulta?.customer?.source || "Sin origen"}
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

        {viewingCustomer && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative overflow-y-auto max-h-[90vh]">
              <button
                onClick={() => setViewingCustomer(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 transition-colors"
              >
                ✕
              </button>
              <h2 className="text-2xl font-black mb-1">
                {viewingCustomer.name}
              </h2>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-6">
                Cliente #{viewingCustomer.id}
              </p>

              <div className="space-y-3 text-sm mb-6">
                <p>
                  <strong>Teléfono:</strong>{" "}
                  {viewingCustomer.phoneNumber || "Sin teléfono"}
                </p>
                <p>
                  <strong>Email:</strong> {viewingCustomer.email || "Sin email"}
                </p>
                <p>
                  <strong>Canal de Contacto:</strong>{" "}
                  {viewingCustomer.contactChannel || "-"}
                </p>
                <p>
                  <strong>¿Cómo nos conoció?:</strong>{" "}
                  {viewingCustomer.source || "-"}
                </p>
                <p>
                  <strong>Fecha de Contacto:</strong>{" "}
                  {viewingCustomer.contactDate
                    ?.split("-")
                    .reverse()
                    .join("/") || "Sin fecha"}
                </p>
              </div>

              <div className="border-t border-slate-100 pt-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">
                  Consultas
                </p>
                {viewingCustomer.consulta &&
                viewingCustomer.consulta.length > 0 ? (
                  <div className="space-y-2">
                    {viewingCustomer.consulta.map((c) => (
                      <div
                        key={c.consultaId}
                        className="bg-slate-50 rounded-xl p-3 text-sm"
                      >
                        <p>
                          <strong>Problema:</strong>{" "}
                          {c.problemDescription || "Sin descripción"}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-400 text-sm">
                    Sin consultas registradas
                  </p>
                )}
              </div>

              <button
                onClick={() => setViewingCustomer(null)}
                className="w-full mt-6 bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        )}

        {isEditingCustomer && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl overflow-y-auto max-h-[90vh]">
              <h2 className="text-2xl font-black mb-4">Editar Cliente</h2>
              <CustomerForm
                initialData={selectedCustomer}
                onCancel={() => {
                  setIsEditingCustomer(false);
                  setSelectedCustomer(null);
                }}
                onSubmit={async (formData) => {
                  if (selectedCustomer?.id) {
                    await customerService.update(selectedCustomer.id, formData);
                  } else {
                    await customerService.create(formData);
                  }
                  await syncAllData();
                  setIsEditingCustomer(false);
                  setSelectedCustomer(null);
                }}
                onRefresh={syncAllData}
              />
            </div>
          </div>
        )}

        {isAddingQuote && selectedLead && (
          <QuoteForm
            consulta={selectedLead}
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
                  consultaId: selectedLead.consultaId || selectedLead.id,
                });
              }
              setIsAddingQuote(false);
              syncAllData();
            }}
          />
        )}

        {isSchedulingVisit && (
          <VisitModal
            allLeads={leads}
            consulta={selectedLead}
            visitDate={visitDate}
            setVisitDate={setVisitDate}
            visitNotes={visitNotes}
            setVisitNotes={setVisitNotes}
            onClose={() => setIsSchedulingVisit(false)}
            onConsultaSelect={(c) => setSelectedLead(c)}
            onConfirm={async () => {
              console.log(selectedLead);
              if (!selectedLead?.consultaId) return;
              const visitData: VisitCreateData = {
                consultaId: selectedLead.consultaId,
                observations: visitNotes,
                ...(visitDate ? { visitDate } : {}),
              };
              await visitService.create(visitData);
              setIsSchedulingVisit(false);
              syncAllData();
            }}
          />
        )}

        {isAddingPresupuesto && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl overflow-y-auto max-h-[90vh]">
              <h2 className="text-2xl font-black mb-4">
                {selectedPresupuesto
                  ? "Editar Presupuesto"
                  : "Nuevo Presupuesto"}
              </h2>
              <PresupuestoForm
                initialData={selectedPresupuesto}
                defaultVisitId={convertingVisitId}
                visits={visits}
                onCancel={() => {
                  setIsAddingPresupuesto(false);
                  setSelectedPresupuesto(null);
                  setConvertingVisitId(null);
                }}
                onSubmit={async (formData) => {
                  if (selectedPresupuesto) {
                    await presupuestoService.update(
                      selectedPresupuesto.presupuestoId,
                      formData
                    );
                  } else {
                    await presupuestoService.create(formData);
                  }
                  await syncAllData();
                  setIsAddingPresupuesto(false);
                  setSelectedPresupuesto(null);
                }}
                onRefresh={syncAllData}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
