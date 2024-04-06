import React from 'react';

const ProductList = ({ products, onDelete, onEdit }) => {
    return (
        <table>
            <thead>
            <tr>
                <th>Name</th>
                <th>Price</th>
                <th>Category</th>
                <th>Sold By</th>
                <th>Actions</th>
            </tr>
            </thead>
            <tbody>
            {products.map((product) => (
                <tr key={product.id}>
                    <td>{product.name}</td>
                    <td>${product.price}</td>
                    <td>{product.category}</td>
                    <td>{product.soldByScale ? 'Scale' : 'Quantity'}</td>
                    <td>
                        <button onClick={() => onEdit(product)}>Edit</button>
                        <button onClick={() => onDelete(product.id)}>Delete</button>
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
    );
};

export default ProductList;
