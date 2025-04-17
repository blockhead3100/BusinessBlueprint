import React, { useState, useEffect } from 'react';

const DashboardPage = () => {
    const [dashboardData, setDashboardData] = useState<{ data: { id: string; name: string }[] } | null>(null);

    useEffect(() => {
        // Simulate fetching data
        const fetchData = async () => {
            const mockData = { data: [{ id: '1', name: 'Item 1' }, { id: '2', name: 'Item 2' }] };
            setDashboardData(mockData);
        };
        fetchData();
    }, []);

    const renderDashboard = () => {
        if (!dashboardData || !dashboardData.data) {
            return <div>No data available</div>;
        }
        return (
            <div>
                {dashboardData.data.map((item) => (
                    <div key={item.id}>{item.name}</div>
                ))}
            </div>
        );
    };

    return <div>{renderDashboard()}</div>;
};

export default DashboardPage;