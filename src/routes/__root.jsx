import * as React from 'react'
import { Outlet, createRootRoute, Link } from '@tanstack/react-router'
import { Github } from 'lucide-react'
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
        
        <div className="flex items-center space-x-2">
          {/* GitHub Link */}
          <a
            href="https://github.com/umuttalha/sisatma"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted"
            title="View on GitHub"
          >
            <Github size={18} />
            <span className="hidden sm:inline">GitHub</span>
          </a>
          
          {/* Theme Toggle */}
          <ModeToggle />
        </div>
      </header>
      
      <main className="container mx-auto p-6">
        <Outlet />
      </main>
    </div>
  )
}