import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetch('http://127.0.0.1:8000/api/dashboard/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
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

    const handleLogout = () => {
        const getCSRFToken = () => {
            const cookies = document.cookie.split(';');
            for (let cookie of cookies) {
                const [name, value] = cookie.trim().split('=');
                if (name === 'csrftoken') {
                    return value;
                }
            }
            return null;
        };

        const csrfToken = getCSRFToken();

        fetch('http://127.0.0.1:8000/api/logout/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken, // Include CSRF token in the headers
            },
            credentials: 'include',
        })
        .then(response => {
            if (response.ok) {
                localStorage.removeItem('token'); // Clear token from localStorage
                navigate('/signin'); // Redirect to sign-in page
            } else {
                console.error('Error logging out:', response.statusText);
            }
        })
        .catch(error => console.error('Error logging out:', error));
    };

    if (!dashboardData) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>Welcome, {dashboardData.user.username}</h1>
            <button onClick={handleLogout}>Logout</button>
            <button onClick={() => navigate('/create-campaign')}>New Campaign</button> 
            {dashboardData.campaigns.map(campaign => (
                <div key={campaign.id}>
                    <h2 
                        onClick={() => navigate(`/campaigns/${campaign.id}`)} 
                        style={{ cursor: 'pointer', textDecoration: 'underline' }}
                    >
                        {campaign.title}
                    </h2>
                    <p>{campaign.description}</p>
                </div>
            ))}
        </div>
    );
};

export default Dashboard;