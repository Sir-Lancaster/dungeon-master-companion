import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function Quests() {
    const { campaignId } = useParams(); // Get the campaign ID from the URL
    const navigate = useNavigate();
    const [campaign, setCampaign] = useState(null); // State for campaign details
    const [quests, setQuests] = useState([]); // State for quests
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
        // Fetch the quests for the campaign
        fetch(`http://127.0.0.1:8000/api/campaigns/${campaignId}/quests/`, {
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
                    throw new Error('Failed to fetch quests');
                }
            })
            .then((data) => {
                setQuests(data); // Set the quests
            })
            .catch((err) => {
                setError(err.message);
            });
    }
    , [campaignId]); // Dependency array for useEffect

    return (
        <div>
            <h1>Quests for {campaign ? campaign.title : 'Loading...'}</h1>
            <button onClick={() => navigate(`/campaigns/${campaignId}/quests/create`)}>Create Quest</button>
            <button onClick={() => navigate(`/campaigns/${campaignId}/`)}>Back to Campaign</button>
            {error && <p>Error: {error}</p>}
            <ul>
                {quests.map((quest) => (
                    <li key={quest.id}>
                        <h2 onClick={() => navigate(`/campaigns/${campaignId}/quests/${quest.id}/`)}>{quest.title}</h2>
                        <p>{quest.description}</p>
                        <p>Status: {quest.is_completed ? 'Completed' : 'In Progress'}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}
export default Quests;