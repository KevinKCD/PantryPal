"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Filter, MoreVertical, Scan, X, Minus, Plus } from "lucide-react";
import { PantryItem, ScannedItem } from "@/types";
import BarcodeScanner from "./BarcodeScanner";

const Pantry: React.FC = () => {
  const [items, setItems] = useState<PantryItem[]>([
    {
      id: 1,
      name: "All-Purpose Flour",
      category: "Baking",
      quantity: "2.5 kg",
      status: "Full",
    },
    {
      id: 2,
      name: "Olive Oil",
      category: "Oils",
      quantity: "500 ml",
      status: "Low",
    },
    {
      id: 3,
      name: "Basmati Rice",
      category: "Grains",
      quantity: "1 kg",
      status: "Medium",
    },
    {
      id: 4,
      name: "Tomato Paste",
      category: "Canned",
      quantity: "3 cans",
      status: "Full",
    },
    {
      id: 5,
      name: "Sea Salt",
      category: "Spices",
      quantity: "200g",
      status: "Full",
    },
  ]);

  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [scannedItem, setScannedItem] = useState<ScannedItem | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleScanSuccess = async (decodedText: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://world.openfoodfacts.org/api/v0/product/${decodedText}.json`,
      );
      const data = await response.json();

      if (data.status === 1 && data.product) {
        const product = data.product;
        const item: ScannedItem = {
          barcode: decodedText,
          name:
            product.product_name ||
            product.product_name_en ||
            "Unknown Product",
          category: product.categories?.split(",")[0] || "Uncategorized",
          image:
            product.image_url ||
            product.image_front_url ||
            `https://picsum.photos/seed/${decodedText}/100/100`,
        };
        setScannedItem(item);
        setIsScannerOpen(false);
      } else {
        setError(
          `Product with barcode ${decodedText} not found in Open Food Facts database.`,
        );
      }
    } catch (err) {
      console.error("Error fetching product:", err);
      setError(
        "Failed to connect to Open Food Facts database. Please check your connection.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const addItemToPantry = () => {
    if (scannedItem) {
      const newItem: PantryItem = {
        id: Date.now(),
        name: scannedItem.name,
        category: scannedItem.category,
        quantity: `${quantity} unit${quantity > 1 ? "s" : ""}`,
        status: "Full",
      };
      setItems([newItem, ...items]);
      setScannedItem(null);
      setQuantity(1);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Pantry</h2>
        <div className="flex w-full sm:w-auto space-x-2">
          <button
            onClick={() => setIsScannerOpen(true)}
            className="flex-1 sm:flex-none flex items-center justify-center space-x-2 px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <Scan size={20} />
            <span className="hidden sm:inline">Scan Barcode</span>
            <span className="sm:hidden text-sm">Scan</span>
          </button>
          <button className="p-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">
            <Filter size={20} />
          </button>
          <button className="flex-1 sm:flex-none bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors text-sm sm:text-base">
            Add Item
          </button>
        </div>
      </div>

      {/* Barcode Scanner Modal */}
      <AnimatePresence>
        {isScannerOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl relative"
            >
              <button
                onClick={() => setIsScannerOpen(false)}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Scan Barcode
              </h3>
              <div className="relative">
                <BarcodeScanner onScanSuccess={handleScanSuccess} />
                {isLoading && (
                  <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-10 rounded-xl">
                    <div className="w-12 h-12 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-orange-600 font-bold">
                      Fetching product details...
                    </p>
                  </div>
                )}
              </div>
              {error && (
                <p className="mt-4 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                  {error}
                </p>
              )}
              <p className="mt-4 text-sm text-gray-500 text-center italic">
                Tip: Point your camera at a product barcode.
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Scanned Item Details Modal */}
      <AnimatePresence>
        {scannedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl"
            >
              <div className="flex items-start space-x-4 mb-6">
                <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                  <img
                    src={scannedItem.image}
                    alt={scannedItem.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {scannedItem.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {scannedItem.category}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Barcode: {scannedItem.barcode}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-700">Quantity</span>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 rounded-full border border-gray-200 hover:bg-gray-50 text-gray-600"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="text-lg font-bold w-8 text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-2 rounded-full border border-gray-200 hover:bg-gray-50 text-gray-600"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={() => setScannedItem(null)}
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={addItemToPantry}
                    className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium"
                  >
                    Add to Pantry
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Mobile Card View */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex justify-between items-center"
          >
            <div>
              <h3 className="font-bold text-gray-900">{item.name}</h3>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-xs text-gray-500">{item.category}</span>
                <span className="text-xs text-gray-300">•</span>
                <span className="text-xs text-gray-500">{item.quantity}</span>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span
                className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  item.status === "Full"
                    ? "bg-green-100 text-green-700"
                    : item.status === "Medium"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                }`}
              >
                {item.status}
              </span>
              <button className="text-gray-400">
                <MoreVertical size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-6 py-4 text-sm font-semibold text-gray-900">
                Item Name
              </th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-900">
                Category
              </th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-900">
                Quantity
              </th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-900">
                Status
              </th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-900"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {item.name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {item.category}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {item.quantity}
                </td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.status === "Full"
                        ? "bg-green-100 text-green-700"
                        : item.status === "Medium"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                    }`}
                  >
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
