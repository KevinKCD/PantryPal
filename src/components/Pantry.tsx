'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Filter, MoreVertical, Scan, X, Minus, Plus, Trash2 } from 'lucide-react';
import { PantryItem, ScannedItem } from '@/types';
import BarcodeScanner from './BarcodeScanner';
import { db, auth, handleFirestoreError, OperationType } from '@/lib/firebase';
import { collection, query, where, onSnapshot, addDoc, deleteDoc, doc, serverTimestamp, orderBy } from 'firebase/firestore';
import { useAuth } from './FirebaseProvider';

const Pantry: React.FC = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<PantryItem[]>([]);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [scannedItem, setScannedItem] = useState<ScannedItem | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const pantryRef = collection(db, 'pantry');
    const q = query(
      pantryRef, 
      where('uid', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const pantryItems = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as PantryItem[];
      setItems(pantryItems);
      setIsDataLoading(false);
    }, (err) => {
      handleFirestoreError(err, OperationType.LIST, 'pantry');
    });

    return () => unsubscribe();
  }, [user]);

  const handleScanSuccess = async (decodedText: string) => {
    if (!decodedText || decodedText.trim() === '') return;
    
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${decodedText}.json`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();

      if (data.status === 1 && data.product) {
        const product = data.product;
        const item: ScannedItem = {
          barcode: decodedText,
          name: product.product_name || product.product_name_en || 'Unknown Product',
          category: product.categories?.split(',')[0] || 'Uncategorized',
          image: product.image_url || product.image_front_url || `https://picsum.photos/seed/${decodedText}/100/100`,
        };
        setScannedItem(item);
        setIsScannerOpen(false);
      } else {
        setError(`Product with barcode ${decodedText} not found in Open Food Facts database.`);
      }
    } catch (err) {
      console.error('Error fetching product:', err);
      setError('Could not connect to the product database. This might be due to a network issue or your browser blocking the request. Please try again or enter details manually.');
    } finally {
      setIsLoading(false);
    }
  };

  const addItemToPantry = async () => {
    if (scannedItem && user) {
      try {
        const newItem = {
          name: scannedItem.name,
          category: scannedItem.category,
          quantity: `${quantity} unit${quantity > 1 ? 's' : ''}`,
          status: 'Full',
          uid: user.uid,
          createdAt: serverTimestamp(),
          barcode: scannedItem.barcode,
          image: scannedItem.image
        };
        await addDoc(collection(db, 'pantry'), newItem);
        setScannedItem(null);
        setQuantity(1);
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, 'pantry');
      }
    }
  };

  const deleteItem = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'pantry', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `pantry/${id}`);
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
              <h3 className="text-xl font-bold text-gray-900 mb-4">Add by Barcode</h3>
              
              {/* Manual Input Section */}
              <div className="mb-6">
                <label htmlFor="manual-barcode" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Manual Entry
                </label>
                <div className="flex space-x-2">
                  <input
                    id="manual-barcode"
                    type="text"
                    placeholder="Enter barcode number..."
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleScanSuccess((e.target as HTMLInputElement).value);
                      }
                    }}
                  />
                  <button 
                    onClick={() => {
                      const input = document.getElementById('manual-barcode') as HTMLInputElement;
                      if (input.value) handleScanSuccess(input.value);
                    }}
                    className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
                  >
                    Lookup
                  </button>
                </div>
              </div>

              <div className="relative flex items-center my-6">
                <div className="flex-grow border-t border-gray-100"></div>
                <span className="flex-shrink mx-4 text-gray-400 text-xs font-medium uppercase tracking-widest">OR SCAN</span>
                <div className="flex-grow border-t border-gray-100"></div>
              </div>

              <div className="relative">
                <BarcodeScanner onScanSuccess={handleScanSuccess} />
                {isLoading && (
                  <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-10 rounded-xl">
                    <div className="w-12 h-12 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-orange-600 font-bold">Fetching product details...</p>
                  </div>
                )}
              </div>
              {error && (
                <p className="mt-4 text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>
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
                  <h3 className="text-xl font-bold text-gray-900">{scannedItem.name}</h3>
                  <p className="text-sm text-gray-500">{scannedItem.category}</p>
                  <p className="text-xs text-gray-400 mt-1">Barcode: {scannedItem.barcode}</p>
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
                    <span className="text-lg font-bold w-8 text-center">{quantity}</span>
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
        {isDataLoading ? (
          <div className="bg-white p-8 rounded-xl border border-gray-200 text-center text-gray-500">
            Loading pantry...
          </div>
        ) : items.length === 0 ? (
          <div className="bg-white p-8 rounded-xl border border-gray-200 text-center text-gray-500">
            Your pantry is empty. Scan something to start!
          </div>
        ) : items.map((item) => (
          <div key={item.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex justify-between items-center">
            <div>
              <h3 className="font-bold text-gray-900">{item.name}</h3>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-xs text-gray-500">{item.category}</span>
                <span className="text-xs text-gray-300">•</span>
                <span className="text-xs text-gray-500">{item.quantity}</span>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                item.status === 'Full' ? 'bg-green-100 text-green-700' :
                item.status === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              }`}>
                {item.status}
              </span>
              <button 
                onClick={() => deleteItem(item.id)}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <Trash2 size={16} />
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
              <th className="px-6 py-4 text-sm font-semibold text-gray-900">Item Name</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-900">Category</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-900">Quantity</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-900">Status</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-900"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isDataLoading ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                  Loading pantry...
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                  Your pantry is empty. Scan something to start!
                </td>
              </tr>
            ) : items.map((item) => (
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
                  <button 
                    onClick={() => deleteItem(item.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={16} />
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
