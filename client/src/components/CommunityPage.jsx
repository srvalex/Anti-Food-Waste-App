import { useState, useEffect } from 'react';
import './CommunityPage.css';

function CommunityPage({ userId }) {
    const [products, setProducts] = useState([]);
    const [friends, setFriends] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [categoryFilter, setCategoryFilter] = useState('');

    const categories = [
        'Toate',
        'Lactate',
        'Carne',
        'Pește',
        'Fructe',
        'Legume',
        'Pâine și Produse de Patiserie',
        'Conserve',
        'Băuturi',
        'Condimente',
        'Altele'
    ];

    useEffect(() => {
        fetchFriendsAndProducts();
    }, [userId]);

    const fetchFriendsAndProducts = async () => {
        setIsLoading(true);
        setError(null);

        try {
            // Step 1: Fetch user's friends
            const sentResponse = await fetch(`http://localhost:8000/prietenii?idSender=${userId}`);
            const receivedResponse = await fetch(`http://localhost:8000/prietenii?idReciever=${userId}`);

            if (!sentResponse.ok || !receivedResponse.ok) {
                setError('Failed to load friends');
                setIsLoading(false);
                return;
            }

            const sentData = await sentResponse.json();
            const receivedData = await receivedResponse.json();

            // Get accepted friends from both directions
            const acceptedSent = sentData.filter(f => f.statusCerere === 'Acceptata');
            const acceptedReceived = receivedData.filter(f => f.statusCerere === 'Acceptata');

            // Extract friend IDs
            const friendIds = [
                ...acceptedSent.map(f => f.idReciever),
                ...acceptedReceived.map(f => f.idSender)
            ];

            setFriends(friendIds);

            // Step 2: Fetch available products
            const productsResponse = await fetch('http://localhost:8000/produse/available');

            if (!productsResponse.ok) {
                setError('Failed to load products');
                setIsLoading(false);
                return;
            }

            const allProducts = await productsResponse.json();

            // Filter products to only show those from friends
            const friendsProducts = allProducts.filter(product =>
                friendIds.includes(product.idUtilizator)
            );

            setProducts(friendsProducts);
        } catch (err) {
            setError('Network error: ' + err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const claimProduct = async (productId, productName) => {
        if (!confirm(`Vrei să revendici "${productName}"?`)) return;

        try {
            // Step 1: Create the claim
            const claimResponse = await fetch('http://localhost:8000/claims', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    idProdus: productId,
                    idClaimer: userId,
                    mesaj: 'Doresc să revendic acest produs'
                })
            });

            if (!claimResponse.ok) {
                const errorData = await claimResponse.json();
                alert(`Eroare: ${errorData.Eroare || 'Nu s-a putut revendica produsul'}`);
                return;
            }

            // Step 2: Update product status to 'claimed'
            const updateResponse = await fetch(`http://localhost:8000/produse/${productId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    status: 'claimed',
                    isAvailable: false
                })
            });

            if (updateResponse.ok) {
                alert('Produs revendicat cu succes! Proprietarul va fi notificat.');
                fetchFriendsAndProducts(); // Refresh the list
            } else {
                alert('Produs revendicat, dar statusul nu a putut fi actualizat.');
                fetchFriendsAndProducts();
            }
        } catch (err) {
            alert(`Eroare de rețea: ${err.message}`);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ro-RO', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getDaysUntilExpiration = (dateString) => {
        const expirationDate = new Date(dateString);
        const today = new Date();
        const diffTime = expirationDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const getExpirationStatus = (dateString) => {
        const days = getDaysUntilExpiration(dateString);

        if (days < 0) return { label: 'Expirat', class: 'expired' };
        if (days === 0) return { label: 'Expiră astăzi!', class: 'expiring-today' };
        if (days <= 3) return { label: `Expiră în ${days} zile`, class: 'expiring-soon' };
        if (days <= 7) return { label: `Expiră în ${days} zile`, class: 'expiring-week' };
        return { label: `Expiră în ${days} zile`, class: 'fresh' };
    };

    const filteredProducts = categoryFilter && categoryFilter !== 'Toate'
        ? products.filter(p => p.categorie === categoryFilter)
        : products;

    if (isLoading) {
        return (
            <div className="community-container">
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Se încarcă produsele din comunitate...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="community-container">
                <div className="error-state">
                    <span className="error-icon">⚠️</span>
                    <p>{error}</p>
                    <button onClick={fetchFriendsAndProducts} className="retry-btn">
                        🔄 Încearcă din nou
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="community-container">
            <div className="community-header">
                <div>
                    <h2>🌍 Comunitate</h2>
                    <p className="community-subtitle">Produse disponibile de la prietenii tăi</p>
                </div>
                <div className="filter-section">
                    <label htmlFor="category-filter">Filtrează:</label>
                    <select
                        id="category-filter"
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="category-filter"
                    >
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>
            </div>

            {friends.length === 0 ? (
                <div className="no-friends-state">
                    <span className="empty-icon">👥</span>
                    <h3>Nu ai prieteni încă</h3>
                    <p>Adaugă prieteni pentru a vedea produsele lor disponibile!</p>
                </div>
            ) : filteredProducts.length === 0 ? (
                <div className="empty-community">
                    <span className="empty-icon">📦</span>
                    <h3>Niciun produs disponibil</h3>
                    <p>Prietenii tăi nu au produse disponibile momentan.</p>
                </div>
            ) : (
                <>
                    <div className="products-count">
                        {filteredProducts.length} {filteredProducts.length === 1 ? 'produs disponibil' : 'produse disponibile'}
                    </div>
                    <div className="community-grid">
                        {filteredProducts.map((product) => {
                            const expirationStatus = getExpirationStatus(product.dataExpirare);

                            return (
                                <div key={product.idProdus} className={`community-card ${expirationStatus.class}`}>
                                    <div className="product-owner">
                                        <span className="owner-icon">👤</span>
                                        <span className="owner-name">
                                            {product.User ? product.User.username : `User #${product.idUtilizator}`}
                                        </span>
                                    </div>

                                    <div className="product-header">
                                        <h3 className="product-name">{product.nume}</h3>
                                    </div>

                                    <div className="product-details">
                                        <div className="detail-row">
                                            <span className="detail-icon">🏷️</span>
                                            <span className="detail-label">Categorie:</span>
                                            <span className="detail-value">{product.categorie}</span>
                                        </div>

                                        <div className="detail-row">
                                            <span className="detail-icon">📅</span>
                                            <span className="detail-label">Expiră:</span>
                                            <span className="detail-value">{formatDate(product.dataExpirare)}</span>
                                        </div>

                                        <div className={`expiration-warning ${expirationStatus.class}`}>
                                            <span className="warning-icon">
                                                {expirationStatus.class === 'expired' ? '❌' :
                                                    expirationStatus.class === 'expiring-today' ? '⚠️' :
                                                        expirationStatus.class === 'expiring-soon' ? '⏰' : '✅'}
                                            </span>
                                            <span>{expirationStatus.label}</span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => claimProduct(product.idProdus, product.nume)}
                                        className="claim-btn"
                                    >
                                        🎁 Revendică Produs
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </>
            )}
        </div>
    );
}

export default CommunityPage;
