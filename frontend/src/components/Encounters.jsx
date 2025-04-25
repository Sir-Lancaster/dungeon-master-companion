import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function Encounters() {
    const { campaignId } = useParams(); // Get the campaign ID from the URL
    const navigate = useNavigate();
    const [campaign, setCampaign] = useState(null); // State for campaign details
    const [encounters, setEncounters] = useState([]);
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
        // Fetch the encounters for the campaign
        fetch(`http://127.0.0.1:8000/api/campaigns/${campaignId}/encounters/`, {
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
                    throw new Error('Failed to fetch encounters');
                }
            })
            .then((data) => {
                setEncounters(data);
            })
            .catch((err) => {
                setError(err.message);
            });
        }, [campaignId]);
        
        return (
            <div>
                <h1>Encounters for {campaign ? campaign.title : 'Loading...'}</h1>
                <button onClick={() => navigate(`/campaigns/${campaignId}/encounters/create`)}>Create Encounter</button>
                <button onClick={() => navigate(`/campaigns/${campaignId}/`)}>Back to Campaign</button>
                {error && <p>Error: {error}</p>}
                <ul>
                    {encounters.map((encounter) => (
                        <li key={encounter.id}>
                            <h2 onClick={() => navigate(`/campaigns/${campaignId}/encounters/${encounter.id}`)}>{encounter.name}</h2>
                            <p>{encounter.description}</p>
                        </li>
                    ))}
                </ul>
            </div>
        );
}

export default Encounters;