import { createFileRoute } from '@tanstack/react-router'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts'
import React, { useState, useEffect } from 'react'

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

  useEffect(() => {
    const savedTasks = localStorage.getItem('timeTasks')
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks))
    }
  }, [])

  const getTagColor = (tagName) => {
    const colorIndex = userTags.indexOf(tagName) % TAG_COLORS.length
    return TAG_COLORS[colorIndex]
  }

  const formatTimeMinutes = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    if (minutes === 0) {
      return `${seconds}s`
    }
    return seconds > 0 ? `${minutes}m ${seconds}s` : `${minutes}m`
  }

  const formatMinutesOnly = (totalSeconds) => {
    return Math.floor(totalSeconds / 60)
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
          <div className="text-2xl font-bold text-blue-600">{formatTimeMinutes(totalSeconds)}</div>
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

      {/* Recent Activity Summary */}
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