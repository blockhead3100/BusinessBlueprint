import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Task } from "@/lib/types";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { getDueDateDisplay } from "@/lib/utils/dateUtils";
import { Skeleton } from "@/components/ui/skeleton";
import { apiRequest } from "@/lib/queryClient";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { queryClient } from "@/lib/queryClient";

const newTaskSchema = z.object({
  title: z.string().min(1, "Task title is required"),
  dueDate: z.string().optional()
});

type NewTaskFormValues = z.infer<typeof newTaskSchema>;

export default function UpcomingTasks() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const { data: tasks, isLoading } = useQuery<Task[]>({
    queryKey: ['/api/tasks', { completed: false }],
  });

  const form = useForm<NewTaskFormValues>({
    resolver: zodResolver(newTaskSchema),
    defaultValues: {
      title: "",
      dueDate: new Date().toISOString().split('T')[0]
    }
  });

  const createTaskMutation = useMutation({
    mutationFn: async (newTask: NewTaskFormValues) => {
      return apiRequest('POST', '/api/tasks', {
        title: newTask.title,
        completed: false,
        dueDate: newTask.dueDate ? new Date(newTask.dueDate) : undefined
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tasks'] });
      form.reset();
      setIsDialogOpen(false);
    }
  });

  const toggleTaskMutation = useMutation({
    mutationFn: async ({ id, completed }: { id: number, completed: boolean }) => {
      return apiRequest('PUT', `/api/tasks/${id}`, { completed });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tasks'] });
      queryClient.invalidateQueries({ queryKey: ['/api/activities'] });
    }
  });

  const handleTaskToggle = (taskId: number, currentState: boolean) => {
    toggleTaskMutation.mutate({ id: taskId, completed: !currentState });
  };

  const onSubmit = (data: NewTaskFormValues) => {
    createTaskMutation.mutate(data);
  };

  return (
    <>
      <Card>
        <CardHeader className="px-6 py-4 border-b border-neutral-100">
          <CardTitle className="text-lg font-semibold text-neutral-800">Upcoming Tasks</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Skeleton className="h-4 w-4 mr-3" />
                    <Skeleton className="h-4 w-48" />
                  </div>
                  <Skeleton className="h-3 w-16" />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {tasks && tasks.length > 0 ? (
                tasks.slice(0, 4).map((task) => (
                  <div key={task.id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Checkbox 
                        id={`task-${task.id}`} 
                        checked={task.completed}
                        onCheckedChange={() => handleTaskToggle(task.id, task.completed)}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
                      />
                      <label htmlFor={`task-${task.id}`} className="ml-3 text-sm text-neutral-700">
                        {task.title}
                      </label>
                    </div>
                    <span className="text-xs text-neutral-500">
                      {getDueDateDisplay(new Date(task.dueDate))}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-neutral-500">No upcoming tasks.</p>
              )}
              
              <Button 
                onClick={() => setIsDialogOpen(true)}
                className="mt-4 w-full"
              >
                Add New Task
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Task</DialogTitle>
            <DialogDescription>
              Create a new task to keep track of your work.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Task Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter task title" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Due Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                className="w-full"
                disabled={createTaskMutation.isPending}
              >
                {createTaskMutation.isPending ? "Adding..." : "Add Task"}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
