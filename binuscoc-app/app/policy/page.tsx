"use client";

import { Mail, Phone, ExternalLink } from "lucide-react";

export default function PolicyPage() {
  return (
    <div className="space-y-6 px-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Policy Information</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Official Bina Nusantara University dress code and campus regulations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Dress Code Policy */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold text-blue-600 mb-4 border-b pb-2">Dress Code Policy</h2>
          <ul className="space-y-4 text-gray-700 dark:text-gray-300">
            <li className="flex items-start">
              <span className="font-bold mr-2">1.</span>
              <span>
                <strong>Tops:</strong> No Crop Tops, Sleeveless shirts, or Transparent Cardigans are allowed. 
                Shoulders and midriffs must be covered at all times.
              </span>
            </li>
            <li className="flex items-start">
              <span className="font-bold mr-2">2.</span>
              <span>
                <strong>Bottoms:</strong> Ripped jeans, shorts, and skirts above the knee (mini-skirts) are strictly prohibited 
                on campus grounds. Trousers must be neat and proper.
              </span>
            </li>
            <li className="flex items-start">
              <span className="font-bold mr-2">3.</span>
              <span>
                <strong>Footwear:</strong> Closed footwear (shoes/sneakers) must be worn. Sandals, slippers, and bare feet 
                are not permitted.
              </span>
            </li>
            <li className="flex items-start">
              <span className="font-bold mr-2">4.</span>
              <span>
                <strong>Formal Wear:</strong> For specific events or exams, formal attire (White shirt, black tie/pants) 
                may be required as per department instruction.
              </span>
            </li>
          </ul>
        </div>

        {/* General Regulations */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold text-purple-600 mb-4 border-b pb-2">General Regulations</h2>
          <div className="space-y-4 text-gray-700 dark:text-gray-300">
            <p>
              Students are expected to maintain a professional and academic appearance. The university reserves the right 
              to deny entry or request students to leave if their attire is deemed inappropriate.
            </p>
            <p>
              Repeated violations may result in disciplinary action, including verbal warnings, points deduction (SAT), 
              or suspension depending on severity.
            </p>
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded border-l-4 border-yellow-500 mt-4">
              <p className="text-sm italic">
                "Respect the campus environment by dressing appropriately for an academic setting."
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Inquiries */}
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Policy Inquiries</h2>
        <p className="mb-6 text-gray-600">
            If you have questions regarding the dress code or specific situations, please contact the Student Advisory Center (SAC).
        </p>
        <div className="flex flex-col md:flex-row gap-6">
            <a href="mailto:sac@binus.edu" className="flex items-center p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                <Mail className="w-6 h-6 text-blue-500 mr-4" />
                <div>
                    <div className="font-bold">Email Support</div>
                    <div className="text-sm text-gray-500">sac@binus.edu</div>
                </div>
            </a>
            <a href="#" className="flex items-center p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                <Phone className="w-6 h-6 text-green-500 mr-4" />
                <div>
                    <div className="font-bold">Phone Contact</div>
                    <div className="text-sm text-gray-500">+62 21 534 5830</div>
                </div>
            </a>
            <a href="https://binus.edu" target="_blank" className="flex items-center p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                <ExternalLink className="w-6 h-6 text-orange-500 mr-4" />
                <div>
                    <div className="font-bold">Website</div>
                    <div className="text-sm text-gray-500">binus.edu</div>
                </div>
            </a>
        </div>
      </div>
    </div>
  );
}
