import React, { useState, useMemo, useEffect } from 'react';
import { InventoryItem, User, OrderRequest, Tab, Task, DailyOrder, TaskStatus } from './types';
import Header from './components/Header';
import DashboardSection from './components/DashboardSection';
import InventorySection from './components/InventorySection';
import ReorderSection from './components/ReorderSection';
import OrderRequestSection from './components/WishlistSection';
import TaskSection from './components/TaskSection';
import DailyOrdersSection from './components/DailyOrdersSection';
import Avatar from './components/Avatar';
import { PlusIcon, ArchiveBoxIcon, ListBulletIcon, InformationCircleIcon, XMarkIcon, ClipboardDocumentCheckIcon, TruckIcon, BellIcon, HomeIcon, LockClosedIcon, EyeIcon, EyeSlashIcon, ArrowLeftIcon } from './components/icons';

const initialUsers: User[] = [
  { id: 1, name: 'Mohammad', description: 'Owner', password: 'password123', hasSetPassword: false },
  { id: 2, name: 'Osama', description: ' Manager', password: 'password123', hasSetPassword: false },
  { id: 3, name: 'Shadi', description: 'Sales Manager', password: 'password123', hasSetPassword: false },
  { id: 4, name: 'Anas', description: 'Tecnical Servis', password: 'password123', hasSetPassword: false },
  { id: 5, name: 'Abdulselam', description: 'Accountent', password: 'password123', hasSetPassword: false },
  { id: 6, name: 'Abdulkarim', description: 'Sales Lead', password: 'password123', hasSetPassword: false },
  { id: 7, name: 'King Abdullah', description: 'Computer Enginner', password: 'password123', hasSetPassword: false },
];

const initialInventory: InventoryItem[] = [
  { id: 'item-1', name: 'Wireless Mouse', type: 'Electronics', quantity: 15, managedBy: 1, createdAt: new Date('2023-10-26T10:00:00Z').toISOString() },
  { id: 'item-2', name: 'Ergonomic Keyboard', type: 'Electronics', quantity: 2, managedBy: 2, createdAt: new Date('2023-10-26T10:05:00Z').toISOString() },
  { id: 'item-3', name: 'USB-C Hub', type: 'Accessories', quantity: 8, managedBy: 1, createdAt: new Date('2023-10-26T10:10:00Z').toISOString() },
  { id: 'item-4', name: 'Monitor Stand', type: 'Furniture', quantity: 1, managedBy: 3, createdAt: new Date('2023-10-26T10:15:00Z').toISOString() },
  { id: 'item-5', name: 'Laptop Sleeve', type: 'Accessories', quantity: 25, managedBy: 4, createdAt: new Date('2023-10-26T10:20:00Z').toISOString() },
  { id: 'item-6', name: 'Webcam 1080p', type: 'Electronics', quantity: 0, managedBy: 5, createdAt: new Date('2023-10-26T10:25:00Z').toISOString() },
];

const initialOrderRequests: OrderRequest[] = [
    { id: 'wish-1', itemName: 'Mechanical Keyboard (Blue Switch)', notes: 'Customer wants a clicky one.', requestedBy: 'Customer Inquiry', createdAt: new Date('2023-10-27T11:00:00Z').toISOString() },
];

const initialTasks: Task[] = [];
const initialDailyOrders: DailyOrder[] = [];

// Generic migration function to add a timestamp to any object that lacks one.
const runMigration = <T extends { createdAt?: string }>(items: T[], defaultCreatorId: number): T[] => {
    const now = new Date();
    return items.map((item, index) => {
        const newItem = { ...item };
        if (!newItem.createdAt) {
            newItem.createdAt = new Date(now.getTime() - (items.length - index) * 60000).toISOString();
        }
        if ('assignedTo' in newItem && !(newItem as any).createdBy) {
            (newItem as any).createdBy = defaultCreatorId;
        }
        return newItem as T;
    });
};


const UserSelectionPage: React.FC<{ users: User[]; onSelectUser: (user: User) => void; }> = ({ users, onSelectUser }) => (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col justify-center items-center p-4 transition-colors duration-300">
      <div className="w-full max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-2">
              <svg className="h-10 w-10 text-indigo-600 dark:text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4M4 7l8 5 8-5" />
              </svg>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Invictus Manager</h1>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 sm:p-8">
            <h2 className="text-center text-xl font-semibold text-gray-800 dark:text-gray-200">Welcome!</h2>
            <p className="text-center text-gray-500 dark:text-gray-400 mt-1 mb-6">Please select your profile to continue.</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {users.map(user => (
                <button key={user.id} onClick={() => onSelectUser(user)} className="flex flex-col items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg shadow-sm hover:shadow-lg hover:-translate-y-1 transform transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:ring-offset-gray-800 focus:ring-indigo-500">
                <Avatar name={user.name} size="large" />
                <span className="mt-2 font-medium text-sm text-gray-800 dark:text-gray-200 text-center">{user.name}</span>
                <span className="mt-1 text-xs text-gray-500 dark:text-gray-400 text-center">{user.description}</span>
                </button>
            ))}
            </div>
        </div>
      </div>
    </div>
);

const AuthPage: React.FC<{
    selectedUser: User;
    onLogin: (password: string) => void;
    onBack: () => void;
}> = ({ selectedUser, onLogin, onBack }) => {
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        // Simple validation, can be enhanced
        if (!password) {
            setError('Password cannot be empty.');
            return;
        }
        onLogin(password);
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col justify-center items-center p-4">
            <div className="w-full max-w-sm mx-auto">
                <button onClick={onBack} className="flex items-center text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4">
                    <ArrowLeftIcon className="h-4 w-4 mr-1" />
                    Back to user selection
                </button>
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8">
                    <div className="flex flex-col items-center mb-6">
                        <Avatar name={selectedUser.name} size="large" />
                        <h2 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">{selectedUser.name}</h2>
                        <p className="text-gray-500 dark:text-gray-400">{selectedUser.description}</p>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="password" className="sr-only">Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <LockClosedIcon className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    autoComplete="current-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                    placeholder="Password"
                                />
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-gray-400 hover:text-gray-500">
                                        {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                                    </button>
                                </div>
                            </div>
                        </div>
                        {error && <p className="text-sm text-red-500">{error}</p>}
                        <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            Sign In
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

const PasswordModal: React.FC<{
    title: string;
    onSave: (passwords: Record<string, string>) => void;
    onClose: () => void;
    isFirstTimeSetup?: boolean;
}> = ({ title, onSave, onClose, isFirstTimeSetup = false }) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (newPassword.length < 6) {
            setError('New password must be at least 6 characters long.');
            return;
        }
        if (newPassword !== confirmPassword) {
            setError('New passwords do not match.');
            return;
        }
        onSave({ currentPassword, newPassword });
    };

    return (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
                <form onSubmit={handleSubmit}>
                    <div className="p-6">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h2>
                        {isFirstTimeSetup && <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">For security, please set your own password.</p>}
                        <div className="space-y-4 mt-4">
                            {!isFirstTimeSetup && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Current Password</label>
                                    <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} required className="mt-1 block w-full bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                                </div>
                            )}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">New Password</label>
                                <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required className="mt-1 block w-full bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Confirm New Password</label>
                                <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required className="mt-1 block w-full bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                            </div>
                            {error && <p className="text-sm text-red-500">{error}</p>}
                        </div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700/50 px-6 py-3 flex justify-end space-x-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white dark:bg-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600">Cancel</button>
                        <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700">Save Password</button>
                    </div>
                </form>
            </div>
        </div>
    );
};


const playSound = (type: 'confirmation' | 'notification') => {
  const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioContext) return;
  const audioContext = new AudioContext();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  if (type === 'confirmation') {
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.2);
  } else {
    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(660, audioContext.currentTime);
    gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.4);
  }
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.4);
};


const App: React.FC = () => {
  const [users, setUsers] = useState<User[]>(() => {
    try {
        const saved = localStorage.getItem('users');
        // If users exist, use them. Otherwise, initialize from our default list.
        return saved ? JSON.parse(saved) : initialUsers;
    } catch {
        return initialUsers;
    }
  });
  const [selectedUserForLogin, setSelectedUserForLogin] = useState<User | null>(null);
  const [authenticatedUser, setAuthenticatedUser] = useState<User | null>(() => {
    try {
        const savedUser = localStorage.getItem('authenticatedUser');
        return savedUser ? JSON.parse(savedUser) : null;
    } catch { return null; }
  });
  const [showReminder, setShowReminder] = useState(false);
  const [isSettingFirstPassword, setIsSettingFirstPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  
  const [inventory, setInventory] = useState<InventoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('inventory');
      return runMigration(saved ? JSON.parse(saved) : initialInventory, 1);
    } catch { return initialInventory; }
  });
  const [orderRequests, setOrderRequests] = useState<OrderRequest[]>(() => {
    try {
      const saved = localStorage.getItem('orderRequests');
      return runMigration(saved ? JSON.parse(saved) : initialOrderRequests, 1);
    } catch { return initialOrderRequests; }
  });
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const saved = localStorage.getItem('tasks');
      return runMigration(saved ? JSON.parse(saved) : initialTasks, 1);
    } catch { return initialTasks; }
  });
  const [dailyOrders, setDailyOrders] = useState<DailyOrder[]>(() => {
    try {
      const saved = localStorage.getItem('dailyOrders');
      return runMigration(saved ? JSON.parse(saved) : initialDailyOrders, 1);
    } catch { return initialDailyOrders; }
  });
  
  const [activeTab, setActiveTab] = useState<Tab>(Tab.Dashboard);
  const [notifications, setNotifications] = useState<Record<string, string[]>>(() => {
    try {
      const savedNotifications = localStorage.getItem('notifications');
      return savedNotifications ? JSON.parse(savedNotifications) : {};
    } catch { return {}; }
  });
  const [activeNotifications, setActiveNotifications] = useState<string[]>([]);

  useEffect(() => {
    if (authenticatedUser) {
        const userNotifications = notifications[authenticatedUser.id];
        if (userNotifications && userNotifications.length > 0) {
            playSound('notification');
            setActiveNotifications(userNotifications);
            const newNotifications = {...notifications};
            delete newNotifications[authenticatedUser.id];
            setNotifications(newNotifications);
        }
    }
  }, [authenticatedUser]);

  useEffect(() => { localStorage.setItem('users', JSON.stringify(users)); }, [users]);
  useEffect(() => { localStorage.setItem('notifications', JSON.stringify(notifications)); }, [notifications]);
  useEffect(() => { 
      if (authenticatedUser) localStorage.setItem('authenticatedUser', JSON.stringify(authenticatedUser));
      else localStorage.removeItem('authenticatedUser');
  }, [authenticatedUser]);
  useEffect(() => { localStorage.setItem('inventory', JSON.stringify(inventory)); }, [inventory]);
  useEffect(() => { localStorage.setItem('orderRequests', JSON.stringify(orderRequests)); }, [orderRequests]);
  useEffect(() => { localStorage.setItem('tasks', JSON.stringify(tasks)); }, [tasks]);
  useEffect(() => { localStorage.setItem('dailyOrders', JSON.stringify(dailyOrders)); }, [dailyOrders]);
  
  useEffect(() => {
    const lastReminderDate = localStorage.getItem('lastReminderDate');
    const today = new Date().toISOString().split('T')[0];
    if (lastReminderDate !== today) setShowReminder(true);
  }, []);

  const dismissNotification = (index: number) => {
    setActiveNotifications(prev => prev.filter((_, i) => i !== index));
  };
  
  const handleDismissReminder = () => {
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem('lastReminderDate', today);
    setShowReminder(false);
  };
  
  const handleLogin = (password: string) => {
    if (!selectedUserForLogin) return;
    const userInDb = users.find(u => u.id === selectedUserForLogin.id);
    if (userInDb && userInDb.password === password) {
        if (!userInDb.hasSetPassword) {
            setIsSettingFirstPassword(true);
        } else {
            setAuthenticatedUser(userInDb);
            setSelectedUserForLogin(null);
            setActiveTab(Tab.Dashboard);
        }
    } else {
        alert('Incorrect password. Please try again.');
    }
  };
  
  const handleSetFirstPassword = ({ newPassword }: Record<string, string>) => {
    if (!selectedUserForLogin) return;
    const updatedUsers = users.map(u => u.id === selectedUserForLogin.id ? { ...u, password: newPassword, hasSetPassword: true } : u);
    setUsers(updatedUsers);
    const updatedUser = updatedUsers.find(u => u.id === selectedUserForLogin.id)!;
    setAuthenticatedUser(updatedUser);
    setIsSettingFirstPassword(false);
    setSelectedUserForLogin(null);
  };

  const handleChangePassword = ({ currentPassword, newPassword }: Record<string, string>) => {
    if (!authenticatedUser) return;
    const userInDb = users.find(u => u.id === authenticatedUser.id);
    if (userInDb && userInDb.password === currentPassword) {
        const updatedUsers = users.map(u => u.id === authenticatedUser.id ? { ...u, password: newPassword } : u);
        setUsers(updatedUsers);
        alert('Password changed successfully!');
        setIsChangingPassword(false);
    } else {
        alert('Incorrect current password.');
    }
  };

  const reorderItems = useMemo(() => inventory.filter(item => item.quantity < 3), [inventory]);
  const stockItems = useMemo(() => inventory.filter(item => item.quantity >= 3), [inventory]);
  
  const handleLogout = () => { 
    setAuthenticatedUser(null);
    setSelectedUserForLogin(null);
  };
  
  const handleUpdateQuantity = (itemId: string, newQuantity: number) => setInventory(p => p.map(i => i.id === itemId ? { ...i, quantity: Math.max(0, newQuantity) } : i));
  const handleAddItem = (newItem: Omit<InventoryItem, 'id' | 'managedBy' | 'createdAt'>) => {
    if (!authenticatedUser) return;
    const item: InventoryItem = { ...newItem, id: `item-${Date.now()}`, managedBy: authenticatedUser.id, createdAt: new Date().toISOString() };
    setInventory(p => [...p, item]);
  };
  const handleUpdateItem = (itemId: string, updates: Partial<Omit<InventoryItem, 'id'>>) => setInventory(p => p.map(i => i.id === itemId ? { ...i, ...updates } : i));
  const handleRemoveItem = (itemId: string) => setInventory(p => p.filter(i => i.id !== itemId));
  const handleImportItems = (importedItems: Omit<InventoryItem, 'id' | 'managedBy' | 'createdAt'>[]) => {
    if (!authenticatedUser) return;
    setInventory(currentInventory => {
      const inventoryMap = new Map(currentInventory.map(item => [`${item.name.toLowerCase()}|${item.type.toLowerCase()}`, item]));
      importedItems.forEach(importedItem => {
        const key = `${importedItem.name.toLowerCase()}|${importedItem.type.toLowerCase()}`;
        const existingItem = inventoryMap.get(key);
        if (existingItem) existingItem.quantity += importedItem.quantity;
        else {
          const newItem: InventoryItem = { ...importedItem, id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, managedBy: authenticatedUser.id, createdAt: new Date().toISOString() };
          inventoryMap.set(key, newItem);
        }
      });
      return Array.from(inventoryMap.values());
    });
  };
  const handleAddOrderRequest = (item: Omit<OrderRequest, 'id' | 'createdAt'>) => {
    const orderRequestItem: OrderRequest = { ...item, id: `order-${Date.now()}`, createdAt: new Date().toISOString() };
    setOrderRequests(p => [...p, orderRequestItem]);
  };
  const handleRemoveOrderRequest = (itemId: string) => setOrderRequests(p => p.filter(i => i.id !== itemId));
  const handleRestock = (itemId: string, restockQuantity: number) => setInventory(p => p.map(i => i.id === itemId ? { ...i, quantity: i.quantity + restockQuantity } : i));
  const handleAddTask = (task: Omit<Task, 'id' | 'createdBy' | 'createdAt'>) => {
    if (!authenticatedUser) return;
    const newTask: Task = { ...task, id: `task-${Date.now()}`, createdBy: authenticatedUser.id, createdAt: new Date().toISOString() };
    setTasks(p => [...p, newTask]);
    if (newTask.assignedTo !== authenticatedUser.id) {
        playSound('confirmation');
        const message = `${authenticatedUser.name} assigned you a new task: "${newTask.description.substring(0, 50)}..."`;
        setNotifications(prev => {
            const newNots = {...prev};
            const userNots = newNots[newTask.assignedTo] || [];
            newNots[newTask.assignedTo] = [...userNots, message];
            return newNots;
        });
    }
  };
  const handleRemoveTask = (taskId: string) => setTasks(p => p.filter(t => t.id !== taskId));
  const handleUpdateTaskStatus = (taskId: string, status: TaskStatus) => setTasks(p => p.map(t => t.id === taskId ? { ...t, status } : t));
  const handleAddDailyOrder = (order: Omit<DailyOrder, 'id' | 'createdAt'>) => {
    const newOrder: DailyOrder = { ...order, id: `d-order-${Date.now()}`, createdAt: new Date().toISOString() };
    setDailyOrders(p => [newOrder, ...p]);
  };
  const handleRemoveDailyOrder = (orderId: string) => setDailyOrders(p => p.filter(o => o.id !== orderId));

  if (!authenticatedUser) {
    if (!selectedUserForLogin) {
        return <UserSelectionPage users={users} onSelectUser={setSelectedUserForLogin} />;
    }
    return (
        <>
            <AuthPage selectedUser={selectedUserForLogin} onLogin={handleLogin} onBack={() => setSelectedUserForLogin(null)} />
            {isSettingFirstPassword && (
                <PasswordModal 
                    title="Set Your New Password" 
                    onSave={handleSetFirstPassword}
                    onClose={() => setIsSettingFirstPassword(false)}
                    isFirstTimeSetup={true}
                />
            )}
        </>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case Tab.Dashboard: return <DashboardSection currentUser={authenticatedUser} users={users} inventory={inventory} tasks={tasks} dailyOrders={dailyOrders} orderRequests={orderRequests} onTabChange={setActiveTab} />;
      case Tab.Inventory: return <InventorySection items={stockItems} onUpdateQuantity={handleUpdateQuantity} onAddItem={handleAddItem} onImportItems={handleImportItems} onRemoveItem={handleRemoveItem} onUpdateItem={handleUpdateItem} users={users} />;
      case Tab.Reorder: return <ReorderSection items={reorderItems} users={users} onRestock={handleRestock} onAddItem={handleAddItem} onRemoveItem={handleRemoveItem} onUpdateItem={handleUpdateItem} />;
      case Tab.OrderRequests: return <OrderRequestSection items={orderRequests} onAddItem={handleAddOrderRequest} onRemoveItem={handleRemoveOrderRequest} />;
      case Tab.Tasks: return <TaskSection tasks={tasks} users={users} onAddTask={handleAddTask} onRemoveTask={handleRemoveTask} onUpdateTaskStatus={handleUpdateTaskStatus} />;
      case Tab.DailyOrders: return <DailyOrdersSection orders={dailyOrders} onAddOrder={handleAddDailyOrder} onRemoveOrder={handleRemoveDailyOrder} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen text-gray-800 dark:text-gray-200 transition-colors duration-300">
        {isChangingPassword && (
            <PasswordModal
                title="Change Your Password"
                onSave={handleChangePassword}
                onClose={() => setIsChangingPassword(false)}
            />
        )}
        <div aria-live="assertive" className="fixed inset-0 flex items-start px-4 py-6 pointer-events-none sm:p-6 sm:items-start z-50">
            <div className="w-full flex flex-col items-center space-y-4 sm:items-end">
                {activeNotifications.map((message, index) => (
                <div key={index} className="max-w-sm w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden">
                    <div className="p-4">
                    <div className="flex items-start">
                        <div className="flex-shrink-0"><BellIcon className="h-6 w-6 text-sky-500" /></div>
                        <div className="ml-3 w-0 flex-1 pt-0.5">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">New Task Assigned!</p>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{message}</p>
                        </div>
                        <div className="ml-4 flex-shrink-0 flex">
                        <button onClick={() => dismissNotification(index)} className="bg-white dark:bg-gray-800 rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            <XMarkIcon className="h-5 w-5" />
                        </button>
                        </div>
                    </div>
                    </div>
                </div>
                ))}
            </div>
        </div>

      <Header currentUser={authenticatedUser} onLogout={handleLogout} onOpenChangePassword={() => setIsChangingPassword(true)} />
      <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        {showReminder && (
          <div className="bg-indigo-500 text-white rounded-md shadow-lg p-4 mb-6 flex justify-between items-center">
            <div className="flex items-center">
              <InformationCircleIcon className="h-6 w-6 mr-3" />
              <p className="font-medium">Daily Reminder: Don't forget to import today's Excel file into your accounting system!</p>
            </div>
            <button onClick={handleDismissReminder} className="p-1 rounded-full hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-white">
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        )}
        
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Management Center</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">An overview of your team's operations and inventory.</p>
        </div>

        <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-4 sm:space-x-6 overflow-x-auto" aria-label="Tabs">
            <button onClick={() => setActiveTab(Tab.Dashboard)} className={`group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 shrink-0 ${ activeTab === Tab.Dashboard ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-600' }`}>
              <HomeIcon className="mr-2 h-5 w-5"/> <span>Dashboard</span>
            </button>
            <button onClick={() => setActiveTab(Tab.Inventory)} className={`group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 shrink-0 ${ activeTab === Tab.Inventory ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-600' }`}>
              <ArchiveBoxIcon className="mr-2 h-5 w-5"/> <span>In Stock ({stockItems.length})</span>
            </button>
            <button onClick={() => setActiveTab(Tab.Reorder)} className={`group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 relative shrink-0 ${ activeTab === Tab.Reorder ? 'border-red-500 text-red-600 dark:text-red-400' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-600' }`}>
              <PlusIcon className="mr-2 h-5 w-5"/> <span>Reorder Needed</span>
              {reorderItems.length > 0 && (<span className="absolute top-2 -right-3 ml-2 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">{reorderItems.length}</span>)}
            </button>
            <button onClick={() => setActiveTab(Tab.OrderRequests)} className={`group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 shrink-0 ${ activeTab === Tab.OrderRequests ? 'border-amber-500 text-amber-600 dark:text-amber-400' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-600' }`}>
              <ListBulletIcon className="mr-2 h-5 w-5"/> <span>Order Requests ({orderRequests.length})</span>
            </button>
            <button onClick={() => setActiveTab(Tab.Tasks)} className={`group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 shrink-0 ${ activeTab === Tab.Tasks ? 'border-sky-500 text-sky-600 dark:text-sky-400' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-600' }`}>
              <ClipboardDocumentCheckIcon className="mr-2 h-5 w-5"/> <span>Team Tasks ({tasks.length})</span>
            </button>
            <button onClick={() => setActiveTab(Tab.DailyOrders)} className={`group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 shrink-0 ${ activeTab === Tab.DailyOrders ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-600' }`}>
              <TruckIcon className="mr-2 h-5 w-5"/> <span>Daily Orders ({dailyOrders.length})</span>
            </button>
          </nav>
        </div>

        <div>
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
