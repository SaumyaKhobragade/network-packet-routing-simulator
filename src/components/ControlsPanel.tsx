"use client"
import React, { memo, useMemo, useState } from 'react'
import type { Node, Edge } from '../../app/page'

type Props = {
  nodes: Node[]
  edges: Edge[]
  addNode: () => void
  addEdge: (s: string, t: string, w: number) => void
  runSimulation: (s: string, e: string) => void
  resetNetwork: () => void
  loadDijkstraScenario: () => void
  loadBellmanScenario: () => void
  onShowVisualizer: () => void
}

function ControlsPanel({
  nodes,
  edges,
  addNode,
  addEdge,
  runSimulation,
  resetNetwork,
  loadDijkstraScenario,
  loadBellmanScenario,
  onShowVisualizer,
}: Props) {
  const [src, setSrc] = useState('')
  const [tgt, setTgt] = useState('')
  const [w, setW] = useState(1)
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')

  const nodeOptions = useMemo(() => nodes.map(n => (
    <option key={n.id} value={n.id}>{n.id}</option>
  )), [nodes])

  return (
    <div className="p-5 text-sm text-slate-200">
      <div className="mb-4 grid gap-2">
        <button
          className="w-full px-3 py-2 rounded-lg font-semibold text-slate-900 shadow-lg transition-transform hover:scale-[1.01]"
          style={{ background: 'linear-gradient(135deg, rgba(127,176,92,0.9), rgba(56,115,173,0.9))' }}
          onClick={addNode}
        >
          Add Router
        </button>
        <button
          type="button"
          className="w-full px-3 py-2 rounded-lg font-semibold text-slate-900 shadow-lg transition-transform hover:scale-[1.01]"
          style={{ background: 'linear-gradient(135deg, rgba(239,140,140,0.9), rgba(244,63,94,0.85))' }}
          onClick={resetNetwork}
        >
          Reset Network
        </button>
      </div>

      <div className="mb-4 border-t border-white/10 pt-4">
        <div className="text-xs uppercase tracking-widest text-slate-400 mb-3">Add Connection</div>
        <select value={src} onChange={e => setSrc(e.target.value)} className="w-full mb-2 px-3 py-2 rounded-lg bg-slate-900/60 border border-white/15 text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-400/50">
          <option value="">Select source</option>
          {nodeOptions}
        </select>
        <select value={tgt} onChange={e => setTgt(e.target.value)} className="w-full mb-2 px-3 py-2 rounded-lg bg-slate-900/60 border border-white/15 text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-400/50">
          <option value="">Select target</option>
          {nodeOptions}
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
          {nodeOptions}
        </select>
        <select value={end} onChange={e => setEnd(e.target.value)} className="w-full mb-3 px-3 py-2 rounded-lg bg-slate-900/60 border border-white/15 text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-400/50">
          <option value="">Select end</option>
          {nodeOptions}
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

      <div className="mt-5 border-t border-white/10 pt-4">
        <div className="text-xs uppercase tracking-widest text-slate-400 mb-3">Preset Scenarios</div>
        <div className="grid gap-2">
          <button
            type="button"
            className="w-full px-3 py-2 rounded-lg font-semibold text-slate-900 shadow-lg transition-transform hover:scale-[1.01]"
            style={{ background: 'linear-gradient(135deg, rgba(85,168,240,0.95), rgba(163,231,106,0.95))' }}
            onClick={loadDijkstraScenario}
          >
            Load Dijkstra Demo
          </button>
          <button
            type="button"
            className="w-full px-3 py-2 rounded-lg font-semibold text-slate-900 shadow-lg transition-transform hover:scale-[1.01]"
            style={{ background: 'linear-gradient(135deg, rgba(142,119,255,0.95), rgba(66,213,206,0.95))' }}
            onClick={loadBellmanScenario}
          >
            Load Bellman-Ford Demo
          </button>
        </div>
      </div>

      <div className="mt-5 text-xs tracking-widest uppercase text-slate-400">
        Nodes: {nodes.length} • Edges: {edges.length}
      </div>
    </div>
  )
}

export default memo(ControlsPanel)
