# ⏰ Time Tracker App

A modern, feature-rich time tracking application built with React and TanStack Router. Track your productivity with precision using customizable timers, stopwatches, and dynamic task categorization.

## ✨ Features

### 🎯 Core Functionality
- **Dual Timer System**: Pomodoro-style countdown timer and traditional stopwatch
- **Smart Task Management**: Add, edit, and delete tasks with real-time tracking
- **Dynamic Categories**: Create, customize, and manage your own task tags
- **Persistent Storage**: All data automatically saved to localStorage
- **Visual Analytics**: Beautiful charts and statistics for productivity insights

### ⏱️ Timer Controls
- **Start**: Begin timing your work session
- **Pause**: Take breaks without losing progress (doesn't save task)
- **Stop**: Complete and save your work session
- **Reset**: Clear timer without saving

### 🏷️ Tag System
- **12 Color Palette**: Automatic color assignment for visual distinction
- **Custom Tags**: Add your own categories (Work, Study, Exercise, etc.)
- **Smart Migration**: When deleting tags, time automatically moves to "Other"
- **Protected Default**: "Other" tag cannot be deleted

### 📊 Dashboard Analytics
- **Daily Activity**: Last 7 days breakdown by category
- **Time Distribution**: Pie chart showing category percentages  
- **Weekly Trends**: Line chart tracking daily productivity
- **Today's Summary**: Real-time stats for current day
- **Detailed Statistics**: Total time, sessions, and averages

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/umuttalha/sisatma
   cd sisatma
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Start the development server**
   ```bash
   pnpm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 🛠️ Tech Stack

### Core Framework
- **React 18**: Modern React with hooks
- **TanStack Router**: Type-safe routing
- **TypeScript**: Type safety and better development experience

### UI Components
- **Tailwind CSS**: Utility-first styling
- **Lucide React**: Beautiful icons
- **shadcn/ui**: High-quality UI components
- **Aceternity UI**: Advanced background components

### Data Visualization
- **Recharts**: Responsive charts and graphs
- **Custom Analytics**: Real-time data processing

### Storage
- **LocalStorage API**: Client-side data persistence
- **JSON Serialization**: Efficient data storage

## 📁 Project Structure

```
src/
├── routes/
│   ├── __root.jsx          # Root layout with navigation
│   ├── index.jsx           # Timer page (main functionality)
│   └── dashboard.jsx       # Analytics and charts
├── components/
│   ├── ui/
│   │   ├── button.jsx 
│   │   └── ...             # Other UI components
│   └── mode-toggle.jsx     # Dark/light mode switcher
└── lib/
    └── utils.js            # Utility functions
```

## 🎮 How to Use

### Timer Mode
1. **Set Duration**: Enter minutes and seconds (default: 25:00)
2. **Add Task**: Describe what you're working on
3. **Select Category**: Choose or create a tag
4. **Start Working**: Click Start to begin timing
5. **Manage Session**: Use Pause for breaks, Stop to finish

### Stopwatch Mode
1. **Add Task**: Describe your activity
2. **Select Category**: Choose appropriate tag
3. **Start Timing**: Click Start to begin counting up
4. **Complete Task**: Click Stop to save your work

### Tag Management
1. **Add Tags**: Click "Manage Tags" → Enter name → Add
2. **Remove Tags**: Click X on any tag (except "Other")
3. **View Totals**: See accumulated time per category
4. **Color Coding**: Each tag gets a unique color automatically

### Analytics Dashboard
1. **View Charts**: Navigate to Dashboard tab
2. **Daily Breakdown**: See last 7 days activity
3. **Category Analysis**: Understand time distribution
4. **Track Progress**: Monitor productivity trends

## 🔧 Configuration

### Default Settings
- **Timer Duration**: 25 minutes (Pomodoro technique)
- **Default Category**: "Other"
- **Data Storage**: Browser localStorage
- **Chart Period**: Last 7 days

### Customization
- **Timer Duration**: Adjustable from 0-999 minutes
- **Custom Categories**: Unlimited tag creation
- **Color Themes**: Automatic assignment from 12-color palette
- **Display Format**: HH:MM:SS for all time values

## 💾 Data Management

### Storage
- All data persists in browser localStorage
- Automatic saving on every change
- No server or account required

### Data Structure
```javascript
// Tasks
{
  id: timestamp,
  task: "Task description",
  tag: "Category name", 
  duration: seconds,
  type: "timer" | "stopwatch",
  date: "YYYY-MM-DD",
  timestamp: "ISO string"
}

// User Tags
["Other", "Work", "Study", ...]
```

### Export/Import
Currently stores data locally.

### Design System
- **Responsive**: Works on desktop, tablet, and mobile
- **Dark Mode**: Automatic theme switching
- **Modern UI**: Clean, minimal interface
- **Animations**: Smooth transitions and effects

### Visual Elements
- **Gradient Text**: Eye-catching headers
- **Color Coding**: Category distinction
- **Interactive Charts**: Hover tooltips and legends
- **Animated Backgrounds**: Engaging visual effects

