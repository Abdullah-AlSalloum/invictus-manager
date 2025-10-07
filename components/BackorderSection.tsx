import React, { useState } from 'react';
import { Backorder, User } from '../types';
import { PlusIcon, TrashIcon } from './icons';
import Avatar from './Avatar';

interface BackorderSectionProps {
  backorders: Backorder[];
  users: User[];
  onAddBackorder: (order: Omit<Backorder, 'id' | 'userId' | 'createdAt'>) => void;
  onRemoveBackorder: (orderId: string) => void;
}

const BackorderSection: React.FC<BackorderSectionProps> = ({ backorders, users, onAddBackorder, onRemoveBackorder }) => {
  const [orderDetails, setOrderDetails] = useState('');
  const [customerName, setCustomerName] = useState('');

  const getUser = (userId: string) => users.find(u => u.id === userId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderDetails && customerName) {
      onAddBackorder({ orderDetails, customerName });
      setOrderDetails('');
      setCustomerName('');
    }
  };

  const handleRemoveClick = (order: Backorder) => {
    if (window.confirm(`Are you sure you want to remove the backorder for "${order.customerName}"? This action cannot be undone.`)) {
        onRemoveBackorder(order.id);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Backorders</h2>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Create a New Backorder</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <div className="md:col-span-3">
            <label htmlFor="order-details" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Order Details</label>
            <textarea id="order-details" value={orderDetails} onChange={e => setOrderDetails(e.target.value)} required rows={2} className="mt-1 block w-full bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm" />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="order-customer" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Customer Name</label>
            <input type="text" id="order-customer" value={customerName} onChange={e => setCustomerName(e.target.value)} required className="mt-1 block w-full bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm" />
          </div>
          <div className="md:col-span-1 flex items-end">
            <button type="submit" className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500">
              <PlusIcon className="w-5 h-5 mr-2" /> Create
            </button>
          </div>
        </form>
      </div>
      
      {backorders.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">No backorders found.</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Use the form above to create a backorder for a customer.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-700">
            {backorders.map(order => {
              const user = getUser(order.userId);
              return (
              <li key={order.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200">
                <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-yellow-600 dark:text-yellow-400">
                            {new Date(order.createdAt).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                        <p className="text-base text-gray-800 dark:text-gray-200 mt-1 whitespace-pre-wrap">{order.orderDetails}</p>
                        <div className="flex items-center flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-gray-500 dark:text-gray-400">
                            <p>For: <span className="font-medium text-gray-700 dark:text-gray-300">{order.customerName}</span></p>
                            {user && (
                                <div className="flex items-center" title={`Created by ${user.name}`}>
                                    <span>By:</span>
                                    <div className="ml-1.5 flex items-center">
                                      <Avatar name={user.name} size="small"/>
                                      <span className="ml-1.5 font-medium text-gray-700 dark:text-gray-300">{user.name}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex-shrink-0 ml-4">
                        <button onClick={() => handleRemoveClick(order)} className="p-2 rounded-full text-gray-400 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500" aria-label={`Remove order for ${order.customerName}`}>
                            <TrashIcon className="h-5 w-5" />
                        </button>
                    </div>
                </div>
              </li>
            )})}
          </ul>
        </div>
      )}
    </div>
  );
};

export default BackorderSection;