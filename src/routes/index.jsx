// index.jsx - Complete Timer page with responsive design
import { createFileRoute } from '@tanstack/react-router'
import React, { useState, useEffect } from 'react'
import { Play, Pause, Square, RotateCcw, Clock, Timer as TimerIcon, Plus, X, Edit2, Check } from 'lucide-react'

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
  const [editingTask, setEditingTask] = useState(null)
  const [newTagName, setNewTagName] = useState('')
  const [showTagManager, setShowTagManager] = useState(false)

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
      setIsTimerRunning(false)
      saveCompletedTask('timer')
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
    resetTimer()
  }

  const resetTimer = () => {
    setIsTimerRunning(false)
    setTimerMinutes(25)
    setTimerSeconds(0)
    setTimerStartTime(0)
    setTimerPausedTime(0)
  }

  const startStopwatch = () => {
    if (currentTask.trim()) {
      setIsStopwatchRunning(true)
      setStopwatchStartTime(Date.now())
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
    resetStopwatch()
  }

  const resetStopwatch = () => {
    setIsStopwatchRunning(false)
    setStopwatchTime(0)
    setStopwatchStartTime(null)
    setStopwatchPausedTime(0)
  }

  const deleteTask = (taskToDelete) => {
    setTasks(prev => prev.filter(task => task.id !== taskToDelete.id))
  }

  const editTask = (id, newTask) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, task: newTask } : task
    ))
    setEditingTask(null)
  }

  const getTotalTimeByTag = () => {
    const tagTotals = {}
    tasks.forEach(task => {
      if (!tagTotals[task.tag]) {
        tagTotals[task.tag] = 0
      }
      tagTotals[task.tag] += task.duration
    })
    return tagTotals
  }

  const tagTotals = getTotalTimeByTag()

  return (
    <div className="min-h-screen bg-background px-4 py-4 sm:py-6 md:py-8">
      <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
        {/* Tab Navigation */}
        <div className="flex justify-center">
          <div className="flex space-x-1 bg-muted p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('timer')}
              className={`flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'timer'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <TimerIcon size={16} />
              <span className="hidden sm:inline">Timer</span>
            </button>
            <button
              onClick={() => setActiveTab('stopwatch')}
              className={`flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'stopwatch'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Clock size={16} />
              <span className="hidden sm:inline">Stopwatch</span>
            </button>
          </div>
        </div>

        {/* Timer/Stopwatch Display */}
        <div className="text-center space-y-4 sm:space-y-6">
          {/* Timer Input Controls */}
          {activeTab === 'timer' && (
            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
              <div className="flex items-center justify-center space-x-2">
                <label className="text-sm font-medium whitespace-nowrap">Minutes:</label>
                <input
                  type="number"
                  min="0"
                  max="999"
                  value={timerMinutes}
                  onChange={(e) => {
                    if (!isTimerRunning) {
                      setTimerMinutes(parseInt(e.target.value) || 0)
                    }
                  }}
                  disabled={isTimerRunning}
                  className="w-16 sm:w-20 px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 text-center"
                />
              </div>
              <div className="flex items-center justify-center space-x-2">
                <label className="text-sm font-medium whitespace-nowrap">Seconds:</label>
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={timerSeconds}
                  onChange={(e) => {
                    if (!isTimerRunning) {
                      setTimerSeconds(parseInt(e.target.value) || 0)
                    }
                  }}
                  disabled={isTimerRunning}
                  className="w-16 sm:w-20 px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 text-center"
                />
              </div>
            </div>
          )}

          {/* Main Timer Display */}
          <div className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-mono font-bold text-primary break-all">
            {activeTab === 'timer'
              ? `${timerMinutes.toString().padStart(2, '0')}:${timerSeconds.toString().padStart(2, '0')}`
              : formatTime(stopwatchTime)
            }
          </div>

          {/* Task Input Section */}
          <div className="space-y-3 sm:space-y-4 max-w-md mx-auto">
            <input
              type="text"
              placeholder="What are you working on?"
              value={currentTask}
              onChange={(e) => setCurrentTask(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base"
            />
            
            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base"
            >
              {userTags.map(tag => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>

            <button
              onClick={() => setShowTagManager(!showTagManager)}
              className="w-full px-3 sm:px-4 py-2 border border-dashed rounded-lg hover:bg-muted transition-colors text-sm"
            >
              Manage Tags
            </button>

            {showTagManager && (
              <div className="border rounded-lg p-3 sm:p-4 space-y-3 bg-muted/50">
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
                      className="flex-1 px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary min-w-0"
                    />
                    <button
                      onClick={addNewTag}
                      disabled={!newTagName.trim() || userTags.includes(newTagName.trim())}
                      className="px-3 py-2 bg-green-600 text-white rounded-md text-sm hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed shrink-0 flex items-center"
                    >
                      <Plus size={16} />
                      <span className="hidden sm:inline sm:ml-1">Add</span>
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
                        className="flex items-center justify-between p-2 rounded-md border min-w-0"
                        style={{ 
                          backgroundColor: getTagBackground(tag),
                          borderColor: getTagColor(tag)
                        }}
                      >
                        <div className="flex items-center space-x-2 min-w-0 flex-1">
                          <div
                            className="w-3 h-3 rounded-full shrink-0"
                            style={{ backgroundColor: getTagColor(tag) }}
                          />
                          <span className="text-sm truncate font-medium">{tag}</span>
                        </div>
                        {tag !== 'Other' && (
                          <button
                            onClick={() => removeTag(tag)}
                            className="ml-2 p-1 hover:bg-red-100 hover:text-red-700 rounded shrink-0 transition-colors"
                            title={`Remove ${tag} tag`}
                          >
                            <X size={14} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Close button for mobile */}
                <div className="pt-2 border-t sm:hidden">
                  <button
                    onClick={() => setShowTagManager(false)}
                    className="w-full px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Controls - Responsive layout */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4 px-2">
            {activeTab === 'timer' ? (
              <>
                <button
                  onClick={startTimer}
                  disabled={isTimerRunning || !currentTask.trim()}
                  className="flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 md:px-6 py-2 sm:py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                >
                  <Play size={16} className="sm:w-5 sm:h-5" />
                  <span>Start</span>
                </button>
                <button
                  onClick={pauseTimer}
                  disabled={!isTimerRunning}
                  className="flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 md:px-6 py-2 sm:py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                >
                  <Pause size={16} className="sm:w-5 sm:h-5" />
                  <span>Pause</span>
                </button>
                <button
                  onClick={stopTimer}
                  disabled={!isTimerRunning}
                  className="flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 md:px-6 py-2 sm:py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                >
                  <Square size={16} className="sm:w-5 sm:h-5" />
                  <span>Stop</span>
                </button>
                <button
                  onClick={resetTimer}
                  className="flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 md:px-6 py-2 sm:py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm sm:text-base"
                >
                  <RotateCcw size={16} className="sm:w-5 sm:h-5" />
                  <span>Reset</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={startStopwatch}
                  disabled={isStopwatchRunning || !currentTask.trim()}
                  className="flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 md:px-6 py-2 sm:py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                >
                  <Play size={16} className="sm:w-5 sm:h-5" />
                  <span>Start</span>
                </button>
                <button
                  onClick={pauseStopwatch}
                  disabled={!isStopwatchRunning}
                  className="flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 md:px-6 py-2 sm:py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                >
                  <Pause size={16} className="sm:w-5 sm:h-5" />
                  <span>Pause</span>
                </button>
                <button
                  onClick={stopStopwatch}
                  disabled={!isStopwatchRunning}
                  className="flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 md:px-6 py-2 sm:py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                >
                  <Square size={16} className="sm:w-5 sm:h-5" />
                  <span>Stop</span>
                </button>
                <button
                  onClick={resetStopwatch}
                  className="flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 md:px-6 py-2 sm:py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm sm:text-base"
                >
                  <RotateCcw size={16} className="sm:w-5 sm:h-5" />
                  <span>Reset</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Tag Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
          {userTags.map(tag => (
            <div
              key={tag}
              className="p-3 sm:p-4 rounded-lg border"
              style={{ backgroundColor: getTagBackground(tag) }}
            >
              <div className="text-sm font-medium truncate" style={{ color: getTagColor(tag) }}>
                {tag}
              </div>
              <div className="text-lg sm:text-xl md:text-2xl font-bold" style={{ color: getTagColor(tag) }}>
                {formatTime(tagTotals[tag] || 0)}
              </div>
            </div>
          ))}
        </div>

        {/* Recent Tasks */}
        <div className="space-y-3 sm:space-y-4">
          <h2 className="text-lg sm:text-xl font-semibold">Recent Tasks</h2>
          <div className="space-y-2 max-h-60 sm:max-h-80 overflow-y-auto">
            {tasks.slice(-10).reverse().map(task => {
              return (
                <div key={task.id} className="flex items-center justify-between p-3 bg-card rounded-lg border gap-3">
                  <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
                    <div
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: getTagColor(task.tag) }}
                    />
                    {editingTask === task.id ? (
                      <input
                        type="text"
                        defaultValue={task.task}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            editTask(task.id, e.target.value)
                          }
                          if (e.key === 'Escape') {
                            setEditingTask(null)
                          }
                        }}
                        onBlur={(e) => editTask(task.id, e.target.value)}
                        className="flex-1 px-2 py-1 border rounded text-sm"
                        autoFocus
                      />
                    ) : (
                      <span className="flex-1 truncate text-sm sm:text-base">{task.task}</span>
                    )}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 text-xs sm:text-sm text-muted-foreground shrink-0">
                      <span className="font-mono">{formatTime(task.duration)}</span>
                      <span className="hidden sm:inline">{task.date}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 shrink-0">
                    <button
                      onClick={() => setEditingTask(task.id)}
                      className="p-1 hover:bg-muted rounded"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => deleteTask(task)}
                      className="p-1 hover:bg-muted rounded text-red-500"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}