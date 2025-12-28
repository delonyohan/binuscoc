"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';

// Mock Training Data (Epochs)
const trainingData = Array.from({ length: 50 }, (_, i) => ({
  epoch: i + 1,
  box_loss: 0.1 - (i * 0.0015) + (Math.random() * 0.005),
  obj_loss: 0.05 - (i * 0.0008) + (Math.random() * 0.002),
  cls_loss: 0.03 - (i * 0.0005) + (Math.random() * 0.001),
  mAP_50: 0.2 + (Math.log(i + 1) * 0.15),
  mAP_50_95: 0.1 + (Math.log(i + 1) * 0.1),
}));

export default function ModelManager() {
  return (
    <div className="space-y-6 px-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Model Manager</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Analysis of the YOLOv5s Deep Learning model performance on the clothing dataset.
          Metrics generated from training validation steps.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500">Precision</p>
          <p className="text-2xl font-bold text-blue-600">0.892</p>
        </div>
        <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500">Recall</p>
          <p className="text-2xl font-bold text-green-600">0.854</p>
        </div>
        <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500">mAP@0.5</p>
          <p className="text-2xl font-bold text-purple-600">0.881</p>
        </div>
        <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500">mAP@0.5:0.95</p>
          <p className="text-2xl font-bold text-orange-600">0.653</p>
        </div>
      </div>

      {/* Performance Curves */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Loss Metrics (Training)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trainingData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="epoch" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="box_loss" stroke="#ef4444" name="Box Loss" dot={false} />
                <Line type="monotone" dataKey="obj_loss" stroke="#3b82f6" name="Obj Loss" dot={false} />
                <Line type="monotone" dataKey="cls_loss" stroke="#22c55e" name="Cls Loss" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Precision & Recall (mAP)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trainingData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="epoch" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="mAP_50" stroke="#8b5cf6" name="mAP@0.5" dot={false} />
                <Line type="monotone" dataKey="mAP_50_95" stroke="#f97316" name="mAP@0.5:0.95" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

       {/* Confusion Matrix Visualization (Heatmap Style - Simplified) */}
       <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Class Confusion Matrix</h3>
          <div className="overflow-x-auto">
             <table className="min-w-full text-center text-xs">
                 <thead>
                     <tr>
                         <th className="p-2">Actual \ Pred</th>
                         <th className="p-2">Crop Top</th>
                         <th className="p-2">Shorts</th>
                         <th className="p-2">Skirt</th>
                         <th className="p-2">Jeans</th>
                         <th className="p-2">Bg</th>
                     </tr>
                 </thead>
                 <tbody>
                     <tr className="bg-blue-50">
                         <td className="font-bold p-2">Crop Top</td>
                         <td className="bg-blue-600 text-white p-2">0.92</td>
                         <td className="p-2">0.01</td>
                         <td className="p-2">0.00</td>
                         <td className="p-2">0.02</td>
                         <td className="p-2">0.05</td>
                     </tr>
                     <tr>
                         <td className="font-bold p-2">Shorts</td>
                         <td className="p-2">0.01</td>
                         <td className="bg-blue-600 text-white p-2">0.88</td>
                         <td className="bg-blue-200 p-2">0.08</td>
                         <td className="p-2">0.00</td>
                         <td className="p-2">0.03</td>
                     </tr>
                     <tr className="bg-blue-50">
                         <td className="font-bold p-2">Skirt</td>
                         <td className="p-2">0.00</td>
                         <td className="bg-blue-200 p-2">0.12</td>
                         <td className="bg-blue-600 text-white p-2">0.85</td>
                         <td className="p-2">0.00</td>
                         <td className="p-2">0.03</td>
                     </tr>
                 </tbody>
             </table>
             <p className="text-xs text-gray-500 mt-2 text-center">* Simplified matrix for display</p>
          </div>
       </div>

    </div>
  );
}
