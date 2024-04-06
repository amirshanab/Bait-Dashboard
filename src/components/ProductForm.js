import React, { useState } from 'react';
import CategorySelector from './CategorySelector';

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
        <form onSubmit={handleSubmit}>
            <CategorySelector onSelectCategory={(category) => setProduct({ ...product, category })} />
            <input name="name" placeholder="Product Name" value={product.name || ''} onChange={handleChange} />
            <input type="number" name="price" placeholder="Price" value={product.price || ''} onChange={handleChange} />
            <textarea name="description" placeholder="Description" value={product.description || ''} onChange={handleChange} />
            <input name="image" placeholder="Image URL" value={product.image || ''} onChange={handleChange} />
            <label>
                Sold by Scale?
                <input type="checkbox" name="soldByScale" checked={product.soldByScale || false} onChange={handleChange} />
            </label>
            <button type="submit">Submit</button>
        </form>
    );
};

export default ProductForm;
