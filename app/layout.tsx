import '../styles/globals.css'
import React from 'react'

export const metadata = {
  title: 'Network Packet Routing Simulator',
  description: 'Visualize Dijkstra and Bellman-Ford algorithms'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen flex flex-col">{children}</div>
      </body>
    </html>
  )
}
