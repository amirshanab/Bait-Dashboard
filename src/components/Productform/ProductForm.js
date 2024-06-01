import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import CategorySelector from '../catagory selector/CategorySelector';
import styles from './ProductForm.module.css';

const ProductForm = ({ onSubmit, initialProduct = {} }) => {
    const [product, setProduct] = useState({
        ...initialProduct,
        Scale: initialProduct.Scale || false // Ensure Scale is always included
    });
    const [notification, setNotification] = useState('');

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (name === 'Category') {
            setProduct({ ...product, [name]: `/Categories/${value}` });
        } else {
            setProduct({ ...product, [name]: type === 'checkbox' ? checked : value });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const id = uuidv4();
        onSubmit({ ...product, ID: id }).then(() => {
            setNotification('Product added successfully!');
            // Reset form fields
            setProduct({
                Name: '',
                Description: '',
                Image: '',
                Category: '',
                Scale: false,
                Price: '',
                Stock: ''
            });
            // Remove notification after a delay
            setTimeout(() => setNotification(''), 3000);
        }).catch(error => {
            setNotification('Failed to add product: ' + error.message);
            setTimeout(() => setNotification(''), 3000);
        });
    };

    return (
        <form onSubmit={handleSubmit} className={styles.formContainer}>
            {notification && <div className={styles.notification}>{notification}</div>}
            <CategorySelector onSelectCategory={(category) => handleChange({
                target: {
                    name: 'Category',
                    value: category,
                    type: 'select'
                }
            })}/>
            <input className={styles.input} name="Name" placeholder="Product Name" value={product.Name || ''} onChange={handleChange} />
            <textarea className={styles.textarea} name="Description" placeholder="Description" value={product.Description || ''} onChange={handleChange} />
            <input className={styles.input} name="Image" placeholder="Image URL" value={product.Image || ''} onChange={handleChange} />
            <label className={styles.label}>Sold by Scale?
                <input className={styles.checkbox} type="checkbox" name="Scale" checked={product.Scale || false} onChange={handleChange} />
            </label>
            <input className={styles.input} type="number" name="Price" placeholder="Price" value={product.Price || ''} onChange={handleChange} />
            <input className={styles.input} type="number" name="Stock" placeholder="Stock" value={product.Stock || ''} onChange={handleChange} min="0" />
            <button className={styles.button} type="submit">Add</button>
        </form>
    );
};

export default ProductForm;
