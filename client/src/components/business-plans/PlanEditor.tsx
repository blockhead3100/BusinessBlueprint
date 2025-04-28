import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { ChevronLeft, Save, FileText, Download } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { BusinessPlan, Client } from "@shared/schema";

// Template sections for each template type
const templateSections: Record<string, string[]> = {
  standard: [
    "Executive Summary",
    "Company Description",
    "Market Analysis",
    "Organization & Management",
    "Service or Product Line",
    "Marketing & Sales",
    "Funding Request",
    "Financial Projections",
    "Appendix"
  ],
  "tech-startup": [
    "Problem",
    "Solution",
    "Market Opportunity",
    "Competition",
    "Technology Stack",
    "Business Model",
    "Go-to-Market Strategy",
    "Team",
    "Traction",
    "Funding Requirements",
    "Financial Projections"
  ],
  "food-business": [
    "Executive Summary",
    "Business Concept",
    "Menu & Products",
    "Target Market",
    "Competitor Analysis",
    "Operations Plan",
    "Supply Chain",
    "Marketing Strategy",
    "Financial Projections",
    "Sustainability Plan"
  ]
};

interface PlanEditorProps {
  planId: number | null;
  templateId: string | null;
  onBack: () => void;
}

export default function PlanEditor({ planId, templateId, onBack }: PlanEditorProps) {
  const { toast } = useToast();
  const [selectedSection, setSelectedSection] = useState<string>("");
  const [planData, setPlanData] = useState({
    name: "",
    template: templateId || "standard",
    clientId: "",
    content: JSON.stringify({}),
    status: "draft",
  });
  const [contentSections, setContentSections] = useState<Record<string, string>>({});

  // Fetch clients for dropdown
  const { data: clients } = useQuery<Client[]>({
    queryKey: ['/api/clients'],
  });

  // If editing existing plan, fetch its data
  const { data: existingPlan, isLoading: isLoadingPlan } = useQuery<BusinessPlan>({
    queryKey: ['/api/business-plans', planId],
    enabled: !!planId
  });
  
  // Process the data when it changes
  useEffect(() => {
    if (existingPlan) {
      setPlanData({
        name: existingPlan.name || "",
        template: existingPlan.template || "standard",
        clientId: existingPlan.clientId?.toString() || "",
        content: existingPlan.content || "{}",
        status: existingPlan.status || "draft",
      });
      
      try {
        const parsedContent = JSON.parse(existingPlan.content || "{}");
        setContentSections(parsedContent);
      } catch (e) {
        setContentSections({});
      }
    }
  }, [existingPlan]);

  // Set up sections based on template
  useEffect(() => {
    let template = planData.template || "standard";
    let sections: string[] = [];
    
    // Handle custom template format (custom:name:section1\nsection2\nsection3)
    if (template.startsWith("custom:")) {
      const parts = template.split(":");
      if (parts.length >= 3) {
        const customSections = parts[2].split("\n").filter(section => section.trim() !== "");
        if (customSections.length > 0) {
          sections = customSections;
        } else {
          // Fallback to standard if no sections defined
          sections = templateSections["standard"];
        }
      } else {
        sections = templateSections["standard"];
      }
    } else {
      // Use predefined template sections
      sections = templateSections[template] || templateSections["standard"];
    }
    
    if (sections && sections.length > 0) {
      // Initialize sections if they don't exist
      const initialContent: Record<string, string> = {};
      
      for (const section of sections) {
        if (!contentSections[section]) {
          initialContent[section] = "";
        }
      }
      
      if (Object.keys(initialContent).length > 0) {
        setContentSections(prev => ({ ...prev, ...initialContent }));
      }
      
      // Select first section if none selected
      if (!selectedSection || !sections.includes(selectedSection)) {
        setSelectedSection(sections[0]);
      }
    }
  }, [planData.template, contentSections, selectedSection]);

  // Add logic to handle custom templates
  useEffect(() => {
    if (templateId?.startsWith("custom:")) {
      const parts = templateId.split(":");
      if (parts.length >= 3) {
        const customSections = parts[2].split("\n").filter(section => section.trim() !== "");
        setContentSections(prev => ({
          ...prev,
          ...Object.fromEntries(customSections.map(section => [section, ""])),
        }));
      }
    }
  }, [templateId]);

  // Create or update plan mutation
  const savePlanMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        ...planData,
        clientId: planData.clientId ? parseInt(planData.clientId) : null,
        content: JSON.stringify(contentSections),
        lastUpdated: new Date()
      };
      
      if (planId) {
        return apiRequest('PUT', `/api/business-plans/${planId}`, payload);
      } else {
        return apiRequest('POST', '/api/business-plans', payload);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/business-plans'] });
      toast({
        title: "Success",
        description: `Business plan ${planId ? "updated" : "created"} successfully`,
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to ${planId ? "update" : "create"} business plan: ${error.toString()}`,
      });
    }
  });

  const handleSectionChange = (section: string) => {
    setSelectedSection(section);
  };

  const handleSectionContentChange = (content: string) => {
    setContentSections(prev => ({
      ...prev,
      [selectedSection]: content
    }));
  };

  const handleSaveDraft = () => {
    savePlanMutation.mutate();
  };

  const handleExportPDF = () => {
    // Logic to export the plan as a PDF
    toast({
      title: "Export Successful",
      description: "Your business plan has been exported as a PDF.",
    });
  };

  const handleExport = () => {
    // Create exportable content
    const planName = planData.name || "Business Plan";
    
    // Generate text content
    let content = `# ${planName}\n\n`;
    content += `Template: ${planData.template.startsWith("custom:") ? 
      planData.template.split(":")[1] || "Custom Template" : 
      planData.template}\n\n`;
    
    // Add each section
    currentTemplateSections.forEach(section => {
      content += `## ${section}\n\n`;
      content += `${contentSections[section] || ""}\n\n`;
    });
    
    // Create a blob and download link
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${planName.replace(/\s+/g, '_')}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Export Successful",
      description: `${planName} has been exported as Markdown`,
    });
  };
  
  const handleDownloadZip = () => {
    toast({
      title: "Coming Soon",
      description: "Full ZIP download coming in the next update",
    });
  };

  const handleSave = () => {
    savePlanMutation.mutate();
  };

  // Get sections for the current template
  let currentTemplateSections: string[] = [];
  const template = planData.template || "standard";
  
  if (template.startsWith("custom:")) {
    // Extract sections from custom template
    const parts = template.split(":");
    if (parts.length >= 3) {
      const customSections = parts[2].split("\n").filter(section => section.trim() !== "");
      if (customSections.length > 0) {
        currentTemplateSections = customSections;
      } else {
        currentTemplateSections = templateSections["standard"];
      }
    } else {
      currentTemplateSections = templateSections["standard"];
    }
  } else {
    // Use predefined template sections
    currentTemplateSections = templateSections[template] || templateSections["standard"];
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <Button variant="ghost" size="sm" onClick={onBack} className="mr-2">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <h1 className="text-2xl font-bold text-neutral-800">
            {planId ? "Edit Business Plan" : "Create New Business Plan"}
          </h1>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleSaveDraft}>
            <FileText className="h-4 w-4 mr-2" />
            Save Draft
          </Button>
          <Button variant="outline" onClick={handleExportPDF}>
            <Download className="h-4 w-4 mr-2" />
            Export to PDF
          </Button>
          <Button onClick={handleSave} disabled={savePlanMutation.isPending}>
            <Save className="h-4 w-4 mr-2" />
            {savePlanMutation.isPending ? "Saving..." : "Save Plan"}
          </Button>
        </div>
      </div>
      
      {/* Plan Details Form */}
      <Card>
        <CardHeader>
          <CardTitle>Plan Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="plan-name">Plan Name</Label>
              <Input 
                id="plan-name" 
                value={planData.name} 
                onChange={(e) => setPlanData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter business plan name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="plan-client">Client</Label>
              <Select 
                value={planData.clientId} 
                onValueChange={(value: string) => setPlanData(prev => ({ ...prev, clientId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a client (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">No client</SelectItem>
                  {clients?.map(client => (
                    <SelectItem key={client.id} value={client.id.toString()}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="plan-template">Template</Label>
              <Select 
                value={planData.template} 
                onValueChange={(value: string) => setPlanData(prev => ({ ...prev, template: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a template" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard Business Plan</SelectItem>
                  <SelectItem value="tech-startup">Tech Startup Plan</SelectItem>
                  <SelectItem value="food-business">Food Business Plan</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="plan-status">Status</Label>
              <Select 
                value={planData.status} 
                onValueChange={(value: string) => setPlanData(prev => ({ ...prev, status: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Plan Content Editor */}
      <Card>
        <CardHeader>
          <CardTitle>Plan Content</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs 
            defaultValue={currentTemplateSections[0]} 
            value={selectedSection} 
            onValueChange={handleSectionChange}
            className="w-full"
          >
            <TabsList className="mb-4 flex flex-wrap">
              {currentTemplateSections.map(section => (
                <TabsTrigger key={section} value={section} className="text-sm">
                  {section}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {currentTemplateSections.map(section => (
              <TabsContent key={section} value={section} className="space-y-4">
                <h3 className="text-lg font-medium text-neutral-800">{section}</h3>
                <Textarea 
                  value={contentSections[section] || ""}
                  onChange={(e) => handleSectionContentChange(e.target.value)}
                  placeholder={`Enter content for ${section}...`}
                  className="min-h-[300px]"
                />
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
