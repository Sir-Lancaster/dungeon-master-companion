import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function Quest() {
    const { campaignId, questId } = useParams(); // Get the campaign ID and quest ID from the URL
    const navigate = useNavigate();
    const [quest, setQuest] = useState({
        name: '',
        description: '',
        is_completed: false,
        created_at: '',
    });
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Fetch the quest details
        fetch(`http://127.0.0.1:8000/api/campaigns/${campaignId}/quests/${questId}/`, {
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
                    throw new Error('Failed to fetch quest details');
                }
            })
            .then((data) => {
                setQuest(data);
                setIsLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setIsLoading(false);
            });
    }
    , [questId, campaignId]); // Dependency array for useEffect
    const handleDelete = async () => {
        const csrfToken = getCSRFToken(); // Get the CSRF token

        const confirmed = window.confirm('Are you sure you want to delete this quest?');
        if (!confirmed) return;

        const response = await fetch(`http://127.0.0.1:8000/api/campaigns/${campaignId}/quests/delete/${questId}/`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken, // Include the CSRF token in the headers
            },
            credentials: 'include', // Include cookies for authentication
        });
        if (response.ok) {
            alert('Quest deleted successfully!');
            navigate(`/campaigns/${campaignId}/quests`); // Redirect to the quests page after deletion
        } else {
            alert('Failed to delete quest');
        }
    }
    const getCSRFToken = () => {
        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
            const [name, value] = cookie.trim().split('=');
            if (name === 'csrftoken') {
                return value;
            }
        }
        return null; // Return null if CSRF token is not found
    };
    return (
        <div>
            {isLoading ? (
                <p>Loading...</p>
            ) : (
                <div>
                    <h1>{quest.name}</h1>
                    <p>{quest.description}</p>
                    <p>Status: {quest.is_completed ? 'Completed' : 'Not Completed'}</p>
                    <p>Created At: {new Date(quest.created_at).toLocaleString()}</p>
                    <button onClick={() => navigate(`/campaigns/${campaignId}/quests/edit/${questId}`)}>Edit Quest</button>
                    <button onClick={handleDelete}>Delete Quest</button>
                    <button onClick={() => navigate(`/campaigns/${campaignId}/quests`)}>Back to Quests</button>
                </div>
            )}
            {error && <p>Error: {error}</p>}
            {message && <p>{message}</p>}
        </div>
    );
}
export default Quest;