import { Edit, Trash2 } from "lucide-react";
import { TITLE_LABEL_MAP } from "../utils/Maps";
import { formatDisplayDate } from "../utils/date";
import type { Customer } from "../types/Customer";

interface CustomerTableProps {
  customers: Customer[];
  onView: (customer: Customer) => void;
  onEdit: (customer: Customer) => void;
  onDelete: (id: number) => void;
  onAddConsulta: (customer: Customer) => void;
}

export const CustomerTable = ({
  customers,
  onView,
  onEdit,
  onDelete,
  onAddConsulta,
}: CustomerTableProps) => {
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
                Teléfono
              </th>
              <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-500 text-right">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {customers.map((customer) => (
              <tr
                key={customer.id}
                className="hover:bg-slate-50/50 transition-colors group"
              >
                <td className="p-4 text-xs font-medium text-slate-400">
                  {formatDisplayDate(customer.contactDate)}
                </td>
                <td className="p-4">
                  <button
                    onClick={() => onView(customer)}
                    className="font-black text-slate-700 hover:text-orange-500 transition-colors text-left"
                  >
                    {customer.name || "Sin nombre"}
                  </button>
                </td>
                <td className="p-4 text-slate-500 font-medium">
                  {customer.title ? TITLE_LABEL_MAP[customer.title] : "-"}
                </td>
                <td className="p-4 text-slate-500 font-medium">
                  {customer.phoneNumber || "-"}
                </td>
                <td className="p-4">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => onAddConsulta(customer)}
                      className="px-3 py-1.5 bg-orange-100 text-orange-700 rounded-lg font-bold text-[10px] uppercase hover:bg-orange-200 transition-all"
                    >
                      + Consulta
                    </button>
                    <button
                      onClick={() => onView(customer)}
                      className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg font-bold text-[10px] uppercase hover:bg-slate-200 transition-all"
                    >
                      Más Info
                    </button>
                    <button
                      onClick={() => onEdit(customer)}
                      className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-all"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => onDelete(customer.id)}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
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
