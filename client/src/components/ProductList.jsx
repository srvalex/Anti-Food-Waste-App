import { useState, useEffect } from 'react';
import './ProductList.css';
import AddProductForm from './AddProductForm';
import ShareButtons from './ShareButtons';

function ProductList({ userId }) {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchUserProducts();
    }, [userId]);

    const fetchUserProducts = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(`http://localhost:8000/user/${userId}/produse`);

            if (response.ok) {
                const data = await response.json();
                console.log('Raw API response:', data);
                // API returns array with user object containing Produs array
                if (data && data.length > 0 && data[0].Produs) {
                    console.log('Products array:', data[0].Produs);
                    console.log('First product:', data[0].Produs[0]);
                    setProducts(data[0].Produs);
                } else {
                    setProducts([]);
                }
            } else {
                setError('Failed to load products');
            }
        } catch (err) {
            setError('Network error: ' + err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleAvailability = async (productId, currentStatus) => {
        console.log('Toggle clicked!', { productId, currentStatus });
        console.log('Product ID type:', typeof productId, 'Value:', productId);

        try {
            const newStatus = currentStatus === 'disponibil' ? 'in frigider' : 'disponibil';
            const isAvailable = newStatus === 'disponibil';

            const url = `http://localhost:8000/produse/${productId}`;
            console.log('Sending update to:', url);
            console.log('Update data:', { newStatus, isAvailable });

            const response = await fetch(`http://localhost:8000/produse/${productId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    status: newStatus,
                    isAvailable: isAvailable
                })
            });

            console.log('Response status:', response.status);

            if (response.ok) {
                const data = await response.json();
                console.log('Update successful:', data);
                // Refresh the product list
                await fetchUserProducts();
                alert(`Produs ${newStatus === 'disponibil' ? 'marcat ca disponibil' : 'scos din comunitate'}!`);
            } else {
                const errorData = await response.json();
                console.error('Failed to update:', errorData);
                alert(`Eroare: ${errorData.Eroare || 'Nu s-a putut actualiza produsul'}`);
            }
        } catch (err) {
            console.error('Error updating availability:', err);
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

    const getStatusBadge = (status) => {
        switch (status) {
            case 'disponibil':
                return { label: 'Disponibil în Comunitate', class: 'available' };
            case 'in frigider':
                return { label: 'În frigider', class: 'in-fridge' };
            case 'claimed':
                return { label: 'Revendicat', class: 'claimed' };
            default:
                return { label: status, class: 'default' };
        }
    };

    if (isLoading) {
        return (
            <div className="product-list-container">
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Se încarcă produsele...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="product-list-container">
                <div className="error-state">
                    <span className="error-icon">⚠️</span>
                    <p>{error}</p>
                    <button onClick={fetchUserProducts} className="retry-btn">
                        🔄 Încearcă din nou
                    </button>
                </div>
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <div className="product-list-container">
                <div className="product-list-header">
                    <h2>🍎 Produsele mele</h2>
                    <span className="product-count">0 produse</span>
                </div>

                <AddProductForm
                    userId={userId}
                    onProductAdded={fetchUserProducts}
                />

                <div className="empty-state">
                    <span className="empty-icon">📦</span>
                    <h3>Nu ai produse încă</h3>
                    <p>Adaugă primul tău produs folosind butonul de mai sus!</p>
                </div>
            </div>
        );
    }

    return (
        <div className="product-list-container">
            <div className="product-list-header">
                <h2>🍎 Produsele mele</h2>
                <span className="product-count">{products.length} {products.length === 1 ? 'produs' : 'produse'}</span>
            </div>

            <AddProductForm
                userId={userId}
                onProductAdded={fetchUserProducts}
            />

            <div className="products-grid">
                {products.map((product) => {
                    const expirationStatus = getExpirationStatus(product.dataExpirare);
                    const statusBadge = getStatusBadge(product.status);

                    return (
                        <div key={product.idProdus} className={`product-card ${expirationStatus.class}`}>
                            <div className="product-header">
                                <h3 className="product-name">{product.nume}</h3>
                                {product.status !== 'claimed' && (
                                    <span className={`status-badge ${statusBadge.class}`}>
                                        {statusBadge.label}
                                    </span>
                                )}
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

                            {product.status === 'claimed' ? (
                                <div className="claimed-label">
                                    🎁 Revendicat
                                </div>
                            ) : (
                                <>
                                    <button
                                        onClick={() => toggleAvailability(product.idProdus, product.status)}
                                        className={`availability-toggle-btn ${product.status === 'disponibil' ? 'available' : 'not-available'}`}
                                    >
                                        {product.status === 'disponibil' ? '✓ Disponibil în Comunitate' : '📢 Marchează ca Disponibil'}
                                    </button>

                                    {product.status === 'disponibil' && (
                                        <ShareButtons product={product} />
                                    )}
                                </>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default ProductList;
