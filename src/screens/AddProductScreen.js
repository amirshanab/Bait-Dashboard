import React from 'react';
import ProductForm from '../components/ProductForm';

const AddProductScreen = () => {
    const handleAddProduct = (product) => {
        // API call to add the product
        console.log(product);
    };

    return (
        <div>
            <h2>Add Product</h2>
            <ProductForm onSubmit={handleAddProduct} />
        </div>
    );
};

export default AddProductScreen;
