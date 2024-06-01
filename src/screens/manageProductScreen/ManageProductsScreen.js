import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import ProductList from '../../components/productlist/ProductList';
import { db } from '../../firebaseConfig';
import { Link } from 'react-router-dom';
import styles from './ManageProductsScreen.module.css';
import {deleteDoc,updateDoc, doc} from "firebase/firestore";
import EditProductModal from "../../components/Editproduct/EditProductModal";

const fetchCategories = async () => {
    const categoryCollection = collection(db, 'Categories');
    const categorySnapshot = await getDocs(categoryCollection);
    const categories = categorySnapshot.docs.map(doc => doc.data().Name);
    return categories;
};

const fetchProducts = async (category) => {
    console.log("Fetching Products for Category:", category); // Debugging
    try {
        const productsCollection = collection(db, 'Products');
        const q = query(productsCollection, where('Category', '==', "/Categories/"+category));
        const querySnapshot = await getDocs(q);
        const products = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log("Fetched Products:", products); // Check what's fetched
        return products;
    } catch (error) {
        console.error("Failed to fetch products:", error);
        return [];
    }
};

const ManageProductsScreen = () => {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [products, setProducts] = useState([]);
    const [editProduct, setEditProduct] = useState(null);

    useEffect(() => {
        fetchCategories().then(setCategories);
    }, []);

    useEffect(() => {
        console.log("Selected Category for Fetching Products:", selectedCategory); // Debugging
        if (selectedCategory) {
            fetchProducts(selectedCategory).then(setProducts);
        }
    }, [selectedCategory]);

    const handleDelete = async (productId) => {
        const productRef = doc(db, 'Products', productId);
        try {
            await deleteDoc(productRef);
            console.log('Product deleted:', productId);
            // Optionally refresh the list or remove the item from local state
            setProducts(products.filter(product => product.id !== productId));
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };


    const handleEdit = (product) => {
        if (!product.id) {
            console.error("Product ID is missing in the product data");
            return;
        }
        setEditProduct(product); // Ensure product includes 'id'
    };


    const handleSaveEdit = async (updatedProduct) => {
        if (!updatedProduct.id) {
            console.error('Product ID is undefined');
            return;
        }
        const productRef = doc(db, 'Products', updatedProduct.id);

        const updatedFields = Object.keys(updatedProduct).reduce((acc, key) => {
            if (key !== 'id' && updatedProduct[key] !== editProduct[key]) {
                acc[key] = updatedProduct[key];
            }
            return acc;
        }, {});

        try {
            await updateDoc(productRef, updatedFields);
            console.log('Product updated:', updatedProduct.id);
            setProducts(products.map(prod => prod.id === updatedProduct.id ? { ...prod, ...updatedFields } : prod));
            setEditProduct(null);
        } catch (error) {
            console.error('Error updating product:', error);
        }
    };



    const handleCloseModal = () => {
        setEditProduct(null);
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.heading}>Manage Products</h2>
            <select onChange={(e) => setSelectedCategory(e.target.value)} value={selectedCategory}>
                <option value="">Select a Category</option>
                {categories.map((category, index) => (
                    <option key={index} value={category}>{category}</option>
                ))}
            </select>
            <Link to="/add-product" className={styles.addLink}>Add New Product</Link>
            <ProductList products={products} onDelete={handleDelete} onEdit={handleEdit} />
            <EditProductModal
                product={editProduct}
                isOpen={!!editProduct}
                onClose={handleCloseModal}
                onSave={handleSaveEdit}
            />
        </div>
    );
};

export default ManageProductsScreen;
