import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardContent,
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  Label,
  Input,
  Textarea,
} from "@radix-ui/themes"; // Assuming Radix UI

const PlanTemplates = () => {
  const navigate = useNavigate();
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [customTemplate, setCustomTemplate] = useState({
    name: "",
    description: "",
    sections: [],
  });
  const [savedTemplates, setSavedTemplates] = useState([]);
  const [saveConfirmation, setSaveConfirmation] = useState("");
  const [expandedTemplateId, setExpandedTemplateId] = useState(null);

  useEffect(() => {
    const storedTemplates = localStorage.getItem("customTemplates");
    if (storedTemplates) {
      setSavedTemplates(JSON.parse(storedTemplates));
    }
  }, []);

  useEffect(() => {
    if (saveConfirmation) {
      const timer = setTimeout(() => {
        setSaveConfirmation("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [saveConfirmation]);

  const saveTemplatesToLocalStorage = (templatesToSave) => {
    localStorage.setItem("customTemplates", JSON.stringify(templatesToSave));
  };

  const templates = [
    {
      id: "food-business",
      name: "Food Business Plan",
      path: "/business-plans/food",
      description: "Focus on menu development, sourcing, and health regulations.",
    },
    {
      id: "smm-agency",
      name: "Social Media Management Agency Plan",
      path: "/business-plans/smm",
      description: "Highlight your strategies for managing social media accounts effectively.",
    },
    {
      id: "consulting-agency",
      name: "Business Consulting Agency Plan",
      path: "/business-plans/consulting",
      description: "Detail your consulting services, target industries, and client acquisition strategies.",
    },
    {
      id: "custom-template", // Changed ID to avoid conflict with the 'custom' action
      name: "Custom Business Plan",
      path: "/business-plans/custom",
      description: "Create a fully customizable business plan tailored to your needs.",
    },
  ];

  const handleCreateBusinessPlan = (templateId) => {
    if (templateId === "custom-template") { // Updated check
      setShowCustomForm(true);
    } else {
      const selectedTemplate = templates.find((template) => template.id === templateId);
      if (selectedTemplate && selectedTemplate.path) {
        navigate(selectedTemplate.path);
      } else {
        console.error("Template path not found for:", templateId);
      }
    }
  };

  const handleSaveCustomTemplate = () => {
    const newTemplate = {
      id: `custom-${Date.now()}`,
      name: customTemplate.name,
      description: customTemplate.description,
      sections: customTemplate.sections,
      isCustom: true,
    };

    const updatedTemplates = [...savedTemplates, newTemplate];
    setSavedTemplates(updatedTemplates);
    saveTemplatesToLocalStorage(updatedTemplates);
    setSaveConfirmation(`Custom template "${newTemplate.name}" saved!`);
    setShowCustomForm(false);
    setCustomTemplate({ name: "", description: "", sections: [] });
  };

  const toggleTemplateDetails = (templateId) => {
    setExpandedTemplateId((prevId) => (prevId === templateId ? null : templateId));
  };

  const useTemplate = (templateId, isCustom = false, customTemplateData = null) => {
    navigate(`/use-template/${templateId}`, { state: { isCustom, customTemplateData } });
  };

  return (
    <div>
      <h1>Choose a Business Plan Template</h1>
      <ul>
        {templates
          .slice(0, 4)
          .map((template) => (
            <li key={template.name} className="mb-4">
              <button
                onClick={() => navigate(template.path)} // Keep existing navigation for the initial list
                className="text-primary-600 hover:underline"
              >
                {template.name}
              </button>
              <p className="text-sm text-neutral-500">{template.description}</p>
            </li>
          ))}
      </ul>
      <Card>
        <CardHeader>
          <Button onClick={() => handleCreateBusinessPlan("custom-template")}>
            Create Template
          </Button>
        </CardHeader>
        <CardContent className="p-6">
          {saveConfirmation && (
            <div className="text-green-500 mb-4">{saveConfirmation}</div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {templates.map((template) => (
              <div
                key={template.id}
                className="border border-neutral-200 rounded-lg p-4 cursor-pointer hover:border-primary-500 hover:shadow-sm transition duration-150 ease-in-out"
                onClick={() => handleCreateBusinessPlan(template.id)}
              >
                <div
                  className={`h-40 rounded-md ${
                    template.id === "tech-startup"
                      ? "bg-blue-50"
                      : template.id === "food-business"
                      ? "bg-green-50"
                      : template.id === "custom-template" // Updated check
                      ? "bg-purple-50"
                      : "bg-neutral-50"
                  } flex items-center justify-center mb-4`}
                >
                  {template.icon}
                </div>
                <h3 className="text-md font-medium text-neutral-800">
                  {template.name}
                </h3>
                <p className="text-sm text-neutral-500 mt-1">
                  {template.description}
                </p>
                <button
                  className="w-full mt-3 px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-md hover:bg-primary-700 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    useTemplate(template.id); // Use template on button click
                  }}
                >
                  {template.id === "custom-template" ? "Create Custom" : "Use This Template"}
                </button>
              </div>
            ))}
            {savedTemplates.map((template) => (
              <div
                key={template.id}
                className="border border-neutral-200 rounded-lg p-4 cursor-pointer hover:border-primary-500 hover:shadow-sm transition duration-150 ease-in-out"
                onClick={() => useTemplate(template.id, true, template)} // Use template on card click
              >
                <div className={`h-40 rounded-md bg-yellow-50 flex items-center justify-center mb-4`}>
                  ⭐
                </div>
                <h3 className="text-md font-medium text-neutral-800">
                  {template.name} (Custom)
                </h3>
                <p className="text-sm text-neutral-500 mt-1">
                  {template.description}
                </p>
                {expandedTemplateId === template.id && (
                  <div className="mt-2">
                    <p className="text-sm text-neutral-600">{template.description}</p>
                    {template.sections && template.sections.length > 0 && (
                      <ul className="list-disc pl-5 mt-2 text-sm text-neutral-600">
                        {template.sections.map((section, index) => (
                          <li key={index}>{section}</li>
                        ))}
                      </ul>
                    )}
                    {template.sections && template.sections.length === 0 && (
                      <p className="text-sm text-neutral-600">No sections defined.</p>
                    )}
                  </div>
                )}
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
                onChange={(e) =>
                  setCustomTemplate({ ...customTemplate, name: e.target.value })
                }
                placeholder="E.g., Retail Business Plan"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="template-description">Description</Label>
              <Input
                id="template-description"
                value={customTemplate.description}
                onChange={(e) =>
                  setCustomTemplate({
                    ...customTemplate,
                    description: e.target.value,
                  })
                }
                placeholder="A brief description of your template"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="template-sections">Sections (one per line)</Label>
              <Textarea
                id="template-sections"
                value={customTemplate.sections.join("\n")}
                onChange={(e) =>
                  setCustomTemplate({
                    ...customTemplate,
                    sections: e.target.value.split("\n"),
                  })
                }
                placeholder="Executive Summary&#10;Company Overview&#10;Market Analysis&#10;..."
                className="min-h-[150px]"
              />
              <p className="text-xs text-neutral-500">
                Enter each section name on a new line
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCustomForm(false)}>
              Cancel
            </Button>
            <Button
              type="button"
              className="bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 mt-4 relative z-50"
              onClick={handleSaveCustomTemplate}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PlanTemplates;