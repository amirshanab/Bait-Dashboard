import React from 'react';
import styles from './ProductList.module.css';

const ProductList = ({ products, onDelete, onEdit }) => {
    return (
        <table className={styles.table}>
            <thead>
            <tr>
                <th className={styles.th}>Name</th>
                <th className={styles.th}>Price</th>
                <th className={styles.th}>Category</th>
                <th className={styles.th}>Description</th>
                <th className={styles.th}>Sold By</th>
                <th className={styles.th}>Actions</th>
            </tr>
            </thead>
            <tbody>
            {products.map((product) => (
                <tr key={product.id}>
                    <td className={styles.td}>{product.Name}</td> {/* Ensure this uses product.Name */}
                    <td className={styles.td}>${product.Price}</td>
                    <td className={styles.td}>{product.Category}</td>
                    <td className={styles.td}>{product.Description}</td>
                    <td className={styles.td}>{product.Scale ? 'Scale' : 'Quantity'}</td>
                    <td className={styles.td}>
                        <button className={`${styles.button} ${styles.edit}`} onClick={() => onEdit(product)}>Edit</button>
                        <button className={`${styles.button} ${styles.delete}`} onClick={() => onDelete(product.id)}>Delete</button>
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
    );
};


export default ProductList;
