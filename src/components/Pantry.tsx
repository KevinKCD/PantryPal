'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Filter, MoreVertical } from 'lucide-react';
import { PantryItem } from '@/types';

const Pantry: React.FC = () => {
  const items: PantryItem[] = [
    { id: 1, name: 'All-Purpose Flour', category: 'Baking', quantity: '2.5 kg', status: 'Full' },
    { id: 2, name: 'Olive Oil', category: 'Oils', quantity: '500 ml', status: 'Low' },
    { id: 3, name: 'Basmati Rice', category: 'Grains', quantity: '1 kg', status: 'Medium' },
    { id: 4, name: 'Tomato Paste', category: 'Canned', quantity: '3 cans', status: 'Full' },
    { id: 5, name: 'Sea Salt', category: 'Spices', quantity: '200g', status: 'Full' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-900">Pantry</h2>
        <div className="flex space-x-2">
          <button className="p-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">
            <Filter size={20} />
          </button>
          <button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors">
            Add Item
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-6 py-4 text-sm font-semibold text-gray-900">Item Name</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-900">Category</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-900">Quantity</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-900">Status</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-900"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.name}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{item.category}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{item.quantity}</td>
                <td className="px-6 py-4 text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    item.status === 'Full' ? 'bg-green-100 text-green-700' :
                    item.status === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {item.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-gray-400 hover:text-gray-600">
                    <MoreVertical size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default Pantry;
