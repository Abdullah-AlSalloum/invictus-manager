

import React, { useState, useEffect, useMemo, FC } from 'react';
import { InventoryItem, User, OrderRequest, Tab, Task, DailyOrder, TaskStatus } from '../types';
import { getDb } from '../firebaseConfig.ts';
import Header from '../components/Header';
import DashboardSection from '../components/DashboardSection';
import InventorySection from '../components/InventorySection';
import ReorderSection from '../components/ReorderSection';
import OrderRequestSection from '../components/WishlistSection';
import TaskSection from '../components/TaskSection';
import DailyOrdersSection from '../components/DailyOrdersSection';
import Avatar from '../components/Avatar';
import Sidebar from '../components/Sidebar';
import { PlusIcon, ArchiveBoxIcon, ListBulletIcon, InformationCircleIcon, XMarkIcon, ClipboardDocumentCheckIcon, TruckIcon, BellIcon, HomeIcon, LockClosedIcon, EyeIcon, EyeSlashIcon } from '../components/icons';

const initialUsersList: Omit<User, 'id'>[] = [
  { name: 'Mohammad', description: 'Owner', password: 'password123', hasSetPassword: false },
  { name: 'Osama', description: ' Manager', password: 'password123', hasSetPassword: false },
  { name: 'Shadi', description: 'Sales Manager', password: 'password123', hasSetPassword: false },
  { name: 'Anas', description: 'Tecnical Servis', password: 'password123', hasSetPassword: false },
  { name: 'Abdulselam', description: 'Accountent', password: 'password123', hasSetPassword: false },
  { name: 'Abdulkarim', description: 'Sales Lead', password: 'password123', hasSetPassword: false },
  { name: 'King Abdullah', description: 'Computer Enginner', password: 'password123', hasSetPassword: false },
];

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

const LoadingScreen: FC<{ message: string }> = ({ message }) => (
     <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col justify-center items-center p-4 text-center">
        <svg className="animate-spin h-8 w-8 text-indigo-600 dark:text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="mt-4 text-gray-600 dark:text-gray-400">{message}</p>
    </div>
);


const UserSelectionPage: FC<{ users: User[]; onSelectUser: (user: User) => void; }> = ({ users, onSelectUser }) => (
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
            <h2 className="text-center text-xl font-semibold text-gray-800 dark:text-gray-200">Who's signing in?</h2>
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

const AuthModal: FC<{
    selectedUser: User;
    onLogin: (password: string) => void;
    onClose: () => void;
}> = ({ selectedUser, onLogin, onClose }) => {
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!password) {
            setError('Password cannot be empty.');
            return;
        }
        onLogin(password);
    };
    
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    return (
       <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-40">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 w-full max-w-sm transform transition-all"  role="dialog" aria-modal="true">
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
                            id="password" name="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password"
                            required autoFocus value={password} onChange={(e) => setPassword(e.target.value)}
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
                 <button type="button" onClick={onClose} className="w-full text-center py-2 text-sm text-gray-600 dark:text-gray-400 hover:underline">Cancel</button>
            </form>
        </div>
       </div>
    );
};

const PasswordModal: FC<{
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


const App: React.FC = () => {
  // FIX: Use `any` for db type to align with window.firebase and remove dependency on firebase sdk types.
  const [db, setDb] = useState<any | null>(null);
  const [dbError, setDbError] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [orderRequests, setOrderRequests] = useState<OrderRequest[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [dailyOrders, setDailyOrders] = useState<DailyOrder[]>([]);
  const [notifications, setNotifications] = useState<Record<string, string[]>>({});

  const [selectedUserForLogin, setSelectedUserForLogin] = useState<User | null>(null);
  const [authenticatedUser, setAuthenticatedUser] = useState<User | null>(null);
  
  const [isSettingFirstPassword, setIsSettingFirstPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>(Tab.Dashboard);
  const [activeNotifications, setActiveNotifications] = useState<string[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  useEffect(() => {
    const initDb = async () => {
        try {
            const firestoreDb = await getDb();
            setDb(firestoreDb);
            setDbError(null);
        } catch (error) {
            console.error("Database connection error:", error);
            setDbError("Failed to connect to the database. Please check your Firebase configuration and internet connection.");
        }
    };
    initDb();
  }, []);

  useEffect(() => {
    if (!db) return;

    // --- Seeding Logic ---
    const seedDatabase = async () => {
        const usersSnapshot = await db.collection('users').limit(1).get();
        if (usersSnapshot.empty) {
            console.log("Seeding database: creating initial users and inventory...");
            const batch = db.batch();
            const createdUserRefs: { [key: string]: string } = {};

            initialUsersList.forEach(user => {
                const userRef = db.collection('users').doc();
                batch.set(userRef, user);
                createdUserRefs[user.name] = userRef.id;
            });

            const userValues = Object.values(createdUserRefs);
            const initialInventoryList: Omit<InventoryItem, 'id' | 'managedBy'>[] = [
                { name: 'Wireless Mouse', type: 'Electronics', quantity: 15, createdAt: new Date('2023-10-26T10:00:00Z').toISOString(), supplier: 'TechSupply' },
                { name: 'Ergonomic Keyboard', type: 'Electronics', quantity: 2, createdAt: new Date('2023-10-26T10:05:00Z').toISOString(), supplier: 'OfficeGoods' }
            ];
            initialInventoryList.forEach((item, index) => {
                const itemRef = db.collection('inventory').doc();
                batch.set(itemRef, { ...item, managedBy: userValues[index % userValues.length] });
            });
            await batch.commit();
            console.log("Database seeded successfully.");
        }
    };
    seedDatabase();

    // --- Real-time Listeners ---
    const unsubscribers = [
        db.collection('users').onSnapshot((snapshot: any) => setUsers(snapshot.docs.map((doc: any) => ({ ...doc.data(), id: doc.id } as User)))),
        db.collection('inventory').onSnapshot((snapshot: any) => setInventory(snapshot.docs.map((doc: any) => ({ ...doc.data(), id: doc.id } as InventoryItem)))),
        db.collection('orderRequests').onSnapshot((snapshot: any) => setOrderRequests(snapshot.docs.map((doc: any) => ({ ...doc.data(), id: doc.id } as OrderRequest)))),
        db.collection('tasks').onSnapshot((snapshot: any) => setTasks(snapshot.docs.map((doc: any) => ({ ...doc.data(), id: doc.id } as Task)))),
        db.collection('dailyOrders').onSnapshot((snapshot: any) => setDailyOrders(snapshot.docs.map((doc: any) => ({ ...doc.data(), id: doc.id } as DailyOrder)))),
        db.collection('notifications').onSnapshot((snapshot: any) => {
            const notifs: Record<string, string[]> = {};
            snapshot.forEach((doc: any) => { notifs[doc.id] = doc.data().messages; });
            setNotifications(notifs);
        }),
    ];
    return () => unsubscribers.forEach(unsub => unsub());
  }, [db]);
  
   useEffect(() => {
    if (authenticatedUser && notifications[authenticatedUser.id]) {
        playSound('notification');
        setActiveNotifications(notifications[authenticatedUser.id]);
        db?.collection('notifications').doc(authenticatedUser.id).delete();
    }
  }, [authenticatedUser, notifications, db]);
  
  // --- Auth Handlers ---
  const handleLogin = (password: string) => {
    if (!selectedUserForLogin) return;
    if (selectedUserForLogin.password === password) {
        if (!selectedUserForLogin.hasSetPassword) {
            setIsSettingFirstPassword(true);
        } else {
            setAuthenticatedUser(selectedUserForLogin);
            setSelectedUserForLogin(null);
        }
    } else {
        alert('Incorrect password. Please try again.');
    }
  };
  
  const handleSetFirstPassword = ({ newPassword }: Record<string, string>) => {
    if (!db || !selectedUserForLogin) return;
    const updatedUser = { ...selectedUserForLogin, password: newPassword, hasSetPassword: true };
    db.collection('users').doc(updatedUser.id).update({ password: newPassword, hasSetPassword: true });
    setAuthenticatedUser(updatedUser);
    setIsSettingFirstPassword(false);
    setSelectedUserForLogin(null);
  };

  const handleChangePassword = ({ currentPassword, newPassword }: Record<string, string>) => {
    if (!db || !authenticatedUser) return;
    if (authenticatedUser.password === currentPassword) {
        db.collection('users').doc(authenticatedUser.id).update({ password: newPassword });
        setAuthenticatedUser(prev => prev ? { ...prev, password: newPassword } : null);
        alert('Password changed successfully!');
        setIsChangingPassword(false);
    } else {
        alert('Incorrect current password.');
    }
  };
  
  const handleLogout = () => setAuthenticatedUser(null);
  
  // --- Data Handlers ---
  const handleAddItem = (newItem: Omit<InventoryItem, 'id' | 'managedBy' | 'createdAt'>) => {
    if (!db || !authenticatedUser) return;
    db.collection('inventory').add({ ...newItem, managedBy: authenticatedUser.id, createdAt: new Date().toISOString() });
  };
  const handleUpdateItem = (itemId: string, updates: Partial<Omit<InventoryItem, 'id'>>) => {
    db?.collection('inventory').doc(itemId).update(updates);
  };
  const handleRemoveItem = (itemId: string) => {
    db?.collection('inventory').doc(itemId).delete();
  };
  const handleAddTask = (task: Omit<Task, 'id' | 'createdBy' | 'createdAt'>) => {
    if (!db || !authenticatedUser) return;
    // FIX: Explicitly type `newTask` to prevent type inference issues.
    const newTask: Omit<Task, 'id'> = { ...task, createdBy: authenticatedUser.id, createdAt: new Date().toISOString() };
    db.collection('tasks').add(newTask);

    if (newTask.assignedTo !== authenticatedUser.id) {
        playSound('confirmation');
        const message = `${authenticatedUser.name} assigned you a new task: "${newTask.description.substring(0, 50)}..."`;
        // FIX: Use window.firebase for consistency with getDb.
        const FieldValue = window.firebase.firestore.FieldValue;
        db.collection('notifications').doc(newTask.assignedTo).set({
            messages: FieldValue.arrayUnion(message)
        }, { merge: true });
    }
  };
  const handleUpdateTaskStatus = (taskId: string, status: TaskStatus) => {
     db?.collection('tasks').doc(taskId).update({ status });
  };
  const handleRemoveTask = (taskId: string) => {
    db?.collection('tasks').doc(taskId).delete();
  };
  const handleAddDailyOrder = (order: Omit<DailyOrder, 'id' | 'createdAt'>) => {
    db?.collection('dailyOrders').add({ ...order, createdAt: new Date().toISOString() });
  };
  const handleRemoveDailyOrder = (orderId: string) => {
    db?.collection('dailyOrders').doc(orderId).delete();
  };
   const handleAddOrderRequest = (item: Omit<OrderRequest, 'id' | 'createdAt'>) => {
    db?.collection('orderRequests').add({ ...item, createdAt: new Date().toISOString() });
  };
  const handleRemoveOrderRequest = (itemId: string) => {
    db?.collection('orderRequests').doc(itemId).delete();
  };
  const handleRestock = (itemId: string, restockQuantity: number) => {
    if (!db) return;
    // FIX: Use window.firebase for consistency with getDb.
    const FieldValue = window.firebase.firestore.FieldValue;
    db.collection('inventory').doc(itemId).update({ quantity: FieldValue.increment(restockQuantity) });
  };
  
  // --- UI Render ---

  if (dbError) {
      return <LoadingScreen message={dbError} />;
  }

  if (!db) {
      return <LoadingScreen message="Connecting to database..." />;
  }
  
  if (!authenticatedUser) {
    return (
        <>
            {users.length > 0 ? (
                <UserSelectionPage users={users} onSelectUser={setSelectedUserForLogin} />
            ) : (
                <LoadingScreen message="Loading user profiles..." />
            )}
            {selectedUserForLogin && !isSettingFirstPassword && (
                <AuthModal
                    selectedUser={selectedUserForLogin}
                    onLogin={handleLogin}
                    onClose={() => setSelectedUserForLogin(null)}
                />
            )}
            {selectedUserForLogin && isSettingFirstPassword && (
                <PasswordModal 
                    title="Set Your New Password" 
                    onSave={handleSetFirstPassword}
                    onClose={() => { setIsSettingFirstPassword(false); setSelectedUserForLogin(null); }}
                    isFirstTimeSetup={true}
                />
            )}
        </>
    );
  }
  
  const reorderItems = inventory.filter(item => item.quantity < 3);
  const stockItems = inventory.filter(item => item.quantity >= 3);

  const renderContent = () => {
    switch (activeTab) {
      case Tab.Dashboard: return <DashboardSection currentUser={authenticatedUser} users={users} inventory={inventory} tasks={tasks} dailyOrders={dailyOrders} orderRequests={orderRequests} onTabChange={setActiveTab} />;
      case Tab.Inventory: return <InventorySection items={stockItems} onUpdateQuantity={(id, qty) => handleUpdateItem(id, { quantity: qty })} onAddItem={handleAddItem} onImportItems={()=>{}} onRemoveItem={handleRemoveItem} onUpdateItem={handleUpdateItem} users={users} />;
      case Tab.Reorder: return <ReorderSection items={reorderItems} users={users} onRestock={handleRestock} onAddItem={handleAddItem} onRemoveItem={handleRemoveItem} onUpdateItem={handleUpdateItem} />;
      case Tab.OrderRequests: return <OrderRequestSection items={orderRequests} onAddItem={handleAddOrderRequest} onRemoveItem={handleRemoveOrderRequest} />;
      case Tab.Tasks: return <TaskSection tasks={tasks} users={users} onAddTask={handleAddTask} onRemoveTask={handleRemoveTask} onUpdateTaskStatus={handleUpdateTaskStatus} />;
      case Tab.DailyOrders: return <DailyOrdersSection orders={dailyOrders} onAddOrder={handleAddDailyOrder} onRemoveOrder={handleRemoveDailyOrder} />;
      default: return null;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 transition-colors duration-300">
        {isChangingPassword && <PasswordModal title="Change Your Password" onSave={handleChangePassword} onClose={() => setIsChangingPassword(false)} />}
        <Header 
            currentUser={authenticatedUser} 
            onLogout={handleLogout} 
            onOpenChangePassword={() => setIsChangingPassword(true)}
            onToggleSidebar={() => setIsSidebarOpen(prev => !prev)}
        />
        <div className="flex flex-1 overflow-hidden">
            <Sidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                stockItemsCount={stockItems.length}
                reorderItemsCount={reorderItems.length}
                orderRequestsCount={orderRequests.length}
                tasksCount={tasks.length}
                dailyOrdersCount={dailyOrders.length}
                isOpen={isSidebarOpen}
                setIsOpen={setIsSidebarOpen}
            />
            <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
                <div className="max-w-7xl mx-auto w-full">
                    {renderContent()}
                </div>
            </main>
        </div>
    </div>
  );
};

export default App;