import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import styles from './OrderDetails.module.css';
import ProductSelectionModal from '../../components/ProductSelectionModal/ProductSelectionModal'; //

const OrderDetails = ({ order, onClose }) => {
    const [orderDetails, setOrderDetails] = useState(order);
    const [products, setProducts] = useState([]);
    const [showProductSelection, setShowProductSelection] = useState(false);
    const [currentItemId, setCurrentItemId] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            const productsCollection = collection(db, 'Products');
            const productsSnapshot = await getDocs(productsCollection);
            const productsList = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setProducts(productsList);
        };
        fetchProducts();
    }, []);

    const onDeleteProduct = async (orderId, itemId) => {
        const orderRef = doc(db, `Users/${orderDetails.user.id}/orders`, orderId);
        const updatedItems = orderDetails.items.filter(item => item.id !== itemId);
        try {
            await updateDoc(orderRef, { items: updatedItems });
            // Update the local state to reflect the change
            setOrderDetails(prevOrder => ({ ...prevOrder, items: updatedItems }));
        } catch (error) {
            console.error('Error deleting product from order:', error);
        }
    };

    const onReplaceProduct = (itemId) => {
        setCurrentItemId(itemId);
        setShowProductSelection(true);
    };

    const handleProductSelection = async (selectedProduct) => {
        const updatedItems = orderDetails.items.map(item => item.id === currentItemId ? {
            ...item,
            name: selectedProduct.Name,
            img: selectedProduct.Image,
            price: selectedProduct.Price,
            quantity: item.quantity
        } : item);

        const orderRef = doc(db, `Users/${orderDetails.user.id}/orders`, orderDetails.id);
        try {
            await updateDoc(orderRef, { items: updatedItems });
            // Update the local state to reflect the change
            setOrderDetails(prevOrder => ({ ...prevOrder, items: updatedItems }));
            setShowProductSelection(false);
        } catch (error) {
            console.error('Error replacing product in order:', error);
        }
    };

    if (!orderDetails) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.container}>
                <button onClick={onClose} className={styles.closeButton}>×</button>
                <h2 className={styles.heading}>Order Details</h2>
                <div className={styles.details}>
                    <p><strong>Name:</strong> {orderDetails.user?.name || 'Unknown'}</p>
                    <p><strong>Email:</strong> {orderDetails.user?.email || 'Unknown'}</p>
                    <p><strong>Phone:</strong> {orderDetails.user?.phoneNumber || 'Unknown'}</p>
                    <p><strong>Order Date:</strong> {orderDetails.orderDate}</p>
                    <p><strong>Total Amount:</strong> ${orderDetails.totalAmount}</p>
                    <p><strong>Order Status:</strong> {orderDetails.OrderStatus || 'Unknown'}</p>
                    <h3>Items:</h3>
                    <ul className={styles.itemList}>
                        {orderDetails.items.map((item, index) => (
                            <li key={item.id} className={styles.item}>
                                <img src={item.img} alt={item.name} className={styles.itemImage} />
                                <div className={styles.itemDetails}>
                                    <p><strong>Name:</strong> {item.name}</p>
                                    <p><strong>Price:</strong> ${item.price}</p>
                                    <p><strong>Quantity:</strong> {item.quantity}</p>
                                </div>
                                <div className={styles.itemActions}>
                                    <button
                                        onClick={() => onDeleteProduct(orderDetails.id, item.id)}
                                        className={styles.deleteButton}
                                    >
                                        Delete
                                    </button>
                                    <button
                                        onClick={() => onReplaceProduct(item.id)}
                                        className={styles.replaceButton}
                                    >
                                        Replace
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            {showProductSelection && (
                <ProductSelectionModal
                    products={products}
                    onClose={() => setShowProductSelection(false)}
                    onSelect={handleProductSelection}
                />
            )}
        </div>
    );
};

export default OrderDetails;
