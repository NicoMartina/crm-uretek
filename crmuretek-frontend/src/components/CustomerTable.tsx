import { Edit, Trash2 } from "lucide-react";

interface CustomerTableProps {
  customers: any[];
  onView: (customer: any) => void;
  onEdit: (customer: any) => void;
  onDelete: (id: number) => void;
}

export const CustomerTable = ({
  customers,
  onView,
  onEdit,
  onDelete,
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
                Nombre
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
                  {customer.contactDate
                    ? customer.contactDate.split("-").reverse().join("/")
                    : "Sin fecha"}
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
                  {customer.phoneNumber || "-"}
                </td>
                <td className="p-4">
                  <div className="flex justify-end gap-2">
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
                <td className="p-4">
                  <div className="flex justify-end gap-2">
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
