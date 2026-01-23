import React from "react";

interface QuoteFormProps {
  lead: any;
  onCancel: () => void;
  onCreate: (jobData: any) => void;
}

const QuoteForm: React.FC<QuoteFormProps> = ({ lead, onCancel, onCreate }) => {
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const jobData = Object.fromEntries(formData.entries());
    onCreate(jobData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md"
      >
        <h2 className="text-xl font-bold mb-4">Create Quote for {lead.name}</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Job Description
          </label>
          <input
            name="description"
            type="text"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Total Amount
          </label>
          <input
            name="totalAmount"
            type="number"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            required
          />
        </div>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            Create
          </button>
        </div>
      </form>
    </div>
  );
};

export default QuoteForm;
