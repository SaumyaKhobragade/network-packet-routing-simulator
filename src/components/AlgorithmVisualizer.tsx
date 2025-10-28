"use client"
import React, { useEffect } from "react"

export type TraceEntry = {
  step: string
  dist: Record<string, number>
}

type Props = {
  isOpen: boolean
  onClose: () => void
  trace: TraceEntry[]
  finalPath: string[]
}

export default function AlgorithmVisualizer({ isOpen, onClose, trace, finalPath }: Props) {
  useEffect(() => {
    if (!isOpen) return

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose()
    }

    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/70 backdrop-blur" onClick={onClose} />

      <div className="relative w-full max-w-4xl mx-4 rounded-3xl border border-white/10 shadow-2xl overflow-hidden"
        style={{ background: "linear-gradient(135deg, rgba(16,28,34,0.96), rgba(17,33,55,0.96))" }}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 text-slate-100">
          <div className="text-lg font-semibold tracking-wide">Trace / Logs</div>
          <div className="flex items-center gap-3">
            <span className="text-xs uppercase tracking-widest text-slate-300/80">Entries: {trace.length}</span>
            <button
              type="button"
              className="px-3 py-1.5 rounded-lg text-slate-900 font-semibold shadow transition-transform hover:scale-[1.03]"
              style={{ background: "linear-gradient(135deg, rgba(122,161,86,0.9), rgba(61,143,189,0.9))" }}
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>

        <div className="p-6 text-slate-100">
          <div className="mb-5">
            <div className="text-xs uppercase tracking-widest text-slate-300/80 mb-2">Final Path</div>
            <div className="text-xl font-semibold text-lime-300">
              {finalPath.length ? finalPath.join(" -> ") : "—"}
            </div>
          </div>

          <div className="max-h-[26rem] overflow-auto rounded-2xl border border-white/10 bg-slate-900/50 backdrop-blur">
            {trace.length === 0 && (
              <div className="p-6 text-sm text-slate-300/80">No simulation run yet.</div>
            )}
            {trace.map((entry, idx) => (
              <div key={idx} className="p-5 border-b border-white/5 last:border-0">
                <div className="text-xs uppercase tracking-widest text-slate-400 mb-2">
                  {entry.step}
                </div>
                <pre className="text-xs bg-slate-900/80 border border-white/10 rounded-xl p-4 whitespace-pre-wrap text-slate-200 shadow-inner">
                  {JSON.stringify(entry.dist, null, 2)}
                </pre>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
