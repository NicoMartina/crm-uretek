import { useState, useEffect } from "react";
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
import type { StatsData } from "../types/StatsData";

interface DashboardViewProps {
  statsData: StatsData | null;
}

export const DashboardView = ({ statsData }: DashboardViewProps) => {
  const leadsChartData = statsData
    ? Object.entries(statsData.leadsPerMonth).map(([month, count]) => ({
        month,
        leads: count,
      }))
    : [];

  const months = statsData ? Object.keys(statsData.leadsBySource) : [];
  const lastMonth = months[months.length - 1] || "";
  const [selectedMonth, setSelectedMonth] = useState(lastMonth);

  const sourceChartData =
    statsData && statsData.leadsBySource[selectedMonth]
      ? Object.entries(statsData.leadsBySource[selectedMonth]).map(
          ([source, count]) => ({
            name: source,
            value: count,
          })
        )
      : [];

  useEffect(() => {
    if (statsData) {
      const months = Object.keys(statsData.leadsBySource);
      setSelectedMonth(months[months.length - 1] || "");
    }
  }, [statsData]);

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
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="text-[10px] font-black uppercase px-2 py-1 rounded-md border border-slate-200 outline-none mb-4"
            >
              {months.map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>
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
    </div>
  );
};
