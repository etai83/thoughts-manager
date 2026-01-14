import { forceSimulation, forceLink, forceManyBody, forceCenter } from 'd3-force';
import { type Node, type Edge } from '@xyflow/react';

export const runLayout = (nodes: Node[], edges: Edge[]) => {
  const simulationNodes = nodes.map((n) => ({ ...n, x: n.position.x, y: n.position.y }));
  const simulationLinks = edges.map((e) => ({ ...e, source: e.source, target: e.target }));

  const simulation = forceSimulation(simulationNodes as any)
    .force('link', forceLink(simulationLinks).id((d: any) => d.id).distance(100))
    .force('charge', forceManyBody().strength(-300))
    .force('center', forceCenter(200, 200))
    .stop();

  // Run simulation for a fixed number of ticks
  for (let i = 0; i < 300; ++i) simulation.tick();

  return nodes.map((n, i) => ({
    ...n,
    position: {
      x: (simulationNodes[i] as any).x,
      y: (simulationNodes[i] as any).y,
    },
  }));
};
