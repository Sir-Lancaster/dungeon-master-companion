import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function CreateOrEditQuest({ isEditing = false }) {
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
        // Fetch the existing quest data if editing
        if (isEditing && questId) {
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
        } else {
            setIsLoading(false); // If not editing, stop loading immediately
        }
    }, [isEditing, questId, campaignId]); // Dependency array for useEffect

    const handleSubmit = async (e) => {
        e.preventDefault();
        const csrfToken = getCSRFToken(); // Get the CSRF token

        const url = isEditing
            ? `http://127.0.0.1:8000/api/campaigns/${campaignId}/quests/update/${questId}/`
            : `http://127.0.0.1:8000/api/campaigns/${campaignId}/quests/create_quest/`;
        const method = isEditing ? 'PUT' : 'POST';
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken, // Include the CSRF token in the headers
            },
            credentials: 'include', // Include cookies for authentication
            body: JSON.stringify(quest), // Send the quest data as JSON
        });
        if (response.ok) {
            const data = await response.json();
            setMessage('Quest saved successfully!');
            navigate(`/campaigns/${campaignId}/quests/`); // Redirect to the quests page
        } else {
            const errorData = await response.json();
            setMessage(`Failed to save quest: ${errorData.detail}`);
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

    return (
        <div>
            <h1>{isEditing ? 'Edit Quest' : 'Create Quest'}</h1>
            {error && <p>Error: {error}</p>}
            {message && <p>{message}</p>}
            {isLoading ? (
                <p>Loading...</p>
            ) : (
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Title:</label>
                        <input
                            type="text"
                            id="title"
                            value={quest.title}
                            onChange={(e) => setQuest({ ...quest, name: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <label>Description:</label>
                        <textarea
                            id="description"
                            value={quest.description}
                            onChange={(e) => setQuest({ ...quest, description: e.target.value })}
                            required
                        ></textarea>
                    </div>
                    <div>
                        <label>Is Completed:</label>
                        <input
                            type="checkbox"
                            id="is_completed"
                            checked={quest.completed} // Use 'completed' instead of 'is_completed'
                            onChange={(e) => setQuest({ ...quest, completed: e.target.checked })} // Update key to 'completed'
                        />
                    </div>
                    <button type="submit">{isEditing ? 'Update Quest' : 'Create Quest'}</button>
                </form>
            )}
        </div>
    );
}

export default CreateOrEditQuest;