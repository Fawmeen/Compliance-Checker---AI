'use client';

import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Shield, AlertTriangle, Check, Trash2, Search, Filter, Loader2, FileText, Calendar } from 'lucide-react';

type Policy = {
  _id: string;
  name: string;
  category: string;
  status: string;
  indexed: boolean;
  createdAt: string;
};

export default function PoliciesPage() {
  const [loading, setLoading] = useState(true);
  const [policies, setPolicies] = useState<Policy[]>([]);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchPolicy() {
      try {
        const res = await fetch("api/policy");
        if (!res.ok) throw new Error("Failed to fetch");

        const data = await res.json();
        if (Array.isArray(data)) {
          setPolicies(data);
        } else {
          console.error("API returned non-array data:", data);
          setPolicies([]);
        }
      } catch (error) {
        console.error("Failed to fetch policies", error);
        setPolicies([]);
      } finally {
        setLoading(false);
      }
    }
    fetchPolicy();
  }, []);

  useEffect(() => {
    if (!loading && policies.length > 0) {
      gsap.fromTo(
        ".policy-card",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "power2.out" }
      );
    }
  }, [loading, policies]);

  async function deactivatePolicy(id: string) {
    // Optimistic update could be done here, but sticking to simple reliable patterns for now
    const res = await fetch(`/api/policy/${id}/deactivate`, {
      method: 'PATCH'
    });
    const data = await res.json();
    console.log(data);

    // Refresh
    setLoading(true);
    const resUpdated = await fetch("api/policy");
    const dataUpdated = await resUpdated.json();
    setPolicies(dataUpdated);
    setLoading(false);
  }

  return (
    <div className="min-h-screen p-6 md:p-12">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Policy Documents</h1>
            <p className="text-slate-500">Manage and monitor your compliance policies.</p>
          </div>
          <div className="flex items-center gap-2">
            {/* Placeholder for future search/filter */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search policies..."
                className="pl-10 pr-4 py-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all text-sm w-full md:w-64"
              />
            </div>
            <button className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-colors">
              <Filter className="w-4 h-4 text-slate-600" />
            </button>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-violet-600 animate-spin" />
            <span className="ml-3 text-slate-600 font-medium">Loading policies...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" ref={listRef}>
            {policies.map((p) => (
              <div
                key={p._id}
                className="policy-card group relative bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-violet-100 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl ${p.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                    {p.status === 'ACTIVE' ? <Shield className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-semibold ${p.indexed ? 'bg-violet-100 text-violet-700' : 'bg-slate-100 text-slate-500 ml-auto'}`}>
                    {p.indexed ? "Indexed" : "Not Indexed"}
                  </div>
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-1" title={p.name}>
                  {p.name}
                </h3>

                <div className="space-y-2 mb-6">
                  <div className="flex items-center text-xs text-slate-500">
                    <FileText className="w-3 h-3 mr-2" />
                    Category: {p.category}
                  </div>
                  <div className="flex items-center text-xs text-slate-500">
                    <Calendar className="w-3 h-3 mr-2" />
                    Created: {new Date(p.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className={`text-xs font-semibold px-2 py-1 rounded ${p.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                    {p.status}
                  </span>

                  {p.status === "ACTIVE" && (
                    <button
                      onClick={() => deactivatePolicy(p._id)}
                      className="text-xs font-medium text-red-500 hover:text-red-600 bg-red-50 hover:bg-red-100 px-3 py-2 rounded-lg transition-colors flex items-center gap-1"
                    >
                      Deactivate
                    </button>
                  )}
                </div>
              </div>
            ))}

            {policies.length === 0 && (
              <div className="col-span-full text-center py-12 text-slate-500">
                <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-slate-400" />
                </div>
                No policies found. Upload one to get started.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}