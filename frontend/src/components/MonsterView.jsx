import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function Monster() {
    const { campaignId, encounterId, monsterId } = useParams(); // Get campaign ID, encounter ID, and monster ID from URL
    const navigate = useNavigate();
    const [monster, setMonster] = useState({
        name: '',
        description: '',
        hp: 0,
        ac: 0,
        attack_bonus: 0,
        damage: '',
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Fetch monster details
        fetch(`http://127.0.0.1:8000/api/campaigns/${campaignId}/encounters/${encounterId}/monsters/${monsterId}/`, {
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
                    throw new Error('Failed to fetch monster details');
                }
            })
            .then((data) => {
                setMonster(data);
                setIsLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setIsLoading(false);
            });
    }, [campaignId, encounterId, monsterId]); // Dependency array for useEffect

    const handleDelete = async () => {
        const confirmed = window.confirm('Are you sure you want to delete this monster?');
        if (!confirmed) return;

        const csrfToken = getCSRFToken();
        const response = await fetch(`http://127.0.0.1:8000/api/campaigns/${campaignId}/encounters/${encounterId}/monsters/delete/${monsterId}/`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken,
            },
            credentials: 'include',
        });

        if (response.ok) {
            alert('Monster deleted successfully!');
            navigate(`/campaigns/${campaignId}/encounters/${encounterId}/`);
        } else {
            alert('Failed to delete monster');
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
            {error && <p>{error}</p>}
            {isLoading ? (
                <p>Loading...</p>
            ) : (
                <div>
                    <h1>{monster.name}</h1>
                    <p><strong>Description:</strong> {monster.description}</p>
                    <p><strong>HP:</strong> {monster.hp}</p>
                    <p><strong>AC:</strong> {monster.ac}</p>
                    <p><strong>Attack Bonus:</strong> {monster.attack_bonus}</p>
                    <p><strong>Damage:</strong> {monster.damage}</p>
                    <button onClick={() => navigate(`/campaigns/${campaignId}/encounters/${encounterId}/monsters/edit/${monsterId}/`)}>Edit Monster</button>
                    <button onClick={handleDelete}>Delete Monster</button>
                    <button onClick={() => navigate(`/campaigns/${campaignId}/encounters/${encounterId}/`)}>Back to Encounter</button>
                </div>
            )}
        </div>
    );
}

export default Monster;