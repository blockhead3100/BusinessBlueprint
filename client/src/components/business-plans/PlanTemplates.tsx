import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PlanTemplate } from "@/lib/types";
import { FileText, Briefcase, DollarSign, PenTool } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface PlanTemplatesProps {
  onSelect: (templateId: string) => void;
}

interface BusinessInfo {
  id: string;
  name: string;
  ownerName: string;
  industry: string;
  location: string;
}

interface FinancialData {
  startingCapital: number;
  projectedRevenue: number;
  expenses: { [category: string]: number };
  fundingRequest: number;
  collateral?: string;
}

interface MarketAnalysis {
  targetMarket: string;
  competitorAnalysis: string;
  marketingStrategy: string;
}

interface OperationalPlan {
  companyStructure: string;
  productsOrServices: string;
  productionProcess?: string;
  managementTeam: { name: string; role: string; experience: string }[];
}

interface BusinessPlan {
  executiveSummary: string;
  companyDescription: string;
  productsAndServices: string;
  marketAnalysis: MarketAnalysis;
  managementAndOrganization: string;
  financialProjections: FinancialData;
  fundingRequest: string;
  operationalPlan: OperationalPlan;
  attachments?: string[];
  sections: string[];
}

interface LoanApplication {
  businessInfo: BusinessInfo;
  businessPlan: BusinessPlan;
  status: "Draft" | "Submitted" | "Approved" | "Rejected";
  submissionDate?: Date;
  notes?: string;
}

interface AppData {
  businesses: { [businessId: string]: LoanApplication };
}

export default function PlanTemplates({ onSelect }: PlanTemplatesProps) {
  const [appData, setAppData] = useState<AppData>({ businesses: {} });
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [customTemplate, setCustomTemplate] = useState({
    name: "",
    description: "",
    sections: "",
  });

  const templates: PlanTemplate[] = [
    {
      id: "standard",
      name: "Standard Business Plan",
      description: "A comprehensive business plan suitable for most businesses",
      icon: <FileText className="h-16 w-16 text-neutral-400" />
    },
    {
      id: "tech-startup",
      name: "Tech Startup Plan",
      description: "Focused on technology innovation, growth projections and market fit",
      icon: <Briefcase className="h-16 w-16 text-neutral-400" />
    },
    {
      id: "food-business",
      name: "Food Business Plan",
      description: "Specialized for food industry businesses including restaurants and producers",
      icon: <DollarSign className="h-16 w-16 text-neutral-400" />
    },
    {
      id: "custom",
      name: "Custom Template",
      description: "Create your own custom template with sections tailored to your business needs",
      icon: <PenTool className="h-16 w-16 text-neutral-400" />
    }
  ];

  const handleCustomTemplateClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowCustomForm(true);
  };

  const handleCreateBusinessPlan = (templateId: string) => {
    const businessId = crypto.randomUUID();
    const newBusiness: LoanApplication = {
      businessInfo: {
        id: businessId,
        name: "New Business",
        ownerName: "Owner Name",
        industry: "Industry",
        location: "Location",
      },
      businessPlan: {
        executiveSummary: "",
        companyDescription: "",
        productsAndServices: "",
        marketAnalysis: {
          targetMarket: "",
          competitorAnalysis: "",
          marketingStrategy: "",
        },
        managementAndOrganization: "",
        financialProjections: {
          startingCapital: 0,
          projectedRevenue: 0,
          expenses: {},
          fundingRequest: 0,
        },
        fundingRequest: "",
        operationalPlan: {
          companyStructure: "",
          productsOrServices: "",
          managementTeam: [],
        },
        sections: templateId === "custom" ? customTemplate.sections.split("\n") : ["Executive Summary", "Market Analysis", "Financial Projections"],
      },
      status: "Draft",
    };

    setAppData((prev) => ({
      ...prev,
      businesses: {
        ...prev.businesses,
        [businessId]: newBusiness,
      },
    }));

    onSelect(businessId);
  };

  return (
    <>
      <Card className="border border-neutral-100 shadow-sm">
        <CardHeader className="px-6 py-4 border-b border-neutral-100">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-lg font-medium text-neutral-800">Choose a Template</CardTitle>
              <CardDescription>Select a template below to get started quickly</CardDescription>
            </div>
            <Button 
              variant="outline" 
              onClick={() => setShowCustomForm(true)}
              className="border-primary-500 text-primary-600 hover:bg-primary-50"
            >
              Create Template
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {templates.map((template) => (
              <div 
                key={template.id}
                className="border border-neutral-200 rounded-lg p-4 cursor-pointer hover:border-primary-500 hover:shadow-sm transition duration-150 ease-in-out"
                onClick={() => handleCreateBusinessPlan(template.id)}
              >
                <div className={`h-40 rounded-md ${
                  template.id === "tech-startup" ? "bg-blue-50" : 
                  template.id === "food-business" ? "bg-green-50" : 
                  template.id === "custom" ? "bg-purple-50" :
                  "bg-neutral-50"
                } flex items-center justify-center mb-4`}>
                  {template.icon}
                </div>
                <h3 className="text-md font-medium text-neutral-800">{template.name}</h3>
                <p className="text-sm text-neutral-500 mt-1">{template.description}</p>
                <button 
                  className="w-full mt-3 px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-md hover:bg-primary-700 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation(); 
                    handleCreateBusinessPlan(template.id);
                  }}
                >
                  {template.id === "custom" ? "Create Custom" : "Use This Template"}
                </button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={showCustomForm} onOpenChange={setShowCustomForm}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Create Custom Template</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="template-name">Template Name</Label>
              <Input
                id="template-name"
                value={customTemplate.name}
                onChange={(e) => setCustomTemplate({...customTemplate, name: e.target.value})}
                placeholder="E.g., Retail Business Plan"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="template-description">Description</Label>
              <Input
                id="template-description"
                value={customTemplate.description}
                onChange={(e) => setCustomTemplate({...customTemplate, description: e.target.value})}
                placeholder="A brief description of your template"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="template-sections">
                Sections (one per line)
              </Label>
              <Textarea
                id="template-sections"
                value={customTemplate.sections}
                onChange={(e) => setCustomTemplate({...customTemplate, sections: e.target.value})}
                placeholder="Executive Summary&#10;Company Overview&#10;Market Analysis&#10;..."
                className="min-h-[150px]"
              />
              <p className="text-xs text-neutral-500">Enter each section name on a new line</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCustomForm(false)}>Cancel</Button>
            <Button 
                type="submit" 
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 mt-4 relative z-50"
                style={{ display: 'block' }}
              >
                Save
              </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
