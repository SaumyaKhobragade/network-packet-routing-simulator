"use client"
import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { Node, Edge } from '../../app/page'

type Props = {
  nodes: Node[]
  edges: Edge[]
  finalPath: string[]
  onNodePositionChange?: (id: string, position: { x: number; y: number }) => void
}

function GraphCanvas({ nodes, edges, finalPath, onNodePositionChange }: Props) {
  const [packetIndex, setPacketIndex] = useState(0)
  const [replayTick, setReplayTick] = useState(0)
  const svgRef = useRef<SVGSVGElement | null>(null)
  const [draggedNode, setDraggedNode] = useState<{
    id: string
    offsetX: number
    offsetY: number
    pointerId: number
  } | null>(null)

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
  }, [finalPath, replayTick])

  const nodeMap = useMemo(() => {
    return Object.fromEntries(nodes.map(n => [n.id, n])) as Record<string, Node>
  }, [nodes])

  const getSvgCoordinates = useCallback((clientX: number, clientY: number) => {
    const svg = svgRef.current
    if (!svg) return null
    const point = svg.createSVGPoint()
    point.x = clientX
    point.y = clientY
    const ctm = svg.getScreenCTM()
    if (!ctm) return null
    const transformed = point.matrixTransform(ctm.inverse())
    return { x: transformed.x, y: transformed.y }
  }, [])

  const highlightedEdges = useMemo(() => {
    const set = new Set<string>()
    if (!finalPath || finalPath.length < 2) return set
    for (let i = 0; i < finalPath.length - 1; i++) {
      const a = finalPath[i]
      const b = finalPath[i + 1]
      set.add(`${a}|${b}`)
      set.add(`${b}|${a}`)
    }
    return set
  }, [finalPath])

  const handleReplay = useCallback(() => {
    if (!finalPath || finalPath.length < 2) return
    setReplayTick(tick => tick + 1)
  }, [finalPath])

  const handlePointerDown = useCallback((event: React.PointerEvent<SVGGElement>, node: Node) => {
    const coords = getSvgCoordinates(event.clientX, event.clientY)
    if (!coords) return
    event.preventDefault()
    event.stopPropagation()
    svgRef.current?.setPointerCapture?.(event.pointerId)
    setDraggedNode({
      id: node.id,
      offsetX: coords.x - node.x,
      offsetY: coords.y - node.y,
      pointerId: event.pointerId,
    })
  }, [getSvgCoordinates])

  const finishDrag = useCallback((pointerId?: number) => {
    if (pointerId !== undefined) {
      svgRef.current?.releasePointerCapture?.(pointerId)
    }
    setDraggedNode(null)
  }, [])

  const handlePointerMove = useCallback((event: React.PointerEvent<SVGSVGElement>) => {
    if (!draggedNode) return
    const coords = getSvgCoordinates(event.clientX, event.clientY)
    if (!coords) return
    const nextX = coords.x - draggedNode.offsetX
    const nextY = coords.y - draggedNode.offsetY
    onNodePositionChange?.(draggedNode.id, { x: nextX, y: nextY })
  }, [draggedNode, getSvgCoordinates, onNodePositionChange])

  const handlePointerUp = useCallback((event: React.PointerEvent<SVGSVGElement>) => {
    if (!draggedNode) return
    event.preventDefault()
    finishDrag(draggedNode.pointerId)
  }, [draggedNode, finishDrag])

  const handlePointerLeave = useCallback((event: React.PointerEvent<SVGSVGElement>) => {
    if (!draggedNode) return
    if (event.buttons !== 0) return
    finishDrag(draggedNode.pointerId)
  }, [draggedNode, finishDrag])

  const handlePointerCancel = useCallback(() => {
    if (!draggedNode) return
    finishDrag(draggedNode.pointerId)
  }, [draggedNode, finishDrag])

  return (
    <div className="relative h-full min-h-[24rem] sm:min-h-[28rem] lg:min-h-[34rem]">
      {finalPath && finalPath.length > 1 && (
        <button
          type="button"
          onClick={handleReplay}
          className="absolute right-4 top-4 z-10 rounded-full px-4 py-2 text-xs font-semibold text-slate-900 shadow-lg transition-transform hover:scale-[1.03]"
          style={{ background: 'linear-gradient(135deg, rgba(252,211,77,0.95), rgba(248,113,113,0.95))' }}
        >
          Replay Animation
        </button>
      )}
      <svg
        ref={svgRef}
        className="w-full h-full max-w-full"
        viewBox="0 0 900 520"
        preserveAspectRatio="xMidYMid meet"
        style={{ background: 'radial-gradient(circle at 20% 20%, rgba(122,161,86,0.12), transparent 55%)' }}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        onPointerLeave={handlePointerLeave}
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
          const highlighted = highlightedEdges.has(`${e.source}|${e.target}`)
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
          <g
            key={n.id}
            transform={`translate(${n.x - 20}, ${n.y - 20})`}
            onPointerDown={event => handlePointerDown(event, n)}
            className="cursor-grab active:cursor-grabbing"
          >
            <rect width={40} height={40} rx={20} fill="url(#nodeGradient)" stroke="rgba(255,255,255,0.12)" strokeWidth={2} />
            <text x={20} y={26} fontSize={14} fill="#f8fafc" textAnchor="middle">{n.id}</text>
          </g>
        ))}

        {/* packet indicator */}
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

export default memo(GraphCanvas)
