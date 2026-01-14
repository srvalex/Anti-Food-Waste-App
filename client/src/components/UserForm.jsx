import { useState, useEffect } from 'react';
import './UserForm.css';

function UserForm({ onUserSelect }) {

    const [users, setUsers] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState('');
    const [showCreateForm, setShowCreateForm] = useState(false);

    // State for creating new user
    const [newUsername, setNewUsername] = useState('');
    const [newEmail, setNewEmail] = useState('');

    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Fetch all users when component mounts
    useEffect(() => {
        fetchUsers();
    }, []);

    // Fetch all users from backend
    const fetchUsers = async () => {
        try {
            const response = await fetch('http://localhost:8000/users');
            if (response.ok) {
                const data = await response.json();
                setUsers(data);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            setMessage('❌ Failed to load users');
            setMessageType('error');
        }
    };

    // Handle selecting an existing user
    const handleSelectUser = () => {
        if (!selectedUserId) {
            setMessage('❌ Please select a user');
            setMessageType('error');
            return;
        }

        const user = users.find(u => u.id === parseInt(selectedUserId));
        onUserSelect(user);
        setMessage(`✅ Logged in as ${user.username}`);
        setMessageType('success');
    };

    // Handle creating a new user
    const handleCreateUser = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');

        const userData = {
            username: newUsername,
            email: newEmail
        };

        try {
            const response = await fetch('http://localhost:8000/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });

            if (response.ok) {
                const newUser = await response.json();
                setMessage(`✅ User "${newUsername}" created successfully!`);
                setMessageType('success');

                // Refresh user list and auto-select the new user
                await fetchUsers();
                onUserSelect(newUser);

                // Reset form
                setNewUsername('');
                setNewEmail('');
                setShowCreateForm(false);
            } else {
                const errorData = await response.json();
                setMessage(`❌ Error: ${errorData.mesaj || 'Failed to create user'}`);
                setMessageType('error');
            }
        } catch (error) {
            setMessage(`❌ Network error: ${error.message}`);
            setMessageType('error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="user-form-container">
            <h2>Conectare sau Inregistrare</h2>
            <p className="form-description">
                Selecteaza un user existent sau creeaza unul nou
            </p>

            {message && (
                <div className={`message ${messageType}`}>
                    {message}
                </div>
            )}

            {!showCreateForm ? (
                // SELECT EXISTING USER
                <div className="select-user-section">
                    <div className="form-group">
                        <label htmlFor="userSelect">Select User</label>
                        <select
                            id="userSelect"
                            value={selectedUserId}
                            onChange={(e) => setSelectedUserId(e.target.value)}
                            className="user-select"
                        >
                            <option value="">-- Choose a user --</option>
                            {users.map(user => (
                                <option key={user.id} value={user.id}>
                                    {user.username} ({user.email})
                                </option>
                            ))}
                        </select>
                    </div>

                    <button onClick={handleSelectUser} className="submit-btn">
                        🚀 Continue as Selected User
                    </button>

                    <div className="divider">
                        <span>OR</span>
                    </div>

                    <button
                        onClick={() => setShowCreateForm(true)}
                        className="secondary-btn"
                    >
                        ➕ Create New User
                    </button>
                </div>
            ) : (
                // CREATE NEW USER FORM
                <div className="create-user-section">
                    <form onSubmit={handleCreateUser} className="user-form">
                        <div className="form-group">
                            <label htmlFor="username">Username *</label>
                            <input
                                type="text"
                                id="username"
                                value={newUsername}
                                onChange={(e) => setNewUsername(e.target.value)}
                                placeholder="Enter your username"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">Email *</label>
                            <input
                                type="email"
                                id="email"
                                value={newEmail}
                                onChange={(e) => setNewEmail(e.target.value)}
                                placeholder="Enter your email"
                                required
                            />
                        </div>

                        <button type="submit" className="submit-btn" disabled={isLoading}>
                            {isLoading ? '⏳ Creating...' : '✨ Create User'}
                        </button>

                        <button
                            type="button"
                            onClick={() => setShowCreateForm(false)}
                            className="secondary-btn"
                        >
                            ← Back to Selection
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}

export default UserForm;