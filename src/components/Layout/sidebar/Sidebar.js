import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Sidebar.module.css'; // Import the CSS module

const Sidebar = () => {
    return (
        <aside className={styles.sidebar}>
            <ul className={styles.linkList}>
                <li className={styles.linkItem}><Link to="/" className={styles.link}>Dashboard</Link></li>
                <li className={styles.linkItem}><Link to="/users" className={styles.link}>Users</Link></li>
                <li className={styles.linkItem}><Link to="/manage-products" className={styles.link}>Manage
                    Products</Link></li>
                <li className={styles.linkItem}><Link to="/add-product" className={styles.link}>Add Product</Link></li>
                <li className={styles.linkItem}><Link to="/add-recipe" className={styles.link}>Add Dish</Link></li>
                <li className={styles.linkItem}><Link to="/manage-orders" className={styles.link}>Manage Orders</Link>
                </li>
            </ul>
        </aside>
    );
}

export default Sidebar;
