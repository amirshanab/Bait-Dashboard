import React, { useState, useEffect } from 'react';
import styles from './EditProductModal.module.css';

const EditProductModal = ({ product, isOpen, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        Name: '',
        Price: 0,
        Description: '',
        Scale: false,
        Stock: 0,
        Image: ''
    });

    // Effect to reset form data when the product changes
    useEffect(() => {
        if (product) {
            setFormData({
                Name: product.Name || '',
                Price: product.Price || 0,
                Description: product.Description || '',
                Scale: product.Scale || false,
                Stock: product.Stock || 0,
                Image: product.Image || ''
            });
        }
    }, [product]);  // Dependency on product ensures this runs when product changes

    const handleChange = (e) => {
        const { name, type, value, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!product?.id) {
            console.error("Product ID is undefined in form data");
            return;
        }
        onSave({
            ...formData,
            id: product.id  // Ensure the id is passed for update operation
        });
    };

    if (!isOpen) return null;

    return (
        <div className={styles.modalBackground}>
            <div className={styles.modalContent}>
                <form onSubmit={handleSubmit}>
                    <div className={styles.formControl}>
                        <label>Name:</label>
                        <input name="Name" value={formData.Name} onChange={handleChange}/>
                    </div>
                    <div className={styles.formControl}>
                        <label>Price:</label>
                        <input name="Price" type="number" value={formData.Price} onChange={handleChange}/>
                    </div>
                    <div className={styles.formControl}>
                        <label>Description:</label>
                        <textarea name="Description" value={formData.Description} onChange={handleChange} rows="3"/>
                    </div>
                    <div className={styles.formControl}>
                        <label>Image URL:</label>
                        <input name="Image" value={formData.Image} onChange={handleChange}/>
                    </div>
                    <div>
                        <label>Sold By Scale?</label>
                        <input type="checkbox" className={styles.checkbox} name="Scale" checked={formData.Scale}
                               onChange={handleChange}/>
                    </div>

                    <div className={styles.formControl}>
                        <label>Stock:</label>
                        <input name="Stock" type="number" value={formData.Stock} onChange={handleChange}/>
                    </div>
                    <div className={styles.formControl}>
                        <button type="submit">Save Changes</button>
                        <button type="button" onClick={onClose}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProductModal;
