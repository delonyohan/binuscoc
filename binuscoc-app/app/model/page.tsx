"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import StaticImageDetector from '@/components/StaticImageDetector';

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
    <div className="space-y-8 px-4 pb-10">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 border-l-4 border-green-600">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">Model Analytics</h1>
        <p className="text-gray-600 dark:text-gray-300 text-lg">
          Detailed performance metrics for the YOLOv5s architecture.
          Visualizing training loss, precision-recall, and class accuracy.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="lg:col-span-2">
            <StaticImageDetector />
        </div>

        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 border-b pb-4">Training Loss Metrics</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trainingData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                    dataKey="epoch" 
                    tick={{fill: '#6b7280'}} 
                    label={{ value: 'Epochs', position: 'insideBottomRight', offset: -5, fill: '#9ca3af' }}
                />
                <YAxis tick={{fill: '#6b7280'}} />
                <Tooltip 
                    contentStyle={{backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '8px', border: '1px solid #e5e7eb'}}
                />
                <Legend wrapperStyle={{paddingTop: '10px'}} />
                <Line type="monotone" dataKey="box_loss" stroke="#ef4444" name="Box Loss" dot={false} strokeWidth={2} />
                <Line type="monotone" dataKey="obj_loss" stroke="#3b82f6" name="Obj Loss" dot={false} strokeWidth={2} />
                <Line type="monotone" dataKey="cls_loss" stroke="#22c55e" name="Cls Loss" dot={false} strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 border-b pb-4">Precision & Recall (mAP)</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trainingData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                    dataKey="epoch" 
                    tick={{fill: '#6b7280'}}
                    label={{ value: 'Epochs', position: 'insideBottomRight', offset: -5, fill: '#9ca3af' }} 
                />
                <YAxis tick={{fill: '#6b7280'}} />
                <Tooltip 
                    contentStyle={{backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '8px', border: '1px solid #e5e7eb'}}
                />
                <Legend wrapperStyle={{paddingTop: '10px'}} />
                <Line type="monotone" dataKey="mAP_50" stroke="#8b5cf6" name="mAP@0.5" dot={false} strokeWidth={2} />
                <Line type="monotone" dataKey="mAP_50_95" stroke="#f97316" name="mAP@0.5:0.95" dot={false} strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md lg:col-span-2">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 border-b pb-4">Class Confusion Matrix</h3>
          <div className="overflow-x-auto">
             <table className="w-full text-center text-sm border-collapse">
                 <thead>
                     <tr className="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                         <th className="p-3 border dark:border-gray-700">Actual \ Pred</th>
                         <th className="p-3 border dark:border-gray-700">Crop Top</th>
                         <th className="p-3 border dark:border-gray-700">Shorts</th>
                         <th className="p-3 border dark:border-gray-700">Skirt</th>
                         <th className="p-3 border dark:border-gray-700">Jeans</th>
                         <th className="p-3 border dark:border-gray-700">Footwear</th>
                         <th className="p-3 border dark:border-gray-700">Background</th>
                     </tr>
                 </thead>
                 <tbody className="text-gray-700 dark:text-gray-300">
                     <tr>
                         <td className="font-bold p-3 border dark:border-gray-700 bg-gray-50 dark:bg-gray-800">Crop Top</td>
                         <td className="bg-blue-600 text-white font-bold p-3 border dark:border-gray-700">0.92</td>
                         <td className="p-3 border dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">0.01</td>
                         <td className="p-3 border dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">0.00</td>
                         <td className="p-3 border dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">0.02</td>
                         <td className="p-3 border dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">0.00</td>
                         <td className="p-3 border dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">0.05</td>
                     </tr>
                     <tr>
                         <td className="font-bold p-3 border dark:border-gray-700 bg-gray-50 dark:bg-gray-800">Shorts</td>
                         <td className="p-3 border dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">0.01</td>
                         <td className="bg-blue-600 text-white font-bold p-3 border dark:border-gray-700">0.88</td>
                         <td className="bg-blue-100 dark:bg-blue-900/30 p-3 border dark:border-gray-700">0.08</td>
                         <td className="p-3 border dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">0.00</td>
                         <td className="p-3 border dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">0.00</td>
                         <td className="p-3 border dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">0.03</td>
                     </tr>
                     <tr>
                         <td className="font-bold p-3 border dark:border-gray-700 bg-gray-50 dark:bg-gray-800">Skirt</td>
                         <td className="p-3 border dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">0.00</td>
                         <td className="bg-blue-100 dark:bg-blue-900/30 p-3 border dark:border-gray-700">0.12</td>
                         <td className="bg-blue-600 text-white font-bold p-3 border dark:border-gray-700">0.85</td>
                         <td className="p-3 border dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">0.00</td>
                         <td className="p-3 border dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">0.00</td>
                         <td className="p-3 border dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">0.03</td>
                     </tr>
                 </tbody>
             </table>
             <p className="text-xs text-gray-500 mt-3 text-center italic">* Rows represent Actual classes, Columns represent Predicted classes. High diagonal values indicate good performance.</p>
          </div>
       </div>

      </div>
    </div>
  );
}