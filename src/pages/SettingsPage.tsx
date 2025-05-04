import React, { useState } from 'react';

// Define the type for formData
type FormData = {
    username: string;
    email: string;
};

const SettingsPage = () => {
    const [formData, setFormData] = useState<FormData>({ username: '', email: '' });
    const [formErrors, setFormErrors] = useState<{ username?: string; email?: string }>({});

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    function validateForm(data: FormData) {
        const errors: { username?: string; email?: string } = {};
        if (!data.username || data.username.trim() === '') {
            errors.username = 'Username is required';
        }
        if (!data.email || !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(data.email)) {
            errors.email = 'Valid email is required';
        }
        return errors;
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        const errors = validateForm(formData);
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }
        // Proceed with form submission
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Username:</label>
                <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Enter your username"
                />
                {formErrors.username && <span>{formErrors.username}</span>}
            </div>
            <div>
                <label>Email:</label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    title="Email"
                />
                {formErrors.email && <span>{formErrors.email}</span>}
            </div>
            <button 
              type="submit" 
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 mt-4 relative z-50"
              style={{ display: 'block' }}
            >
              Save
            </button>
        </form>
    );
};

export default SettingsPage;