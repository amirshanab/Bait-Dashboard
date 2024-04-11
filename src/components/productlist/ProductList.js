import React from 'react';
import styles from './ProductList.module.css'
const ProductList = ({ products, onDelete, onEdit }) => {
    return (
        <table className={styles.table}>
            <thead>
            <tr>
                <th className={styles.th}>Name</th>
                <th className={styles.th}>Price</th>
                <th className={styles.th}>Category</th>
                <th className={styles.th}>Sold By</th>
                <th className={styles.th}>Actions</th>
            </tr>
            </thead>
            <tbody>
            {products.map((product) => (
                <tr key={product.id}>
                    <td className={styles.td}>{product.name}</td>
                    <td className={styles.td}>${product.price}</td>
                    <td className={styles.td}>{product.category}</td>
                    <td className={styles.td}>{product.soldByScale ? 'Scale' : 'Quantity'}</td>
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
