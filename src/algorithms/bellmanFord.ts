type Node = { id: string }
type Edge = { source: string; target: string; weight: number }

export function runBellmanFord(graph: { nodes: Node[]; edges: Edge[] }, start: string, end?: string) {
  const nodes = graph.nodes.map(n => n.id)
  const edges = graph.edges

  const dist: Record<string, number> = {}
  const prev: Record<string, string | null> = {}
  for (const n of nodes) {
    dist[n] = Infinity
    prev[n] = null
  }
  dist[start] = 0

  const trace: any[] = []
  trace.push({ step: 'init', dist: { ...dist } })

  for (let i = 0; i < nodes.length - 1; i++) {
    let changed = false
    for (const e of edges) {
      if (dist[e.source] + e.weight < dist[e.target]) {
        dist[e.target] = dist[e.source] + e.weight
        prev[e.target] = e.source
        changed = true
        trace.push({ step: `relax ${e.source}->${e.target}`, edge: [e.source, e.target], dist: { ...dist } })
      }
      if (dist[e.target] + e.weight < dist[e.source]) {
        dist[e.source] = dist[e.target] + e.weight
        prev[e.source] = e.target
        changed = true
        trace.push({ step: `relax ${e.target}->${e.source}`, edge: [e.target, e.source], dist: { ...dist } })
      }
    }
    trace.push({ step: `pass ${i+1}`, dist: { ...dist } })
    if (!changed) break
  }

  // reconstruct path
  const path: string[] = []
  if (end && dist[end] < Infinity) {
    let cur: string | null = end
    while (cur) {
      path.unshift(cur)
      cur = prev[cur]
    }
  }

  return { trace, dist, path }
}
