import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

const TechItem: React.FC<{ icon: string; name: string; color: string }> = ({ icon, name, color }) => (
    <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
        <i className={`${icon} text-3xl mb-2`} style={{ color }}></i>
        <p className="font-semibold text-sm text-slate-700">{name}</p>
    </div>
);

export const LicenseInfo: React.FC = () => {
    return (
        <div className="p-6 bg-slate-50 min-h-screen">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-800">License & Information</h1>
                    <p className="text-slate-500 mt-1">System details, legal information, and technology stack.</p>
                </div>

                <div className="space-y-8">
                    {/* System Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle>System Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                <div className="flex items-start gap-4">
                                    <i className="fas fa-box-open text-xl text-slate-400 mt-1"></i>
                                    <div>
                                        <p className="text-sm text-slate-500">Application</p>
                                        <p className="font-semibold text-slate-800">binuscoc</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <i className="fas fa-code-branch text-xl text-slate-400 mt-1"></i>
                                    <div>
                                        <p className="text-sm text-slate-500">Version</p>
                                        <p className="font-semibold text-slate-800">2.1.0</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <i className="fas fa-calendar-alt text-xl text-slate-400 mt-1"></i>
                                    <div>
                                        <p className="text-sm text-slate-500">Build Date</p>
                                        <p className="font-semibold text-slate-800">{new Date().toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <i className="fas fa-server text-xl text-slate-400 mt-1"></i>
                                    <div>
                                        <p className="text-sm text-slate-500">Environment</p>
                                        <p className="font-semibold text-slate-800">Production</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Technology Stack */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Technology Stack</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-4">
                                <TechItem icon="fab fa-react" name="React" color="#61DAFB" />
                                <TechItem icon="fas fa-bolt" name="Vite" color="#646CFF" />
                                <TechItem icon="fab fa-python" name="Python" color="#3776AB" />
                                <TechItem icon="fas fa-rocket" name="FastAPI" color="#009688" />
                                <TechItem icon="fas fa-brain" name="YOLOv8" color="#A358FF" />
                                <TechItem icon="fab fa-docker" name="Docker" color="#2496ED" />
                                <TechItem icon="fas fa-wind" name="TailwindCSS" color="#06B6D4" />
                                <TechItem icon="fas fa-chart-pie" name="Recharts" color="#8884d8" />
                            </div>
                        </CardContent>
                    </Card>

                    {/* License */}
                    <Card>
                        <CardHeader>
                            <CardTitle>License</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="prose prose-slate max-w-none text-slate-600">
                                <p><strong>MIT License</strong></p>
                                <p>Copyright (c) 2024 binuscoc</p>
                                <p>
                                    Permission is hereby granted, free of charge, to any person obtaining a copy
                                    of this software and associated documentation files (the "Software"), to deal
                                    in the Software without restriction...
                                </p>
                                <p>
                                    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
                                    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
                                    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
                                    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
                                    LIABILITY...
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};