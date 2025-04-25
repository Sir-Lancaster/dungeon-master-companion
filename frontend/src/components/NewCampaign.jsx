import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function CreateOrEditCampaign({ isEditing = false }) {
    const navigate = useNavigate();
    const { campaignId } = useParams(); // Get campaign ID from URL if editing
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [message, setMessage] = useState('');

    // Fetch existing campaign data if editing
    useEffect(() => {
        if (isEditing && campaignId) {
            fetch(`http://127.0.0.1:8000/api/campaigns/${campaignId}/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            })
                .then((response) => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        throw new Error('Failed to fetch campaign details');
                    }
                })
                .then((data) => {
                    setTitle(data.title);
                    setDescription(data.description);
                })
                .catch((err) => {
                    setMessage(err.message);
                });
        }
    }, [isEditing, campaignId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const csrfToken = getCSRFToken(); // Get the CSRF token

        const url = isEditing
            ? `http://127.0.0.1:8000/api/campaigns/update/${campaignId}/`
            : 'http://127.0.0.1:8000/api/create_campaign/';
        const method = isEditing ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken, // Include the CSRF token in the headers
            },
            credentials: 'include', // Include cookies for authentication
            body: JSON.stringify({ title, description }),
        });

        const data = await response.json();
        if (response.ok) {
            setMessage(isEditing ? 'Campaign updated successfully!' : 'Campaign created successfully!');
            if (isEditing) {
                // Navigate back to the campaign details page after updating
                navigate(`/campaigns/${campaignId}`);
            } else {
                // Clear the form after creating a new campaign
                setTitle('');
                setDescription('');
            }
        } else {
            setMessage(data.error || 'Failed to save campaign');
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
            <h1>{isEditing ? 'Edit Campaign' : 'Create Campaign'}</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Title:</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Description:</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">{isEditing ? 'Update' : 'Create'}</button>
                <button
                    type="button"
                    onClick={() => navigate(isEditing ? `/campaigns/${campaignId}` : '/')}
                >
                    {isEditing ? 'Back to Campaign' : 'Dashboard'}
                </button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
}

export default CreateOrEditCampaign;