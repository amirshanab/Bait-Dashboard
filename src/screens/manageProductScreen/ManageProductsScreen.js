import React, { useState, useEffect } from 'react';
import { collection, deleteDoc, doc, getDocs, query, setDoc, updateDoc, where } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import styles from './ManageProductsScreen.module.css';

const ManageProductsScreen = ({ category, goBack }) => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editProductData, setEditProductData] = useState({ name: '', image: '', description: '', price: 0, stock: 0, scale: false });
    const [isAdding, setIsAdding] = useState(false);
    const [newProductData, setNewProductData] = useState({ name: '', image: '', description: '', price: 0, stock: 0, scale: false });

    useEffect(() => {
        if (category && category.ID) {
            const fetchProducts = async () => {
                const productsCollection = collection(db, 'Products');
                const q = query(productsCollection, where('Category', '==', `/Categories/${category.Name}`));
                const productsSnapshot = await getDocs(q);
                const productsList = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setProducts(productsList);
                setFilteredProducts(productsList);
            };

            fetchProducts().then(() => console.log('Products fetched')).catch(e => console.error('Error fetching products:', e));
        }
    }, [category]);

    const handleDeleteProduct = async (productId) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            await deleteDoc(doc(db, 'Products', productId));
            setProducts(products.filter(product => product.id !== productId));
            setFilteredProducts(filteredProducts.filter(product => product.id !== productId));
        }
    };

    const handleEditProduct = (product) => {
        setIsEditing(true);
        setEditProductData({
            id: product.id,
            name: product.Name,
            image: product.Image,
            description: product.Description,
            price: product.Price,
            stock: product.Stock,
            scale: product.Scale
        });
    };

    const handleUpdateProduct = async () => {
        const { id, name, image, description, price, stock, scale } = editProductData;
        await updateDoc(doc(db, 'Products', id), {
            Name: name,
            Image: image,
            Description: description,
            Price: price,
            Stock: stock,
            Scale: scale
        });
        setProducts(products.map(product => (product.id === id ? { id, Name: name, Image: image, Description: description, Price: price, Stock: stock, Scale: scale } : product)));
        setFilteredProducts(filteredProducts.map(product => (product.id === id ? { id, Name: name, Image: image, Description: description, Price: price, Stock: stock, Scale: scale } : product)));
        setIsEditing(false);
    };

    const handleAddProduct = async () => {
        const { name, image, description, price, stock, scale } = newProductData;
        const newProductRef = doc(collection(db, 'Products')); // Generate a new document reference
        const productID = newProductRef.id; // Extract the generated ID

        await setDoc(newProductRef, {
            ID: productID, // Add the generated ID to the document
            Name: name,
            Image: image,
            Description: description,
            Price: price,
            Stock: stock,
            Scale: scale,
            Category: `/Categories/${category.Name}`
        });

        const newProduct = { id: productID, Name: name, Image: image, Description: description, Price: price, Stock: stock, Scale: scale, Category: `/Categories/${category.Name}` };
        setProducts([...products, newProduct]);
        setFilteredProducts([...filteredProducts, newProduct]);
        setIsAdding(false);

        // Reset newProductData to clear the form for the next product addition
        setNewProductData({ name: '', image: '', description: '', price: 0, stock: 0, scale: false });
    };

    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);
        setFilteredProducts(products.filter(product => product.Name.toLowerCase().includes(query)));
    };

    const closeModal = () => {
        setIsEditing(false);
        setIsAdding(false);
    };

    const openAddProductModal = () => {
        setNewProductData({ name: '', image: '', description: '', price: 0, stock: 0, scale: false });
        setIsAdding(true);
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <button onClick={goBack} className={styles.backButton}>Back to Categories</button>
                <h2 className={styles.heading}>Manage Products in {category?.Name}</h2>
            </div>
            <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={handleSearch}
                className={styles.searchBar}
            />
            {isEditing && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <h3>Edit Product</h3>
                        <div className={styles.fieldContainer}>
                            <input
                                type="text"
                                value={editProductData.name}
                                onChange={(e) => setEditProductData({ ...editProductData, name: e.target.value })}
                                placeholder="Product Name"
                                className={styles.inputField}
                            />
                            <label className={styles.fieldLabel}>Name</label>
                        </div>
                        <div className={styles.fieldContainer}>
                            <input
                                type="text"
                                value={editProductData.image}
                                onChange={(e) => setEditProductData({ ...editProductData, image: e.target.value })}
                                placeholder="Image URL"
                                className={styles.inputField}
                            />
                            <label className={styles.fieldLabel}>Image URL</label>
                        </div>
                        <div className={styles.fieldContainer}>
                            <textarea
                                value={editProductData.description}
                                onChange={(e) => setEditProductData({ ...editProductData, description: e.target.value })}
                                placeholder="Description"
                                className={styles.textarea}
                            />
                            <label className={styles.fieldLabel}>Description</label>
                        </div>
                        <div className={styles.fieldContainer}>
                            <input
                                type="number"
                                value={editProductData.price}
                                onChange={(e) => setEditProductData({ ...editProductData, price: parseFloat(e.target.value) })}
                                placeholder="Price"
                                className={styles.inputField}
                            />
                            <label className={styles.fieldLabel}>Price</label>
                        </div>
                        <div className={styles.fieldContainer}>
                            <input
                                type="number"
                                value={editProductData.stock}
                                onChange={(e) => setEditProductData({ ...editProductData, stock: parseInt(e.target.value, 10) })}
                                placeholder="Stock"
                                className={styles.inputField}
                            />
                            <label className={styles.fieldLabel}>Stock</label>
                        </div>
                        <div className={styles.fieldContainer}>
                            <label>
                                <input
                                    type="checkbox"
                                    checked={editProductData.scale}
                                    onChange={(e) => setEditProductData({ ...editProductData, scale: e.target.checked })}
                                />
                                Sold by Scale?
                            </label>
                        </div>
                        <div className={styles.modalActions}>
                            <button onClick={handleUpdateProduct} className={styles.saveButton}>Save</button>
                            <button onClick={closeModal} className={styles.cancelButton}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {isAdding && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <h3>Add New Product</h3>
                        <div className={styles.fieldContainer}>
                            <input
                                type="text"
                                value={newProductData.name}
                                onChange={(e) => setNewProductData({ ...newProductData, name: e.target.value })}
                                placeholder="Product Name"
                                className={styles.inputField}
                            />
                            <label className={styles.fieldLabel}>Name</label>
                        </div>
                        <div className={styles.fieldContainer}>
                            <input
                                type="text"
                                value={newProductData.image}
                                onChange={(e) => setNewProductData({ ...newProductData, image: e.target.value })}
                                placeholder="Image URL"
                                className={styles.inputField}
                            />
                            <label className={styles.fieldLabel}>Image URL</label>
                        </div>
                        <div className={styles.fieldContainer}>
                            <textarea
                                value={newProductData.description}
                                onChange={(e) => setNewProductData({ ...newProductData, description: e.target.value })}
                                placeholder="Description"
                                className={styles.textarea}
                            />
                            <label className={styles.fieldLabel}>Description</label>
                        </div>
                        <div className={styles.fieldContainer}>
                            <input
                                type="number"
                                value={newProductData.price}
                                onChange={(e) => setNewProductData({ ...newProductData, price: parseFloat(e.target.value) })}
                                placeholder="Price"
                                className={styles.inputField}
                            />
                            <label className={styles.fieldLabel}>Price</label>
                        </div>
                        <div className={styles.fieldContainer}>
                            <input
                                type="number"
                                value={newProductData.stock}
                                onChange={(e) => setNewProductData({ ...newProductData, stock: parseInt(e.target.value, 10) })}
                                placeholder="Stock"
                                className={styles.inputField}
                            />
                            <label className={styles.fieldLabel}>Stock</label>
                        </div>
                        <div className={styles.fieldContainer}>
                            <label>
                                <input
                                    type="checkbox"
                                    checked={newProductData.scale}
                                    onChange={(e) => setNewProductData({ ...newProductData, scale: e.target.checked })}
                                />
                                Sold by Scale?
                            </label>
                        </div>
                        <div className={styles.modalActions}>
                            <button onClick={handleAddProduct} className={styles.saveButton}>Add</button>
                            <button onClick={closeModal} className={styles.cancelButton}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
            <div className={styles.productsContainer}>
                <div className={styles.addCard} onClick={openAddProductModal}>
                    <span className={styles.plusSign}>+</span>
                    <p>Add New Product</p>
                </div>
                {filteredProducts.map(product => (
                    <div key={product.id} className={styles.productCard}>
                        <img src={product.Image} alt={product.Name} className={styles.productImage} />
                        <p>{product.Name}</p>
                        <div className={styles.options}>
                            <button onClick={() => handleEditProduct(product)} className={styles.editButton}>Edit</button>
                            <button onClick={() => handleDeleteProduct(product.id)} className={styles.deleteButton}>Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ManageProductsScreen;
