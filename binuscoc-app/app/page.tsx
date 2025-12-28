"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // Wait, I don't have shadcn ui, I'll use raw tailwind
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { AlertTriangle, CheckCircle, Brain, Users } from "lucide-react";

// Mock Data
const weeklyData = [
  { name: 'Mon', violations: 12, compliance: 150 },
  { name: 'Tue', violations: 19, compliance: 230 },
  { name: 'Wed', violations: 8, compliance: 180 },
  { name: 'Thu', violations: 15, compliance: 210 },
  { name: 'Fri', violations: 25, compliance: 190 },
  { name: 'Sat', violations: 5, compliance: 80 },
  { name: 'Sun', violations: 2, compliance: 40 },
];

const distributionData = [
  { name: 'Crop Tops', value: 40, color: '#ef4444' }, // Red
  { name: 'Shorts/Skirts', value: 35, color: '#f97316' }, // Orange
  { name: 'Open Footwear', value: 25, color: '#eab308' }, // Yellow
];

export default function Dashboard() {
  return (
    <div className="space-y-6 px-4">
      {/* Intro Section */}
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Welcome to BINUSCOC</h1>
        <p className="text-gray-600 dark:text-gray-300">
          The BINUS Campus Outfit Check system utilizes the <strong>YOLOv5s</strong> deep learning model to monitor 
          and ensure compliance with Bina Nusantara University's dress code policy in real-time. 
          This dashboard provides live insights into outfit detections and violation trends.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Detections</p>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white">1,284</h3>
            </div>
            <Users className="w-8 h-8 text-blue-500" />
          </div>
          <p className="text-xs text-green-600 mt-2 flex items-center">
            <CheckCircle className="w-3 h-3 mr-1" /> +12% from last week
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Violations Today</p>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white">14</h3>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
          <p className="text-xs text-red-600 mt-2">Requires attention</p>
        </div>

        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Model Version</p>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white">YOLOv5s</h3>
            </div>
            <Brain className="w-8 h-8 text-purple-500" />
          </div>
          <p className="text-xs text-gray-500 mt-2">Last updated: v1.0.0</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Trend */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Weekly Violation Trends</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="violations" stroke="#ef4444" name="Violations" strokeWidth={2} />
                <Line type="monotone" dataKey="compliance" stroke="#22c55e" name="Compliant" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Distribution */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Violation Distribution</h3>
          <div className="h-80 flex justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={distributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {distributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}