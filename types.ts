export interface User {
  id: string;
  name: string;
  description: string;
  password: string;
  hasSetPassword: boolean;
}

export interface InventoryItem {
  id: string;
  reference: string;
  name: string;
  type: string;
  quantity: number;
  managedBy: string; // User ID
  createdAt: string; // ISO String
}

export interface OrderRequest {
  id: string;
  itemName: string;
  notes: string;
  requestedBy: string;
  createdAt: string; // ISO String
}

export type TaskStatus = 'To Do' | 'In Progress' | 'Completed';

export interface Task {
    id: string;
    description: string;
    assignedTo: string; // User ID
    createdBy: string; // User ID
    dueDate: string; // YYYY-MM-DD
    status: TaskStatus;
    createdAt: string; // ISO String
}

export interface DailyOrder {
    id: string;
    orderDetails: string;
    customerName: string;
    dateSent: string; // YYYY-MM-DD
    createdAt: string; // ISO String
}

export interface Customer {
  id: string;
  name: string;
  phoneNumber: string;
  googleMapsLink: string;
  createdAt: string; // ISO String
}

export enum Tab {
  Dashboard = 'DASHBOARD',
  Inventory = 'INVENTORY',
  Reorder = 'REORDER',
  OrderRequests = 'ORDER_REQUESTS',
  Tasks = 'TASKS',
  DailyOrders = 'DAILY_ORDERS',
  Customers = 'CUSTOMERS',
}