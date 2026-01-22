export const colors = {
  light: {
    primary: '#2563eb', // blue-600
    primaryLight: '#3b82f6', // blue-500
    primaryDark: '#1d4ed8', // blue-700
    secondary: '#6366f1', // indigo-500
    background: '#eff6ff', // blue-50
    backgroundSecondary: '#ffffff',
    backgroundTertiary: '#eef2ff', // indigo-50
    text: '#111827', // gray-900
    textSecondary: '#4b5563', // gray-600
    textTertiary: '#6b7280', // gray-500
    border: '#e5e7eb', // gray-200
    borderDark: '#d1d5db', // gray-300
    card: '#ffffff',
    cardHover: '#f3f4f6', // gray-100
    success: '#10b981', // green-500
    error: '#ef4444', // red-500
    warning: '#f59e0b', // amber-500
    info: '#3b82f6', // blue-500
  },
  dark: {
    primary: '#3b82f6', // blue-500
    primaryLight: '#60a5fa', // blue-400
    primaryDark: '#2563eb', // blue-600
    secondary: '#818cf8', // indigo-400
    background: '#111827', // gray-900
    backgroundSecondary: '#1f2937', // gray-800
    backgroundTertiary: '#312e81', // indigo-900
    text: '#ffffff',
    textSecondary: '#d1d5db', // gray-300
    textTertiary: '#9ca3af', // gray-400
    border: '#374151', // gray-700
    borderDark: '#4b5563', // gray-600
    card: '#1f2937', // gray-800
    cardHover: '#374151', // gray-700
    success: '#34d399', // green-400
    error: '#f87171', // red-400
    warning: '#fbbf24', // amber-400
    info: '#60a5fa', // blue-400
  },
  // Priority colors
  priority: {
    low: '#10b981', // green-500
    medium: '#f59e0b', // amber-500
    high: '#ef4444', // red-500
  },
  // Calendar event colors
  eventColors: {
    blue: '#3b82f6',
    green: '#10b981',
    red: '#ef4444',
    yellow: '#f59e0b',
    purple: '#8b5cf6',
    pink: '#ec4899',
  }
};

export type ColorScheme = 'light' | 'dark';
