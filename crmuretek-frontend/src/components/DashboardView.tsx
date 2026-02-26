import { Package } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

interface DashboardViewProps {
  inventory: any;
  totalPossibleMix: number;
  onAddStock: (type: "iso" | "resina") => void;
  totalQuoted: number;
  totalActive: number;
  materialTotal: number;
  statsData?: any;
}

export const DashboardView = ({
  inventory,
  totalPossibleMix,
  onAddStock,
  totalQuoted,
  totalActive,
  materialTotal,
  statsData,
}: DashboardViewProps) => {
  const leadsChartData = statsData
    ? Object.entries(statsData.leadsPerMonth).map(([month, count]) => ({
        month,
        leads: count,
      }))
    : [];

  const sourceChartData = statsData
    ? Object.entries(statsData.leadsBySource).map(([source, count]) => ({
        name: source,
        value: count,
      }))
    : [];

  const COLORS = [
    "#f97316",
    "#3b82f6",
    "#10b981",
    "#8b5cf6",
    "#ec4899",
    "#14b8a6",
  ];

  const jobsChartData = statsData
    ? Object.entries(statsData.jobsPerMonth).map(([month, count]) => ({
        month,
        jobs: count as number,
      }))
    : [];

  const visitsChartData = statsData
    ? Object.entries(statsData.visitsPerMonth).map(([month, count]) => ({
        month,
        visits: count as number,
      }))
    : [];

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <header>
        <h2 className="text-3xl font-black text-slate-800">Panel de Control</h2>
        <p className="text-slate-500">Resumen de stock y finanzas</p>
      </header>

      {/* --- INVENTORY BOX --- */}
      <div className="bg-slate-900 p-8 rounded-[2rem] shadow-xl text-white border-b-8 border-orange-500">
        <div className="flex justify-between items-start mb-6">
          <div>
            <span className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
              Capacidad de Obra Total
            </span>
            <h3 className="text-5xl font-black mt-2 leading-none">
              {Math.floor(totalPossibleMix).toLocaleString()}{" "}
              <span className="text-xl text-slate-500 uppercase">kg</span>
            </h3>
          </div>
          <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-sm">
            <Package size={32} className="text-orange-500" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/10">
          <div>
            <p className="text-slate-500 text-[10px] font-bold uppercase mb-1">
              Stock ISO (63%)
            </p>
            <p className="text-xl font-black text-blue-400">
              {inventory?.isoStock?.toLocaleString() || 0} kg
            </p>
          </div>
          <div>
            <p className="text-slate-500 text-[10px] font-bold uppercase mb-1">
              Stock Resina (37%)
            </p>
            <p className="text-xl font-black text-emerald-400">
              {inventory?.resinaStock?.toLocaleString() || 0} kg
            </p>
          </div>
        </div>

        <div className="mt-8 flex gap-4 border-t border-white/10 pt-6">
          <button
            onClick={() => onAddStock("iso")}
            className="flex-1 bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 py-3 rounded-2xl font-bold text-xs transition-all border border-blue-500/30"
          >
            + CARGAR ISO
          </button>
          <button
            onClick={() => onAddStock("resina")}
            className="flex-1 bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-400 py-3 rounded-2xl font-bold text-xs transition-all border border-emerald-500/30"
          >
            + CARGAR RESINA
          </button>
        </div>
      </div>

      {/* --- QUICK STATS --- */}
      {statsData && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Leads per month bar chart */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h4 className="text-[10px] font-black uppercase text-slate-400 mb-4">
              Consultas por Mes
            </h4>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={leadsChartData}>
                <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Bar dataKey="leads" fill="#f97316" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Lead source pie chart */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h4 className="text-[10px] font-black uppercase text-slate-400 mb-4">
              Origen de las Consultas
            </h4>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={sourceChartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {sourceChartData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          {/* Visits per month bar chart */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h4 className="text-[10px] font-black uppercase text-slate-400 mb-4">
              Visitas por Mes
            </h4>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={visitsChartData}>
                <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Bar dataKey="visits" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          {/* Jobs per month bar chart */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h4 className="text-[10px] font-black uppercase text-slate-400 mb-4">
              Obras por Mes
            </h4>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={jobsChartData}>
                <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Bar dataKey="jobs" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <span className="text-slate-400 text-[10px] font-bold uppercase">
            Presupuestado
          </span>
          <h3 className="text-2xl font-black text-slate-800 mt-1">
            ${(totalQuoted || 0).toLocaleString()}
          </h3>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <span className="text-slate-400 text-[10px] font-bold uppercase">
            En Obra
          </span>
          <h3 className="text-2xl font-black text-slate-800 mt-1">
            ${(totalActive || 0).toLocaleString()}
          </h3>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <span className="text-slate-400 text-[10px] font-bold uppercase">
            Material Requerido
          </span>
          <h3 className="text-2xl font-black text-orange-500 mt-1">
            {(materialTotal || 0).toLocaleString()} kg
          </h3>
        </div>
      </div>
    </div>
  );
};
