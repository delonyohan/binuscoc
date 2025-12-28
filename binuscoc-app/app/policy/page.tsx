"use client";

import { Mail, Phone, ExternalLink, Shirt, UserCheck, AlertOctagon, Footprints, GraduationCap } from "lucide-react";

export default function PolicyPage() {
  return (
    <div className="space-y-10 px-4 pb-12 max-w-5xl mx-auto">
      
      {/* Header Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          Campus Dress Code & Regulations
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          To maintain a professional academic environment, all students are expected to adhere to the following standards while on Bina Nusantara University grounds.
        </p>
      </div>

      {/* Main Policy Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Do's and Don'ts Cards */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-800 transition-transform hover:scale-[1.01]">
          <div className="bg-red-50 dark:bg-red-900/20 p-6 flex items-center border-b border-red-100 dark:border-red-800/30">
            <div className="p-3 bg-red-100 dark:bg-red-800 rounded-full mr-4 text-red-600 dark:text-red-200">
                <AlertOctagon className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Strictly Prohibited</h2>
          </div>
          <div className="p-6 space-y-4 text-gray-600 dark:text-gray-300">
            <div className="flex items-start">
                <Shirt className="w-5 h-5 mr-3 mt-1 text-red-500 shrink-0" />
                <p><strong>Tops:</strong> Crop tops, sleeveless shirts, tank tops, and transparent cardigans/outerwear are not allowed. Shoulders and midriff must be covered.</p>
            </div>
            <div className="flex items-start">
                <UserCheck className="w-5 h-5 mr-3 mt-1 text-red-500 shrink-0" />
                <p><strong>Bottoms:</strong> Ripped jeans (any size tear), shorts, and skirts above the knee (mini-skirts) are strictly forbidden.</p>
            </div>
            <div className="flex items-start">
                <Footprints className="w-5 h-5 mr-3 mt-1 text-red-500 shrink-0" />
                <p><strong>Footwear:</strong> Sandals, slippers, open-toe shoes, and bare feet are prohibited inside campus buildings.</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-800 transition-transform hover:scale-[1.01]">
          <div className="bg-green-50 dark:bg-green-900/20 p-6 flex items-center border-b border-green-100 dark:border-green-800/30">
            <div className="p-3 bg-green-100 dark:bg-green-800 rounded-full mr-4 text-green-600 dark:text-green-200">
                <GraduationCap className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Standard Attire</h2>
          </div>
          <div className="p-6 space-y-4 text-gray-600 dark:text-gray-300">
            <ul className="space-y-3 list-disc pl-5 marker:text-green-500">
                <li><span className="font-medium text-gray-900 dark:text-white">Shirts/Blouses:</span> Must have sleeves and cover the torso completely. Collared shirts are recommended.</li>
                <li><span className="font-medium text-gray-900 dark:text-white">Trousers/Skirts:</span> Long trousers (jeans/chinos) or skirts that fall below the knee length. Must be neat and free of holes.</li>
                <li><span className="font-medium text-gray-900 dark:text-white">Shoes:</span> Closed shoes (sneakers, boots, formal shoes) must be worn at all times.</li>
                <li><span className="font-medium text-gray-900 dark:text-white">ID Card:</span> Binusian Flazz Card must be worn and visible while entering the campus area.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* General Regulations Note */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-6 rounded-r-lg">
        <h3 className="text-lg font-bold text-blue-800 dark:text-blue-300 mb-2">Important Notice</h3>
        <p className="text-blue-700 dark:text-blue-200">
          Security personnel and lecturers have the authority to deny entry or request students to leave the premises if their attire is deemed inappropriate or distracting to the learning environment. Repeated violations may result in disciplinary points (SAT) deduction.
        </p>
      </div>

      {/* Contact Section */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Need Clarification?</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-lg mx-auto">
            If you are unsure about specific attire for an event or have questions regarding the policy, please reach out to the Student Advisory Center (SAC).
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href="mailto:sac@binus.edu" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition shadow-sm">
                <Mail className="w-5 h-5 mr-2" />
                Email Support
            </a>
            <a href="tel:+62215345830" className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-700 text-base font-medium rounded-md text-gray-700 dark:text-white bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition shadow-sm">
                <Phone className="w-5 h-5 mr-2 text-gray-500" />
                +62 21 534 5830
            </a>
            <a href="https://binus.edu" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-700 text-base font-medium rounded-md text-gray-700 dark:text-white bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition shadow-sm">
                <ExternalLink className="w-5 h-5 mr-2 text-gray-500" />
                Official Website
            </a>
        </div>
      </div>

    </div>
  );
}