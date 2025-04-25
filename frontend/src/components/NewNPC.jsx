import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function CreateOrEditNPC({ isEditing = false }) {
    const navigate = useNavigate();
    const { campaignId, npcId } = useParams(); // Get campaign ID and NPC ID from URL if editing
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [roll, setRoll] = useState('');
    const [hp, setHp] = useState('');
    const [ac, setAc] = useState('');
    const [attack_bonus, setAttackBonus] = useState('');
    const [damage, setDamage] = useState('');
    const [message, setMessage] = useState('');

    // Fetch existing NPC data if editing
    useEffect(() => {
        if (isEditing && npcId) {
            fetch(`http://127.0.0.1:8000/api/campaigns/${campaignId}/npcs/${npcId}/`, {
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
                        throw new Error('Failed to fetch NPC details');
                    }
                })
                .then((data) => {
                    setName(data.name);
                    setDescription(data.description);
                    setRoll(data.rolls || ''); // Use default value if rolls is not provided
                    setHp(data.hp || '');
                    setAc(data.ac || '');
                    setAttackBonus(data.attack_bonus || '');
                    setDamage(data.damage || '');
                })
                .catch((err) => {
                    setMessage(err.message);
                });
        }
    }, [isEditing, npcId, campaignId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const csrfToken = getCSRFToken(); // Get the CSRF token

        const url = isEditing
            ? `http://127.0.0.1:8000/api/campaigns/${campaignId}/npcs/update/${npcId}/`
            : `http://127.0.0.1:8000/api/campaigns/${campaignId}/npcs/create_npc/`;
        const method = isEditing ? 'PUT' : 'POST';
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken, // Include the CSRF token in the headers
            },
            credentials: 'include', // Include cookies for authentication
            body: JSON.stringify({ name, description, rolls: roll, hp, ac, attack_bonus, damage }),
        });
        const data = await response.json();
        if (response.ok) {
            setMessage(isEditing ? 'NPC updated successfully!' : 'NPC created successfully!');
            navigate(isEditing ? `/campaigns/${campaignId}/npcs/${npcId}` : `/campaigns/${campaignId}/npcs/`);
        } else {
            setMessage('Failed to create/update NPC');
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
            <h1>{isEditing ? 'Edit NPC' : 'Create NPC'}</h1>
            {message && <p>{message}</p>}
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
                    <label>Roll:</label>
                    <input
                        type="text"
                        value={roll}
                        onChange={(e) => setRoll(e.target.value)}
                        required
                    />
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
                        type="text"
                        value={attack_bonus}
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
                <button type="submit">{isEditing ? 'Update NPC' : 'Create NPC'}</button>
            </form>
        </div>
    );
}

export default CreateOrEditNPC;