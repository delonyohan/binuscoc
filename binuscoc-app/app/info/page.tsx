"use client";

import { useEffect, useState } from "react";
import { Cpu, Scale, Code, Monitor, Smartphone, Globe } from "lucide-react";

export default function InfoPage() {
  const [systemInfo, setSystemInfo] = useState<any>({
    userAgent: "Loading...",
    platform: "Loading...",
    language: "Loading...",
    resolution: "Loading...",
    cores: "Loading...",
    memory: "Loading...",
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
        setSystemInfo({
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            language: navigator.language,
            resolution: `${window.screen.width} x ${window.screen.height} (Pixel Ratio: ${window.devicePixelRatio})`,
            cores: navigator.hardwareConcurrency ? `${navigator.hardwareConcurrency} Logical Cores` : "Unknown",
            // @ts-ignore
            memory: navigator.deviceMemory ? `~${navigator.deviceMemory} GB` : "Unknown",
            connection: navigator.onLine ? "Online" : "Offline"
        });
    }
  }, []);

  return (
    <div className="space-y-6 px-4 pb-10 max-w-6xl mx-auto">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-5 border border-gray-200 dark:border-gray-800">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">System & License Info</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Technical specifications and licensing details.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
         {/* System Info */}
         <div className="bg-white dark:bg-gray-900 p-5 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800">
            <div className="flex items-center mb-4 pb-2 border-b border-gray-100 dark:border-gray-800">
                <Cpu className="w-5 h-5 text-purple-600 mr-2" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">System Diagnostics</h2>
            </div>
            <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-md">
                        <div className="flex items-center text-xs text-gray-500 mb-1">
                            <Monitor className="w-3 h-3 mr-1.5"/> Resolution
                        </div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{systemInfo.resolution}</div>
                    </div>
                    <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-md">
                        <div className="flex items-center text-xs text-gray-500 mb-1">
                            <Cpu className="w-3 h-3 mr-1.5"/> Cores
                        </div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{systemInfo.cores}</div>
                    </div>
                    <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-md">
                        <div className="flex items-center text-xs text-gray-500 mb-1">
                            <Smartphone className="w-3 h-3 mr-1.5"/> Platform
                        </div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{systemInfo.platform}</div>
                    </div>
                    <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-md">
                        <div className="flex items-center text-xs text-gray-500 mb-1">
                            <Globe className="w-3 h-3 mr-1.5"/> Language
                        </div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{systemInfo.language}</div>
                    </div>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-md mt-2">
                    <div className="text-xs text-gray-500 mb-1">User Agent</div>
                    <div className="font-mono text-xs text-gray-600 dark:text-gray-400 break-all leading-tight">
                        {systemInfo.userAgent}
                    </div>
                </div>
            </div>
        </div>

        {/* Tech Stack */}
        <div className="bg-white dark:bg-gray-900 p-5 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800">
            <div className="flex items-center mb-4 pb-2 border-b border-gray-100 dark:border-gray-800">
                <Code className="w-5 h-5 text-blue-600 mr-2" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Tech Stack</h2>
            </div>
            <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center py-1">
                    <span className="text-gray-600 dark:text-gray-400">Framework</span>
                    <span className="font-medium text-gray-900 dark:text-white bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded text-xs">Next.js 14</span>
                </div>
                <div className="flex justify-between items-center py-1">
                    <span className="text-gray-600 dark:text-gray-400">Styling</span>
                    <span className="font-medium text-gray-900 dark:text-white bg-cyan-50 dark:bg-cyan-900/20 px-2 py-0.5 rounded text-xs">Tailwind CSS</span>
                </div>
                <div className="flex justify-between items-center py-1">
                    <span className="text-gray-600 dark:text-gray-400">Inference</span>
                    <span className="font-medium text-gray-900 dark:text-white bg-orange-50 dark:bg-orange-900/20 px-2 py-0.5 rounded text-xs">ONNX Runtime</span>
                </div>
                <div className="flex justify-between items-center py-1">
                    <span className="text-gray-600 dark:text-gray-400">Model</span>
                    <span className="font-medium text-gray-900 dark:text-white bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded text-xs">YOLOv5s</span>
                </div>
                <div className="flex justify-between items-center py-1">
                    <span className="text-gray-600 dark:text-gray-400">Host</span>
                    <span className="font-medium text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded text-xs">Vercel</span>
                </div>
            </div>
        </div>
      </div>

      {/* License */}
      <div className="bg-white dark:bg-gray-900 p-5 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800">
          <div className="flex items-center mb-3">
                <Scale className="w-5 h-5 text-gray-700 dark:text-gray-300 mr-2" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">MIT License</h2>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-md text-xs text-gray-600 dark:text-gray-400 font-mono overflow-y-auto max-h-48 whitespace-pre-wrap leading-relaxed border border-gray-100 dark:border-gray-700">
{`MIT License

Copyright (c) 2025 BINUSCOC

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`}
          </div>
      </div>
    </div>
  );
}