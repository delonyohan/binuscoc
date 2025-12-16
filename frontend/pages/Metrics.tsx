import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { useQuery } from '@tanstack/react-query';
import Papa from 'papaparse';

const fetchCsv = async () => {
  const response = await fetch('/metrics/results.csv');
  if (!response.ok) throw new Error('Failed to fetch metrics data');
  const csvText = await response.text();
  const results = Papa.parse(csvText, { header: true });
  // Filter out empty rows that PapaParse might create
  return results.data.filter(row => Object.values(row).some(val => val !== ''));
};

const MetricCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <Card>
        <CardHeader>
            <CardTitle className="text-lg">{title}</CardTitle>
        </CardHeader>
        <CardContent>
            {children}
        </CardContent>
    </Card>
);

const Metrics: React.FC = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['metrics-data'],
    queryFn: fetchCsv,
  });

  const renderTable = () => {
    if (isLoading) return (
      <div className="text-center text-slate-500 py-10">
        <i className="fas fa-spinner fa-spin text-2xl"></i>
        <p>Loading metrics data...</p>
      </div>
    );
    if (error) return <p className="text-red-500 text-center py-10">Error loading data: {error.message}</p>;
    if (!data || data.length === 0) return <p className="text-center text-slate-500 py-10">No data available.</p>;

    const headers = Object.keys(data[0] || {});

    return (
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {headers.map((key) => <TableHead key={key} className="whitespace-nowrap">{key}</TableHead>)}
            </TableRow>
          </TableHeader>
          <TableBody>
            {(data as any[]).map((row, i) => (
              <TableRow key={i}>
                {headers.map((key, j) => (
                  <TableCell key={j} className="whitespace-nowrap">{row[key]}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-800">Model Performance Metrics</h1>
            <p className="text-slate-500 mt-1">An overview of the YOLOv8 model's training and validation results.</p>
        </div>
        
        <div className="space-y-8">
            {/* Main Results & Confusion Matrices */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <MetricCard title="Overall Results">
                    <img src="/metrics/results.png" alt="Results" className="rounded-lg object-contain w-full" />
                </MetricCard>
                <MetricCard title="Confusion Matrix">
                    <img src="/metrics/confusion_matrix_normalized.png" alt="Normalized Confusion Matrix" className="rounded-lg object-contain w-full" />
                </MetricCard>
            </div>

            {/* Performance Curves */}
            <Card>
                <CardHeader>
                    <CardTitle>Performance Curves</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                        <img src="/metrics/BoxP_curve.png" alt="Precision Curve" className="rounded-lg shadow-sm border" />
                        <img src="/metrics/BoxR_curve.png" alt="Recall Curve" className="rounded-lg shadow-sm border" />
                        <img src="/metrics/BoxPR_curve.png" alt="PR Curve" className="rounded-lg shadow-sm border" />
                        <img src="/metrics/BoxF1_curve.png" alt="F1 Curve" className="rounded-lg shadow-sm border" />
                    </div>
                </CardContent>
            </Card>

            {/* Raw Data Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Results Data</CardTitle>
                </CardHeader>
                <CardContent>
                    {renderTable()}
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
};

export default Metrics;
