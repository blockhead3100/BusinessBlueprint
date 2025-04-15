import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { ChevronLeft, Save } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
  const { data: clients } = useQuery<any[]>({
    queryKey: ['/api/clients'],
  });

  // If editing existing plan, fetch its data
  const { data: existingPlan, isLoading: isLoadingPlan } = useQuery({
    queryKey: ['/api/business-plans', planId],
    enabled: !!planId,
    onSuccess: (data) => {
      if (data) {
        setPlanData({
          name: data.name,
          template: data.template,
          clientId: data.clientId?.toString() || "",
          content: data.content,
          status: data.status,
        });
        
        try {
          const parsedContent = JSON.parse(data.content);
          setContentSections(parsedContent);
        } catch (e) {
          setContentSections({});
        }
      }
    }
  });

  // Set up sections based on template
  useEffect(() => {
    const template = planData.template || "standard";
    const sections = templateSections[template];
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
        variant: "destructive"
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

  const handleSave = () => {
    savePlanMutation.mutate();
  };

  const currentTemplateSections = templateSections[planData.template || "standard"];

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
        <Button onClick={handleSave} disabled={savePlanMutation.isPending}>
          <Save className="h-4 w-4 mr-2" />
          {savePlanMutation.isPending ? "Saving..." : "Save Plan"}
        </Button>
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
                onValueChange={(value) => setPlanData(prev => ({ ...prev, clientId: value }))}
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
                onValueChange={(value) => setPlanData(prev => ({ ...prev, template: value }))}
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
                onValueChange={(value) => setPlanData(prev => ({ ...prev, status: value }))}
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
