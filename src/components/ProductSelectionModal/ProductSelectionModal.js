import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import styles from './ProductSelectionModal.module.css';

const ProductSelectionModal = ({ onClose, onSelect }) => {
    const [products, setProducts] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchProducts = async () => {
            const productsCollection = collection(db, 'Products');
            const productsSnapshot = await getDocs(productsCollection);
            const productsList = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setProducts(productsList);
        };

        fetchProducts();
    }, []);

    const handleProductSelection = (product) => {
        const existingProduct = selectedProducts.find(p => p.id === product.id);
        if (existingProduct) {
            setSelectedProducts(selectedProducts.filter(p => p.id !== product.id));
        } else {
            setSelectedProducts([...selectedProducts, { ...product, quantity: 1 }]);
        }
    };

    const handleQuantityChange = (index, delta) => {
        const updatedProducts = [...selectedProducts];
        const newQuantity = updatedProducts[index].quantity + delta;
        if (newQuantity > 0) {
            updatedProducts[index].quantity = newQuantity;
            setSelectedProducts(updatedProducts);
        }
    };

    const handleSaveSelection = () => {
        onSelect(selectedProducts);
        onClose();
    };

    const filteredProducts = products.filter(product =>
        product.Name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <h3>Select Ingredients</h3>
                <div className={styles.searchContainer}>
                    <input
                        type="text"
                        placeholder="Search for ingredients..."
                        className={styles.searchInput}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className={styles.productsGrid}>
                    {filteredProducts.map((product) => (
                        <div
                            key={product.id}
                            className={`${styles.productCard} ${selectedProducts.find(p => p.id === product.id) ? styles.selected : ''}`}
                            onClick={() => handleProductSelection(product)}
                        >
                            <img src={product.Image} alt={product.Name} />
                            <p>{product.Name}</p>
                            <p>Price: ₪{product.Price}</p>
                            {selectedProducts.find(p => p.id === product.id) && (
                                <div className={styles.quantityControl}>
                                    <button onClick={(e) => { e.stopPropagation(); handleQuantityChange(selectedProducts.findIndex(p => p.id === product.id), -1); }} className={styles.quantityButton}>-</button>
                                    <span className={styles.quantity}>{selectedProducts.find(p => p.id === product.id).quantity}</span>
                                    <button onClick={(e) => { e.stopPropagation(); handleQuantityChange(selectedProducts.findIndex(p => p.id === product.id), 1); }} className={styles.quantityButton}>+</button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                <div className={styles.modalActions}>
                    <button className={styles.saveButton} onClick={handleSaveSelection}>Save</button>
                    <button className={styles.cancelButton} onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default ProductSelectionModal;
