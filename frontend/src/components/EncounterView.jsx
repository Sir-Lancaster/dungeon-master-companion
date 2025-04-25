import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function Encounter() {
    const { campaignId, encounterId } = useParams(); // Get the campaign ID and encounter ID from the URL
    const navigate = useNavigate();
    const [campaign, setCampaign] = useState(null); // State for campaign details
    const [encounter, setEncounter] = useState({
        name: '',
        description: '',
        is_completed: false,
        created_at: '',
    });
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Fetch the encounter details
        fetch(`http://127.0.0.1:8000/api/campaigns/${campaignId}/encounters/${encounterId}/`, {
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
                    throw new Error('Failed to fetch encounter details');
                }
            })
            .then((data) => {
                setEncounter(data);
                setIsLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setIsLoading(false);
            });
    }, [encounterId, campaignId]); // Dependency array for useEffect

    const getCSRFToken = () => {
        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
            const [name, value] = cookie.trim().split('=');
            if (name === 'csrftoken') {
                return decodeURIComponent(value);
            }
        }
        return null;
    };

    const handleDelete = async () => {
        const csrfToken = getCSRFToken(); // Get the CSRF token

        const confirmed = window.confirm('Are you sure you want to delete this encounter?');
        if (!confirmed) return;

        const response = await fetch(`http://127.0.0.1:8000/api/campaigns/${campaignId}/encounters/delete/${encounterId}/`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken, // Include the CSRF token in the headers
            },
            credentials: 'include', // Include cookies for authentication
        });
        if (response.ok) {
            alert('Encounter deleted successfully!');
            navigate(`/campaigns/${campaignId}/encounters/`); // Redirect to the encounters list after deletion
        } else {
            alert('Failed to delete encounter');
        }
    };

    return (
        <div>
            {error && <p>{error}</p>}
            {isLoading ? (
                <p>Loading...</p>
            ) : (
                <div>
                    <h1>{encounter.name}</h1>
                    <p>{encounter.description}</p>
                    <p>Status: {encounter.is_completed ? 'Completed' : 'Not Completed'}</p>
                    <button onClick={() => navigate(`/campaigns/${campaignId}/encounters/edit/${encounterId}/`)}>Edit Encounter</button>
                    <button onClick={handleDelete}>Delete Encounter</button>
                    <button onClick={() => navigate(`/campaigns/${campaignId}/encounters/`)}>Back to Encounters</button>
                </div>
            )}
        </div>
    );
}

export default Encounter;