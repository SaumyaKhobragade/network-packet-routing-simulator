# Network Packet Routing Simulator

An interactive single-page simulator that models packet routing on a custom network. Built with Next.js (App Router), TypeScript, React, and Tailwind CSS, it delivers a dark-mode dashboard with gradients, modal trace logs, and smooth packet playback for Dijkstra and Bellman-Ford algorithms.

## Features

- **Visual Graph Builder**: Add routers and weighted links from the left control panel.
- **Routing Algorithms**: Switch between Dijkstra and Bellman-Ford to compare behavior on the same graph.
- **Trace Modal**: View the distance table for every iteration and the final computed path in a gradient modal.
- **Packet Animation**: Watch packets traverse the shortest path with highlighted edges.
- **Responsive UI**: Controls stack on smaller screens; the canvas scales fluidly for mobile.

## Getting Started

```powershell
# install dependencies
npm install

# run the development server
npm run dev

# the app defaults to http://localhost:3000 (Next.js picks another port if busy)
```

### Linting

```powershell
npm run lint
```

> Note: You may see an informational warning about the TypeScript version; the lint task still succeeds.

### Build for Production

```powershell
npm run build
npm run start
```

## Project Structure Highlights

- `app/page.tsx` - main layout orchestrating the top bar, controls, canvas, and trace modal.
- `src/components/ControlsPanel.tsx` - responsive controls with trace/log trigger.
- `src/components/GraphCanvas.tsx` - SVG renderer with gradients and packet animation.
- `src/components/AlgorithmVisualizer.tsx` - modal that displays the algorithm trace and final path.
- `src/algorithms/` - TypeScript implementations of Dijkstra and Bellman-Ford emitting step-by-step traces.
- `styles/globals.css` - global Tailwind directives plus custom gradient dark theme.
