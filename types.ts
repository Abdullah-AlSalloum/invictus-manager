export interface User {
  id: number;
  name: string;
  description: string;
  password?: string;
  hasSetPassword?: boolean;
}

export interface InventoryItem {
  id: string;
  name: string;
  type: string;
  quantity: number;
  managedBy: number; // User ID
  supplier?: string;
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
    assignedTo: number; // User ID
    createdBy: number; // User ID
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

export enum Tab {
  Dashboard = 'DASHBOARD',
  Inventory = 'INVENTORY',
  Reorder = 'REORDER',
  OrderRequests = 'ORDER_REQUESTS',
  Tasks = 'TASKS',
  DailyOrders = 'DAILY_ORDERS',
}
