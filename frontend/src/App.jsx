import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import CreateCampaign from './components/NewCampaign';
import Campaign from './components/Campaign';
import NPCs from './components/NPCs';
import CreateOrEditNPC from './components/NewNPC';
import NPC from './components/NPCView';
import Encounters from './components/Encounters';
import CreateOrEditEncounter from './components/NewEncounter';
import Encounter from './components/EncounterView'; // Import the Encounter component
import CreateOrEditMonster from './components/NewMonster';
import Monster from './components/MonsterView'; // Import the Monster component

import './App.css';

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    {/* Route for the dashboard (home page) */}
                    <Route path="/" element={<Dashboard />} />

                    {/* Route for the sign-in page */}
                    <Route path="/signin" element={<SignIn />} />

                    {/* Route for the sign-up page */}
                    <Route path="/signup" element={<SignUp />} />

                    {/* Route for the create campaign page */}
                    <Route path="/create-campaign" element={<CreateCampaign />} />

                    {/* Routes for campaign viewing, deleting, and edditing */}
                    <Route path="/campaigns/:campaignId" element={<Campaign />} />
                    <Route path="/campaigns/edit/:campaignId" element={<CreateCampaign isEditing={true} />} />

                    {/* Add more routes as needed */}
                    {/* Route for the NPCs page */}
                    <Route path="/campaigns/:campaignId/npcs" element={<NPCs />} />
                    <Route path="/campaigns/:campaignId/npcs/create" element={<CreateOrEditNPC />} />
                    <Route path="/campaigns/:campaignId/npcs/edit/:npcId" element={<CreateOrEditNPC isEditing={true} />} />
                    <Route path="/campaigns/:campaignId/npcs/:npcId" element={<NPC />} /> {/* Route for the NPC view page */}

                    {/* Routes for the encounter pages */}
                    <Route path="/campaigns/:campaignId/encounters" element={<Encounters />} />
                    <Route path="/campaigns/:campaignId/encounters/create" element={<CreateOrEditEncounter />} />
                    <Route path="/campaigns/:campaignId/encounters/edit/:encounterId" element={<CreateOrEditEncounter isEditing={true} />} />
                    <Route path="/campaigns/:campaignId/encounters/:encounterId" element={<Encounter />} /> 

                    {/* Route for the monster view */}
                    <Route path="/campaigns/:campaignId/encounters/:encounterId/monsters/create" element={<CreateOrEditMonster />} /> 
                    <Route path="/campaigns/:campaignId/encounters/:encounterId/monsters/edit/:monsterId" element={<CreateOrEditMonster isEditing={true} />} />
                    <Route path="/campaigns/:campaignId/encounters/:encounterId/monsters/:monsterId" element={<Monster />} />                    {/* Route for the encounter view */}

                    {/* Add more routes as needed */}

                </Routes>
            </div>
        </Router>
    );
}

export default App;
