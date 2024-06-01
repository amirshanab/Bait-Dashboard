import React from 'react';
import styles from './OrderDetails.module.css';

const OrderDetails = ({ order, onClose }) => {
    if (!order) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.container}>
                <button onClick={onClose} className={styles.closeButton}>×</button>
                <h2 className={styles.heading}>Order Details</h2>
                <div className={styles.details}>
                    <p><strong>Name:</strong> {order.user?.name || 'Unknown'}</p>
                    <p><strong>Email:</strong> {order.user?.email || 'Unknown'}</p>
                    <p><strong>Phone:</strong> {order.user?.phoneNumber || 'Unknown'}</p>
                    <p><strong>Order Date:</strong> {order.orderDate}</p>
                    <p><strong>Total Amount:</strong> ${order.totalAmount}</p>
                    <p><strong>Order Status:</strong> {order.OrderStatus || 'Unknown'}</p>
                    <h3>Items:</h3>
                    <ul className={styles.itemList}>
                        {order.items.map((item, index) => (
                            <li key={index} className={styles.item}>
                                <img src={item.img} alt={item.name} className={styles.itemImage} />
                                <div className={styles.itemDetails}>
                                    <p><strong>Name:</strong> {item.name}</p>
                                    <p><strong>Price:</strong> ${item.price}</p>
                                    <p><strong>Quantity:</strong> {item.quantity}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;
