import { useState } from 'react';
import PlanTemplates from './PlanTemplates';
import PlansList from './PlansList';
import PlanEditor from './PlanEditor';

export default function BusinessPlans() {
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const handleCreateNew = () => {
    setIsCreatingNew(true);
    setSelectedPlanId(null);
  };
  
  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    setIsCreatingNew(true);
  };
  
  const handlePlanSelect = (planId: number) => {
    setSelectedPlanId(planId);
    setIsCreatingNew(false);
  };
  
  const handleBackToList = () => {
    setSelectedPlanId(null);
    setIsCreatingNew(false);
    setSelectedTemplate(null);
  };

  if (isCreatingNew || selectedPlanId !== null) {
    return (
      <PlanEditor 
        planId={selectedPlanId}
        templateId={selectedTemplate}
        onBack={handleBackToList}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Section heading and actions */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0">
        <h1 className="text-2xl font-bold text-neutral-800">Business Plan Creator</h1>
        <div>
          <button 
            onClick={handleCreateNew}
            className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-md shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Create New Plan
          </button>
        </div>
      </div>
      
      <PlanTemplates onSelect={handleTemplateSelect} />
      <PlansList onSelect={handlePlanSelect} />
    </div>
  );
}
