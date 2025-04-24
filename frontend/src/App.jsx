import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
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
                </Routes>
            </div>
        </Router>
    );
}

export default App;
