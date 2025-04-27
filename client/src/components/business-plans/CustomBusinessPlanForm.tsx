import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { BusinessPlanType } from './types';

interface CustomBusinessPlanFormProps {
    businessPlan: BusinessPlanType;
    onSave: (updatedData: BusinessPlanType) => void;
    planId: number;
}

const CustomBusinessPlanForm: React.FC<CustomBusinessPlanFormProps> = ({ businessPlan, onSave, planId }) => {
    const [formData, setFormData] = useState<BusinessPlanType>(businessPlan);
    const [customFields, setCustomFields] = useState<{ label: string; value: string }[]>([]);
    const [newFieldLabel, setNewFieldLabel] = useState('');

    const handleChange = (section: keyof BusinessPlanType, field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData((prev: BusinessPlanType) => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: e.target.value,
            },
        }));
    };

    const handleCustomFieldChange = (index: number, value: string) => {
        const updatedFields = [...customFields];
        updatedFields[index].value = value;
        setCustomFields(updatedFields);

        setFormData((prev: BusinessPlanType) => ({
            ...prev,
            customData: updatedFields.reduce((acc, field, i) => {
                acc[`customField${i}`] = field.value;
                return acc;
            }, {} as Record<string, string>),
        }));
    };

    const handleAddCustomField = () => {
        if (newFieldLabel.trim() && !customFields.some(field => field.label === newFieldLabel.trim())) {
            setCustomFields([...customFields, { label: newFieldLabel.trim(), value: '' }]);
            setNewFieldLabel('');
        }
    };

    const handleRemoveCustomField = (index: number) => {
        const updatedFields = customFields.filter((_, i) => i !== index);
        setCustomFields(updatedFields);

        setFormData((prev: BusinessPlanType) => {
            const newCustomData = { ...prev.customData };
            delete newCustomData[`customField${index}`];
            return { ...prev, customData: newCustomData };
        });
    };

    const handleSave = () => {
        onSave(formData);
    };

    return (
        <div className="space-y-6 p-6 bg-card rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-foreground">Custom Business Plan Form</h2>
            {/* ...existing code for form sections... */}
            <Button onClick={handleSave} className="mt-6">Save</Button>
        </div>
    );
};

export default CustomBusinessPlanForm;
