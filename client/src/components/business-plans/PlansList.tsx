import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { BusinessPlan } from "@/lib/types";
import { formatDateRelative } from "@/lib/utils/dateUtils";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

interface PlansListProps {
  onSelect: (planId: number) => void;
}

export default function PlansList({ onSelect }: PlansListProps) {
  const { data: plans, isLoading } = useQuery<BusinessPlan[]>({
    queryKey: ['/api/business-plans'],
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200 hover:bg-green-200">
            Active
          </Badge>
        );
      case 'draft':
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200">
            Draft
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-neutral-100 text-neutral-800 border-neutral-200 hover:bg-neutral-200">
            {status}
          </Badge>
        );
    }
  };

  return (
    <Card className="border border-neutral-100 shadow-sm">
      <CardHeader className="px-6 py-4 border-b border-neutral-100">
        <CardTitle className="text-lg font-medium text-neutral-800">Your Business Plans</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-neutral-200">
            <thead className="bg-neutral-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Client
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Last Updated
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-neutral-200">
              {isLoading ? (
                [...Array(3)].map((_, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Skeleton className="h-5 w-40" />
                      <Skeleton className="h-4 w-24 mt-1" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Skeleton className="h-5 w-32" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Skeleton className="h-5 w-24" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Skeleton className="h-5 w-16 rounded-full" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <Skeleton className="h-5 w-24 ml-auto" />
                    </td>
                  </tr>
                ))
              ) : plans && plans.length > 0 ? (
                plans.map((plan) => (
                  <tr 
                    key={plan.id} 
                    className="cursor-pointer hover:bg-neutral-50"
                    onClick={() => onSelect(plan.id)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-neutral-900">{plan.name}</div>
                      <div className="text-xs text-neutral-500">{plan.template} Template</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-neutral-900">{plan.clientName || 'No client'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                      {formatDateRelative(new Date(plan.lastUpdated))}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(plan.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelect(plan.id);
                        }}
                        className="text-primary-600 hover:text-primary-900"
                      >
                        Edit
                      </button>
                      <span className="mx-1 text-neutral-300">|</span>
                      <button 
                        onClick={(e) => e.stopPropagation()}
                        className="text-neutral-600 hover:text-neutral-900"
                      >
                        Preview
                      </button>
                      <span className="mx-1 text-neutral-300">|</span>
                      <button 
                        onClick={(e) => e.stopPropagation()}
                        className="text-neutral-600 hover:text-neutral-900"
                      >
                        Export
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-sm text-neutral-500">
                    No business plans found. Create your first plan above.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
