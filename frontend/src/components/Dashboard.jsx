import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetch('http://127.0.0.1:8000/api/dashboard/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            credentials: 'include',
        })
        .then(response => {
            if (response.status === 401) {
                // Redirect to login if not authenticated
                navigate('/signin');
                return null;
            } else if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data) setDashboardData(data);
        })
        .catch(error => console.error('Error fetching dashboard data:', error));
    }, [navigate]);

    if (!dashboardData) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>Welcome, {dashboardData.user.username}</h1>
            {dashboardData.campaigns.map(campaign => (
                <div key={campaign.id}>
                    <h2>{campaign.title}</h2>
                    <p>{campaign.description}</p>
                    <h3>NPCs</h3>
                    <ul>
                        {campaign.npcs.map(npc => (
                            <li key={npc.id}>{npc.name}: {npc.description}</li>
                        ))}
                    </ul>
                    <h3>Quests</h3>
                    <ul>
                        {campaign.quests.map(quest => (
                            <li key={quest.id}>
                                {quest.title} - {quest.completed ? 'Completed' : 'In Progress'}
                            </li>
                        ))}
                    </ul>
                    <h3>Encounters</h3>
                    <ul>
                        {campaign.encounters.map(encounter => (
                            <li key={encounter.id}>
                                {encounter.name} - {encounter.is_completed ? 'Completed' : 'Pending'}
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
};

export default Dashboard;