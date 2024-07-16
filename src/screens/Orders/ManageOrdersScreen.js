import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import styles from './ManageOrdersScreen.module.css';
import OrderDetails from './OrderDetails'; // Import the new component

const ManageOrdersScreen = () => {
    const [orders, setOrders] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [filterStatus, setFilterStatus] = useState('All'); // State to toggle between all, pending, and done
    const [selectedOrder, setSelectedOrder] = useState(null); // State to track the selected order
    const [sortOption, setSortOption] = useState('orderDate'); // State to track the sorting option

    useEffect(() => {
        const fetchOrders = async () => {
            const usersCollection = collection(db, 'Users');
            const usersSnapshot = await getDocs(usersCollection);

            const allOrders = [];
            for (const userDoc of usersSnapshot.docs) {
                const userData = userDoc.data();
                const userOrdersCollection = collection(db, `Users/${userDoc.id}/orders`);
                const userOrdersSnapshot = await getDocs(userOrdersCollection);

                userOrdersSnapshot.forEach(orderDoc => {
                    const orderData = orderDoc.data();
                    console.log('Order Data:', orderData); // Debugging each order data

                    // Check and convert the Timestamp fields
                    const orderDate = orderData.orderDate ? orderData.orderDate.toDate().toString() : 'Unknown';
                    const scheduledDelivery = orderData.ScheduledDelivery ? orderData.ScheduledDelivery : 'Not Scheduled';

                    allOrders.push({
                        id: orderDoc.id,
                        ...orderData,
                        user: {
                            id: userDoc.id,
                            email: userData.email,
                            name: userData.name,
                            phoneNumber: userData.phoneNumber,
                        },
                        orderDate,
                        scheduledDelivery,
                        paymentMethod: orderData.PaymentMethod || 'Unknown', // Ensure field name matches exactly
                        totalAmount: orderData.totalAmount || 'Unknown'
                    });
                });
            }
            console.log('Fetched Orders:', allOrders); // Debugging
            setOrders(allOrders);
            setFilteredOrders(allOrders); // Initialize filtered orders with all orders
        };

        fetchOrders();
    }, []);

    const handleStatusChange = async (orderId, userId, newStatus) => {
        const orderRef = doc(db, `Users/${userId}/orders`, orderId);
        try {
            await updateDoc(orderRef, { OrderStatus: newStatus });
            const updatedOrders = orders.map(order =>
                order.id === orderId && order.user.id === userId
                    ? { ...order, OrderStatus: newStatus }
                    : order
            );
            setOrders(updatedOrders);
            filterOrders(updatedOrders, filterStatus, searchQuery, sortOption);
        } catch (error) {
            console.error('Error updating order status:', error);
        }
    };

    const handleStatusButtonClick = (orderId, userId, currentStatus) => {
        if (currentStatus === 'Done') {
            if (window.confirm('Are you sure you want to change the status back to Not Delivered?')) {
                handleStatusChange(orderId, userId, 'Pending');
            }
        } else {
            handleStatusChange(orderId, userId, 'Done');
        }
    };

    const handleSearchChange = (event) => {
        const query = event.target.value.toLowerCase();
        setSearchQuery(query);
        filterOrders(orders, filterStatus, query, sortOption);
    };

    const handleFilterChange = (status) => {
        setFilterStatus(status);
        filterOrders(orders, status, searchQuery, sortOption);
    };

    const handleSortChange = (option) => {
        setSortOption(option);
        filterOrders(orders, filterStatus, searchQuery, option);
    };

    const filterOrders = (orders, status, query, sortOption) => {
        const filtered = orders.filter(order => {
            const matchesStatus = status === 'All' || order.OrderStatus === status;
            const matchesQuery = order.user.name.toLowerCase().includes(query)
                || order.user.email.toLowerCase().includes(query)
                || order.user.phoneNumber.includes(query);
            return matchesStatus && matchesQuery;
        });

        const sorted = filtered.sort((a, b) => {
            if (sortOption === 'orderDate') {
                return new Date(a.orderDate) - new Date(b.orderDate);
            } else if (sortOption === 'scheduledDelivery') {
                return new Date(a.scheduledDelivery) - new Date(b.scheduledDelivery);
            } else {
                return 0;
            }
        });

        setFilteredOrders(sorted);
    };

    const handleOrderClick = (order) => {
        setSelectedOrder(order);
    };

    const handleCloseOrderDetails = () => {
        setSelectedOrder(null);
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.heading}>Manage Orders</h2>
            <input
                type="text"
                placeholder="Search by name, email or phone number"
                value={searchQuery}
                onChange={handleSearchChange}
                className={styles.searchBar}
            />
            <div className={styles.filterContainer}>
                <button
                    onClick={() => handleFilterChange('All')}
                    className={`${styles.filterButton} ${filterStatus === 'All' ? styles.active : ''}`}
                >
                    All
                </button>
                <button
                    onClick={() => handleFilterChange('Pending')}
                    className={`${styles.filterButton} ${filterStatus === 'Pending' ? styles.active : ''}`}
                >
                    Pending
                </button>
                <button
                    onClick={() => handleFilterChange('Done')}
                    className={`${styles.filterButton} ${filterStatus === 'Done' ? styles.active : ''}`}
                >
                    Done
                </button>
            </div>
            <div className={styles.sortContainer}>
                <label>Sort by: </label>
                <select onChange={(e) => handleSortChange(e.target.value)} value={sortOption}>
                    <option value="orderDate">Order Date</option>
                    <option value="scheduledDelivery">Scheduled Delivery</option>
                </select>
            </div>
            <ul className={styles.orderList}>
                {filteredOrders.map(order => (
                    <li key={order.id} className={styles.orderItem}>
                        <div>
                            <p><strong>Name:</strong> {order.user?.name || 'Unknown'}</p>
                            <p><strong>Phone:</strong> {order.user?.phoneNumber || 'Unknown'}</p>
                            <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
                            <p><strong>Scheduled Delivery:</strong> {order.scheduledDelivery}</p>
                            <p><strong>Total Amount:</strong> ${order.totalAmount}</p>
                        </div>
                        <div className={styles.buttonContainer}>
                            <button
                                onClick={() => handleStatusButtonClick(order.id, order.user.id, order.OrderStatus)}
                                className={`${styles.statusButton} ${order.OrderStatus === 'Done' ? styles.done : styles.pending}`}>
                                {order.OrderStatus === 'Pending' ? 'Mark as Delivered' : 'Delivered'}
                            </button>
                            <button onClick={() => handleOrderClick(order)} className={styles.viewDetailsButton}>View Details</button>
                        </div>
                    </li>
                ))}
            </ul>
            {selectedOrder && <OrderDetails order={selectedOrder} onClose={handleCloseOrderDetails} />}
        </div>
    );
};

export default ManageOrdersScreen;
