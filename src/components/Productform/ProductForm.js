import React, { useState } from 'react';
import CategorySelector from '../CategorySelector';
import styles from './ProductForm.module.css'; // Assuming this file already exists and includes styles for your form

const ProductForm = ({ onSubmit, initialProduct = {} }) => {
    const [product, setProduct] = useState(initialProduct);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setProduct({ ...product, [name]: type === 'checkbox' ? checked : value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(product);
    };

    return (
        <form onSubmit={handleSubmit} className={styles.formContainer}>
            <CategorySelector onSelectCategory={(category) => setProduct({...product, category})}/>
            <input
                className={styles.input}
                name="name"
                placeholder="Product Name"
                value={product.name || ''}
                onChange={handleChange}
            />

            <textarea
                className={styles.textarea}
                name="description"
                placeholder="Description"
                value={product.description || ''}
                onChange={handleChange}
            />
            <input
                className={styles.input}
                name="image"
                placeholder="Image URL"
                value={product.image || ''}
                onChange={handleChange}
            />
            <label className={styles.label}>
                Sold by Scale?
                <input
                    className={styles.checkbox}
                    type="checkbox"
                    name="soldByScale"
                    checked={product.soldByScale || false}
                    onChange={handleChange}
                />
            </label>
            <input
                className={styles.input}
                type="number"
                name="price"
                placeholder="Price"
                value={product.price || ''}
                onChange={handleChange}
            />
            {/* Amount or Quantity Input */}
            <input
                className={styles.input}
                type="number"
                name="quantity"
                placeholder="Quantity"
                value={product.quantity || ''}
                onChange={handleChange}
                min="0" // Ensures that the value cannot be negative
            />
            <button className={styles.button} type="submit">Add</button>
        </form>
    );
};

export default ProductForm;
