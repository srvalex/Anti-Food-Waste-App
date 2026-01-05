import { useState } from 'react';
import './AddProductForm.css';

function AddProductForm({ userId, onProductAdded }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form fields
    const [nume, setNume] = useState('');
    const [categorie, setCategorie] = useState('');
    const [dataExpirare, setDataExpirare] = useState('');

    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');

    // Common food categories
    const categories = [
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage('');

        const productData = {
            nume,
            categorie,
            dataExpirare,
            idUtilizator: userId
        };

        try {
            const response = await fetch('http://localhost:8000/produse', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productData)
            });

            if (response.ok) {
                const newProduct = await response.json();
                setMessage(`✅ Produs "${nume}" adăugat cu succes!`);
                setMessageType('success');

                // Reset form
                setNume('');
                setCategorie('');
                setDataExpirare('');

                // Notify parent component to refresh product list
                if (onProductAdded) {
                    onProductAdded(newProduct);
                }

                // Close form after 1.5 seconds
                setTimeout(() => {
                    setIsOpen(false);
                    setMessage('');
                }, 1500);
            } else {
                const errorData = await response.json();
                setMessage(`❌ Eroare: ${errorData.Eroare || 'Nu s-a putut adăuga produsul'}`);
                setMessageType('error');
            }
        } catch (error) {
            setMessage(`❌ Eroare de rețea: ${error.message}`);
            setMessageType('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        setIsOpen(false);
        setNume('');
        setCategorie('');
        setDataExpirare('');
        setMessage('');
    };

    // Get today's date in YYYY-MM-DD format for min date
    const getTodayDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };

    return (
        <div className="add-product-form-wrapper">
            {!isOpen ? (
                <button
                    onClick={() => setIsOpen(true)}
                    className="add-product-btn"
                >
                    ➕ Adaugă Produs Nou
                </button>
            ) : (
                <div className="add-product-form-container">
                    <div className="form-header">
                        <h3>🍎 Adaugă Produs Nou</h3>
                        <button
                            onClick={handleCancel}
                            className="close-btn"
                            type="button"
                        >
                            ✕
                        </button>
                    </div>

                    {message && (
                        <div className={`form-message ${messageType}`}>
                            {message}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="nume">Nume Produs *</label>
                            <input
                                type="text"
                                id="nume"
                                value={nume}
                                onChange={(e) => setNume(e.target.value)}
                                placeholder="ex: Lapte, Pâine, Mere..."
                                required
                                disabled={isSubmitting}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="categorie">Categorie *</label>
                            <select
                                id="categorie"
                                value={categorie}
                                onChange={(e) => setCategorie(e.target.value)}
                                required
                                disabled={isSubmitting}
                            >
                                <option value="">-- Selectează categoria --</option>
                                {categories.map((cat) => (
                                    <option key={cat} value={cat}>
                                        {cat}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="dataExpirare">Data Expirare *</label>
                            <input
                                type="date"
                                id="dataExpirare"
                                value={dataExpirare}
                                onChange={(e) => setDataExpirare(e.target.value)}
                                min={getTodayDate()}
                                required
                                disabled={isSubmitting}
                            />
                        </div>

                        <div className="form-actions">
                            <button
                                type="submit"
                                className="submit-btn"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? '⏳ Se adaugă...' : '✨ Adaugă Produs'}
                            </button>
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="cancel-btn"
                                disabled={isSubmitting}
                            >
                                Anulează
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}

export default AddProductForm;
