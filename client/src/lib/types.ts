export type Tab = 'dashboard' | 'business-plans' | 'expenses' | 'clients' | 
                 'forecasting' | 'market-analysis' | 'pitch-deck' | 'legal';

export interface QuickStat {
  title: string;
  value: string;
  change?: string;
  changeType?: 'increase' | 'decrease' | 'neutral';
  icon: JSX.Element;
}

export interface Activity {
  id: number;
  type: string;
  description: string;
  timestamp: Date;
  entityId?: number;
  entityType?: string;
}

export interface Task {
  id: number;
  title: string;
  completed: boolean;
  dueDate: Date;
}

export interface Client {
  id: number;
  name: string;
  industry: string;
  contactName: string;
  contactEmail: string;
  status: 'active' | 'inactive' | 'archived';
  projectsActive: number;
  projectsCompleted: number;
}

export interface BusinessPlan {
  id: number;
  name: string;
  template: string;
  clientName: string;
  lastUpdated: Date;
  status: 'active' | 'draft' | 'archived';
}

export interface PlanTemplate {
  id: string;
  name: string;
  description: string;
  icon: JSX.Element;
}

export interface Expense {
  id: number;
  description: string;
  amount: number;
  date: Date;
  category: string;
  isIncome: boolean;
  clientName?: string;
  projectName?: string;
}

export interface ProjectSummary {
  active: number;
  completed: number;
}

export interface User {
  id: number;
  fullName: string;
  planType: string;
  avatarUrl?: string;
}
