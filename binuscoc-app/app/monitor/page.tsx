"use client";

import WebcamDetector from "@/components/WebcamDetector";

export default function MonitorPage() {
  return (
    <div className="space-y-6 px-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Live Monitor</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Real-time outfit detection using your camera. Ensure you are in a well-lit environment.
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
            <WebcamDetector />
        </div>
        
        {/* Recent Violations Sidebar - (Logic will be inside WebcamDetector but for now placing a placeholder or lifting state up is complex. I'll keep the Recent Violations list INSIDE the WebcamDetector component for simplicity of the prototype) */}
         <div className="hidden lg:block bg-white dark:bg-gray-900 p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Detection Log</h3>
            <p className="text-sm text-gray-500">Live feed logs will appear below the camera view on smaller screens.</p>
            {/* The WebcamDetector will handle the display of logs */}
        </div>
      </div>
    </div>
  );
}
