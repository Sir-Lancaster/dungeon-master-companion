import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function CreateOrEditMonster({ isEditing = false }) {
    const navigate = useNavigate();
    const { campaignId, encounterId, monsterId } = useParams(); // Get campaign ID, encounter ID, and monster ID from URL
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [hp, setHp] = useState('');
    const [ac, setAc] = useState('');
    const [attackBonus, setAttackBonus] = useState('');
    const [damage, setDamage] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    // Fetch existing monster data if editing
    useEffect(() => {
        if (isEditing && monsterId) {
            fetch(`http://127.0.0.1:8000/api/campaigns/${campaignId}/encounters/${encounterId}/monsters/${monsterId}/`, {
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
                        throw new Error('Failed to fetch monster details');
                    }
                })
                .then((data) => {
                    setName(data.name || '');
                    setDescription(data.description || '');
                    setHp(data.hp || '');
                    setAc(data.ac || '');
                    setAttackBonus(data.attack_bonus || '');
                    setDamage(data.damage || '');
                })
                .catch((err) => {
                    setError(err.message);
                });
        }
    }, [isEditing, monsterId, campaignId, encounterId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const csrfToken = getCSRFToken(); // Get the CSRF token

        const url = isEditing
            ? `http://127.0.0.1:8000/api/campaigns/${campaignId}/encounters/${encounterId}/monsters/update/${monsterId}/`
            : `http://127.0.0.1:8000/api/campaigns/${campaignId}/encounters/${encounterId}/monsters/create/`;
        const method = isEditing ? 'PUT' : 'POST';
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken, // Include the CSRF token in the headers
            },
            credentials: 'include', // Include cookies for authentication
            body: JSON.stringify({ name, description, hp, ac, attack_bonus: attackBonus, damage }),
        });
        const data = await response.json();
        if (response.ok) {
            setMessage(isEditing ? 'Monster updated successfully!' : 'Monster created successfully!');
            navigate(`/campaigns/${campaignId}/encounters/${encounterId}/`);
        } else {
            setMessage('Failed to create/update monster');
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
            <h1>{isEditing ? 'Edit Monster' : 'Create Monster'}</h1>
            {message && <p>{message}</p>}
            {error && <p>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Description:</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    ></textarea>
                </div>
                <div>
                    <label>HP:</label>
                    <input
                        type="number"
                        value={hp}
                        onChange={(e) => setHp(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>AC:</label>
                    <input
                        type="number"
                        value={ac}
                        onChange={(e) => setAc(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Attack Bonus:</label>
                    <input
                        type="number"
                        value={attackBonus}
                        onChange={(e) => setAttackBonus(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Damage:</label>
                    <input
                        type="text"
                        value={damage}
                        onChange={(e) => setDamage(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">{isEditing ? 'Update Monster' : 'Create Monster'}</button>
            </form>
        </div>
    );
}

export default CreateOrEditMonster;