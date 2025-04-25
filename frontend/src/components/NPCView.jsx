import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function NPC() {
    const { campaignId, npcId } = useParams(); // Get campaign ID and NPC ID from URL
    const navigate = useNavigate();
    const [npc, setNpc] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        // Fetch the NPC details
        fetch(`http://127.0.0.1:8000/api/campaigns/${campaignId}/npcs/${npcId}/`, {
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
                    throw new Error('Failed to fetch NPC details');
                }
            })
            .then((data) => {
                setNpc(data);
            })
            .catch((err) => {
                setError(err.message);
            });
        }, [campaignId, npcId]);
    const handleDelete = async () => {
        const csrfToken = getCSRFToken(); // Get the CSRF token

        const confirmed = window.confirm('Are you sure you want to delete this NPC?');
        if (!confirmed) return;

        const response = await fetch(`http://127.0.0.1:8000/api/campaigns/${campaignId}/npcs/delete/${npcId}/`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken, // Include the CSRF token in the headers
            },
            credentials: 'include', // Include cookies for authentication
        });
        if (response.ok) {
            alert('NPC deleted successfully!');
            navigate(`/campaigns/${campaignId}/npcs`); // Redirect to the NPCs list after deletion
        } else {
            alert('Failed to delete NPC');
        }
    }
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
            {error && <p>{error}</p>}
            {npc ? (
                <div>
                    <h1>{npc.name}</h1>
                    <p>Roll: {npc.roll}</p>
                    <p>{npc.description}</p>

                    <h1> STATS</h1>
                    <p>HP: {npc.hp}</p>
                    <p>AC: {npc.ac}</p>
                    <p>Attack Bonus {npc.attack_bonus}</p>
                    <p>Damage: {npc.damage}</p>
                    <button onClick={handleDelete}>Delete NPC</button>
                    <button onClick={() => navigate(`/campaigns/${campaignId}/npcs/edit/${npcId}`)}>Edit NPC</button>
                    <button onClick={() => navigate(`/campaigns/${campaignId}/npcs`)}>Back to NPCs</button>
                </div>
            ) : (
                <p>Loading NPC details...</p>
            )}
        </div>
    );
}

export default NPC;