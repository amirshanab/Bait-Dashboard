import React from 'react';
import ProductForm from '../components/Productform/ProductForm';
import { db } from '../firebaseConfig';
import { collection, setDoc, doc } from 'firebase/firestore';

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
    const handleAddProduct = async (product) => {
        try {
            // Use the product's Name field as the document ID
            const productRef = doc(collection(db, "Products"), product.Name);
            await setDoc(productRef, product);
            console.log("Product added with Name:", product.Name);
        } catch (error) {
            console.error("Error adding product:", error);
        }
    };

    return (
        <div style={styles.screenContainer}>
            <h2 style={styles.title}>Add Product</h2>
            <ProductForm onSubmit={handleAddProduct} />
        </div>
    );
};

export default AddProductScreen;
