import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Dashboard.module.css';

function Dashboard() {
    return (
        <div className={styles.dashboardContainer}>
            <Link to="/add-product">
                <div className={styles.button}>
                    <img src='https://cdn-icons-png.flaticon.com/512/10608/10608883.png' alt="Add Product" className={styles.buttonImage} />
                    <span>Add Product</span>
                </div>
            </Link>
            <Link to="/analytics">
                <div className={styles.button}>
                    <img src='https://cdn-icons-png.flaticon.com/128/16365/16365511.png' alt="Analytics" className={styles.buttonImage} />
                    <span>Analytics</span>
                </div>
            </Link>
            <Link to="/manage-products">
                <div className={styles.button}>
                    <img src='https://cdn-icons-png.flaticon.com/128/10112/10112509.png' alt="Manage Products" className={styles.buttonImage} />
                    <span>Manage Products</span>
                </div>
            </Link>
            <Link to="/manage-orders">
                <div className={styles.button}>
                    <img src='https://cdn-icons-png.flaticon.com/128/16963/16963052.png' alt="Manage Orders" className={styles.buttonImage} />
                    <span>Manage Orders</span>
                </div>
            </Link>
            <Link to="/manage-users">
                <div className={styles.button}>
                    <img src='https://cdn-icons-png.flaticon.com/128/4168/4168988.png' alt="Manage Users" className={styles.buttonImage} />
                    <span>Manage Users</span>
                </div>
            </Link>
            <Link to="/inventory">
                <div className={styles.button}>
                    <img src='https://cdn-icons-png.flaticon.com/128/7656/7656409.png' alt="Inventory Management" className={styles.buttonImage} />
                    <span>Inventory Management</span>
                </div>
            </Link>
            <Link to="/manage-regions">
                <div className={styles.button}>
                    <img src='https://cdn-icons-png.flaticon.com/512/3050/3050135.png' alt="Manage Regions" className={styles.buttonImage} />
                    <span>Manage Dishes</span>
                </div>
            </Link>
        </div>
    );
}

export default Dashboard;
