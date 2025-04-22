import { useState } from 'react';

function SignIn() {
    const [ username, setUsername ] = useState('');
    const [ password, setPassword ] = useState('');
    const [ message, setMessage ] = useState(''); 

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch('http://127.0.0.1:8000/api/login/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await response.json();
        if (response.ok) {
            setMessage('Login successful!');
            // Redirect or perform other actions
        } else {
            setMessage(data.error || 'Login failed');
        }
    };
    return (
        <div>
            <h1>Sign In</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Username:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Sign In</button>
            </form>
            {message && <p>{message}</p>}
            <p>Don't have an account? <a href="/signup">Create One</a></p>
        </div>
    );
}