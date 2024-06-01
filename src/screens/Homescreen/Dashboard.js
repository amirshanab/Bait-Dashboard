import React from 'react';
import {Link} from 'react-router-dom';
import styles from './Dashboard.module.css'; // Assume you have some styles defined

function Dashboard() {
    return (
        <div className={styles.dashboardContainer}>
            <Link to="/add-product">
                <div className={styles.button}>
                    <img src='https://cdn-icons-png.flaticon.com/512/10608/10608883.png' alt="Add Product"
                         className={styles.buttonImage}/>
                    <span>Add Product</span>
                </div>
            </Link>
            <Link to="/manage-products">
                <div className={styles.button}>
                    <img src='https://cdn-icons-png.flaticon.com/512/7023/7023090.png' alt="Manage Products"
                         className={styles.buttonImage}/>
                    <span>Manage Products</span>
                </div>
            </Link>
            <Link to="/manage-orders">
                <div className={styles.button}>
                    <img src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8lZsA3JNe_0bPy53ADp_sM-kbStGyEJ999A&s' alt="Manage Orders"
                         className={styles.buttonImage}/>
                    <span>Manage Orders</span>
                </div>
            </Link>

            <Link to="/users">
                <div className={styles.button}>
                    <img src='https://cdn-icons-png.flaticon.com/512/33/33308.png' alt="Users"
                         className={styles.buttonImage}/>
                    <span>Users</span>
                </div>
            </Link>
            <Link to="/add-recipe">
                <div className={styles.button}>
                    <img src='https://cdn-icons-png.flaticon.com/512/10608/10608883.png' alt="Add Recipe"
                         className={styles.buttonImage}/>
                    <span>Add Recipe</span>
                </div>
            </Link>

        </div>
    );
}

export default Dashboard;
