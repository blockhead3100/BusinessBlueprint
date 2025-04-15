import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { DollarSign, Users, FileText } from "lucide-react";
import { QuickStat } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { useLocation } from "wouter";

export default function QuickStats() {
  const [, setLocation] = useLocation();
  
  const { data: expenses, isLoading: expensesLoading } = useQuery<any[]>({
    queryKey: ['/api/expenses'],
  });

  const { data: clients, isLoading: clientsLoading } = useQuery<any[]>({
    queryKey: ['/api/clients'],
  });

  const { data: businessPlans, isLoading: plansLoading } = useQuery<any[]>({
    queryKey: ['/api/business-plans'],
  });

  const isLoading = expensesLoading || clientsLoading || plansLoading;

  // Calculate monthly revenue
  const calculateMonthlyRevenue = () => {
    if (!expenses) return 0;
    
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    return expenses
      .filter(expense => expense.isIncome && new Date(expense.date) >= firstDayOfMonth)
      .reduce((sum, expense) => sum + expense.amount, 0);
  };

  // Count active plans
  const countActivePlans = () => {
    if (!businessPlans) return { active: 0, draft: 0 };
    
    const active = businessPlans.filter(plan => plan.status === 'active').length;
    const draft = businessPlans.filter(plan => plan.status === 'draft').length;
    
    return { active, draft };
  };

  const stats: (QuickStat & { link: string })[] = [
    {
      title: "Monthly Revenue",
      value: isLoading ? "-" : `$${calculateMonthlyRevenue().toLocaleString()}`,
      change: "8.2% from last month",
      changeType: "increase",
      icon: <DollarSign className="h-6 w-6 text-primary-600" />,
      link: "/expenses"
    },
    {
      title: "Active Clients",
      value: isLoading ? "-" : `${clients?.length || 0}`,
      change: "2 new this month",
      changeType: "increase",
      icon: <Users className="h-6 w-6 text-primary-600" />,
      link: "/clients"
    },
    {
      title: "Business Plans",
      value: isLoading ? "-" : `${(businessPlans?.length || 0)}`,
      change: isLoading ? "-" : `${countActivePlans().active} active, ${countActivePlans().draft} drafts`,
      changeType: "neutral",
      icon: <FileText className="h-6 w-6 text-primary-600" />,
      link: "/business-plans"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat, index) => (
        <Card 
          key={index} 
          className="cursor-pointer hover:border-primary-400 transition-colors"
          onClick={() => setLocation(stat.link)}
        >
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="bg-primary-50 p-3 rounded-md">
                {stat.icon}
              </div>
              <div className="ml-4">
                <h2 className="text-sm font-medium text-neutral-500">{stat.title}</h2>
                {isLoading ? (
                  <Skeleton className="h-8 w-24 mt-1" />
                ) : (
                  <>
                    <p className="text-2xl font-semibold text-neutral-800">{stat.value}</p>
                    {stat.change && (
                      <p className={`text-sm mt-1 ${
                        stat.changeType === 'increase' ? 'text-green-600' : 
                        stat.changeType === 'decrease' ? 'text-red-600' : 'text-neutral-500'
                      }`}>
                        {stat.changeType === 'increase' && '↑ '}
                        {stat.changeType === 'decrease' && '↓ '}
                        {stat.change}
                      </p>
                    )}
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
