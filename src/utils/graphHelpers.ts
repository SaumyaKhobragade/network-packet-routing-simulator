export type Node = { id: string }
export type Edge = { source: string; target: string; weight: number }

export function neighbors(edges: Edge[]) {
  const adj: Record<string, { to: string; w: number }[]> = {}
  for (const e of edges) {
    if (!adj[e.source]) adj[e.source] = []
    if (!adj[e.target]) adj[e.target] = []
    adj[e.source].push({ to: e.target, w: e.weight })
    adj[e.target].push({ to: e.source, w: e.weight })
  }
  return adj
}
