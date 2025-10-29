"use client"
import React, { memo, useEffect, useMemo } from "react"

export type TraceEntry = {
  step: string
  dist: Record<string, number>
  edge?: [string, string]
}

type Props = {
  isOpen: boolean
  onClose: () => void
  trace: TraceEntry[]
  finalPath: string[]
}

function AlgorithmVisualizer({ isOpen, onClose, trace, finalPath }: Props) {
  useEffect(() => {
    if (!isOpen) return

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose()
    }

    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [isOpen, onClose])

  const finalPathLabel = useMemo(() => (finalPath.length ? finalPath.join(" -> ") : "—"), [finalPath])

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
              {finalPathLabel}
            </div>
          </div>

          <div className="max-h-[26rem] overflow-auto rounded-2xl border border-white/10 bg-slate-900/50 backdrop-blur">
            {trace.length === 0 && (
              <div className="p-6 text-sm text-slate-300/80">No simulation run yet.</div>
            )}
            {trace.map((entry, idx) => {
              const distances = Object.entries(entry.dist).sort((a, b) => a[0].localeCompare(b[0]))
              return (
                <div key={idx} className="p-5 border-b border-white/5 last:border-0">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-xs uppercase tracking-widest text-slate-400">
                      {entry.step}
                    </div>
                    {entry.edge && (
                      <div className="text-[11px] font-semibold text-sky-300/80">
                        Edge: {entry.edge[0]} → {entry.edge[1]}
                      </div>
                    )}
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full border-separate border-spacing-y-1 text-xs text-left">
                      <thead>
                        <tr className="text-slate-300">
                          <th className="px-3 py-2 font-semibold bg-slate-800/60 rounded-l-lg border border-white/10">Router</th>
                          <th className="px-3 py-2 font-semibold bg-slate-800/60 rounded-r-lg border border-white/10">Distance</th>
                        </tr>
                      </thead>
                      <tbody>
                        {distances.map(([node, value]) => (
                          <tr key={node} className="text-slate-200">
                            <td className="px-3 py-1.5 bg-slate-900/70 border border-white/10 rounded-l-md">{node}</td>
                            <td className="px-3 py-1.5 bg-slate-900/70 border border-white/10 rounded-r-md">
                              {Number.isFinite(value) ? value : '∞'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default memo(AlgorithmVisualizer)
