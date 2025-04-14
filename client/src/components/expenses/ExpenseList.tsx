import { useQuery } from '@tanstack/react-query';
import { Expense } from '@/lib/types';
import { formatDate } from '@/lib/utils/dateUtils';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { ArrowUpDown, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface ExpenseListProps {
  filterType: 'all' | 'income' | 'expenses';
}

export default function ExpenseList({ filterType }: ExpenseListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<'date' | 'amount'>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  const { data: expenses, isLoading } = useQuery<Expense[]>({
    queryKey: ['/api/expenses'],
  });
  
  const toggleSort = (field: 'date' | 'amount') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };
  
  // Filter and sort expenses
  const filteredExpenses = expenses?.filter(expense => {
    // Filter by type
    if (filterType === 'income' && !expense.isIncome) return false;
    if (filterType === 'expenses' && expense.isIncome) return false;
    
    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        expense.description.toLowerCase().includes(searchLower) ||
        expense.category.toLowerCase().includes(searchLower) ||
        (expense.clientName && expense.clientName.toLowerCase().includes(searchLower))
      );
    }
    
    return true;
  }).sort((a, b) => {
    if (sortField === 'date') {
      return sortDirection === 'asc' 
        ? new Date(a.date).getTime() - new Date(b.date).getTime()
        : new Date(b.date).getTime() - new Date(a.date).getTime();
    } else {
      return sortDirection === 'asc' 
        ? a.amount - b.amount
        : b.amount - a.amount;
    }
  });
  
  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-neutral-400" />
        <Input
          placeholder="Search transactions..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Description</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>
                <Button variant="ghost" className="p-0 h-8 font-medium" onClick={() => toggleSort('date')}>
                  Date
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" className="p-0 h-8 font-medium" onClick={() => toggleSort('amount')}>
                  Amount
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>Client</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                </TableRow>
              ))
            ) : filteredExpenses && filteredExpenses.length > 0 ? (
              filteredExpenses.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell>{expense.description}</TableCell>
                  <TableCell>{expense.category}</TableCell>
                  <TableCell>{formatDate(new Date(expense.date), 'medium')}</TableCell>
                  <TableCell>
                    <span className={expense.isIncome ? 'text-green-600' : 'text-red-600'}>
                      {expense.isIncome ? '+' : '-'}${expense.amount.toFixed(2)}
                    </span>
                  </TableCell>
                  <TableCell>
                    {expense.clientName ? (
                      <Badge variant="outline" className="bg-neutral-100 text-neutral-800 hover:bg-neutral-200">
                        {expense.clientName}
                      </Badge>
                    ) : (
                      <span className="text-neutral-400">-</span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4 text-neutral-500">
                  No transactions found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
