import React, { useState } from "react";

interface QuoteFormProps {
  lead: any;
  onCancel: () => void;
  onCreate: (jobData: any) => void;
}

export const QuoteForm: React.FC<QuoteFormProps> = ({
  lead,
  onCancel,
  onCreate,
}) => {
  const [amount, setAmount] = useState("");
  const [material, setMaterial] = useState("");
  const [workDate, setWorkDate] = useState("2026-01-23");
  const [description, setDescription] = useState(""); // Added state for description

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Create Quote for {lead.name}</h2>

        <div className="mb-4">
          <label className="block text-sm font-bold text-slate-700 mb-1">
            Job Description
          </label>
          <input
            type="text"
            className="w-full border p-2 rounded-lg"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Quebraduras en las paredes..."
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-bold text-slate-700 mb-1">
            Total Amount ($)
          </label>
          <input
            type="number"
            className="w-full border p-2 rounded-lg"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-bold text-slate-700 mb-1">
            Material Est. (kg)
          </label>
          <input
            type="number"
            className="w-full border p-2 rounded-lg"
            value={material}
            onChange={(e) => setMaterial(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-bold text-slate-700 mb-1">
            Fecha de Trabajo
          </label>
          <input
            type="date"
            className="w-full border p-2 rounded-lg"
            value={workDate}
            onChange={(e) => setWorkDate(e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-300 px-4 py-2 rounded-md font-bold"
          >
            Cancel
          </button>
          <button
            type="button" // CHANGED TO "button" so it doesn't trigger a form submit
            onClick={() =>
              onCreate({
                totalAmount: Number(amount),
                estimateMaterialKg: Number(material),
                workDate: workDate,
                jobDescription: description,
              })
            }
            className="bg-orange-400 hover:bg-orange-500 text-white px-4 py-2 rounded-md font-bold"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};
