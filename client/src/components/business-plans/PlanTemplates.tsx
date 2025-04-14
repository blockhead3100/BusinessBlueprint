import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PlanTemplate } from "@/lib/types";
import { FileText, Briefcase, DollarSign } from "lucide-react";

interface PlanTemplatesProps {
  onSelect: (templateId: string) => void;
}

export default function PlanTemplates({ onSelect }: PlanTemplatesProps) {
  const templates: PlanTemplate[] = [
    {
      id: "standard",
      name: "Standard Business Plan",
      description: "A comprehensive business plan suitable for most businesses",
      icon: <FileText className="h-16 w-16 text-neutral-400" />
    },
    {
      id: "startup",
      name: "Startup Plan",
      description: "Focused on innovation, growth projections and market fit",
      icon: <Briefcase className="h-16 w-16 text-neutral-400" />
    },
    {
      id: "financial",
      name: "Financial Focus",
      description: "Emphasizes financial projections and investment needs",
      icon: <DollarSign className="h-16 w-16 text-neutral-400" />
    }
  ];

  return (
    <Card className="border border-neutral-100 shadow-sm">
      <CardHeader className="px-6 py-4 border-b border-neutral-100">
        <CardTitle className="text-lg font-medium text-neutral-800">Choose a Template</CardTitle>
        <CardDescription>Select a template below to get started quickly</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {templates.map((template) => (
            <div 
              key={template.id}
              className="border border-neutral-200 rounded-lg p-4 cursor-pointer hover:border-primary-500 transition duration-150 ease-in-out"
              onClick={() => onSelect(template.id)}
            >
              <div className="h-40 rounded-md bg-neutral-50 flex items-center justify-center mb-4">
                {template.icon}
              </div>
              <h3 className="text-md font-medium text-neutral-800">{template.name}</h3>
              <p className="text-sm text-neutral-500 mt-1">{template.description}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
