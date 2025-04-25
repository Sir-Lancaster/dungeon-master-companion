import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function Campaign() {
    const { campaignId } = useParams(); // Get the campaign ID from the URL
    const navigate = useNavigate();
    const [campaign, setCampaign] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        // Fetch the campaign details
        fetch(`http://127.0.0.1:8000/api/campaigns/${campaignId}/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', // Include cookies for authentication
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Failed to fetch campaign details');
                }
            })
            .then((data) => {
                setCampaign(data);
            })
            .catch((err) => {
                setError(err.message);
            });
    }, [campaignId]);

    const handleDelete = async () => {
        const csrfToken = getCSRFToken(); // Get the CSRF token

        const confirmed = window.confirm('Are you sure you want to delete this campaign?');
        if (!confirmed) return;

        const response = await fetch(`http://127.0.0.1:8000/api/campaigns/delete/${campaignId}/`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken, // Include the CSRF token in the headers
            },
            credentials: 'include', // Include cookies for authentication
        });

        if (response.ok) {
            alert('Campaign deleted successfully!');
            navigate('/'); // Redirect to the dashboard after deletion
        } else {
            alert('Failed to delete campaign');
        }
    };

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

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!campaign) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>{campaign.title}</h1>
            <p>{campaign.description}</p>
            <button onClick={() => navigate('/')}>Back to Dashboard</button>
            <button onClick={() => navigate(`/campaigns/edit/${campaignId}`)}>Edit Campaign</button>
            <button onClick={() => navigate(`/campaigns/${campaignId}/npcs`)}>View NPCs</button>
            <button onClick={() => navigate(`/campaigns/${campaignId}/encounters`)}>View Encounters</button>
            <button onClick={handleDelete} style={{ color: 'red' }}>Delete Campaign</button>
        </div>
    );
}

export default Campaign;
