import QuickStats from './QuickStats';
import RecentActivity from './RecentActivity';
import UpcomingTasks from './UpcomingTasks';

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <QuickStats />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentActivity />
        </div>
        <div>
          <UpcomingTasks />
        </div>
      </div>
    </div>
  );
}
