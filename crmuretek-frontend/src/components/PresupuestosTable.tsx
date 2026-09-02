import { Plus } from "lucide-react";
import type { Presupuesto } from "../types/Presupuesto";
import { presupuestoService } from "../services/presupuestoService";

interface PresupuestosTableProps {
  presupuestos: Presupuesto[];
  setSelectedPresupuesto: (presupuesto: Presupuesto | null) => void;
  setIsAddingPresupuesto: (value: boolean) => void;
  syncAllData: () => void;
}

export const PresupuestosTable = ({
  presupuestos,
  setSelectedPresupuesto,
  setIsAddingPresupuesto,
  syncAllData,
}: PresupuestosTableProps) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black text-slate-800">Presupuestos</h2>
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
              <tr key={p.presupuestoId} className="border-t hover:bg-slate-50">
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
                        .updateStatus(p.presupuestoId, "received", !p.received)
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
                        .updateStatus(p.presupuestoId, "accepted", !p.accepted)
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
  );
};
