import { createFileRoute } from '@tanstack/react-router'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts'
import React, { useState, useEffect } from 'react'
import { Edit2, X } from 'lucide-react'

export const Route = createFileRoute('/dashboard')({
  component: DashboardPage,
})

const TAG_COLORS = [
  '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', 
  '#ef4444', '#06b6d4', '#ec4899', '#6b7280',
  '#f97316', '#84cc16', '#06b6d4', '#8b5cf6'
]

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