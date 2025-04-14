import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Activity } from "@/lib/types";
import { formatDateRelative } from "@/lib/utils/dateUtils";
import { Skeleton } from "@/components/ui/skeleton";
import { UserPlus, FileText, DollarSign, CheckCircle } from "lucide-react";

export default function RecentActivity() {
  const { data: activities, isLoading } = useQuery<Activity[]>({
    queryKey: ['/api/activities'],
  });

  // Function to determine icon based on activity type
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'client_created':
        return (
          <span className="flex items-center justify-center h-8 w-8 rounded-full bg-primary-100 text-primary-600">
            <UserPlus className="h-5 w-5" />
          </span>
        );
      case 'business_plan_created':
      case 'business_plan_updated':
        return (
          <span className="flex items-center justify-center h-8 w-8 rounded-full bg-secondary-100 text-secondary-600">
            <FileText className="h-5 w-5" />
          </span>
        );
      case 'expense_created':
        return (
          <span className="flex items-center justify-center h-8 w-8 rounded-full bg-amber-100 text-amber-600">
            <DollarSign className="h-5 w-5" />
          </span>
        );
      case 'task_completed':
        return (
          <span className="flex items-center justify-center h-8 w-8 rounded-full bg-green-100 text-green-600">
            <CheckCircle className="h-5 w-5" />
          </span>
        );
      default:
        return (
          <span className="flex items-center justify-center h-8 w-8 rounded-full bg-primary-100 text-primary-600">
            <FileText className="h-5 w-5" />
          </span>
        );
    }
  };

  // Function to parse description and highlight entities
  const parseDescription = (description: string) => {
    // This regex matches content between potential entity markers
    const regex = /([^:]+): ([^(]+)(?:\(([^)]+)\))?/g;
    let match;
    
    if ((match = regex.exec(description)) !== null) {
      const prefix = description.substring(0, match.index);
      const action = match[1];
      const entity = match[2].trim();
      
      return (
        <>
          {prefix}{action}: <span className="text-primary-600">{entity}</span>
        </>
      );
    }
    
    return description;
  };
  
  return (
    <Card>
      <CardHeader className="border-b border-neutral-100 px-6 py-4">
        <CardTitle className="text-lg font-semibold text-neutral-800">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-start">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="ml-4 space-y-2">
                  <Skeleton className="h-4 w-64" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {activities && activities.length > 0 ? (
              activities.slice(0, 5).map((activity) => (
                <div key={activity.id} className="flex items-start">
                  {getActivityIcon(activity.type)}
                  <div className="ml-4">
                    <p className="text-sm font-medium text-neutral-800">
                      {parseDescription(activity.description)}
                    </p>
                    <p className="text-xs text-neutral-500 mt-1">
                      {formatDateRelative(new Date(activity.timestamp))}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-neutral-500">No recent activity.</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
