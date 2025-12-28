"use client";

import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { AlertTriangle, CheckCircle, Brain, Users, RotateCcw } from "lucide-react";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalDetections: 0,
    violationsToday: 0,
    cropTop: 0,
    shorts: 0,
    openFoot: 0
  });

  useEffect(() => {
    // Load data from localStorage
    const saved = localStorage.getItem("binuscoc_stats");
    if (saved) {
        setStats(JSON.parse(saved));
    }
  }, []);

  const resetData = () => {
      const empty = { totalDetections: 0, violationsToday: 0, cropTop: 0, shorts: 0, openFoot: 0 };
      setStats(empty);
      localStorage.setItem("binuscoc_stats", JSON.stringify(empty));
  }

  // Transform stats for charts
  const weeklyData = [
    { name: 'Today', violations: stats.violationsToday, compliance: stats.totalDetections - stats.violationsToday },
  ];

  const distributionData = [
    { name: 'Crop Tops', value: stats.cropTop, color: '#ef4444' }, 
    { name: 'Shorts/Skirts', value: stats.shorts, color: '#f97316' }, 
    { name: 'Open Footwear', value: stats.openFoot, color: '#eab308' }, 
  ];

  return (
    <div className="space-y-6 px-4 pb-10">
      {/* Intro Section */}
      <div className="flex justify-between items-end">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 border-l-4 border-blue-600 flex-1 mr-4">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">BINUSCOC Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
              Real-time monitoring system for Bina Nusantara University dress code compliance. 
              Powered by <strong>YOLOv5</strong>.
            </p>
          </div>
          <button onClick={resetData} className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-md h-full hover:bg-gray-50 transition text-gray-500 hover:text-red-500" title="Reset Data">
              <RotateCcw className="w-6 h-6"/>
          </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Detections</p>
              <h3 className="text-4xl font-extrabold text-gray-900 dark:text-white mt-2">{stats.totalDetections}</h3>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                <Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-4 flex items-center">
            <CheckCircle className="w-4 h-4 mr-1 text-green-500" /> System Active
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Violations Today</p>
              <h3 className="text-4xl font-extrabold text-gray-900 dark:text-white mt-2">{stats.violationsToday}</h3>
            </div>
            <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full">
                <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-4">recorded from live monitor</p>
        </div>

        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Model Status</p>
              <h3 className="text-4xl font-extrabold text-gray-900 dark:text-white mt-2">v5s</h3>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                <Brain className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-4">ONNX Runtime Web</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Trend */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Live Activity</h3>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis dataKey="name" tick={{fill: '#6b7280'}} axisLine={false} tickLine={false} dy={10} />
                <YAxis tick={{fill: '#6b7280'}} axisLine={false} tickLine={false} />
                <Tooltip 
                    contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} 
                />
                <Legend wrapperStyle={{paddingTop: '20px'}}/>
                <Line 
                    type="monotone" 
                    dataKey="violations" 
                    stroke="#ef4444" 
                    name="Violations" 
                    strokeWidth={3} 
                    dot={{r: 4, fill: '#ef4444', strokeWidth: 2, stroke: '#fff'}}
                    activeDot={{r: 6}}
                />
                <Line 
                    type="monotone" 
                    dataKey="compliance" 
                    stroke="#22c55e" 
                    name="Compliant" 
                    strokeWidth={3} 
                    dot={{r: 4, fill: '#22c55e', strokeWidth: 2, stroke: '#fff'}}
                    activeDot={{r: 6}}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Distribution */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Violation Categories</h3>
          <div className="h-[350px] w-full flex flex-col items-center justify-center">
            {stats.violationsToday === 0 ? (
                <div className="text-gray-400 text-sm font-medium">No violations to display</div>
            ) : (
                <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                    data={distributionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }: any) => percent > 0 ? `${name}` : ''}
                    outerRadius={120}
                    innerRadius={60}
                    paddingAngle={5}
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
}