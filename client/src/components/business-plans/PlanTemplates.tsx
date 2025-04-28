import React from "react";
import { useNavigate } from "react-router-dom";

const PlanTemplates = () => {
  const navigate = useNavigate();

  const templates = [
    {
      name: "Food Business Plan",
      path: "/business-plans/food",
      description: "Focus on menu development, sourcing, and health regulations.",
    },
    {
      name: "Social Media Management Agency Plan",
      path: "/business-plans/smm",
      description: "Highlight your strategies for managing social media accounts effectively.",
    },
    {
      name: "Business Consulting Agency Plan",
      path: "/business-plans/consulting",
      description: "Detail your consulting services, target industries, and client acquisition strategies.",
    },
    {
      name: "Custom Business Plan",
      path: "/business-plans/custom",
      description: "Create a fully customizable business plan tailored to your needs.",
    },
  ];

  return (
    <div>
      <h1>Choose a Business Plan Template</h1>
      <ul>
        {templates.map((template) => (
          <li key={template.name} className="mb-4">
            <button
              onClick={() => navigate(template.path)}
              className="text-primary-600 hover:underline"
            >
              {template.name}
            </button>
            <p className="text-sm text-neutral-500">{template.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PlanTemplates;
