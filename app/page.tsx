"use client"
import React, { useState } from "react"
import Topbar from "../src/components/Topbar"
import ControlsPanel from "../src/components/ControlsPanel"
import GraphCanvas from "../src/components/GraphCanvas"
import AlgorithmVisualizer from "../src/components/AlgorithmVisualizer"
import { runDijkstra } from "../src/algorithms/dijkstra"
import { runBellmanFord } from "../src/algorithms/bellmanFord"

export type Node = { id: string; x: number; y: number }
export type Edge = { source: string; target: string; weight: number }

type AlgorithmKind = "dijkstra" | "bellman"

type RunResult = {
  trace: any[]
  path: string[]
}

export default function Page() {
  const [nodes, setNodes] = useState<Node[]>([])
  const [edges, setEdges] = useState<Edge[]>([])
  const [algorithm, setAlgorithm] = useState<AlgorithmKind>("dijkstra")
  const [trace, setTrace] = useState<any[]>([])
  const [finalPath, setFinalPath] = useState<string[]>([])
  const [showVisualizer, setShowVisualizer] = useState(false)

  function addNode() {
    const id = `R${nodes.length + 1}`
    const x = 120 + Math.random() * 640
    const y = 80 + Math.random() * 360
    setNodes(prev => [...prev, { id, x, y }])
  }

  function addEdge(source: string, target: string, weight: number) {
    setEdges(prev => [...prev, { source, target, weight }])
  }

  function runSimulation(startId: string, endId: string) {
    const graph = { nodes: nodes.map(node => ({ id: node.id })), edges }
    const result: RunResult =
      algorithm === "dijkstra"
        ? runDijkstra(graph, startId, endId)
        : runBellmanFord(graph, startId, endId)

    setTrace(result.trace)
    setFinalPath(result.path)
    setShowVisualizer(true)
  }

  return (
    <div className="flex-1 flex flex-col h-full text-slate-100">
      <Topbar algorithm={algorithm} setAlgorithm={setAlgorithm} />

      <div className="flex flex-col gap-6 p-4 sm:p-6 w-full max-w-7xl mx-auto lg:flex-row">
        <div className="w-full lg:w-80 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl shadow-xl">
          <ControlsPanel
            nodes={nodes}
            edges={edges}
            addNode={addNode}
            addEdge={addEdge}
            runSimulation={runSimulation}
            onShowVisualizer={() => setShowVisualizer(true)}
          />
        </div>

        <div className="flex-1 flex flex-col gap-6">
          <div className="flex-1 rounded-3xl border border-white/10 bg-slate-900/50 shadow-2xl p-3 sm:p-4 backdrop-blur-xl min-h-[24rem] sm:min-h-[28rem] lg:min-h-[34rem]">
            <GraphCanvas nodes={nodes} edges={edges} finalPath={finalPath} />
          </div>
        </div>
      </div>

      <AlgorithmVisualizer
        isOpen={showVisualizer}
        onClose={() => setShowVisualizer(false)}
        trace={trace}
        finalPath={finalPath}
      />
    </div>
  )
}
