import { useLocation } from 'wouter';
import { Tab } from '@/lib/types';
import { Bell, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  setIsSidebarOpen: (isOpen: boolean) => void;
}

export default function Header({ setIsSidebarOpen }: HeaderProps) {
  const [location] = useLocation();
  const currentTab = location === '/' ? 'dashboard' : location.slice(1) as Tab;
  
  // Map tab names to display titles
  const tabTitles: Record<Tab, string> = {
    'dashboard': 'Dashboard',
    'business-plans': 'Business Plans',
    'expenses': 'Expense Tracking',
    'clients': 'Client Management',
    'forecasting': 'Financial Forecasting',
    'market-analysis': 'Market Analysis',
    'pitch-deck': 'Pitch Deck Generator',
    'legal': 'Legal Resources'
  };

  return (
    <header className="bg-white border-b border-neutral-100 shadow-sm">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            {/* Mobile menu button */}
            <button 
              onClick={() => setIsSidebarOpen(true)} 
              type="button" 
              className="sm:hidden p-2 text-neutral-400 hover:text-neutral-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            
            {/* Page title */}
            <h1 className="text-xl font-semibold text-neutral-800 ml-2 sm:ml-0">
              {tabTitles[currentTab]}
            </h1>
          </div>
          
          {/* Right side icons */}
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" className="text-neutral-400 hover:text-neutral-500">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-neutral-400 hover:text-neutral-500">
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
