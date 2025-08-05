import { createFileRoute } from '@tanstack/react-router'
import React, { useState } from 'react'

export const Route = createFileRoute('/about')({
  component: RouteComponent,
})

function RouteComponent() {
  const [counter, setCounter] = useState(59)

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCounter((prev) => {
        if (prev <= 0) {
          clearInterval(interval)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-gradient-to-br from-orange-700 to-red-900">
      <p>About Us</p>
      <p className="text-sm font-normal text-neutral-300 max-w-lg mt-2">
        Learn more about our company and mission.
      </p>
      <div className="mt-4">
        <span className="countdown text-6xl font-mono">
          <span style={{"--value":counter}} aria-live="polite" aria-label={counter}>
            {counter}
          </span>
        </span>
      </div>
    </div>
  )
}