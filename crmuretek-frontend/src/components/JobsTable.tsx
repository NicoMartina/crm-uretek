import React from "react";
import { Edit, Trash2 } from "lucide-react";

interface JobsTableProps {
  jobs: any[];
  statusMap: Record<string, { label: string; color: string }>;
  onUpdateStatus: (id: number, status: string) => void;
  onDelete: (id: number) => void;
  onEdit: (id: number) => void;
  onRefresh: () => void;
}

export const JobsTable = ({
  jobs,
  statusMap,
  onUpdateStatus,
  onDelete,
  onEdit,
  onRefresh,
}: JobsTableProps) => {
  return (
    <div className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-500">
                ID
              </th>
              <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-500">
                Cliente
              </th>
              <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-500">
                Estado
              </th>
              <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-500 text-right">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {jobs.map((job) => (
              <tr
                key={job.id}
                className="hover:bg-slate-50/50 transition-colors group"
              >
                <td className="p-4 text-xs font-bold text-slate-400">
                  #{job.id}
                </td>
                <td className="p-4">
                  <div className="font-bold text-slate-800">
                    {job.lead?.name || "Sin nombre"}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {job.lead?.phoneNumber}
                  </div>
                </td>
                <td className="p-4">
                  <select
                    value={job.jobStatus}
                    onChange={(e) => onUpdateStatus(job.id, e.target.value)}
                    className={`text-[10px] font-black uppercase px-2 py-1 rounded-md outline-none cursor-pointer border-none ${
                      statusMap[job.jobStatus]?.color
                    }`}
                  >
                    <option value="QUOTED">Presupuestado</option>
                    <option value="IN_PROGRESS">En Obra</option>
                    <option value="COMPLETED">Finalizado</option>
                  </select>
                </td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => onEdit(job.id)}
                      className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                    >
                      <Edit size={16} />
                    </button>

                    <button
                      onClick={async () => {
                        await onDelete(job.id);
                        onRefresh(); // This uses the "unused" prop to trigger the sync
                      }}
                      className="p-2 text-slate-400 hover:text-red-500 transition-colors"
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
