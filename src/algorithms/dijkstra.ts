type Node = { id: string }
type Edge = { source: string; target: string; weight: number }

export function runDijkstra(graph: { nodes: Node[]; edges: Edge[] }, start: string, end?: string) {
  const nodes = graph.nodes.map(n => n.id)
  const adj: Record<string, { to: string; w: number }[]> = {}
  nodes.forEach(n => (adj[n] = []))
  for (const e of graph.edges) {
    adj[e.source].push({ to: e.target, w: e.weight })
    adj[e.target].push({ to: e.source, w: e.weight })
  }

  const dist: Record<string, number> = {}
  const prev: Record<string, string | null> = {}
  for (const n of nodes) {
    dist[n] = Infinity
    prev[n] = null
  }
  dist[start] = 0

  const visited = new Set<string>()
  const trace: any[] = []
  trace.push({ step: 'init', dist: { ...dist } })

  while (visited.size < nodes.length) {
    // pick unvisited with min dist
    let u: string | null = null
    let best = Infinity
    for (const n of nodes) {
      if (!visited.has(n) && dist[n] < best) {
        best = dist[n]
        u = n
      }
    }
    if (u === null) break
    visited.add(u)
    trace.push({ step: `visit ${u}`, node: u, dist: { ...dist } })

    for (const e of adj[u]) {
      const alt = dist[u] + e.w
      if (alt < dist[e.to]) {
        dist[e.to] = alt
        prev[e.to] = u
        trace.push({ step: `relax ${u}->${e.to}`, edge: [u, e.to], dist: { ...dist } })
      }
    }
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
