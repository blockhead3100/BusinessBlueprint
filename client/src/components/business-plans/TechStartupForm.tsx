import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { BusinessPlanType } from './types'; // Ensure this path is correct

const TechStartupForm: React.FC<{ businessPlan: BusinessPlanType; onSave: (updatedData: BusinessPlanType) => void; planId: number }> = ({ businessPlan, onSave, planId }) => {
    const [formData, setFormData] = useState<BusinessPlanType>(businessPlan);

    const handleChange = (section: keyof BusinessPlanType, field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData((prev: BusinessPlanType) => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: e.target.value,
            },
        }));
    };

    const handleSave = () => {
        onSave(formData);
    };

    return (
        <div className="space-y-6 p-6 bg-card rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-foreground">Tech Startup Business Plan Form</h2>
            {/* ...existing code for form sections... */}
            <Button onClick={handleSave} className="mt-6">Save</Button>
        </div>
    );
};

export default TechStartupForm;
