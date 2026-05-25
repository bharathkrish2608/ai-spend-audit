import { useState } from "react";
import { updateAuditLead } from "../services/supabase";

export default function LeadCapture({ auditId, totalMonthlySavings }) {
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [role, setRole] = useState("");
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState(null);

  const handleSubmit = async () => {
    if (website) return;
    if (!email) {
      setStatus("error");
      return;
    }
    try {
      await updateAuditLead(auditId, email, companyName, role);
      setStatus("success");
    } catch (e) {
      console.error(e);
      setStatus("error");
    }
  };

  return (
    <div className="max-w-2xl mx-auto pt-12 pb-16 px-6 bg-zinc-900 text-zinc-100 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Get your full report this</h2>
      <p className="text-sm text-white mb-14">
        We'll email you the audit and notify you when new savings apply.
      </p>
      <br />

      <div className="flex flex-col gap-8">
        <input
          type="email"
          placeholder="Email (required)"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 text-zinc-100 placeholder-zinc-500 rounded focus:outline-none focus:border-emerald-500"
        />
        <input
          type="text"
          placeholder="Company name (optional)"
          value={companyName}
          onChange={e => setCompanyName(e.target.value)}
          className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 text-zinc-100 placeholder-zinc-500 rounded focus:outline-none focus:border-emerald-500"
        />
        <input
          type="text"
          placeholder="Role (optional)"
          value={role}
          onChange={e => setRole(e.target.value)}
          className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 text-zinc-100 placeholder-zinc-500 rounded focus:outline-none focus:border-emerald-500"
        />
        <input
          type="text"
          name="website"
          value={website}
          onChange={e => setWebsite(e.target.value)}
          className="hidden"
        />
        <button
          type="button"
          onClick={handleSubmit}
          className="w-full bg-[var(--brand-green)] hover:bg-[var(--brand-green-hover)] text-zinc-950 font-medium py-2 rounded transition-colors"
        >
          Submit
        </button>
        {status === "success" && (
          <p className="text-emerald-400 text-base mt-2">Audit saved. We'll be in touch.</p>
        )}
        {status === "error" && (
          <p className="text-red-400 text-sm mt-2">Something went wrong. Try again.</p>
        )}
      </div>
    </div>
  );
}