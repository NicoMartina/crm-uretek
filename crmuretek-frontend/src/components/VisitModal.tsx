import type { Lead } from "../types/Lead";
import type { SelectedLead } from "../types/SelectedLead";

interface VisitModalProps {
  allLeads?: Lead[];
  consulta: SelectedLead | null;
  visitDate: string;
  setVisitDate: (date: string) => void;
  visitNotes: string;
  setVisitNotes: (notes: string) => void;
  onClose: () => void;
  onConfirm: () => void;
  onConsultaSelect?: (consulta: Lead | null) => void;
}

export const VisitModal = ({
  allLeads,
  consulta,
  visitDate,
  setVisitDate,
  visitNotes,
  setVisitNotes,
  onClose,
  onConfirm,
  onConsultaSelect,
}: VisitModalProps) => {
  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
        <h3 className="text-2xl font-black mb-2">Agendar Visita</h3>

        {consulta ? (
          <p className="text-slate-500 mb-6">
            Cliente: {consulta.customer?.name ?? consulta.name}
          </p>
        ) : (
          <div className="mb-6">
            <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
              Seleccionar Consulta
            </label>
            <select
              className="w-full p-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-orange-500"
              onChange={(e) => {
                const found = allLeads?.find(
                  (l) => l.consultaId === Number(e.target.value)
                );
                onConsultaSelect?.(found || null);
              }}
            >
              <option value="">Seleccione un cliente</option>
              {(allLeads || []).map((l) => (
                <option key={l.consultaId} value={l.consultaId}>
                  {l.name} - {l.phoneNumber}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
              Fecha de Visita
            </label>
            <input
              type="date"
              className="w-full p-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
              value={visitDate}
              onChange={(e) => setVisitDate(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
              Observaciones
            </label>
            <textarea
              className="w-full p-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-orange-500"
              rows={3}
              value={visitNotes}
              onChange={(e) => setVisitNotes(e.target.value)}
              placeholder="Ej: Revisar grietas en el garaje..."
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 py-3 font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 py-3 bg-orange-400 text-white font-bold rounded-xl shadow-lg shadow-orange-200 hover:bg-orange-500 transition-all"
            >
              Confirmar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
