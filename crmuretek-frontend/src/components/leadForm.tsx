import React, { useState } from "react";
import axios from "axios";

// We define what "onRefresh" is so App.tsx can tell us to update the list
export default function LeadForm({ onRefresh }: { onRefresh: () => void }) {
  // We use one "state" object to hold all the form data
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    email: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Stops the page from reloading
    try {
      // This sends the data to your @PostMapping in Java
      await axios.post("http://localhost:8080/api/customers", formData);

      // Clear the form for the next lead
      setFormData({ name: "", phoneNumber: "", email: "" });

      // Tell the main App to refresh the list of jobs/customers
      onRefresh();

      alert("Lead saved successfully!");
    } catch (error) {
      console.error("Error saving lead:", error);
      alert("Failed to save lead. Is the Java backend running?");
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-8">
      <h2 className="text-xl font-bold text-slate-800 mb-4">
        Add New Customer Lead
      </h2>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <input
          className="border p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-700"
          placeholder="Customer Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        <input
          className="border p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-700"
          placeholder="Phone Number"
          value={formData.phoneNumber}
          onChange={(e) =>
            setFormData({ ...formData, phoneNumber: e.target.value })
          }
          required
        />
        <input
          className="border p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-700"
          placeholder="Email (Optional)"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition"
        >
          Create Lead
        </button>
      </form>
    </div>
  );
}
