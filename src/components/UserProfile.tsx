import React, { useEffect, useState } from 'react';

interface UserProfileProps {
    userId: string;
}

// Define the User type
type User = {
    name: string;
    email: string;
    // Add other properties as needed
};

const UserProfile: React.FC<UserProfileProps> = ({ userId }) => {
    const [userDetails, setUserDetails] = useState<User | null>(null);

    useEffect(() => {
        async function fetchUserDetails() {
            const details = await loadUserDetails(userId);
            setUserDetails(details);
        }

        fetchUserDetails();
    }, [userId]);

    if (!userDetails) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>{userDetails.name}</h1>
            <p>{userDetails.email}</p>
            {/* Add more user details as needed */}
        </div>
    );
};

async function loadUserDetails(userId: string): Promise<User | null> {
    try {
        // Fetch user details from the API
        const response = await fetch(`/api/users/${userId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch user details');
        }
        const userDetails: User = await response.json();
        return userDetails;
    } catch (error) {
        console.error('Error loading user details:', error);
        return null;
    }
}

export default UserProfile;