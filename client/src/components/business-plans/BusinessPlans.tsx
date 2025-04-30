import { useState } from 'react';
import PlanTemplates from './PlanTemplates';
import PlansList from './PlansList';
import StandardBusinessPlanForm from './StandardBusinessPlanForm';
import TechStartupForm from './TechStartupForm';
import FoodBusinessForm from './FoodBusinessForm';
import CustomBusinessPlanForm from './CustomBusinessPlanForm';

export default function BusinessPlans() {
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [businessPlan, setBusinessPlan] = useState<any>(null); // Placeholder for the business plan data

  const handleCreateNew = () => {
    setIsCreatingNew(true);
    setSelectedPlanId(null);
  };

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    setIsCreatingNew(true);
    // Initialize a new business plan based on the selected template
    setBusinessPlan({
      businessInfo: { name: '', industry: '', address: '' },
      financialProjections: { revenue: 0, expenses: 0, profit: 0 },
      loanRequest: { amount: 0, purpose: '' },
      ...(templateId === 'tech-startup' && { techAndInnovation: { productDescription: '', uniqueSellingProposition: '' } }),
      ...(templateId === 'food-business' && { menuAndOperations: { menuHighlights: '', seatingCapacity: 0 } }),
      ...(templateId === 'custom' && { customData: {} }),
    });
  };

  const handlePlanSelect = (planId: number) => {
    console.log('Plan selected:', planId); // Debugging log
    setSelectedPlanId(planId);
    setIsCreatingNew(false);
    // Load the selected plan's data (mocked for now)
    setBusinessPlan({
      businessInfo: { name: 'Sample Business', industry: 'Tech', address: '123 Main St' },
      financialProjections: { revenue: 100000, expenses: 50000, profit: 50000 },
      loanRequest: { amount: 20000, purpose: 'Expansion' },
    });
  };

  const handleBackToList = () => {
    setSelectedPlanId(null);
    setIsCreatingNew(false);
    setSelectedTemplate(null);
  };

  const handleSave = (updatedData: any) => {
    console.log('Saved Data:', updatedData);
    // Save logic here
    handleBackToList();
  };

  if (isCreatingNew || selectedPlanId !== null) {
    if (selectedTemplate === 'standard') {
      return (
        <StandardBusinessPlanForm
          businessPlan={businessPlan}
          onSave={handleSave}
          planId={selectedPlanId || 0}
        />
      );
    } else if (selectedTemplate === 'tech-startup') {
      return (
        <TechStartupForm
          businessPlan={businessPlan}
          onSave={handleSave}
          planId={selectedPlanId || 0}
        />
      );
    } else if (selectedTemplate === 'food-business') {
      return (
        <FoodBusinessForm
          businessPlan={businessPlan}
          onSave={handleSave}
          planId={selectedPlanId || 0}
        />
      );
    } else if (selectedTemplate === 'custom') {
      return (
        <CustomBusinessPlanForm
          businessPlan={businessPlan}
          onSave={handleSave}
          planId={selectedPlanId || 0}
        />
      );
    }
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
