import { useState, useEffect } from 'react';
import './FriendsPage.css';

function FriendsPage({ userId }) {
    const [friends, setFriends] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [pendingRequests, setPendingRequests] = useState([]);
    const [incomingRequests, setIncomingRequests] = useState([]);
    const [userMap, setUserMap] = useState({}); // Map of userId -> user object
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAddFriend, setShowAddFriend] = useState(false);
    const [selectedUser, setSelectedUser] = useState('');
    const [newFriendTag, setNewFriendTag] = useState(''); // Tag for new friend request
    const [editingFriendId, setEditingFriendId] = useState(null); // ID of friend being edited
    const [editTagValue, setEditTagValue] = useState(''); // Current tag value being edited

    useEffect(() => {
        fetchFriends();
        fetchAllUsers();
    }, [userId]);

    const fetchFriends = async () => {
        setIsLoading(true);
        setError(null);

        try {
            // Fetch friendships where user is the sender
            const sentResponse = await fetch(`http://localhost:8000/prietenii?idSender=${userId}`);
            // Fetch friendships where user is the receiver
            const receivedResponse = await fetch(`http://localhost:8000/prietenii?idReciever=${userId}`);

            if (sentResponse.ok && receivedResponse.ok) {
                const sentData = await sentResponse.json();
                const receivedData = await receivedResponse.json();

                // Separate sent requests
                const acceptedSent = sentData.filter(f => f.statusCerere === 'Acceptata');
                const pendingSent = sentData.filter(f => f.statusCerere === 'In asteptare');

                // Separate received requests
                const acceptedReceived = receivedData.filter(f => f.statusCerere === 'Acceptata');
                const pendingReceived = receivedData.filter(f => f.statusCerere === 'In asteptare');

                // Combine accepted friends from both directions
                setFriends([...acceptedSent, ...acceptedReceived]);
                setPendingRequests(pendingSent);
                setIncomingRequests(pendingReceived);

                // Fetch all users to create a mapping
                const usersResponse = await fetch('http://localhost:8000/users');
                if (usersResponse.ok) {
                    const users = await usersResponse.json();
                    const userMapping = {};
                    users.forEach(user => {
                        userMapping[user.id] = user;
                    });
                    setUserMap(userMapping);
                }
            } else {
                setError('Failed to load friends');
            }
        } catch (err) {
            setError('Network error: ' + err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchAllUsers = async () => {
        try {
            const response = await fetch('http://localhost:8000/users');
            if (response.ok) {
                const users = await response.json();
                // Filter out current user
                setAllUsers(users.filter(u => u.id !== userId));
            }
        } catch (err) {
            console.error('Error fetching users:', err);
        }
    };

    const sendFriendRequest = async () => {
        if (!selectedUser) {
            alert('Te rog selectează un utilizator!');
            return;
        }

        try {
            const requestBody = {
                idSender: userId,
                idReciever: parseInt(selectedUser),
                statusCerere: 'In asteptare'
            };

            // Add tag if provided
            if (newFriendTag.trim()) {
                requestBody.tag = newFriendTag.trim();
            }

            const response = await fetch('http://localhost:8000/prietenii', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody)
            });

            if (response.ok) {
                alert('Cerere de prietenie trimisă!');
                setShowAddFriend(false);
                setSelectedUser('');
                setNewFriendTag('');
                fetchFriends();
            } else {
                const errorData = await response.json();
                alert(`Eroare: ${errorData.Eroare || 'Nu s-a putut trimite cererea'}`);
            }
        } catch (err) {
            alert(`Eroare de rețea: ${err.message}`);
        }
    };

    const acceptRequest = async (friendshipId) => {
        try {
            const response = await fetch(`http://localhost:8000/prietenii/${friendshipId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ statusCerere: 'Acceptata' })
            });

            if (response.ok) {
                alert('Cerere acceptată!');
                fetchFriends();
            }
        } catch (err) {
            alert(`Eroare: ${err.message}`);
        }
    };

    const rejectRequest = async (friendshipId) => {
        try {
            const response = await fetch(`http://localhost:8000/prietenii/${friendshipId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                alert('Cerere respinsă!');
                fetchFriends();
            }
        } catch (err) {
            alert(`Eroare: ${err.message}`);
        }
    };

    const removeFriend = async (friendshipId) => {
        if (!confirm('Sigur vrei să ștergi acest prieten?')) return;

        try {
            const response = await fetch(`http://localhost:8000/prietenii/${friendshipId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                alert('Prieten șters!');
                fetchFriends();
            }
        } catch (err) {
            alert(`Eroare: ${err.message}`);
        }
    };

    const startEditingTag = (friendshipId, currentTag) => {
        setEditingFriendId(friendshipId);
        setEditTagValue(currentTag || '');
    };

    const cancelEditingTag = () => {
        setEditingFriendId(null);
        setEditTagValue('');
    };

    const updateFriendTag = async (friendshipId) => {
        try {
            const response = await fetch(`http://localhost:8000/prietenii/${friendshipId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tag: editTagValue.trim() || null })
            });

            if (response.ok) {
                alert('Tag actualizat!');
                setEditingFriendId(null);
                setEditTagValue('');
                fetchFriends();
            } else {
                alert('Eroare la actualizarea tag-ului');
            }
        } catch (err) {
            alert(`Eroare: ${err.message}`);
        }
    };

    if (isLoading) {
        return (
            <div className="friends-page-container">
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Se încarcă prietenii...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="friends-page-container">
                <div className="error-state">
                    <span className="error-icon">⚠️</span>
                    <p>{error}</p>
                    <button onClick={fetchFriends} className="retry-btn">
                        🔄 Încearcă din nou
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="friends-page-container">
            <div className="friends-header">
                <h2>👥 Prietenii mei</h2>
                <button
                    onClick={() => setShowAddFriend(!showAddFriend)}
                    className="add-friend-btn"
                >
                    {showAddFriend ? '✕ Închide' : '➕ Adaugă Prieten'}
                </button>
            </div>

            {showAddFriend && (
                <div className="add-friend-form">
                    <h3>Trimite cerere de prietenie</h3>
                    <select
                        value={selectedUser}
                        onChange={(e) => setSelectedUser(e.target.value)}
                        className="user-select"
                    >
                        <option value="">-- Selectează utilizator --</option>
                        {allUsers.map(user => (
                            <option key={user.id} value={user.id}>
                                {user.username} ({user.email})
                            </option>
                        ))}
                    </select>
                    <input
                        type="text"
                        value={newFriendTag}
                        onChange={(e) => setNewFriendTag(e.target.value)}
                        placeholder="Tag (opțional, ex: Familie, Coleg)"
                        className="tag-input"
                        maxLength="50"
                    />
                    <button onClick={sendFriendRequest} className="send-request-btn">
                        📨 Trimite Cerere
                    </button>
                </div>
            )}

            {incomingRequests.length > 0 && (
                <div className="incoming-section">
                    <h3>📨 Cereri primite ({incomingRequests.length})</h3>
                    <div className="incoming-list">
                        {incomingRequests.map(request => (
                            <div key={request.idPrietenie} className="incoming-card">
                                <div className="incoming-info">
                                    <span className="incoming-icon">👤</span>
                                    <div>
                                        <strong>Cerere de prietenie de la {userMap[request.idSender]?.username || `User #${request.idSender}`}</strong>
                                        {request.tag && <p className="request-tag">Tag: {request.tag}</p>}
                                    </div>
                                </div>
                                <div className="incoming-actions">
                                    <button
                                        onClick={() => acceptRequest(request.idPrietenie)}
                                        className="accept-btn"
                                    >
                                        ✓ Acceptă
                                    </button>
                                    <button
                                        onClick={() => rejectRequest(request.idPrietenie)}
                                        className="reject-btn"
                                    >
                                        ✕ Respinge
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {pendingRequests.length > 0 && (
                <div className="pending-section">
                    <h3>📬 Cereri în așteptare ({pendingRequests.length})</h3>
                    <div className="pending-list">
                        {pendingRequests.map(request => (
                            <div key={request.idPrietenie} className="pending-card">
                                <div className="pending-info">
                                    <span className="pending-icon">⏳</span>
                                    <span>Cerere trimisă către {userMap[request.idReciever]?.username || `User #${request.idReciever}`}</span>
                                </div>
                                <button
                                    onClick={() => rejectRequest(request.idPrietenie)}
                                    className="cancel-btn"
                                >
                                    Anulează
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="friends-section">
                <h3>✅ Prieteni acceptați ({friends.length})</h3>
                {friends.length === 0 ? (
                    <div className="empty-friends">
                        <span className="empty-icon">👤</span>
                        <p>Nu ai încă prieteni. Adaugă primul tău prieten!</p>
                    </div>
                ) : (
                    <div className="friends-grid">
                        {friends.map(friend => (
                            <div key={friend.idPrietenie} className="friend-card">
                                <div className="friend-info">
                                    <div className="friend-avatar">👤</div>
                                    <div className="friend-details">
                                        <h4>{userMap[friend.idSender === userId ? friend.idReciever : friend.idSender]?.username || `User #${friend.idSender === userId ? friend.idReciever : friend.idSender}`}</h4>
                                        {editingFriendId === friend.idPrietenie ? (
                                            <div className="tag-edit-container">
                                                <input
                                                    type="text"
                                                    value={editTagValue}
                                                    onChange={(e) => setEditTagValue(e.target.value)}
                                                    placeholder="Adaugă tag..."
                                                    className="tag-input"
                                                    maxLength="50"
                                                    autoFocus
                                                />
                                                <div className="tag-edit-actions">
                                                    <button
                                                        onClick={() => updateFriendTag(friend.idPrietenie)}
                                                        className="save-tag-btn"
                                                    >
                                                        ✓ Salvează
                                                    </button>
                                                    <button
                                                        onClick={cancelEditingTag}
                                                        className="cancel-tag-btn"
                                                    >
                                                        ✕ Anulează
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="tag-display">
                                                {friend.tag && <span className="friend-tag">{friend.tag}</span>}
                                                <button
                                                    onClick={() => startEditingTag(friend.idPrietenie, friend.tag)}
                                                    className="edit-tag-btn"
                                                    title="Editează tag"
                                                >
                                                    ✏️
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <button
                                    onClick={() => removeFriend(friend.idPrietenie)}
                                    className="remove-btn"
                                >
                                    🗑️ Șterge
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default FriendsPage;
