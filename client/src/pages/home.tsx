import { useState } from 'react';
import { useLocation } from 'wouter';
import { Tab } from '@/lib/types';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import Dashboard from '@/components/dashboard/Dashboard';
import BusinessPlans from '@/components/business-plans/BusinessPlans';
import Expenses from '@/components/expenses/Expenses';
import Clients from '@/components/clients/Clients';
import Forecasting from '@/components/forecasting/Forecasting';
import MarketAnalysis from '@/components/market-analysis/MarketAnalysis';
import PitchDeck from '@/components/pitch-deck/PitchDeck';
import LegalResources from '@/components/legal/LegalResources';

export default function Home() {
  const [location] = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const currentTab = location === '/' ? 'dashboard' : location.slice(1) as Tab;
  
  return (
    <div className="h-screen flex overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header setIsSidebarOpen={setIsSidebarOpen} />
        
        <main className="flex-1 overflow-y-auto bg-neutral-50 p-4 sm:p-6">
          {currentTab === 'dashboard' && <Dashboard />}
          {currentTab === 'business-plans' && <BusinessPlans />}
          {currentTab === 'expenses' && <Expenses />}
          {currentTab === 'clients' && <Clients />}
          {currentTab === 'forecasting' && <Forecasting />}
          {currentTab === 'market-analysis' && <MarketAnalysis />}
          {currentTab === 'pitch-deck' && <PitchDeck />}
          {currentTab === 'legal' && <LegalResources />}
        </main>
      </div>
    </div>
  );
}
