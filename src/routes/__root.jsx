import * as React from 'react'
import { Outlet, createRootRoute, Link } from '@tanstack/react-router'
import ModeToggle from "@/components/mode-toggle"

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <div className="min-h-screen bg-background">
      <header className='flex items-center justify-between p-4 border-b'>
        <div className='flex items-center space-x-4'>
          <nav className='flex space-x-1 bg-muted p-1 rounded-lg'>
            <Link 
              to="/" 
              className="px-4 py-2 rounded-md text-sm font-medium transition-colors"
              activeProps={{ 
                className: "bg-background text-foreground shadow-sm" 
              }}
              inactiveProps={{
                className: "text-muted-foreground hover:text-foreground hover:bg-background/50"
              }}
            >
              Timer
            </Link>
            <Link 
              to="/dashboard" 
              className="px-4 py-2 rounded-md text-sm font-medium transition-colors"
              activeProps={{ 
                className: "bg-background text-foreground shadow-sm" 
              }}
              inactiveProps={{
                className: "text-muted-foreground hover:text-foreground hover:bg-background/50"
              }}
            >
              Dashboard
            </Link>
          </nav>
        </div>
          <ModeToggle />

      </header>
      
      <main className="container mx-auto p-6">
        <Outlet />
      </main>
    </div>
  )
}