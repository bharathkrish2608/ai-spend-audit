import { useState } from "react";
import { updateAuditLead } from "../services/supabase";

export default function LeadCapture({ auditId, totalMonthlySavings }) {
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [role, setRole] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [status, setStatus] = useState(null); // null | "success" | "error"

  const handleSubmit = async () => {
    // Spam protection – if honeypot filled, ignore silently
    if (website) {
      return;
    }
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
    <div className="max-w-2xl mx-auto pt-16 pb-16 text-zinc-100 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-2">Get your full report</h2>
      <p className="text-sm text-zinc-400 mb-4">
        We'll email you the audit and notify you when new savings apply.
      </p>
      <div className="space-y-6">
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
        {/* Honeypot field, hidden from users */}
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
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 rounded transition-colors"
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
