import { Calendar, Trash2, Edit } from "lucide-react";
import { TITLE_MAP } from "../utils/Maps";

interface LeadsTableProps {
  leads: any[];
  onView: (consulta: any) => void;
  onEdit: (consulta: any) => void;
  onDelete: (id: number) => void;
  onScheduleVisit: (consulta: any) => void;
  onQuote: (consulta: any) => void;
}

export const LeadsTable = ({
  leads,
  onView,
  onEdit,
  onDelete,
  onScheduleVisit,
  onQuote,
}: LeadsTableProps) => {
  return (
    <div className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-500">
                Fecha
              </th>
              <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-500">
                Nombre
              </th>
              <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-500">
                Teléfono
              </th>
              <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-500 text-right">
                Acciones Rápidas
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {leads.map((consulta) => (
              <tr
                key={consulta.id}
                className="hover:bg-slate-50/50 transition-colors group"
              >
                <td className="p-4 text-xs font-medium text-slate-400">
                  {consulta.customer?.contactDate
                    ? consulta.customer.contactDate
                        .split("-")
                        .reverse()
                        .join("/")
                    : "Sin fecha"}
                </td>
                <td className="p-4 font-black text-slate-800">
                  <button
                    onClick={() => onView(consulta)}
                    className="font-black text-slate-800 hover:text-orange-500 text-left transition-colors"
                  >
                    {consulta.customer?.title
                      ? `${TITLE_MAP[consulta?.customer?.title]} ${
                          consulta?.customer?.name
                        }`
                      : consulta?.customer?.name || "Sin nombre"}
                  </button>
                </td>
                <td className="p-4 text-slate-500 font-medium">
                  {consulta.customer?.phoneNumber}
                </td>
                <td className="p-4">
                  <div className="flex justify-end gap-2">
                    <a
                      href={`https://wa.me/54${consulta.customer?.phoneNumber?.replace(
                        /\D/g,
                        ""
                      )}`}
                      target="_blank"
                      className="px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-lg font-bold text-[10px] uppercase hover:bg-emerald-200 transition-all flex items-center gap-1"
                    >
                      WhatsApp
                    </a>
                    <button
                      onClick={() => onScheduleVisit(consulta)}
                      className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg font-bold text-[10px] uppercase hover:bg-blue-200 transition-all flex items-center gap-1"
                    >
                      <Calendar size={12} /> Visita
                    </button>
                    <button
                      onClick={() => onQuote(consulta)}
                      className="px-3 py-1.5 bg-orange-100 text-orange-700 rounded-lg font-bold text-[10px] uppercase hover:bg-orange-200 transition-all"
                    >
                      + Obra
                    </button>
                    <button
                      onClick={() => onEdit(consulta)}
                      className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-all"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => onDelete(consulta.id)}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                    >
                      <Trash2 size={18} />
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
