"use client"
import React, { useState } from 'react'
import type { Node, Edge } from '../../app/page'

export default function ControlsPanel({ nodes, edges, addNode, addEdge, runSimulation, onShowVisualizer }:
  { nodes: Node[]; edges: Edge[]; addNode: () => void; addEdge: (s: string, t: string, w: number) => void; runSimulation: (s: string, e: string) => void; onShowVisualizer: () => void }) {
  const [src, setSrc] = useState('')
  const [tgt, setTgt] = useState('')
  const [w, setW] = useState(1)
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')

  return (
    <div className="p-5 text-sm text-slate-200">
      <div className="mb-4">
        <button
          className="w-full px-3 py-2 rounded-lg font-semibold text-slate-900 shadow-lg transition-transform hover:scale-[1.01]"
          style={{ background: 'linear-gradient(135deg, rgba(127,176,92,0.9), rgba(56,115,173,0.9))' }}
          onClick={addNode}
        >
          Add Router
        </button>
      </div>

      <div className="mb-4 border-t border-white/10 pt-4">
        <div className="text-xs uppercase tracking-widest text-slate-400 mb-3">Add Connection</div>
        <select value={src} onChange={e => setSrc(e.target.value)} className="w-full mb-2 px-3 py-2 rounded-lg bg-slate-900/60 border border-white/15 text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-400/50">
          <option value="">Select source</option>
          {nodes.map(n => <option key={n.id} value={n.id}>{n.id}</option>)}
        </select>
        <select value={tgt} onChange={e => setTgt(e.target.value)} className="w-full mb-2 px-3 py-2 rounded-lg bg-slate-900/60 border border-white/15 text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-400/50">
          <option value="">Select target</option>
          {nodes.map(n => <option key={n.id} value={n.id}>{n.id}</option>)}
        </select>
        <input type="number" value={w} onChange={e => setW(Number(e.target.value))} className="w-full mb-3 px-3 py-2 rounded-lg bg-slate-900/60 border border-white/15 text-slate-100 focus:outline-none focus:ring-2 focus:ring-lime-400/50" />
        <button
          className="w-full px-3 py-2 rounded-lg font-semibold text-slate-900 shadow-lg transition-transform hover:scale-[1.01]"
          style={{ background: 'linear-gradient(135deg, rgba(90,152,66,0.9), rgba(61,143,189,0.9))' }}
          onClick={() => { if (src && tgt && src !== tgt) addEdge(src, tgt, w) }}
        >
          Add Edge
        </button>
      </div>

      <div className="border-t border-white/10 pt-4">
        <div className="text-xs uppercase tracking-widest text-slate-400 mb-3">Run Simulation</div>
        <select value={start} onChange={e => setStart(e.target.value)} className="w-full mb-2 px-3 py-2 rounded-lg bg-slate-900/60 border border-white/15 text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-400/50">
          <option value="">Select start</option>
          {nodes.map(n => <option key={n.id} value={n.id}>{n.id}</option>)}
        </select>
        <select value={end} onChange={e => setEnd(e.target.value)} className="w-full mb-3 px-3 py-2 rounded-lg bg-slate-900/60 border border-white/15 text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-400/50">
          <option value="">Select end</option>
          {nodes.map(n => <option key={n.id} value={n.id}>{n.id}</option>)}
        </select>
        <button
          className="w-full px-3 py-2 rounded-lg font-semibold text-slate-900 shadow-lg transition-transform hover:scale-[1.01]"
          style={{ background: 'linear-gradient(135deg, rgba(71,140,201,0.95), rgba(125,187,94,0.95))' }}
          onClick={() => start && end && runSimulation(start, end)}
        >
          Run
        </button>
      </div>

      <div className="mt-4">
        <button
          type="button"
          className="w-full px-3 py-2 rounded-lg font-semibold text-slate-900 shadow-lg transition-transform hover:scale-[1.01]"
          style={{ background: 'linear-gradient(135deg, rgba(122,161,86,0.95), rgba(49,102,160,0.95))' }}
          onClick={onShowVisualizer}
        >
          Show Trace / Logs
        </button>
      </div>

      <div className="mt-5 text-xs tracking-widest uppercase text-slate-400">
        Nodes: {nodes.length} • Edges: {edges.length}
      </div>
    </div>
  )
}
