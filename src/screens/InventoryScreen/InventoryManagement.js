import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import styles from './InventoryManagement.module.css';

const InventoryManagement = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [filter, setFilter] = useState('All');
    const [editProduct, setEditProduct] = useState(null); // State to manage the product being edited

    useEffect(() => {
        const fetchProducts = async () => {
            const productsCollection = collection(db, 'Products');
            const productsSnapshot = await getDocs(productsCollection);
            const productsList = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setProducts(productsList);
            setFilteredProducts(productsList);
        };

        fetchProducts().then(() => console.log('Products fetched')).catch(e => console.error('Error fetching products:', e));
    }, []);

    useEffect(() => {
        filterProducts();
    }, [filter, products]);

    const filterProducts = () => {
        if (filter === 'All') {
            setFilteredProducts(products);
        } else if (filter === 'Short') {
            setFilteredProducts(products.filter(product => product.Stock > 0 && product.Stock <= 15));
        } else if (filter === 'Out') {
            setFilteredProducts(products.filter(product => product.Stock === 0));
        }
    };

    const handleEdit = (product) => {
        setEditProduct(product); // Set the product to be edited
    };

    const handleDelete = async (productId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this product?");
        if (!confirmDelete) return;

        try {
            await deleteDoc(doc(db, 'Products', productId));
            setProducts(products.filter(product => product.id !== productId)); // Update local state
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    const handleSaveEdit = async () => {
        try {
            const productRef = doc(db, 'Products', editProduct.id);
            await updateDoc(productRef, {
                Name: editProduct.Name,
                Price: editProduct.Price,
                Stock: editProduct.Stock,
                Image: editProduct.Image
            });
            setProducts(products.map(product => (product.id === editProduct.id ? editProduct : product)));
            setEditProduct(null); // Close the edit modal
        } catch (error) {
            console.error('Error updating product:', error);
        }
    };

    return (
        <div className={styles.container}>
            <h2>Inventory Management</h2>

            <div className={styles.filterContainer}>
                <button className={styles.filterButton} onClick={() => setFilter('All')}>All Products</button>
                <button className={styles.filterButton} onClick={() => setFilter('Short')}>Short in Stock</button>
                <button className={styles.filterButton} onClick={() => setFilter('Out')}>Out of Stock</button>
            </div>

            <div className={styles.productsGrid}>
                {filteredProducts.map(product => (
                    <div key={product.id} className={styles.productCard}>
                        <img src={product.Image} alt={product.Name} />
                        <p><strong>{product.Name}</strong></p>
                        <p>Price: ₪{product.Price}</p>
                        <p>Stock: {product.Stock}</p>
                        <div className={styles.actions}>
                            <button className={styles.editButton} onClick={() => handleEdit(product)}>Edit</button>
                            <button className={styles.deleteButton} onClick={() => handleDelete(product.id)}>Delete</button>
                        </div>
                    </div>
                ))}
            </div>

            {editProduct && (
                <div className={styles.overlay}>
                    <div className={styles.modal}>
                        <h3>Edit Product</h3>
                        <input
                            type="text"
                            placeholder="Name"
                            value={editProduct.Name}
                            onChange={(e) => setEditProduct({ ...editProduct, Name: e.target.value })}
                        />
                        <input
                            type="number"
                            placeholder="Price"
                            value={editProduct.Price}
                            onChange={(e) => setEditProduct({ ...editProduct, Price: parseFloat(e.target.value) })}
                        />
                        <input
                            type="number"
                            placeholder="Stock"
                            value={editProduct.Stock}
                            onChange={(e) => setEditProduct({ ...editProduct, Stock: parseInt(e.target.value, 10) })}
                        />
                        <input
                            type="text"
                            placeholder="Image URL"
                            value={editProduct.Image}
                            onChange={(e) => setEditProduct({ ...editProduct, Image: e.target.value })}
                        />
                        <div className={styles.modalActions}>
                            <button className={styles.saveButton} onClick={handleSaveEdit}>Save</button>
                            <button className={styles.cancelButton} onClick={() => setEditProduct(null)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InventoryManagement;
