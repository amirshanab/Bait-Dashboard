import React from 'react';
import ProductForm from '../components/Productform/ProductForm';

const styles = {
    screenContainer: {
        display: 'flex',
        flexDirection: 'column',
        padding: '20px',
    },
    title: {
        color: '#333',
    },
};

const AddProductScreen = () => {
    const handleAddProduct = (product) => {
        // API call to add the product
        console.log(product);
    };

    return (
        <div style={styles.screenContainer}>
            <h2 style={styles.title}>Add Product</h2>
            <ProductForm onSubmit={handleAddProduct} />
        </div>
    );
};

export default AddProductScreen;
