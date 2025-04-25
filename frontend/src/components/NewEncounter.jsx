import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function CreateOrEditEncounter({ isEditing = false }) {
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
        // Fetch the existing encounter data if editing
        if (isEditing && encounterId) {
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
        } // Correctly close the if block here
    }, [isEditing, encounterId, campaignId]); // Dependency array for useEffect

    const handleSubmit = async (e) => {
        e.preventDefault();
        const csrfToken = getCSRFToken(); // Get the CSRF token

        const url = isEditing
            ? `http://127.0.0.1:8000/api/campaigns/${campaignId}/encounters/update/${encounterId}/`
            : `http://127.0.0.1:8000/api/campaigns/${campaignId}/encounters/create_encounter/`;
        const method = isEditing ? 'PUT' : 'POST';
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken, // Include the CSRF token in the headers
            },
            credentials: 'include', // Include cookies for authentication
            body: JSON.stringify(encounter), // Send the encounter data as JSON
        });
        if (response.ok) {
            const data = await response.json();
            setMessage('Encounter saved successfully!');
            navigate(`/campaigns/${campaignId}/encounters/`); // Redirect to the encounters page
        } else {
            const errorData = await response.json();
            setMessage(`Failed to save encounter: ${errorData.detail}`);
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
    }

    return (
        <div>
            <h1>{isEditing ? 'Edit Encounter' : 'Create Encounter'}</h1>
            {error && <p>Error: {error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name:</label>
                    <input
                        type="text"
                        id="name"
                        value={encounter.name}
                        onChange={(e) => setEncounter({ ...encounter, name: e.target.value })}
                        required
                    />
                </div>
                <div>
                    <label>Description:</label>
                    <textarea
                        id="description"
                        value={encounter.description}
                        onChange={(e) => setEncounter({ ...encounter, description: e.target.value })}
                        required
                    ></textarea>
                </div>
                <div>
                    <label>Is Completed:</label>
                    <input
                        type="checkbox"
                        id="is_completed"
                        checked={encounter.is_completed}
                        onChange={(e) => setEncounter({ ...encounter, is_completed: e.target.checked })}
                    />
                </div>
                <button type="submit">{isEditing ? 'Update Encounter' : 'Create Encounter'}</button>
            </form>
        </div>
    );
}

export default CreateOrEditEncounter;
