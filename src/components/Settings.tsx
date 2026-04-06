'use client';

import React from 'react';
import { motion } from 'motion/react';
import { User, Bell, Shield, Globe, CreditCard } from 'lucide-react';

const Settings: React.FC = () => {
  const sections = [
    { id: 'profile', label: 'Profile Settings', icon: User, desc: 'Manage your personal information and public profile.' },
    { id: 'notifications', label: 'Notifications', icon: Bell, desc: 'Control how and when you receive alerts.' },
    { id: 'security', label: 'Security', icon: Shield, desc: 'Update your password and secure your account.' },
    { id: 'language', label: 'Language & Region', icon: Globe, desc: 'Set your preferred language and time zone.' },
    { id: 'billing', label: 'Billing', icon: CreditCard, desc: 'Manage your subscription and payment methods.' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6 max-w-4xl"
    >
      <h2 className="text-3xl font-bold text-gray-900">Settings</h2>

      <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100 shadow-sm">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <button key={section.id} className="w-full flex items-center p-6 hover:bg-gray-50 transition-colors text-left group">
              <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-orange-50 group-hover:text-orange-500 transition-colors">
                <Icon size={24} />
              </div>
              <div className="ml-4 flex-1">
                <h3 className="text-lg font-bold text-gray-900">{section.label}</h3>
                <p className="text-sm text-gray-500">{section.desc}</p>
              </div>
              <ChevronRight className="text-gray-300 group-hover:text-gray-500" size={20} />
            </button>
          );
        })}
      </div>

      <div className="pt-6">
        <button className="text-red-600 font-medium hover:text-red-700 transition-colors">
          Sign out of all devices
        </button>
      </div>
    </motion.div>
  );
};

const ChevronRight = ({ size, className }: { size: number, className: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="m9 18 6-6-6-6" />
  </svg>
);

export default Settings;
