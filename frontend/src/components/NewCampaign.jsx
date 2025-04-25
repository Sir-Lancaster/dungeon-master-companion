import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function CreateCampaign() {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [message, setMessage] = useState('');

    // Function to get the CSRF token from cookies
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        const csrfToken = getCSRFToken(); // Get the CSRF token

        const response = await fetch('http://127.0.0.1:8000/api/create_campaign/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken, // Include the CSRF token in the headers
            },
            credentials: 'include', // Include cookies for authentication
            body: JSON.stringify({ title, description }),
        });

        const data = await response.json();
        if (response.ok) {
            setMessage('Campaign created successfully!');
            setTitle('');
            setDescription('');
        } else {
            setMessage(data.error || 'Failed to create campaign');
        }
    };

    return (
        <div>
            <h1>Create Campaign</h1>
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
                <button type="submit">Create</button>
                <button type="button" onClick={() => navigate('/')}>Dashboard</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
}

export default CreateCampaign;