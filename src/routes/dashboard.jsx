import { createFileRoute } from '@tanstack/react-router'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts'
import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Edit2, X, TrendingUp, Calendar, Clock, Filter, ChevronLeft, ChevronRight } from 'lucide-react'

export const Route = createFileRoute('/dashboard')({
  component: DashboardPage,
})

const TAG_COLORS = [
  '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', 
  '#ef4444', '#06b6d4', '#ec4899', '#6b7280',
  '#f97316', '#84cc16', '#06b6d4', '#8b5cf6'
]

// Timeline Component
function TimelineSlider({ tasks, userTags }) {
  const [selectedTime, setSelectedTime] = useState(480) // 8:00 AM default
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [selectedTags, setSelectedTags] = useState([])
  
  const sliderRef = useRef(null)

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`
  }

  const snapToFifteenMinutes = (minutes) => {
    return Math.round(minutes / 15) * 15
  }

  const handleSliderClick = useCallback((e) => {
    if (!sliderRef.current) return

    const rect = sliderRef.current.getBoundingClientRect()
    const y = e.clientY - rect.top
    const percentage = Math.max(0, Math.min(1, y / rect.height))
    const timeInMinutes = percentage * 1440 // 24 hours * 60 minutes

    const snappedTime = snapToFifteenMinutes(timeInMinutes)
    setSelectedTime(snappedTime)
  }, [])

  const getTagColor = (tagName) => {
    const colorIndex = userTags.indexOf(tagName) % TAG_COLORS.length
    return TAG_COLORS[colorIndex]
  }

  // Convert task timestamp to minutes from midnight
  const getTaskTimeInMinutes = (timestamp) => {
    const date = new Date(timestamp)
    return date.getHours() * 60 + date.getMinutes()
  }

  const goToToday = () => {
    setSelectedDate(new Date().toISOString().split('T')[0])
  }

  // Filter tasks for selected date
  const getActivitiesForDate = () => {
    const filteredTasks = tasks.filter(task => {
      const taskDate = task.date || new Date(task.timestamp).toISOString().split('T')[0]
      const matchesDate = taskDate === selectedDate
      const matchesTag = selectedTags.length === 0 || selectedTags.includes(task.tag)
      return matchesDate && matchesTag
    })

    return filteredTasks.map(task => ({
      id: task.id,
      time: task.timestamp ? getTaskTimeInMinutes(task.timestamp) : 480, // Default to 8 AM if no timestamp
      title: task.task,
      duration: Math.max(task.duration / 60, 5), // Convert seconds to minutes, minimum 5 minutes for visibility
      tag: task.tag,
      originalDuration: task.duration
    }))
  }

  const activities = getActivitiesForDate()

  // Get activity at selected time
  const getActivityAtTime = () => {
    return activities.find(activity => 
      selectedTime >= activity.time && 
      selectedTime < activity.time + activity.duration
    )
  }

  const currentActivity = getActivityAtTime()

  // Format duration for display
  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`
    } else {
      return `${secs}s`
    }
  }

  // Get total time for the day
  const getTotalTimeForDay = () => {
    return activities.reduce((total, activity) => total + activity.originalDuration, 0)
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    if (dateString === today.toISOString().split('T')[0]) {
      return 'Today'
    } else if (dateString === yesterday.toISOString().split('T')[0]) {
      return 'Yesterday'
    } else if (dateString === tomorrow.toISOString().split('T')[0]) {
      return 'Tomorrow'
    } else {
      return date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        month: 'short', 
        day: 'numeric',
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
      })
    }
  }

  const navigateDay = (direction) => {
    const currentDate = new Date(selectedDate)
    currentDate.setDate(currentDate.getDate() + direction)
    setSelectedDate(currentDate.toISOString().split('T')[0])
  }

  const toggleTagFilter = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    )
  }

  return (
    <div className="w-full space-y-6">
      {/* Controls */}
      <div className="space-y-4">
        {/* Date Navigation */}
        <div className="flex items-center justify-center space-x-4 bg-card p-4 rounded-lg border">
          <button
            onClick={() => navigateDay(-1)}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
            title="Previous day"
          >
            <ChevronLeft size={20} />
          </button>
          
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <div className="text-lg font-semibold">{formatDate(selectedDate)}</div>
              <div className="text-sm text-muted-foreground">
                {new Date(selectedDate).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
            </div>
            
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
            />
          </div>
          
          <button
            onClick={() => navigateDay(1)}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
            title="Next day"
          >
            <ChevronRight size={20} />
          </button>
          
          {selectedDate !== new Date().toISOString().split('T')[0] && (
            <button
              onClick={goToToday}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
            >
              Today
            </button>
          )}
        </div>

        {/* Activity Summary and Filters */}
        <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between bg-card p-4 rounded-lg border">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="flex items-center space-x-2">
              <Clock size={20} className="text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Total: {formatDuration(getTotalTimeForDay())} | Activities: {activities.length}
              </span>
            </div>
          </div>

          {/* Tag Filters */}
          <div className="flex items-center space-x-2">
            <Filter size={16} className="text-muted-foreground" />
            <div className="flex flex-wrap gap-2">
              {userTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => toggleTagFilter(tag)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                    selectedTags.includes(tag) || selectedTags.length === 0
                      ? 'text-white shadow-md'
                      : 'text-muted-foreground bg-muted hover:bg-muted/80'
                  }`}
                  style={{
                    backgroundColor: selectedTags.includes(tag) || selectedTags.length === 0 
                      ? getTagColor(tag) 
                      : undefined
                  }}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Timeline Slider */}
        <div className="lg:col-span-2 flex justify-center">
          <div className="flex flex-col items-center">
              <div
  ref={sliderRef}
  className="relative w-32 h-[600px] bg-transparent rounded-full cursor-pointer"
  onClick={handleSliderClick}
>
  {/* Hour markers */}
  {Array.from({ length: 25 }, (_, i) => (
    <div key={i} className="absolute left-0 w-full flex items-center" style={{ top: `${(i / 24) * 100}%` }}>
      <div className="w-8 h-0.5 bg-slate-400 dark:bg-slate-500 ml-2" />
      <span className="text-sm text-slate-600 dark:text-slate-400 ml-3 min-w-[3rem] font-medium">
        {i.toString().padStart(2, "0")}:00
      </span>
    </div>
  ))}

  {/* 15-minute markers */}
  {Array.from({ length: 96 }, (_, i) => {
    const minutes = i * 15
    const isHour = minutes % 60 === 0
    if (isHour) return null

    return (
      <div key={`quarter-${i}`} className="absolute left-0" style={{ top: `${(minutes / 1440) * 100}%` }}>
        <div className="w-4 h-px bg-slate-300 dark:bg-slate-600 ml-2" />
      </div>
    )
  })}

  {/* Activity bars */}
  {activities.map((activity, index) => (
    <div
      key={activity.id}
      className="absolute left-3 right-3 rounded-lg border-l-4 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer opacity-90 hover:opacity-100"
      style={{
        top: `${(activity.time / 1440) * 100}%`,
        height: `${Math.max((activity.duration / 1440) * 100, 1)}%`,
        minHeight: "8px",
        backgroundColor: getTagColor(activity.tag),
        borderColor: getTagColor(activity.tag),
      }}
      title={`${activity.title} (${formatTime(activity.time)} - ${formatTime(activity.time + activity.duration)}) - ${formatDuration(activity.originalDuration)}`}
      onClick={(e) => {
        e.stopPropagation()
        setSelectedTime(activity.time)
      }}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        {activity.duration >= 30 && (
          <span className="text-xs text-white font-medium px-1 bg-black bg-opacity-30 rounded">
            {Math.floor(activity.originalDuration / 60)}m
          </span>
        )}
      </div>
    </div>
  ))}

  {/* Current time indicator */}
  <div
    className="absolute left-0 right-0 h-1 bg-red-500 rounded-full shadow-lg z-10 pointer-events-none"
    style={{ top: `calc(${(selectedTime / 1440) * 100}% - 2px)` }}
  >
    <div className="absolute -right-2 -top-2 w-5 h-5 bg-red-500 rounded-full border-2 border-white dark:border-slate-800 shadow-lg" />
  </div>
</div>
            <div className="mt-6 text-center">
              <div className="text-2xl font-bold text-primary">{formatTime(selectedTime)}</div>
              <div className="text-sm text-muted-foreground">Selected Time</div>
            </div>
          </div>
        </div>

        {/* Activity Details Panel */}
        <div className="space-y-6">
          {/* Current Activity */}
          <div className="bg-card p-6 rounded-lg border">
            <h3 className="text-lg font-semibold mb-4">Activity at {formatTime(selectedTime)}</h3>
            {currentActivity ? (
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: getTagColor(currentActivity.tag) }}
                  />
                  <span className="font-medium">{currentActivity.title}</span>
                </div>
                <div className="text-sm text-muted-foreground space-y-1">
                  <div>Category: <span className="font-medium" style={{ color: getTagColor(currentActivity.tag) }}>{currentActivity.tag}</span></div>
                  <div>Duration: <span className="font-medium">{formatDuration(currentActivity.originalDuration)}</span></div>
                  <div>Time: <span className="font-medium">{formatTime(currentActivity.time)} - {formatTime(currentActivity.time + currentActivity.duration)}</span></div>
                </div>
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-4">
                <Clock size={32} className="mx-auto mb-2 opacity-50" />
                <p>No activity at this time</p>
              </div>
            )}
          </div>

          {/* Day Summary */}
          <div className="bg-card p-6 rounded-lg border">
            <h3 className="text-lg font-semibold mb-4">Day Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Total Time:</span>
                <span className="font-bold text-primary">{formatDuration(getTotalTimeForDay())}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Activities:</span>
                <span className="font-medium">{activities.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Categories:</span>
                <span className="font-medium">{new Set(activities.map(a => a.tag)).size}</span>
              </div>
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="bg-card p-6 rounded-lg border">
            <h3 className="text-lg font-semibold mb-4">Category Breakdown</h3>
            <div className="space-y-3">
              {userTags.map(tag => {
                const tagActivities = activities.filter(a => a.tag === tag)
                const totalTime = tagActivities.reduce((sum, a) => sum + a.originalDuration, 0)
                
                if (totalTime === 0) return null
                
                return (
                  <div key={tag} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: getTagColor(tag) }}
                      />
                      <span className="text-sm">{tag}</span>
                    </div>
                    <div className="text-sm font-medium">
                      {formatDuration(totalTime)}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function DashboardPage() {
  const [tasks, setTasks] = useState([])
  const [userTags, setUserTags] = useState(() => {
    const savedTags = localStorage.getItem('userTags')
    return savedTags ? JSON.parse(savedTags) : ['Other']
  })
  const [editingTask, setEditingTask] = useState(null)

  useEffect(() => {
    const savedTasks = localStorage.getItem('timeTasks')
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks))
    }
  }, [])

  // Save tasks when they change
  useEffect(() => {
    localStorage.setItem('timeTasks', JSON.stringify(tasks))
  }, [tasks])

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

  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }

const formatTimeMinutes = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = Math.floor(totalSeconds % 60)
    if (minutes === 0) {
      return `${seconds}s`
    }
    return seconds > 0 ? `${minutes}m ${seconds}s` : `${minutes}m`
}

  const formatMinutesOnly = (totalSeconds) => {
    return Math.floor(totalSeconds / 60)
  }

  // Get total time by tag (for the tag statistics section)
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

  // Delete task function
  const deleteTask = (taskToDelete) => {
    setTasks(prev => prev.filter(task => task.id !== taskToDelete.id))
  }

  // Edit task function
  const editTask = (id, newTask) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, task: newTask } : task
    ))
    setEditingTask(null)
  }

  // Get daily data for last 7 days
  const getDailyData = () => {
    const last7Days = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      last7Days.push(dateStr)
    }

    return last7Days.map(date => {
      const dayTasks = tasks.filter(task => task.date === date)
      const tagTotals = {}
      let totalTime = 0

      dayTasks.forEach(task => {
        if (!tagTotals[task.tag]) {
          tagTotals[task.tag] = 0
        }
        tagTotals[task.tag] += task.duration
        totalTime += task.duration
      })

      const result = {
        date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        fullDate: date,
        total: formatMinutesOnly(totalTime)
      }

      userTags.forEach(tag => {
        result[tag] = formatMinutesOnly(tagTotals[tag] || 0)
      })

      return result
    })
  }

  // Get tag distribution
  const getTagDistribution = () => {
    const tagTotals = {}
    tasks.forEach(task => {
      if (!tagTotals[task.tag]) {
        tagTotals[task.tag] = 0
      }
      tagTotals[task.tag] += task.duration
    })

    return Object.entries(tagTotals).map(([tag, time]) => ({
      name: tag,
      value: formatMinutesOnly(time),
      color: getTagColor(tag)
    })).filter(item => item.value > 0)
  }

  const dailyData = getDailyData()
  const tagDistribution = getTagDistribution()
  const tagTotals = getTotalTimeByTag()
  
  const totalSeconds = tasks.reduce((sum, task) => sum + task.duration, 0)
  const totalTasks = tasks.length
  const averageSessionTime = totalTasks > 0 ? totalSeconds / totalTasks : 0

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.dataKey}: {entry.value} min
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  const CustomPieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0]
      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg">
          <p style={{ color: data.payload.color }}>
            {data.name}: {data.value} minutes
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card p-6 rounded-lg border">
          <div className="text-2xl font-bold text-blue-600">{formatTime(totalSeconds)}</div>
          <div className="text-sm text-muted-foreground">Total Time Tracked</div>
        </div>
        <div className="bg-card p-6 rounded-lg border">
          <div className="text-2xl font-bold text-green-600">{totalTasks}</div>
          <div className="text-sm text-muted-foreground">Total Sessions</div>
        </div>
        <div className="bg-card p-6 rounded-lg border">
          <div className="text-2xl font-bold text-purple-600">{formatTimeMinutes(averageSessionTime)}</div>
          <div className="text-sm text-muted-foreground">Average Session</div>
        </div>
      </div>

      {/* Timeline Section */}
      <div className="bg-card p-6 rounded-lg border">
        <div className="text-center space-y-2 mb-6">
          <h2 className="text-2xl font-bold">Daily Activity Timeline</h2>
          <p className="text-muted-foreground">Visualize your daily activities and time allocation</p>
        </div>
        <TimelineSlider tasks={tasks} userTags={userTags} />
      </div>

      {/* Tag Statistics - Enhanced with total hours display */}
      <div className="bg-card p-6 rounded-lg border">
        <h2 className="text-xl font-semibold mb-4">Time by Category</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {userTags.map(tag => (
            <div
              key={tag}
              className="p-4 rounded-lg border"
              style={{ backgroundColor: getTagBackground(tag) }}
            >
              <div className="text-sm font-medium truncate" style={{ color: getTagColor(tag) }}>
                {tag}
              </div>
              <div className="text-xl font-bold" style={{ color: getTagColor(tag) }}>
                {formatTime(tagTotals[tag] || 0)}
              </div>
              <div className="text-xs text-muted-foreground">
                {formatMinutesOnly(tagTotals[tag] || 0)} minutes
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Daily Activity Chart */}
        <div className="bg-card p-6 rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">Daily Activity (Last 7 Days)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis label={{ value: 'Minutes', angle: -90, position: 'insideLeft' }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              {userTags.map(tag => (
                <Bar
                  key={tag}
                  dataKey={tag}
                  stackId="a"
                  fill={getTagColor(tag)}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Time Distribution Pie Chart */}
        <div className="bg-card p-6 rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">Time Distribution by Category</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={tagDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent, value }) => `${name} ${value}m (${(percent * 100).toFixed(0)}%)`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {tagDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomPieTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Weekly Trend */}
        <div className="bg-card p-6 rounded-lg border lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Weekly Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis label={{ value: 'Minutes', angle: -90, position: 'insideLeft' }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="total" 
                stroke="#8884d8" 
                strokeWidth={3}
                dot={{ fill: '#8884d8', strokeWidth: 2, r: 4 }}
                name="Total Minutes"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Tasks Section - Transferred from home page */}
      <div className="bg-card p-6 rounded-lg border">
        <h2 className="text-xl font-semibold mb-4">Recent Tasks</h2>
        <div className="space-y-2 max-h-80 overflow-y-auto">
          {tasks.slice(-15).reverse().map(task => {
            return (
              <div key={task.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border gap-3">
                <div className="flex items-center space-x-3 flex-1 min-w-0">
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
                    <span className="flex-1 truncate">{task.task}</span>
                  )}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 text-sm text-muted-foreground shrink-0">
                    <span className="font-mono">{formatTime(task.duration)}</span>
                    <span className="text-xs">{task.date}</span>
                    <span className="text-xs capitalize px-2 py-1 bg-background rounded" style={{ color: getTagColor(task.tag) }}>
                      {task.tag}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-1 shrink-0">
                  <button
                    onClick={() => setEditingTask(task.id)}
                    className="p-1 hover:bg-muted rounded"
                    title="Edit task"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => deleteTask(task)}
                    className="p-1 hover:bg-muted rounded text-red-500"
                    title="Delete task"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            )
          })}
          {tasks.length === 0 && (
            <div className="text-center text-muted-foreground py-8">
              No tasks recorded yet. Start using the timer to see your activity here!
            </div>
          )}
        </div>
      </div>

      {/* Today's Activity Summary */}
      <div className="bg-card p-6 rounded-lg border">
        <h2 className="text-xl font-semibold mb-4">Today's Activity</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {userTags.map(tag => {
            const todayTasks = tasks.filter(task => {
              const today = new Date().toISOString().split('T')[0]
              return task.date === today && task.tag === tag
            })
            const todayTime = todayTasks.reduce((sum, task) => sum + task.duration, 0)
            
            return (
              <div key={tag} className="text-center p-3 border rounded-lg">
                <div 
                  className="w-4 h-4 rounded-full mx-auto mb-2"
                  style={{ backgroundColor: getTagColor(tag) }}
                />
                <div className="text-sm font-medium">{tag}</div>
                <div className="text-lg font-bold" style={{ color: getTagColor(tag) }}>
                  {formatMinutesOnly(todayTime)} min
                </div>
                <div className="text-xs text-muted-foreground">
                  {todayTasks.length} session{todayTasks.length !== 1 ? 's' : ''}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}