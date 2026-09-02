import {
  LayoutDashboard,
  Users,
  Calendar,
  FileText,
  Briefcase,
} from "lucide-react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  setIsAuthenticated: (value: boolean) => void;
}

export const Sidebar = ({
  activeTab,
  setActiveTab,
  setIsAuthenticated,
}: SidebarProps) => {
  return (
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
          activeTab === "presupuestos" ? "bg-orange-600" : "hover:bg-slate-800"
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
  );
};
