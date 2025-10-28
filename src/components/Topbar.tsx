"use client"
import React from 'react'

export default function Topbar({ algorithm, setAlgorithm }:
  { algorithm: 'dijkstra'|'bellman'; setAlgorithm: (s: 'dijkstra'|'bellman') => void }) {
  return (
    <header className="bg-gradient-to-r from-[#25331d]/80 via-[#1b2a3b]/80 to-[#0f1a2c]/80 border-b border-white/10 px-4 sm:px-6 py-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between backdrop-blur-xl shadow-lg">
      <div className="text-lg sm:text-xl font-semibold text-slate-100 tracking-wide text-center md:text-left">
        Network Packet Routing Simulator
      </div>
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm w-full md:w-auto">
        <label className="text-xs uppercase tracking-widest text-slate-300/80">Algorithm</label>
        <select
          value={algorithm}
          onChange={e => setAlgorithm(e.target.value as any)}
          className="w-full sm:w-auto px-3 py-2 rounded-lg bg-slate-900/60 border border-white/15 text-slate-100 shadow-inner focus:outline-none focus:ring-2 focus:ring-lime-400/60"
        >
          <option value="dijkstra">Dijkstra (O(V^2) / O(E + V log V))</option>
          <option value="bellman">Bellman-Ford (O(VE))</option>
        </select>
      </div>
    </header>
  )
}
