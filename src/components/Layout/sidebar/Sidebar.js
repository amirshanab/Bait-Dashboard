import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './Sidebar.module.css'; // Import the CSS module

const Sidebar = () => {
    return (
        <aside className={styles.sidebar}>
            <ul className={styles.linkList}>
                <li className={styles.linkItem}>
                    <NavLink
                        to="/"
                        className={({ isActive }) => isActive ? styles.activeLink : styles.link}
                        end
                    >
                        Dashboard
                    </NavLink>
                </li>
                <li className={styles.linkItem}>
                    <NavLink
                        to="/analytics"
                        className={({ isActive }) => isActive ? styles.activeLink : styles.link}
                    >
                        Analytics
                    </NavLink>
                </li>
                <li className={styles.linkItem}>
                    <NavLink
                        to="/manage-users"
                        className={({ isActive }) => isActive ? styles.activeLink : styles.link}
                    >
                        Manage Users
                    </NavLink>
                </li>

                <li className={styles.linkItem}>
                    <NavLink
                        to="/manage-orders"
                        className={({ isActive }) => isActive ? styles.activeLink : styles.link}
                    >
                        Manage Orders
                    </NavLink>
                </li>
                <li className={styles.linkItem}>
                    <NavLink
                        to="/manage-categories"
                        className={({ isActive }) => isActive ? styles.activeLink : styles.link}
                    >
                        Manage Categories
                    </NavLink>
                </li>
                <li className={styles.linkItem}>
                    <NavLink
                        to="/inventory"
                        className={({ isActive }) => isActive ? styles.activeLink : styles.link}
                    >
                        Inventory
                    </NavLink>
                </li>
                <li className={styles.linkItem}>
                    <li className={styles.linkItem}>
                        <NavLink
                            to="/manage-regions"
                            className={({isActive}) => isActive ? styles.activeLink : styles.link}
                        >
                            Manage Dishes
                        </NavLink>
                    </li>
                </li>
            </ul>
        </aside>
    );
}

export default Sidebar;
