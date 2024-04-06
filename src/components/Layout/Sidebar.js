import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
    return (
        <aside style={{width: '200px', height: '100vh', backgroundColor: '#eee', padding: '20px'}}>
            <ul style={{listStyleType: 'none', padding: 0}}>
                <li><Link to="/">Dashboard</Link></li>
                <li><Link to="/users">Users</Link></li>
                <li><Link to="/products">Products</Link></li>
                <li><Link to="/orders">Orders</Link></li>
                <li><Link to="/manage-products">Manage Products</Link></li>
                <li><Link to="/add-product">Add Product</Link></li>
            </ul>
        </aside>
    );
}

export default Sidebar;
