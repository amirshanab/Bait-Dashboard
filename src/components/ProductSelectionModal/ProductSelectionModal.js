import React, { useState } from 'react';
import styles from './ProductSelectionModal.module.css';

const ProductSelectionModal = ({ products, onClose, onSelect }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedProducts, setSelectedProducts] = useState([]);

    const filteredProducts = products.filter(product =>
        product.Name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleProductClick = (product) => {
        const existingProduct = selectedProducts.find(p => p.id === product.id);
        if (existingProduct) {
            setSelectedProducts(prevSelected => prevSelected.filter(p => p.id !== product.id));
        } else {
            setSelectedProducts(prevSelected => [...prevSelected, { ...product, quantity: 1 }]);
        }
    };

    const handleQuantityChange = (e, productId, delta) => {
        e.stopPropagation(); // Prevent the click event from propagating to the product item
        setSelectedProducts(prevSelected =>
            prevSelected.map(p =>
                p.id === productId ? { ...p, quantity: Math.max(p.quantity + delta, 1) } : p
            )
        );
    };

    const handleDone = () => {
        onSelect(selectedProducts);
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.container}>
                <button onClick={onClose} className={styles.closeButton}>×</button>
                <h2 className={styles.heading}>Select Products</h2>
                <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={styles.searchBar}
                />
                <div className={styles.productGrid}>
                    {filteredProducts.map((product) => (
                        <div
                            key={product.id}
                            className={`${styles.productItem} ${selectedProducts.find(p => p.id === product.id) ? styles.selected : ''}`}
                            onClick={() => handleProductClick(product)}
                        >
                            <img src={product.Image} alt={product.Name} className={styles.productImage} />
                            <div className={styles.productDetails}>
                                <p><strong>{product.Name}</strong></p>
                                <p>${product.Price}</p>
                                {selectedProducts.find(p => p.id === product.id) && (
                                    <div className={styles.quantityControl}>
                                        <button onClick={(e) => handleQuantityChange(e, product.id, -1)} className={styles.quantityButton}>-</button>
                                        <span className={styles.quantity}>{selectedProducts.find(p => p.id === product.id).quantity}</span>
                                        <button onClick={(e) => handleQuantityChange(e, product.id, 1)} className={styles.quantityButton}>+</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
                <button onClick={handleDone} className={styles.doneButton}>Done</button>
            </div>
        </div>
    );
};

export default ProductSelectionModal;
