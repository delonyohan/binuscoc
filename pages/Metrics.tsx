import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { useQuery } from '@tanstack/react-query';
import Papa from 'papaparse';

const fetchCsv = async () => {
  const response = await fetch('/metrics/results.csv');
  const reader = response.body.getReader();
  const result = await reader.read();
  const decoder = new TextDecoder('utf-8');
  const csv = decoder.decode(result.value);
  const results = Papa.parse(csv, { header: true });
  return results.data;
};

const Metrics: React.FC = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['metrics-data'],
    queryFn: fetchCsv,
  });

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">YOLOv8 Training Metrics</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Confusion Matrix</CardTitle>
          </CardHeader>
          <CardContent>
            <img src="/metrics/confusion_matrix.png" alt="Confusion Matrix" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Normalized Confusion Matrix</CardTitle>
          </CardHeader>
          <CardContent>
            <img src="/metrics/confusion_matrix_normalized.png" alt="Normalized Confusion Matrix" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Results</CardTitle>
          </CardHeader>
          <CardContent>
            <img src="/metrics/results.png" alt="Results" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>F1 Curve</CardTitle>
          </CardHeader>
          <CardContent>
            <img src="/metrics/BoxF1_curve.png" alt="F1 Curve" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Precision Curve</CardTitle>
          </CardHeader>
          <CardContent>
            <img src="/metrics/BoxP_curve.png" alt="Precision Curve" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Precision-Recall Curve</CardTitle>
          </CardHeader>
          <CardContent>
            <img src="/metrics/BoxPR_curve.png" alt="PR Curve" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recall Curve</CardTitle>
          </CardHeader>
          <CardContent>
            <img src="/metrics/BoxR_curve.png" alt="Recall Curve" />
          </CardContent>
        </Card>
      </div>
      <div className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Results Data</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p>Loading...</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    {data && Object.keys(data[0] || {}).map((key) => <TableHead key={key}>{key}</TableHead>)}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data &&
                    (data as any[]).map((row, i) => (
                      <TableRow key={i}>
                        {Object.values(row).map((value: any, j) => (
                          <TableCell key={j}>{value}</TableCell>
                        ))}
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Metrics;
