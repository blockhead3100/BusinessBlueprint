import React from 'react';
import { render, screen } from '@testing-library/react';
import UserProfile from '../src/components/UserProfile';

test('should render user details correctly', () => {
    const mockUser = {
        name: 'John Doe',
        email: 'john.doe@example.com',
    };
    render(<UserProfile user={mockUser} />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john.doe@example.com')).toBeInTheDocument();
});