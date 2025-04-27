import React, { useState, useEffect } from 'react';
import PlanTemplates from './PlanTemplates';
import PlansList from './PlansList';
import PlanEditor from './PlanEditor';
import { useQuery } from "@tanstack/react-query";
import type { BusinessPlan as ApiBusinessPlan } from "@shared/schema"; // Or from '@/lib/types'
import { Button } from "@/components/ui/button"; // Import Button
import { PlusCircle } from 'lucide-react'; // Import an icon

type ViewMode = 'list' | 'templates' | 'editing';

const BusinessPlans = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [editingPlanId, setEditingPlanId] = useState<number | null>(null);
  const [newPlanTemplateId, setNewPlanTemplateId] = useState<string | null>(null);

  const { data: plans, isLoading: isLoadingList, error: listError } = useQuery<ApiBusinessPlan[]>({
    queryKey: ['/api/business-plans'],
  });

  useEffect(() => {
    // Simplified logic: If not editing, default to list unless loading/error
    if (viewMode !== 'editing' && !isLoadingList) {
        setViewMode('list'); // Let PlansList handle empty state display
    }
     // If error, you might want to show an error message instead of the list
  }, [isLoadingList, viewMode, listError]);

  const handleSelectPlan = (planId: number) => {
    setEditingPlanId(planId);
    setNewPlanTemplateId(null);
    setViewMode('editing');
  };

  const handleTemplateSelect = (templateId: string) => {
    setEditingPlanId(null);
    setNewPlanTemplateId(templateId);
    setViewMode('editing');
  };

  const handleReturnToList = () => {
    setEditingPlanId(null);
    setNewPlanTemplateId(null);
    setViewMode('list');
  };

  const handleShowTemplates = () => {
    setViewMode('templates');
  };

  const renderHeader = () => (
     <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-neutral-800">Business Plans</h1>
        {viewMode === 'list' && !isLoadingList && ( // Only show create button on list view when not loading
             <Button onClick={handleShowTemplates}>
                 <PlusCircle className="h-4 w-4 mr-2" />
                 Create New Plan
             </Button>
         )}
     </div>
  );

  const renderCurrentView = () => {
    if (isLoadingList && viewMode === 'list') {
        // Pass loading state to PlansList OR show a general loader here
        // PlansList already has skeleton loading, so maybe just render it
         return <PlansList onSelect={handleSelectPlan} />; // Pass explicit loading prop if needed
    }
     if (listError && viewMode === 'list') {
        return <div>Error loading plans: {listError.message}</div>; // Show error above list
    }

    switch (viewMode) {
      case 'editing':
        return <PlanEditor planId={editingPlanId} templateId={newPlanTemplateId} onBack={handleReturnToList} />;
      case 'templates':
        return <PlanTemplates onSelect={handleTemplateSelect} />;
      case 'list':
      default:
        // Pass the actual plans data to PlansList
        return <PlansList onSelect={handleSelectPlan} />; // Pass loading state
    }
  };

  return (
    <div className="p-6"> {/* Add padding or container */}
      {renderHeader()}
      {renderCurrentView()}
    </div>
  );
};

export default BusinessPlans;
