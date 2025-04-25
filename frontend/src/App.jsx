import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import CreateCampaign from './components/NewCampaign';
import Campaign from './components/Campaign';

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

                </Routes>
            </div>
        </Router>
    );
}

export default App;
