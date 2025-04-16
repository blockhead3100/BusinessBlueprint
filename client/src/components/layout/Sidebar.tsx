import { useLocation, Link } from 'wouter';
import { cn } from '@/lib/utils';
import { Tab } from '@/lib/types';
import { useQuery } from '@tanstack/react-query';
import {
  Home,
  FileText,
  DollarSign,
  Users,
  LineChart,
  BarChart2,
  Presentation,
  Scale,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const [location] = useLocation();
  const currentTab = location === '/' ? 'dashboard' : location.slice(1) as Tab;
  
  const { data: user } = useQuery<{ fullName: string, planType: string, avatarUrl?: string }>({
    queryKey: ['/api/user'],
  });

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <Home className="w-5 h-5 mr-3" /> },
    { id: 'business-plans', label: 'Business Plans', icon: <FileText className="w-5 h-5 mr-3" /> },
    { id: 'expenses', label: 'Expenses', icon: <DollarSign className="w-5 h-5 mr-3" /> },
    { id: 'clients', label: 'Clients', icon: <Users className="w-5 h-5 mr-3" /> },
    { id: 'forecasting', label: 'Forecasting', icon: <LineChart className="w-5 h-5 mr-3" /> },
    { id: 'market-analysis', label: 'Market Analysis', icon: <BarChart2 className="w-5 h-5 mr-3" /> },
    { id: 'pitch-deck', label: 'Pitch Deck', icon: <Presentation className="w-5 h-5 mr-3" /> },
    { id: 'legal', label: 'Legal Resources', icon: <Scale className="w-5 h-5 mr-3" /> },
  ];

  return (
    <>
      {/* Mobile sidebar backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-30 bg-neutral-900 sm:hidden flex items-center justify-center"
          onClick={() => setIsOpen(false)}
        >
          <div className="bg-neutral-900 rounded-lg p-4">
            <aside 
              className={cn(
                "w-64 transition duration-300 transform bg-white border-r border-neutral-100 flex flex-col",
                isOpen ? "translate-x-0" : "-translate-x-full"
              )}
              onClick={(e) => e.stopPropagation()} // Prevent backdrop from closing on sidebar clicks
            >
              {/* Logo area */}
              <div className="flex items-center justify-between h-16 px-4 border-b border-neutral-100">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-md bg-primary-600 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12z" clipRule="evenodd" />
                      <path d="M10 4a1 1 0 00-1 1v5a1 1 0 002 0V5a1 1 0 00-1-1z" />
                      <path d="M10 12a1 1 0 100 2 1 1 0 000-2z" />
                    </svg>
                  </div>
                  <span className="ml-2 text-lg font-semibold text-neutral-800">BusinessPro</span>
                </div>
                <button 
                  onClick={() => setIsOpen(false)} 
                  className="sm:hidden p-1 text-neutral-400 hover:text-neutral-500"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* Navigation */}
              <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
                {navItems.map((item) => (
                  <Link 
                    key={item.id}
                    href={item.id === 'dashboard' ? '/' : `/${item.id}`}
                    onClick={() => {
                      if (window.innerWidth < 640) setIsOpen(false);
                    }}
                    className={cn(
                      "flex items-center px-4 py-3 text-neutral-600 hover:bg-primary-50 hover:text-primary-600 rounded-md transition-colors duration-200 ease-in-out",
                      currentTab === item.id && "bg-primary-50 text-primary-600 font-medium"
                    )}
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                ))}
              </nav>
              
              {/* Bottom area - User profile */}
              <div className="p-4 border-t border-neutral-100">
                <div className="flex items-center">
                  <Avatar>
                    <AvatarImage src={user?.avatarUrl} />
                    <AvatarFallback className="bg-gradient-to-br from-primary-500 to-primary-600 text-primary-foreground">
                      {user?.fullName?.split(' ').map(n => n[0]).join('') || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-neutral-800">{user?.fullName || 'User'}</p>
                    <p className="text-xs text-neutral-500">{user?.planType || 'Basic Plan'}</p>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 transition duration-300 transform bg-white border-r border-neutral-100 sm:translate-x-0 sm:static sm:h-full flex flex-col",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo area */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-neutral-100">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-md bg-primary-600 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12z" clipRule="evenodd" />
                <path d="M10 4a1 1 0 00-1 1v5a1 1 0 002 0V5a1 1 0 00-1-1z" />
                <path d="M10 12a1 1 0 100 2 1 1 0 000-2z" />
              </svg>
            </div>
            <span className="ml-2 text-lg font-semibold text-neutral-800">BusinessPro</span>
          </div>
          <button 
            onClick={() => setIsOpen(false)} 
            className="sm:hidden p-1 text-neutral-400 hover:text-neutral-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link 
              key={item.id}
              href={item.id === 'dashboard' ? '/' : `/${item.id}`}
              onClick={() => {
                if (window.innerWidth < 640) setIsOpen(false);
              }}
              className={cn(
                "flex items-center px-4 py-3 text-neutral-600 hover:bg-primary-50 hover:text-primary-600 rounded-md transition-colors duration-200 ease-in-out",
                currentTab === item.id && "bg-primary-50 text-primary-600 font-medium"
              )}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>
        
        {/* Bottom area - User profile */}
        <div className="p-4 border-t border-neutral-100">
          <div className="flex items-center">
            <Avatar>
              <AvatarImage src={user?.avatarUrl} />
              <AvatarFallback className="bg-gradient-to-br from-primary-500 to-primary-600 text-primary-foreground">
                {user?.fullName?.split(' ').map(n => n[0]).join('') || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="ml-3">
              <p className="text-sm font-medium text-neutral-800">{user?.fullName || 'User'}</p>
              <p className="text-xs text-neutral-500">{user?.planType || 'Basic Plan'}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
