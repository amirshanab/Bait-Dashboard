import React, { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import ProductSelectionModal from '../../components/ProductSelectionModal/ProductSelectionModal';
import styles from './OrderDetails.module.css';

const OrderDetails = ({ order, onClose }) => {
    const [products, setProducts] = useState(order.items || []);
    const [showProductModal, setShowProductModal] = useState(false);

    const handleAddProduct = (selectedProducts) => {
        const updatedProducts = [...products, ...selectedProducts];
        setProducts(updatedProducts);
        setShowProductModal(false);
    };

    const handleRemoveProduct = (product) => {
        const updatedProducts = products.filter(p => p !== product);
        setProducts(updatedProducts);
    };

    const handleSaveChanges = async () => {
        try {
            const orderDocRef = doc(db, `Users/${order.user.id}/orders/${order.id}`);
            await updateDoc(orderDocRef, {
                items: products,
            });
            alert('Order updated successfully!');
            onClose(); // Close the modal
            window.location.reload(); // Refresh the page
        } catch (error) {
            console.error('Error updating order:', error);
            alert('Failed to update order. Please try again.');
        }
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modal}>
                <div className={styles.modalHeader}>
                    <h3>Order Details</h3>
                    <button onClick={onClose} className={styles.closeButton}>X</button>
                </div>
                <div className={styles.productList}>
                    {products.map((product, index) => (
                        <div key={index} className={styles.productItem}>
                            <img src={product.Image} alt={product.Name} className={styles.productImage} />
                            <div className={styles.productDetails}>
                                <p><strong>{product.Name}</strong></p>
                                <p>Price: ${product.Price}</p>
                                <p>Quantity: {product.quantity}</p>
                            </div>
                            <button
                                onClick={() => handleRemoveProduct(product)}
                                className={styles.removeButton}
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                </div>
                <div className={styles.buttonContainer}>
                    <button className={styles.addButton} onClick={() => setShowProductModal(true)}>
                        Add Product
                    </button>
                    <button className={styles.saveButton} onClick={handleSaveChanges}>
                        Save Changes
                    </button>
                </div>

                {showProductModal && (
                    <ProductSelectionModal
                        onClose={() => setShowProductModal(false)}
                        onSelect={handleAddProduct}
                    />
                )}
            </div>
        </div>
    );
};

export default OrderDetails;
