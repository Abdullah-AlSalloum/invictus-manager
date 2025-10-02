import React, { useState } from 'react';
import { OrderRequest } from '../types';
import { PlusIcon, TrashIcon, ArrowUpTrayIcon } from './icons';

interface OrderRequestSectionProps {
  items: OrderRequest[];
  onAddItem: (item: Omit<OrderRequest, 'id' | 'createdAt'>) => void;
  onRemoveItem: (itemId: string) => void;
}

const OrderRequestSection: React.FC<OrderRequestSectionProps> = ({ items, onAddItem, onRemoveItem }) => {
  const [itemName, setItemName] = useState('');
  const [notes, setNotes] = useState('');
  const [requestedBy, setRequestedBy] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (itemName) {
      onAddItem({ itemName, notes, requestedBy });
      setItemName('');
      setNotes('');
      setRequestedBy('');
    }
  };
  
  const handleExport = () => {
    const headers = ["Item Name", "Requested By", "Notes"];
    const escapeCsvCell = (cell: any) => {
        let strCell = String(cell);
        if (strCell.includes(',') || strCell.includes('"') || strCell.includes('\n')) {
            return `"${strCell.replace(/"/g, '""')}"`;
        }
        return strCell;
    };
    const rows = items.map(item => 
        [item.itemName, item.requestedBy, item.notes].map(escapeCsvCell).join(',')
    );
    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `order-requests-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleRemoveClick = (item: OrderRequest) => {
    if (window.confirm(`Are you sure you want to remove the request for "${item.itemName}"? This action cannot be undone.`)) {
        onRemoveItem(item.id);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Pending Order Requests</h2>
        <button onClick={handleExport} className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md shadow-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <ArrowUpTrayIcon className="w-5 h-5 mr-2" />
            Export
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Log a New Request</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label htmlFor="itemName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Item Name</label>
            <input type="text" id="itemName" value={itemName} onChange={e => setItemName(e.target.value)} required className="mt-1 block w-full bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          </div>
          <div className="">
            <label htmlFor="requestedBy" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Requested By (e.g., Customer Name)</label>
            <input type="text" id="requestedBy" value={requestedBy} onChange={e => setRequestedBy(e.target.value)} className="mt-1 block w-full bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          </div>
          <div className="">
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Notes</label>
            <input type="text" id="notes" value={notes} onChange={e => setNotes(e.target.value)} className="mt-1 block w-full bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          </div>
          <div className="md:col-span-2 flex justify-end">
            <button type="submit" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500">
              <PlusIcon className="w-5 h-5 mr-2" />
              Add Request
            </button>
          </div>
        </form>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">No pending requests.</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Log uncompleted orders or customer requests here.</p>
        </div>
      ) : (
         <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-700">
            {items.map(item => (
              <li key={item.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-lg font-medium text-gray-900 dark:text-white truncate">{item.itemName}</p>
                    <div className="flex flex-col sm:flex-row sm:items-center mt-1 text-sm text-gray-500 dark:text-gray-400">
                      <p className="truncate">{item.notes}</p>
                      {item.requestedBy && <p className="mt-1 sm:mt-0 sm:ml-2 sm:pl-2 sm:border-l sm:border-gray-200 sm:dark:border-gray-600">Requested by: {item.requestedBy}</p>}
                    </div>
                  </div>
                  <div className="ml-2 flex-shrink-0">
                    <button onClick={() => handleRemoveClick(item)} className="p-2 rounded-full text-gray-400 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500" aria-label={`Remove ${item.itemName}`}>
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default OrderRequestSection;