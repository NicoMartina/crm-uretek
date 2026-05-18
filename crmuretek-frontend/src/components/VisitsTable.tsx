import { Trash2, Briefcase } from "lucide-react";
import { TITLE_LABEL_MAP } from "../utils/Maps";
import { formatDisplayDate } from "../utils/date";
import type { Visit } from "../types/Visit";

interface VisitsTableProps {
  visits: Visit[];
  onUpdateStatus: (id: number, status: string) => void;
  onView: (visit: Visit) => void;
  onConvert: (consulta: NonNullable<Visit["consulta"]>) => void;
  onDelete: (id: number) => void;
}

export const VisitsTable = ({
  visits,
  onUpdateStatus,
  onView,
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
                Nombre y Apellido
              </th>
              <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-500">
                Categoria
              </th>
              <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-500">
                Estado
              </th>
              <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-500 text-right">
                Acciones Rápidas
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
                    {formatDisplayDate(visit.visitDate)}
                  </div>
                </td>
                <td className="p-4">
                  <button
                    onClick={() => onView(visit)}
                    className="font-black text-slate-700 hover:text-orange-500 transition-colors text-left"
                  >
                    {visit.consulta?.customer?.name || "Sin nombre"}
                  </button>
                </td>
                <td className="p-4 text-slate-500 font-medium">
                  {visit.consulta?.customer?.title
                    ? TITLE_LABEL_MAP[visit.consulta.customer.title]
                    : "-"}
                </td>
                <td className="p-4">
                  <select
                    value={visit.status}
                    onChange={(e) => onUpdateStatus(visit.id, e.target.value)}
                    className={`text-[10px] font-black uppercase px-2 py-1 rounded-md outline-none cursor-pointer border-none ${
                      visit.status === "SOLICITADA"
                        ? "bg-yellow-100 text-yellow-700"
                        : visit.status === "SCHEDULED"
                        ? "bg-orange-100 text-orange-700"
                        : "bg-emerald-100 text-emerald-700"
                    }`}
                  >
                    <option value="SOLICITADA">Solicitada</option>
                    <option value="SCHEDULED">Programada</option>
                    <option value="VISITED">Visitada</option>
                  </select>
                </td>
                <td className="p-4">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => onView(visit)}
                      className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg font-bold text-[10px] uppercase hover:bg-slate-200 transition-all"
                    >
                      Más Info
                    </button>
                    <button
                      onClick={() =>
                        visit.consulta && onConvert(visit.consulta)
                      }
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
