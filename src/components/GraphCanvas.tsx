"use client"
import React, { useEffect, useState } from 'react'
import type { Node, Edge } from '../../app/page'

export default function GraphCanvas({ nodes, edges, finalPath }:
  { nodes: Node[]; edges: Edge[]; finalPath: string[] }) {
  const [packetIndex, setPacketIndex] = useState(0)

  useEffect(() => {
    if (!finalPath || finalPath.length === 0) return
    setPacketIndex(0)
    const id = setInterval(() => {
      setPacketIndex(i => {
        if (i >= finalPath.length - 1) {
          clearInterval(id)
          return i
        }
        return i + 1
      })
    }, 700)
    return () => clearInterval(id)
  }, [finalPath])

  const nodeMap = Object.fromEntries(nodes.map(n => [n.id, n])) as Record<string, Node>

  return (
  <div className="relative h-full min-h-[24rem] sm:min-h-[28rem] lg:min-h-[34rem]">
      <svg
        className="w-full h-full max-w-full"
        viewBox="0 0 900 520"
        preserveAspectRatio="xMidYMid meet"
        style={{ background: 'radial-gradient(circle at 20% 20%, rgba(122,161,86,0.12), transparent 55%)' }}
      >
        <defs>
          <linearGradient id="edgeHighlight" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#9be37d" />
            <stop offset="100%" stopColor="#60a5fa" />
          </linearGradient>
          <linearGradient id="nodeGradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#7bb05c" />
            <stop offset="100%" stopColor="#3d8fbd" />
          </linearGradient>
        </defs>
        {/* edges */}
        {edges.map((e, i) => {
          const a = nodeMap[e.source]
          const b = nodeMap[e.target]
          if (!a || !b) return null
          const midX = (a.x + b.x) / 2
          const midY = (a.y + b.y) / 2
          const highlighted = finalPath && finalPath.length > 0 && finalPath.includes(e.source) && finalPath.includes(e.target) && Math.abs(finalPath.indexOf(e.source) - finalPath.indexOf(e.target)) === 1
          return (
            <g key={i}>
              <line
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                stroke={highlighted ? 'url(#edgeHighlight)' : 'rgba(148, 163, 184, 0.45)'}
                strokeWidth={highlighted ? 4 : 2.5}
                strokeLinecap="round"
              />
              <text x={midX} y={midY - 6} fontSize={12} fill="#cbd5f5">{e.weight}</text>
            </g>
          )
        })}

        {/* nodes */}
        {nodes.map(n => (
          <g key={n.id} transform={`translate(${n.x - 20}, ${n.y - 20})`}>
            <rect width={40} height={40} rx={20} fill="url(#nodeGradient)" stroke="rgba(255,255,255,0.12)" strokeWidth={2} />
            <text x={20} y={26} fontSize={14} fill="#f8fafc" textAnchor="middle">{n.id}</text>
          </g>
        ))}

        {/* packet indicator - place on node according to packetIndex */}
        {finalPath && finalPath.length > 0 && (() => {
          const id = finalPath[Math.min(packetIndex, finalPath.length - 1)]
          const pos = nodeMap[id]
          if (!pos) return null
          return <circle cx={pos.x} cy={pos.y} r={8} fill="#facc15" stroke="#fde68a" strokeWidth={2} />
        })()}
      </svg>
    </div>
  )
}
