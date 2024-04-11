import React, { useState, useEffect } from 'react';
import ProductList from '../../components/productlist/ProductList'
import { Link } from 'react-router-dom';
import styles from './ManageProductsScreen.module.css'
const fetchProducts = () => Promise.resolve([
    { id: 1, name: 'Apples', price: 1.99, category: 'Fruits', soldByScale: false },
    // Add more mock products here
]);

const ManageProductsScreen = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetchProducts().then(setProducts);
    }, []);

    const handleDelete = (productId) => {
        console.log('Deleting product with ID:', productId);
        setProducts(products.filter(product => product.id !== productId));
    };

    const handleEdit = (product) => {
        console.log('Editing product:', product);
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.heading}>Manage Products</h2>
            <Link to="/add-product" className={styles.addLink}>Add New Product</Link>
            <ProductList products={products} onDelete={handleDelete} onEdit={handleEdit} />
        </div>
    );
};

export default ManageProductsScreen;
