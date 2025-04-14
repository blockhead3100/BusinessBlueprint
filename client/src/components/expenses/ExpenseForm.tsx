import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const expenseSchema = z.object({
  description: z.string().min(1, 'Description is required'),
  amount: z.coerce.number().positive('Amount must be positive'),
  date: z.string().min(1, 'Date is required'),
  category: z.string().min(1, 'Category is required'),
  isIncome: z.boolean(),
  clientId: z.string().optional(),
  projectId: z.string().optional(),
});

type ExpenseFormValues = z.infer<typeof expenseSchema>;

interface ExpenseFormProps {
  onCancel: () => void;
  expenseId?: number;
}

export default function ExpenseForm({ onCancel, expenseId }: ExpenseFormProps) {
  const { toast } = useToast();
  
  // Fetch clients for dropdown
  const { data: clients } = useQuery<any[]>({
    queryKey: ['/api/clients'],
  });
  
  // Fetch projects for dropdown
  const { data: projects } = useQuery<any[]>({
    queryKey: ['/api/projects'],
  });
  
  const form = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      description: '',
      amount: 0,
      date: new Date().toISOString().split('T')[0],
      category: '',
      isIncome: false,
      clientId: '',
      projectId: '',
    },
  });
  
  // Categories for dropdown
  const expenseCategories = [
    'Office Supplies',
    'Rent',
    'Utilities',
    'Salaries',
    'Marketing',
    'Travel',
    'Equipment',
    'Software',
    'Insurance',
    'Professional Services',
    'Taxes',
    'Other'
  ];
  
  const incomeCategories = [
    'Sales',
    'Services',
    'Consulting',
    'Investments',
    'Interest',
    'Royalties',
    'Other'
  ];
  
  // Mutation to create or update expense
  const expenseMutation = useMutation({
    mutationFn: async (values: ExpenseFormValues) => {
      return apiRequest('POST', '/api/expenses', {
        ...values,
        clientId: values.clientId ? parseInt(values.clientId) : null,
        projectId: values.projectId ? parseInt(values.projectId) : null,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/expenses'] });
      queryClient.invalidateQueries({ queryKey: ['/api/activities'] });
      toast({
        title: "Success",
        description: `Transaction ${expenseId ? 'updated' : 'created'} successfully`,
      });
      onCancel();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to ${expenseId ? 'update' : 'create'} transaction: ${error.toString()}`,
        variant: "destructive"
      });
    }
  });
  
  const onSubmit = (values: ExpenseFormValues) => {
    expenseMutation.mutate(values);
  };
  
  const isIncome = form.watch('isIncome');
  const categories = isIncome ? incomeCategories : expenseCategories;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{expenseId ? 'Edit Transaction' : 'Add New Transaction'}</CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-end space-x-2">
              <FormField
                control={form.control}
                name="isIncome"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-end space-x-2 space-y-0">
                    <FormLabel>Income</FormLabel>
                    <FormControl>
                      <Switch 
                        checked={field.value} 
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-neutral-500">
                          $
                        </span>
                        <Input 
                          type="number" 
                          step="0.01" 
                          min="0" 
                          className="pl-8" 
                          placeholder="0.00" 
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select 
                      value={field.value} 
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="clientId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client (Optional)</FormLabel>
                    <Select 
                      value={field.value} 
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select client" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="">None</SelectItem>
                        {clients?.map(client => (
                          <SelectItem key={client.id} value={client.id.toString()}>
                            {client.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="projectId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project (Optional)</FormLabel>
                    <Select 
                      value={field.value} 
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select project" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="">None</SelectItem>
                        {projects?.map(project => (
                          <SelectItem key={project.id} value={project.id.toString()}>
                            {project.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={expenseMutation.isPending}>
              {expenseMutation.isPending ? 'Saving...' : 'Save Transaction'}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
