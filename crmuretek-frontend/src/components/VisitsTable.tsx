import React from "react";
import { Trash2, Briefcase } from "lucide-react";

interface VisitsTableProps {
  visits: any[];
  onUpdateStatus: (id: number, status: string) => void;
  onConvert: (customer: any) => void;
  onDelete: (id: number) => void;
}

export const VisitsTable = ({
  visits,
  onUpdateStatus,
  onConvert,
  onDelete,
}: VisitsTableProps) => {
  return (
    <div className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-500">
                Fecha
              </th>
              <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-500">
                Cliente
              </th>
              <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-500">
                Estado
              </th>
              <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-500 text-right">
                Gestión
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {visits.map((visit) => (
              <tr
                key={visit.id}
                className="hover:bg-slate-50/50 transition-colors group"
              >
                <td className="p-4">
                  <div className="font-bold text-slate-800">
                    {new Date(visit.visitDate).toLocaleDateString()}
                  </div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase">
                    Visita #{visit.id}
                  </div>
                </td>
                <td className="p-4 font-black text-slate-700">
                  {visit.customer.name}
                </td>
                <td className="p-4">
                  <span
                    className={`px-2 py-1 rounded-md text-[10px] font-black uppercase ${
                      visit.status === "VISITED"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-orange-100 text-orange-700"
                    }`}
                  >
                    {visit.status}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex justify-end gap-2">
                    {visit.status === "SCHEDULED" && (
                      <button
                        onClick={() => onUpdateStatus(visit.id, "VISITED")}
                        className="px-3 py-1.5 bg-blue-600 text-white rounded-lg font-bold text-[10px] uppercase hover:bg-blue-700 transition-all"
                      >
                        Marcar Visitado
                      </button>
                    )}
                    <button
                      onClick={() => onConvert(visit.customer)}
                      className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg font-bold text-[10px] uppercase hover:bg-emerald-700 transition-all flex items-center gap-1"
                    >
                      <Briefcase size={12} /> Convertir
                    </button>
                    <button
                      onClick={() => onDelete(visit.id)}
                      className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
