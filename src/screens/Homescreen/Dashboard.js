import React from 'react';
import {Link} from 'react-router-dom';
import styles from './Dashboard.module.css';

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
            <Link to="/analytics">
                <div className={styles.button}>
                    <img src='https://media.istockphoto.com/id/1257312690/vector/analytics-bar-graph-icon.jpg?s=612x612&w=0&k=20&c=3u12q178en00xfxgjwz3xRaTGwrGmWFRdDc3HbJOGHw=' alt="Analytics"
                         className={styles.buttonImage}/>
                    <span>Analytics</span>
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
            <Link to="/manage-users">
                <div className={styles.button}>
                    <img src='https://i.pinimg.com/564x/44/5b/79/445b7970c15895a405f32c69a0412000.jpg' alt="Manage Users"
                         className={styles.buttonImage}/>
                    <span>Manage Users</span>
                </div>
            </Link>

            <Link to="/add-recipe">
                <div className={styles.button}>
                    <img src='https://img.freepik.com/premium-vector/dish-icon-logo-element-illustration-dish-symbol-design-from-2-colored-collection-simple-dish-concept-can-be-used-web-mobile_159242-5034.jpg' alt="Add Recipe"
                         className={styles.buttonImage}/>
                    <span>Add Recipe</span>
                </div>
            </Link>

        </div>
    );
}

export default Dashboard;
