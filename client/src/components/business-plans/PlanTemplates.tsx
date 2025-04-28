import React from "react";
import { useNavigate } from "react-router-dom";

const PlanTemplates = () => {
  const navigate = useNavigate();

  const templates = [
    { name: "Food Business Plan", path: "/business-plans/food" },
    { name: "Social Media Management Agency Plan", path: "/business-plans/smm" },
    { name: "Business Consulting Agency Plan", path: "/business-plans/consulting" },
    { name: "Custom Business Plan", path: "/business-plans/custom" },
  ];

  return (
    <div>
      <h1>Choose a Business Plan Template</h1>
      <ul>
        {templates.map((template) => (
          <li key={template.name}>
            <button onClick={() => navigate(template.path)}>{template.name}</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PlanTemplates;
