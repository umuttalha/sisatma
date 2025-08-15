// index.jsx - 2-stage Timer page: Setup then Focus mode (No Scroll)
import { createFileRoute } from '@tanstack/react-router'
import React, { useState, useEffect } from 'react'
import { Play, Pause, Square, Clock, Timer as TimerIcon, Plus, X } from 'lucide-react'

export const Route = createFileRoute('/')({
  component: TimerPage,
})

const TAG_COLORS = [
  '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', 
  '#ef4444', '#06b6d4', '#ec4899', '#6b7280',
  '#f97316', '#84cc16', '#0ea5e9', '#a855f7'
]

function TimerPage() {
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('activeTab') || 'timer'
  })
  const [timerMinutes, setTimerMinutes] = useState(() => {
    return parseInt(localStorage.getItem('timerMinutes')) || 25
  })
  const [timerSeconds, setTimerSeconds] = useState(() => {
    return parseInt(localStorage.getItem('timerSeconds')) || 0
  })
  const [stopwatchTime, setStopwatchTime] = useState(() => {
    return parseInt(localStorage.getItem('stopwatchTime')) || 0
  })
  const [isTimerRunning, setIsTimerRunning] = useState(() => {
    return localStorage.getItem('isTimerRunning') === 'true'
  })
  const [isStopwatchRunning, setIsStopwatchRunning] = useState(() => {
    return localStorage.getItem('isStopwatchRunning') === 'true'
  })
  const [currentTask, setCurrentTask] = useState(() => {
    return localStorage.getItem('currentTask') || ''
  })
  const [selectedTag, setSelectedTag] = useState(() => {
    return localStorage.getItem('selectedTag') || 'Other'
  })
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('timeTasks')
    return savedTasks ? JSON.parse(savedTasks) : []
  })
  const [userTags, setUserTags] = useState(() => {
    const savedTags = localStorage.getItem('userTags')
    return savedTags ? JSON.parse(savedTags) : ['Other']
  })
  const [timerStartTime, setTimerStartTime] = useState(() => {
    return parseInt(localStorage.getItem('timerStartTime')) || 0
  })
  const [stopwatchStartTime, setStopwatchStartTime] = useState(() => {
    const saved = localStorage.getItem('stopwatchStartTime')
    return saved ? parseInt(saved) : null
  })
  const [timerPausedTime, setTimerPausedTime] = useState(() => {
    return parseInt(localStorage.getItem('timerPausedTime')) || 0
  })
  const [stopwatchPausedTime, setStopwatchPausedTime] = useState(() => {
    return parseInt(localStorage.getItem('stopwatchPausedTime')) || 0
  })
  const [newTagName, setNewTagName] = useState('')
  const [showTagManager, setShowTagManager] = useState(false)
  const [isEditingTime, setIsEditingTime] = useState(false)
  const [editMinutes, setEditMinutes] = useState('')
const [editSeconds, setEditSeconds] = useState('')
  
// New state for 2-stage UI
const [isInTimingMode, setIsInTimingMode] = useState(() => {
  return localStorage.getItem('isInTimingMode') === 'true'
})

// New state for showing controls
const [showControls, setShowControls] = useState(false)

// New state for time adjustment feature
const [timeAdjustment, setTimeAdjustment] = useState(5) // Default 5 minutes
const [showTimeAdjuster, setShowTimeAdjuster] = useState(false)
const [hasUsedRandomAdjust, setHasUsedRandomAdjust] = useState(() => {
  return localStorage.getItem('hasUsedRandomAdjust') === 'true'
})
const [lastAdjustment, setLastAdjustment] = useState(() => {
  const saved = localStorage.getItem('lastAdjustment')
  return saved ? parseInt(saved) : null
})

  // Save all state to localStorage
  useEffect(() => {
    localStorage.setItem('timeTasks', JSON.stringify(tasks))
  }, [tasks])

  useEffect(() => {
    localStorage.setItem('userTags', JSON.stringify(userTags))
  }, [userTags])

  useEffect(() => {
    localStorage.setItem('activeTab', activeTab)
  }, [activeTab])

  useEffect(() => {
    localStorage.setItem('timerMinutes', timerMinutes.toString())
  }, [timerMinutes])

  useEffect(() => {
    localStorage.setItem('timerSeconds', timerSeconds.toString())
  }, [timerSeconds])

  useEffect(() => {
    localStorage.setItem('stopwatchTime', stopwatchTime.toString())
  }, [stopwatchTime])

  useEffect(() => {
    localStorage.setItem('isTimerRunning', isTimerRunning.toString())
  }, [isTimerRunning])

  useEffect(() => {
    localStorage.setItem('isStopwatchRunning', isStopwatchRunning.toString())
  }, [isStopwatchRunning])

  useEffect(() => {
    localStorage.setItem('currentTask', currentTask)
  }, [currentTask])

  useEffect(() => {
    localStorage.setItem('selectedTag', selectedTag)
  }, [selectedTag])

  useEffect(() => {
    localStorage.setItem('timerStartTime', timerStartTime.toString())
  }, [timerStartTime])

  useEffect(() => {
    if (stopwatchStartTime !== null) {
      localStorage.setItem('stopwatchStartTime', stopwatchStartTime.toString())
    } else {
      localStorage.removeItem('stopwatchStartTime')
    }
  }, [stopwatchStartTime])

  useEffect(() => {
    localStorage.setItem('timerPausedTime', timerPausedTime.toString())
  }, [timerPausedTime])

  useEffect(() => {
    localStorage.setItem('stopwatchPausedTime', stopwatchPausedTime.toString())
  }, [stopwatchPausedTime])

  useEffect(() => {
    localStorage.setItem('isInTimingMode', isInTimingMode.toString())
  }, [isInTimingMode])

  useEffect(() => {
  localStorage.setItem('hasUsedRandomAdjust', hasUsedRandomAdjust.toString())
}, [hasUsedRandomAdjust])

useEffect(() => {
  if (lastAdjustment !== null) {
    localStorage.setItem('lastAdjustment', lastAdjustment.toString())
  } else {
    localStorage.removeItem('lastAdjustment')
  }
}, [lastAdjustment])

  // Timer countdown
  useEffect(() => {
    let interval
    if (isTimerRunning && (timerMinutes > 0 || timerSeconds > 0)) {
      interval = setInterval(() => {
        if (timerSeconds > 0) {
          setTimerSeconds(timerSeconds - 1)
        } else if (timerMinutes > 0) {
          setTimerMinutes(timerMinutes - 1)
          setTimerSeconds(59)
        }
      }, 1000)
    } else if (isTimerRunning && timerMinutes === 0 && timerSeconds === 0) {
      // Timer finished - show controls to let user finish manually
      setShowControls(true)
    }
    return () => clearInterval(interval)
  }, [isTimerRunning, timerMinutes, timerSeconds])

  // Stopwatch
  useEffect(() => {
    let interval
    if (isStopwatchRunning) {
      const now = Date.now()
      if (!stopwatchStartTime) {
        setStopwatchStartTime(now)
      }
      
      interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - stopwatchStartTime) / 1000)
        setStopwatchTime(stopwatchPausedTime + elapsed)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isStopwatchRunning, stopwatchStartTime, stopwatchPausedTime])

  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }

  const getTagColor = (tagName) => {
    const colorIndex = userTags.indexOf(tagName) % TAG_COLORS.length
    return TAG_COLORS[colorIndex]
  }

  const getTagBackground = (tagName) => {
    const color = getTagColor(tagName)
    // Convert hex to rgba with low opacity for background
    const r = parseInt(color.slice(1, 3), 16)
    const g = parseInt(color.slice(3, 5), 16)
    const b = parseInt(color.slice(5, 7), 16)
    return `rgba(${r}, ${g}, ${b}, 0.1)`
  }

  const addNewTag = () => {
    if (newTagName.trim() && !userTags.includes(newTagName.trim())) {
      setUserTags(prev => [...prev, newTagName.trim()])
      setNewTagName('')
    }
  }

  const removeTag = (tagToRemove) => {
    if (tagToRemove === 'Other') return // Can't remove Other tag
    
    // Move all tasks with this tag to "Other"
    setTasks(prev => prev.map(task => 
      task.tag === tagToRemove ? { ...task, tag: 'Other' } : task
    ))
    
    // Remove the tag
    setUserTags(prev => prev.filter(tag => tag !== tagToRemove))
    
    // If currently selected tag is being removed, switch to Other
    if (selectedTag === tagToRemove) {
      setSelectedTag('Other')
    }
  }

  const saveCompletedTask = (type) => {
    if (!currentTask.trim()) return

    let duration = 0
    if (type === 'timer') {
      // Calculate actual elapsed time from start
      const originalTime = timerStartTime || (25 * 60)
      const remainingTime = timerMinutes * 60 + timerSeconds
      duration = originalTime - remainingTime
    } else {
      duration = stopwatchTime
    }

    // Only save if there's actual time spent
    if (duration <= 0) return

    const newTask = {
      id: Date.now(),
      task: currentTask,
      tag: selectedTag,
      duration,
      type,
      date: new Date().toISOString().split('T')[0],
      timestamp: new Date().toISOString()
    }

    setTasks(prev => [...prev, newTask])
    setCurrentTask('')
  }

const startTimer = () => {
  if (currentTask.trim()) {
    // Store the original timer duration when starting
    if (!isTimerRunning && timerStartTime === 0) {
      setTimerStartTime(timerMinutes * 60 + timerSeconds)
    }
    setIsTimerRunning(true)
    setIsInTimingMode(true)
    // DON'T reset hasUsedRandomAdjust here - let it persist for the session
  }
}

  const pauseTimer = () => {
    setIsTimerRunning(false)
    // Don't save task when pausing, just pause
  }


const stopTimer = () => {
  setIsTimerRunning(false)
  if (currentTask.trim()) {
    saveCompletedTask('timer')
  }
  // Reset timer to original values and clear start time
  setIsTimerRunning(false)
  setTimerMinutes(25)
  setTimerSeconds(0)
  setTimerStartTime(0)
  setTimerPausedTime(0)
  setIsInTimingMode(false)
  setShowControls(false)
  // Reset random adjustment state ONLY when completely stopping
  setHasUsedRandomAdjust(false)
  setLastAdjustment(null)
  // Clean up localStorage
  localStorage.removeItem('hasUsedRandomAdjust')
  localStorage.removeItem('lastAdjustment')
}

  const startStopwatch = () => {
    if (currentTask.trim()) {
      setIsStopwatchRunning(true)
      setStopwatchStartTime(Date.now())
      setIsInTimingMode(true)
    }
  }

  const pauseStopwatch = () => {
    setIsStopwatchRunning(false)
    setStopwatchPausedTime(stopwatchTime)
    setStopwatchStartTime(null)
  }

  const stopStopwatch = () => {
    setIsStopwatchRunning(false)
    if (currentTask.trim()) {
      saveCompletedTask('stopwatch')
    }
    setIsStopwatchRunning(false)
    setStopwatchTime(0)
    setStopwatchStartTime(null)
    setStopwatchPausedTime(0)
    setIsInTimingMode(false)
    setShowControls(false)
  }

  const goBackToSetup = () => {
    setIsInTimingMode(false)
  }

  const handleTimeClick = () => {
    if (activeTab === 'timer' && !isTimerRunning) {
      setIsEditingTime(true)
      setEditMinutes(timerMinutes.toString())
      setEditSeconds(timerSeconds.toString())
    }
  }

  const handleTimeSubmit = () => {
    const minutes = parseInt(editMinutes) || 0
    const seconds = parseInt(editSeconds) || 0
    
    if (seconds >= 60) {
      setTimerMinutes(minutes + Math.floor(seconds / 60))
      setTimerSeconds(seconds % 60)
    } else {
      setTimerMinutes(minutes)
      setTimerSeconds(seconds)
    }
    
    setIsEditingTime(false)
  }

  const handleTimeCancel = () => {
    setIsEditingTime(false)
    setEditMinutes('')
    setEditSeconds('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleTimeSubmit()
    } else if (e.key === 'Escape') {
      handleTimeCancel()
    }
  }

const adjustTime = () => {
  if (activeTab !== 'timer' || hasUsedRandomAdjust) return
  
  // Generate random adjustment between -timeAdjustment and +timeAdjustment
  const randomAdjustment = Math.floor(Math.random() * (timeAdjustment * 2 + 1)) - timeAdjustment
  const adjustmentInSeconds = randomAdjustment * 60
  
  // Calculate total current time in seconds
  const currentTotalSeconds = timerMinutes * 60 + timerSeconds
  
  // Add adjustment
  const newTotalSeconds = Math.max(0, currentTotalSeconds + adjustmentInSeconds)
  
  // Convert back to minutes and seconds
  const newMinutes = Math.floor(newTotalSeconds / 60)
  const newSeconds = newTotalSeconds % 60
  
  setTimerMinutes(newMinutes)
  setTimerSeconds(newSeconds)
  
  // Update the start time to maintain correct duration tracking
  setTimerStartTime(prev => Math.max(0, prev + adjustmentInSeconds))
  
  // Mark as used and store the adjustment
  setHasUsedRandomAdjust(true)
  setLastAdjustment(randomAdjustment)
}

const handleTimingModeClick = () => {
  if (activeTab === 'timer') {
    // If timer is at 00:00, clicking should finish the task
    if (timerMinutes === 0 && timerSeconds === 0 && isTimerRunning) {
      stopTimer()
      return
    }
    
    if (isTimerRunning) {
      pauseTimer()
      setShowControls(true)
      setShowTimeAdjuster(true)
    } else {
      startTimer()
      setShowControls(false)
      setShowTimeAdjuster(false)
    }
  } else {
    if (isStopwatchRunning) {
      pauseStopwatch()
      setShowControls(true)
    } else {
      startStopwatch()
      setShowControls(false)
    }
  }
}
  // STAGE 1: Setup Mode - Scrollable with proper container
  if (!isInTimingMode) {
    return (
      <div className="h-full overflow-y-auto">
        <div className="min-h-full flex items-center justify-center py-8">
          <div className="max-w-2xl mx-auto space-y-8 px-4">
            <div className="text-center">
              <h1 className="text-3xl sm:text-4xl font-bold mb-2">Start Working</h1>
              <p className="text-muted-foreground">Choose your timer type, set your task, and begin!</p>
            </div>

            {/* Timer Type Selection */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-center">Choose Timer Type</h2>
              <div className="flex justify-center">
                <div className="flex space-x-1 bg-muted p-1 rounded-lg">
                  <button
                    onClick={() => setActiveTab('timer')}
                    className={`flex items-center space-x-2 px-4 py-3 rounded-md text-sm font-medium transition-colors ${
                      activeTab === 'timer'
                        ? 'bg-background text-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <TimerIcon size={20} />
                    <span>Pomodoro Timer</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('stopwatch')}
                    className={`flex items-center space-x-2 px-4 py-3 rounded-md text-sm font-medium transition-colors ${
                      activeTab === 'stopwatch'
                        ? 'bg-background text-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Clock size={20} />
                    <span>Stopwatch</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Timer Setup (only for timer mode) */}
            {activeTab === 'timer' && (
              <div className="bg-card p-6 rounded-lg border space-y-4">
                <h3 className="text-lg font-semibold text-center">Set Timer Duration</h3>
                {isEditingTime ? (
                  <div className="flex justify-center items-center space-x-4">
                    <div className="flex flex-col items-center space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Minutes</label>
                      <input
                        type="number"
                        min="0"
                        max="999"
                        value={editMinutes}
                        onChange={(e) => setEditMinutes(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="w-20 px-3 py-2 text-xl font-mono text-center border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        autoFocus
                      />
                    </div>
                    <span className="text-xl font-mono font-bold mt-6">:</span>
                    <div className="flex flex-col items-center space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Seconds</label>
                      <input
                        type="number"
                        min="0"
                        max="59"
                        value={editSeconds}
                        onChange={(e) => setEditSeconds(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="w-20 px-3 py-2 text-xl font-mono text-center border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div className="flex flex-col space-y-2 mt-6">
                      <button
                        onClick={handleTimeSubmit}
                        className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                      >
                        ✓
                      </button>
                      <button
                        onClick={handleTimeCancel}
                        className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <div 
                      className="text-4xl sm:text-5xl font-mono font-bold text-primary cursor-pointer hover:text-primary/80 transition-colors inline-block"
                      onClick={handleTimeClick}
                      title="Click to edit time"
                    >
                      {`${timerMinutes.toString().padStart(2, '0')}:${timerSeconds.toString().padStart(2, '0')}`}
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">Click to edit time</p>
                  </div>
                )}
              </div>
            )}

            {/* Task Input */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-center">What are you working on?</h3>
              <input
                type="text"
                placeholder="Enter your task..."
                value={currentTask}
                onChange={(e) => setCurrentTask(e.target.value)}
                className="w-full px-4 py-3 text-lg border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              
              <select
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                className="w-full px-4 py-3 text-lg border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {userTags.map(tag => (
                  <option key={tag} value={tag} className='text-black dark:text-white dark:bg-zinc-800'>{tag}</option>
                ))}
              </select>

              <button
                onClick={() => setShowTagManager(!showTagManager)}
                className="w-full px-4 py-3 border border-dashed rounded-lg hover:bg-muted transition-colors"
              >
                Manage Tags
              </button>

              {showTagManager && (
                <div className="border rounded-lg p-4 space-y-4 bg-muted/50">
                  {/* Add new tag section */}
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Add New Tag:</div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Enter tag name"
                        value={newTagName}
                        onChange={(e) => setNewTagName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            addNewTag()
                          }
                        }}
                        className="flex-1 px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                      <button
                        onClick={addNewTag}
                        disabled={!newTagName.trim() || userTags.includes(newTagName.trim())}
                        className="px-4 py-2 bg-green-600 text-white rounded-md text-sm hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
                      >
                        <Plus size={16} />
                        <span>Add</span>
                      </button>
                    </div>
                  </div>
                  
                  {/* Current tags section */}
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Current Tags:</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {userTags.map(tag => (
                        <div
                          key={tag}
                          className="flex items-center justify-between p-2 rounded-md border"
                          style={{ 
                            backgroundColor: getTagBackground(tag),
                            borderColor: getTagColor(tag)
                          }}
                        >
                          <div className="flex items-center space-x-2 flex-1">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: getTagColor(tag) }}
                            />
                            <span className="text-sm font-medium">{tag}</span>
                          </div>
                          {tag !== 'Other' && (
                            <button
                              onClick={() => removeTag(tag)}
                              className="p-1 hover:bg-red-100 hover:text-red-700 rounded transition-colors"
                              title={`Remove ${tag} tag`}
                            >
                              <X size={14} />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Start Button */}
            <div className="text-center pt-4">
              <button
                onClick={activeTab === 'timer' ? startTimer : startStopwatch}
                disabled={!currentTask.trim()}
                className="px-8 py-4 bg-green-700 text-white text-lg font-semibold rounded-lg hover:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2 mx-auto"
              >
                <Play size={20} />
                <span>Start {activeTab === 'timer' ? 'Timer' : 'Stopwatch'}</span>
              </button>
              {!currentTask.trim() && (
                <p className="text-sm text-muted-foreground mt-2">Please enter a task to start</p>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // STAGE 2: Timing Mode - Full screen, perfectly centered, no scroll
  return (
    <div className="fixed inset-0 bg-background flex flex-col">
      {/* Navigation overlay - only visible on hover */}
      <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-background/80 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 z-10">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={goBackToSetup}
            className="px-4 py-2 bg-background/80 backdrop-blur-sm border rounded-lg text-sm font-medium hover:bg-background transition-colors"
          >
            ← Back to Setup
          </button>
          <div className="text-sm text-muted-foreground bg-background/80 backdrop-blur-sm px-3 py-1 rounded-lg">
            {currentTask}
          </div>
        </div>
      </div>
      
      {/* Main timer content - perfectly centered */}
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-8">
          {/* Main Timer Display - Clickable */}

    {/* Main Timer Display - Clickable */}
<div 
  className="text-6xl sm:text-8xl md:text-9xl lg:text-[12rem] xl:text-[14rem] font-mono font-bold text-primary cursor-pointer select-none leading-none"
  onClick={handleTimingModeClick}
  title="Click to pause/resume"
>
  {activeTab === 'timer'
    ? `${timerMinutes.toString().padStart(2, '0')}:${timerSeconds.toString().padStart(2, '0')}`
    : formatTime(stopwatchTime)
  }
</div>

{/* Time Adjuster - Only for timer when paused and not used yet */}
{activeTab === 'timer' && showControls && !hasUsedRandomAdjust && (
  <div className="flex flex-col items-center space-y-4 bg-card/50 backdrop-blur-sm p-4 rounded-lg border">
    <div className="flex items-center space-x-4">
      <div className="flex items-center space-x-2">
        <input
          type="number"
          min="1"
          max="10"
          value={timeAdjustment}
          onChange={(e) => setTimeAdjustment(Math.max(1, Math.min(10, parseInt(e.target.value) || 1)))}
          className="w-16 px-2 py-1 text-center border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="5"
        />
        <span className="text-sm text-muted-foreground">max min</span>
      </div>
      
      <button
        onClick={adjustTime}
        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        title={`Randomly adjust time by ±${timeAdjustment} minutes`}
      >
        <span className="text-sm font-bold">🎲 Random Time</span>
      </button>
    </div>
    <p className="text-xs text-muted-foreground text-center">
      Will randomly add or subtract 1-{timeAdjustment} minutes (one time only)
    </p>
  </div>
)}

{/* Show last adjustment badge */}
{lastAdjustment !== null && (
  <div className={`px-3 py-1 rounded-full text-sm font-bold ${
    lastAdjustment >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
  }`}>
    {lastAdjustment >= 0 ? '+' : ''}{lastAdjustment} minutes
  </div>
)}
          {/* Controls - Only show when paused */}
          {showControls && (
            <div className="flex justify-center space-x-4">

              <button
                onClick={activeTab === 'timer' ? stopTimer : stopStopwatch}
                className="flex items-center space-x-2 px-6 py-3 bg-red-700 text-white rounded-lg hover:bg-red-800"
              >
                <Square size={20} />
                <span>Stop & Save</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}