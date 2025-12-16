import React from 'react';
import { NavLink } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { TrendChart, DistributionChart } from '../components/DashboardCharts';
import { DailyStat, ViolationType } from '../types';

// Mock data for demonstration
const MOCK_STATS: DailyStat[] = [
    { date: 'Dec 10', shorts: 4, sandals: 2, sleeveless: 1, total: 7 },
    { date: 'Dec 11', shorts: 2, sandals: 5, sleeveless: 2, total: 9 },
    { date: 'Dec 12', shorts: 6, sandals: 3, sleeveless: 3, total: 12 },
    { date: 'Dec 13', shorts: 3, sandals: 1, sleeveless: 1, total: 5 },
    { date: 'Dec 14', shorts: 8, sandals: 4, sleeveless: 2, total: 14 },
    { date: 'Dec 15', shorts: 5, sandals: 2, sleeveless: 0, total: 7 },
    { date: 'Dec 16', shorts: 7, sandals: 6, sleeveless: 3, total: 16 },
];

const totalViolations = MOCK_STATS.reduce((acc, day) => acc + day.total, 0);

const Dashboard: React.FC = () => {
  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Dashboard</h1>
        <p className="text-slate-500 mt-1">Welcome back! Here's an overview of the system's activity.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-slate-500">Total Violations (Week)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-slate-800">{totalViolations}</p>
            <p className="text-xs text-green-500 mt-1">-5% from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-slate-500">Most Frequent</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-slate-800">Shorts</p>
            <p className="text-xs text-slate-400 mt-1">45% of all violations</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-slate-500">Model Accuracy</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-slate-800">92.7%</p>
            <p className="text-xs text-slate-400 mt-1">mAP @ 0.5 IoU</p>
          </CardContent>
        </Card>
        <Card className="bg-emerald-500 text-white hover:bg-emerald-600 transition-colors">
            <NavLink to="/live-monitor" className="block h-full">
                <CardHeader>
                    <CardTitle className="text-sm font-medium text-emerald-100">Live Monitor</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center">
                    <i className="fas fa-video text-4xl"></i>
                    <p className="mt-2 font-semibold">Go to Live Feed</p>
                </CardContent>
            </NavLink>
        </Card>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
            <TrendChart data={MOCK_STATS} />
        </div>
        <div>
            <DistributionChart data={MOCK_STATS} />
        </div>
      </div>
    </div>
  );
};

export { Dashboard };