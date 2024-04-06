import React, { useState, useEffect } from 'react';
import ProductList from '../components/ProductList';
import { Link } from 'react-router-dom';

// Mock function to fetch products
// Replace with your actual API call

//todo fire base
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
        // API call to delete the product
        console.log('Deleting product with ID:', productId);
        // Update local state after deleting
        setProducts(products.filter(product => product.id !== productId));
    };

    const handleEdit = (product) => {
        // Navigate to the edit product screen
        // You'll need to set this up with react-router-dom and pass the product data
        console.log('Editing product:', product);
    };

    return (
        <div>
            <h2>Manage Products</h2>
            <Link to="/add-product">Add New Product</Link>
            <ProductList products={products} onDelete={handleDelete} onEdit={handleEdit} />
        </div>
    );
};

export default ManageProductsScreen;
