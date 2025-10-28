type Node = { id: string }
type Edge = { source: string; target: string; weight: number }

type TraceEntry = {
  step: string
  edge?: [string, string]
  dist: Record<string, number>
}

function snapshotDistances(ids: string[], dist: Record<string, number>) {
  const clone: Record<string, number> = {}
  for (const id of ids) {
    clone[id] = dist[id]
  }
  return clone
}

export function runBellmanFord(graph: { nodes: Node[]; edges: Edge[] }, start: string, end?: string) {
  const nodeIds = graph.nodes.map(n => n.id)
  const adjacency: Record<string, { to: string; weight: number }[]> = {}
  for (const id of nodeIds) {
    adjacency[id] = []
  }

  for (const edge of graph.edges) {
    if (!adjacency[edge.source]) adjacency[edge.source] = []
    adjacency[edge.source].push({ to: edge.target, weight: edge.weight })
  }

  const dist: Record<string, number> = {}
  const prev: Record<string, string | null> = {}
  for (const id of nodeIds) {
    dist[id] = Infinity
    prev[id] = null
  }
  if (!(start in dist)) {
    return { trace: [], dist, path: [] }
  }
  dist[start] = 0

  const trace: TraceEntry[] = []
  trace.push({ step: 'init', dist: snapshotDistances(nodeIds, dist) })

  const queue: string[] = [start]
  const inQueue = new Set<string>([start])
  const relaxCount: Record<string, number> = {}
  let negativeCycleDetected = false

  while (queue.length) {
    const current = queue.shift() as string
    inQueue.delete(current)

    const neighbors = adjacency[current] ?? []
    for (const edge of neighbors) {
      if (dist[current] === Infinity) continue

      const candidate = dist[current] + edge.weight
      if (candidate < dist[edge.to]) {
        dist[edge.to] = candidate
        prev[edge.to] = current
        trace.push({
          step: `relax ${current}->${edge.to}`,
          edge: [current, edge.to],
          dist: snapshotDistances(nodeIds, dist),
        })

        if (!inQueue.has(edge.to)) {
          queue.push(edge.to)
          inQueue.add(edge.to)
          relaxCount[edge.to] = (relaxCount[edge.to] ?? 0) + 1
          if (relaxCount[edge.to] >= nodeIds.length) {
            negativeCycleDetected = true
            trace.push({ step: 'negative cycle detected', dist: snapshotDistances(nodeIds, dist) })
            queue.length = 0
            break
          }
        }
      }
    }

    if (negativeCycleDetected) break
    trace.push({ step: `settled ${current}`, dist: snapshotDistances(nodeIds, dist) })
  }

  const path: string[] = []
  if (!negativeCycleDetected && end && dist[end] < Infinity) {
    let cursor: string | null = end
    while (cursor) {
      path.unshift(cursor)
      cursor = prev[cursor]
    }
  }

  return { trace, dist, path }
}

