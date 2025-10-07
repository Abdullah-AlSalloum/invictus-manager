import React, { useState } from 'react';
import { Customer } from '../types';
import { PlusIcon, TrashIcon, LinkIcon } from './icons';

const CustomerSection: React.FC<{
  customers: Customer[];
  onAddCustomer: (customer: Omit<Customer, 'id' | 'createdAt'>) => void;
  onRemoveCustomer: (customerId: string) => void;
}> = ({ customers, onAddCustomer, onRemoveCustomer }) => {
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [googleMapsLink, setGoogleMapsLink] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onAddCustomer({ name, phoneNumber, googleMapsLink });
      setName('');
      setPhoneNumber('');
      setGoogleMapsLink('');
    }
  };

  const handleRemoveClick = (customer: Customer) => {
    if (window.confirm(`Are you sure you want to remove customer "${customer.name}"? This action cannot be undone.`)) {
      onRemoveCustomer(customer.id);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Customer Information</h2>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Add New Customer</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="customer-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Customer Name</label>
            <input type="text" id="customer-name" value={name} onChange={e => setName(e.target.value)} required className="mt-1 block w-full bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm" />
          </div>
          <div>
            <label htmlFor="customer-phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone Number</label>
            <input type="tel" id="customer-phone" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} className="mt-1 block w-full bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm" />
          </div>
          <div>
            <label htmlFor="customer-maps" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Google Maps Link</label>
            <input type="url" id="customer-maps" value={googleMapsLink} onChange={e => setGoogleMapsLink(e.target.value)} placeholder="https://maps.app.goo.gl/..." className="mt-1 block w-full bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm" />
          </div>
          <div className="flex justify-end">
            <button type="submit" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
              <PlusIcon className="w-5 h-5 mr-2" /> Add Customer
            </button>
          </div>
        </form>
      </div>

      {customers.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">No customers added yet.</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Use the form above to add a new customer.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-700">
            {customers.map(customer => (
              <li key={customer.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-lg font-medium text-gray-900 dark:text-white truncate">{customer.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{customer.phoneNumber || 'No phone number'}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {customer.googleMapsLink && (
                      <a href={customer.googleMapsLink} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full text-gray-400 hover:text-purple-600 hover:bg-purple-100 dark:hover:bg-purple-900/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500" aria-label={`View map for ${customer.name}`}>
                         <LinkIcon className="h-5 w-5" />
                      </a>
                    )}
                    <button onClick={() => handleRemoveClick(customer)} className="p-2 rounded-full text-gray-400 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500" aria-label={`Remove ${customer.name}`}>
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

export default CustomerSection;
