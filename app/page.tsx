"use client"
import React, { useCallback, useMemo, useState } from "react"
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

  const addNode = useCallback(() => {
    setNodes(prev => {
      const id = `R${prev.length + 1}`
      const x = 120 + Math.random() * 640
      const y = 80 + Math.random() * 360
      return [...prev, { id, x, y }]
    })
  }, [])

  const addEdge = useCallback((source: string, target: string, weight: number) => {
    setEdges(prev => [...prev, { source, target, weight }])
  }, [])

  const resetNetwork = useCallback(() => {
    setNodes([])
    setEdges([])
    setTrace([])
    setFinalPath([])
    setShowVisualizer(false)
  }, [])

  const loadDijkstraScenario = useCallback(() => {
    const scenarioNodes: Node[] = [
      { id: "R1", x: 120, y: 80 },
      { id: "R2", x: 360, y: 70 },
      { id: "R3", x: 620, y: 110 },
      { id: "R4", x: 820, y: 200 },
      { id: "R5", x: 700, y: 320 },
      { id: "R6", x: 460, y: 300 },
      { id: "R7", x: 240, y: 260 },
      { id: "R8", x: 120, y: 380 },
      { id: "R9", x: 360, y: 420 },
      { id: "R10", x: 600, y: 420 },
    ]

    const scenarioEdges: Edge[] = [
      { source: "R1", target: "R2", weight: 4 },
      { source: "R1", target: "R7", weight: 6 },
      { source: "R2", target: "R3", weight: 5 },
      { source: "R2", target: "R7", weight: 3 },
      { source: "R2", target: "R5", weight: 8 },
      { source: "R3", target: "R4", weight: 4 },
      { source: "R3", target: "R6", weight: 7 },
      { source: "R3", target: "R5", weight: 6 },
      { source: "R4", target: "R5", weight: 3 },
      { source: "R4", target: "R10", weight: 9 },
      { source: "R5", target: "R6", weight: 2 },
      { source: "R5", target: "R10", weight: 5 },
      { source: "R6", target: "R7", weight: 5 },
      { source: "R6", target: "R9", weight: 4 },
      { source: "R7", target: "R8", weight: 3 },
      { source: "R7", target: "R9", weight: 6 },
      { source: "R8", target: "R9", weight: 4 },
      { source: "R9", target: "R10", weight: 2 },
    ]

    setAlgorithm("dijkstra")
    setNodes(scenarioNodes)
    setEdges(scenarioEdges)
    setTrace([])
    setFinalPath([])
    setShowVisualizer(false)
  }, [])

  const loadBellmanScenario = useCallback(() => {
    const scenarioNodes: Node[] = [
      { id: "R1", x: 140, y: 90 },
      { id: "R2", x: 320, y: 80 },
      { id: "R3", x: 520, y: 120 },
      { id: "R4", x: 380, y: 240 },
      { id: "R5", x: 560, y: 260 },
      { id: "R6", x: 720, y: 190 },
      { id: "R7", x: 420, y: 380 },
      { id: "R8", x: 620, y: 400 },
    ]

    const scenarioEdges: Edge[] = [
      { source: "R1", target: "R2", weight: 6 },
      { source: "R1", target: "R3", weight: 5 },
      { source: "R1", target: "R6", weight: 8 },
      { source: "R2", target: "R4", weight: 1 },
      { source: "R2", target: "R5", weight: -2 },
      { source: "R2", target: "R6", weight: 2 },
      { source: "R3", target: "R5", weight: 3 },
      { source: "R3", target: "R6", weight: 4 },
      { source: "R4", target: "R7", weight: 2 },
      { source: "R5", target: "R4", weight: 2 },
      { source: "R5", target: "R7", weight: 3 },
      { source: "R5", target: "R8", weight: -4 },
      { source: "R6", target: "R5", weight: 1 },
      { source: "R6", target: "R8", weight: 5 },
      { source: "R7", target: "R8", weight: 2 },
    ]

    setAlgorithm("bellman")
    setNodes(scenarioNodes)
    setEdges(scenarioEdges)
    setTrace([])
    setFinalPath([])
    setShowVisualizer(false)
  }, [])

  const graph = useMemo(
    () => ({ nodes: nodes.map(node => ({ id: node.id })), edges }),
    [nodes, edges]
  )

  const handleNodePositionChange = useCallback((id: string, position: { x: number; y: number }) => {
    setNodes(prev => {
      let changed = false
      const next = prev.map(node => {
        if (node.id !== id) return node
        if (node.x === position.x && node.y === position.y) return node
        changed = true
        return { ...node, x: position.x, y: position.y }
      })
      return changed ? next : prev
    })
  }, [])

  const runSimulation = useCallback(
    (startId: string, endId: string) => {
      const result: RunResult =
        algorithm === "dijkstra"
          ? runDijkstra(graph, startId, endId)
          : runBellmanFord(graph, startId, endId)

      setTrace(result.trace)
      setFinalPath(result.path)
      setShowVisualizer(true)
    },
    [algorithm, graph]
  )

  const handleShowVisualizer = useCallback(() => setShowVisualizer(true), [])
  const handleCloseVisualizer = useCallback(() => setShowVisualizer(false), [])

  return (
    <div className="flex min-h-screen flex-col text-slate-100">
      <Topbar algorithm={algorithm} setAlgorithm={setAlgorithm} />

      <div className="flex flex-col gap-6 p-4 sm:p-6 w-full max-w-7xl mx-auto lg:flex-row">
        <div className="w-full lg:w-80 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl shadow-xl">
          <ControlsPanel
            nodes={nodes}
            edges={edges}
            addNode={addNode}
            addEdge={addEdge}
            runSimulation={runSimulation}
            resetNetwork={resetNetwork}
            loadDijkstraScenario={loadDijkstraScenario}
            loadBellmanScenario={loadBellmanScenario}
            onShowVisualizer={handleShowVisualizer}
          />
        </div>

        <div className="flex-1 flex flex-col gap-6">
          <div className="flex-1 rounded-3xl border border-white/10 bg-slate-900/50 shadow-2xl p-3 sm:p-4 backdrop-blur-xl min-h-[24rem] sm:min-h-[28rem] lg:min-h-[34rem]">
            <GraphCanvas
              nodes={nodes}
              edges={edges}
              finalPath={finalPath}
              onNodePositionChange={handleNodePositionChange}
            />
          </div>
        </div>
      </div>

      <footer className="mt-auto w-full border-t border-white/10 bg-slate-950/70">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-4 py-6 text-center text-sm text-slate-300 sm:px-6">
          <div className="text-base font-semibold text-slate-100">
            Made for Design and Analysis of Algorithms Lab Final Project
          </div>
          <div className="text-sm leading-relaxed text-slate-300/90">
            Team Members: Saumya Khobragade (Roll No: A2-B1-14), S. A. Balaji (Roll No: A2-B3-35) and Priyanshu Yadav (Roll No: A2-B3-39)
          </div>
        </div>
      </footer>

      <AlgorithmVisualizer
        isOpen={showVisualizer}
        onClose={handleCloseVisualizer}
        trace={trace}
        finalPath={finalPath}
      />
    </div>
  )
}
