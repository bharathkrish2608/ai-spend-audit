import React from 'react';

export default function SpendForm({ onSubmit }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate submitting with empty/default values for testing the wired flow
    onSubmit({ tools: [], teamSize: 1, useCase: 'general' });
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-white text-center">Spend Form (Placeholder)</h2>
      <p className="text-zinc-400 text-sm mb-6 text-center">
        This is a temporary stub to enable app routing. Submit below to simulate the audit trigger.
      </p>
      <form onSubmit={handleSubmit} className="flex justify-center">
        <button
          type="submit"
          className="bg-emerald-500 hover:bg-emerald-600 text-black px-6 py-3 rounded-xl font-medium transition w-full"
        >
          Simulate Form Submission
        </button>
      </form>
    </div>
  );
}
