import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function NPCs() {
    const { campaignId } = useParams(); // Get the campaign ID from the URL
    const navigate = useNavigate();
    const [campaign, setCampaign] = useState(null); // State for campaign details
    const [npcs, setNpcs] = useState([]);
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
                setCampaign(data); // Set the campaign details
            })
            .catch((err) => {
                setError(err.message);
            });

        // Fetch the NPCs for the campaign
        fetch(`http://127.0.0.1:8000/api/campaigns/${campaignId}/npcs/`, {
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
                    throw new Error('Failed to fetch NPCs');
                }
            })
            .then((data) => {
                setNpcs(data);
            })
            .catch((err) => {
                setError(err.message);
            });
    }, [campaignId]);

    const handleDelete = async (npcId) => {
        const csrfToken = getCSRFToken(); // Get the CSRF token

        const confirmed = window.confirm('Are you sure you want to delete this NPC?');
        if (!confirmed) return;

        const response = await fetch(`http://127.0.0.1:8000/api/npcs/delete/${npcId}/`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken, // Include the CSRF token in the headers
            },
            credentials: 'include', // Include cookies for authentication
        });
        if (response.ok) {
            alert('NPC deleted successfully!');
            setNpcs(npcs.filter((npc) => npc.id !== npcId)); // Remove the deleted NPC from the state
        } else {
            alert('Failed to delete NPC');
        }
    };

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

    return (
        <div>
            <h1>NPCs for {campaign ? campaign.title : 'Loading...'}</h1>
            <button onClick={() => navigate(`/campaigns/${campaignId}/npcs/create`)}>Create NPC</button>
            <button onClick={() => navigate(`/campaigns/${campaignId}/`)}>Back to Campaign</button>
            {error && <p>{error}</p>}
            <ul>
                {npcs.map((npc) => (
                    <li key={npc.id}>
                        <h2 onClick={() => navigate(`/campaigns/${campaignId}/npcs/${npc.id}`)}>{npc.name}</h2>
                        <p>{npc.description}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default NPCs;