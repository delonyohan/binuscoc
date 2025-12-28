"use client";

import { useEffect, useState } from "react";
import { Cpu, Scale, Code } from "lucide-react";

export default function InfoPage() {
  const [systemInfo, setSystemInfo] = useState<string>("Loading...");

  useEffect(() => {
    setSystemInfo(`${navigator.userAgent}`);
  }, []);

  return (
    <div className="space-y-6 px-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">License & Information</h1>
        <p className="text-gray-600 dark:text-gray-300">
          System details, licensing, and technology stack.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tech Stack */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow">
            <div className="flex items-center mb-4">
                <Code className="w-6 h-6 text-blue-500 mr-2" />
                <h2 className="text-xl font-bold">Technology Stack</h2>
            </div>
            <div className="space-y-3">
                <div className="flex justify-between border-b pb-2">
                    <span className="font-semibold">Frontend Framework</span>
                    <span className="text-gray-600">Next.js 14 (React)</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                    <span className="font-semibold">Styling</span>
                    <span className="text-gray-600">Tailwind CSS</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                    <span className="font-semibold">AI Model</span>
                    <span className="text-gray-600">YOLOv5s (ONNX Runtime)</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                    <span className="font-semibold">Deployment</span>
                    <span className="text-gray-600">Vercel</span>
                </div>
                <div className="flex justify-between">
                    <span className="font-semibold">Icons & Charts</span>
                    <span className="text-gray-600">Lucide / Recharts</span>
                </div>
            </div>
        </div>

         {/* System Info */}
         <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow">
            <div className="flex items-center mb-4">
                <Cpu className="w-6 h-6 text-purple-500 mr-2" />
                <h2 className="text-xl font-bold">System Information</h2>
            </div>
            <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded font-mono text-xs text-wrap break-all">
                {systemInfo}
            </div>
            <p className="text-xs text-gray-500 mt-2">
                This app runs client-side inference using WebAssembly (WASM).
            </p>
        </div>
      </div>

      {/* License */}
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow">
          <div className="flex items-center mb-4">
                <Scale className="w-6 h-6 text-gray-900 dark:text-white mr-2" />
                <h2 className="text-xl font-bold">MIT License</h2>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded text-sm text-gray-700 dark:text-gray-300 font-mono overflow-y-auto max-h-60 whitespace-pre-wrap">
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
