import { useState } from 'react';
import ExpenseForm from './ExpenseForm';
import ExpenseList from './ExpenseList';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

export default function Expenses() {
  const [isAddingExpense, setIsAddingExpense] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  
  const { data: expenses } = useQuery<any[]>({
    queryKey: ['/api/expenses'],
  });
  
  // Calculate summary data
  const calculateTotal = (isIncome: boolean) => {
    if (!expenses) return 0;
    return expenses
      .filter(expense => expense.isIncome === isIncome)
      .reduce((sum, expense) => sum + expense.amount, 0);
  };
  
  const totalIncome = calculateTotal(true);
  const totalExpenses = calculateTotal(false);
  const balance = totalIncome - totalExpenses;

  return (
    <div className="space-y-6">
      {/* Section heading */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0">
        <h1 className="text-2xl font-bold text-neutral-800">Expense Tracking</h1>
        <Button onClick={() => setIsAddingExpense(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Transaction
        </Button>
      </div>
      
      {/* Financial summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col">
              <span className="text-sm font-medium text-neutral-500">Total Income</span>
              <span className="text-2xl font-semibold text-green-600">${totalIncome.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col">
              <span className="text-sm font-medium text-neutral-500">Total Expenses</span>
              <span className="text-2xl font-semibold text-red-600">${totalExpenses.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col">
              <span className="text-sm font-medium text-neutral-500">Balance</span>
              <span className={`text-2xl font-semibold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${balance.toFixed(2)}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Transaction form or list */}
      {isAddingExpense ? (
        <ExpenseForm onCancel={() => setIsAddingExpense(false)} />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="income">Income</TabsTrigger>
                <TabsTrigger value="expenses">Expenses</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all">
                <ExpenseList filterType="all" />
              </TabsContent>
              <TabsContent value="income">
                <ExpenseList filterType="income" />
              </TabsContent>
              <TabsContent value="expenses">
                <ExpenseList filterType="expenses" />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
