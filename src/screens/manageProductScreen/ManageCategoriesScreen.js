import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, deleteDoc, addDoc, updateDoc, query, where, writeBatch } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import ManageProductsScreen from './ManageProductsScreen';
import styles from './ManageCategoriesScreen.module.css';

const ManageCategoriesScreen = () => {
    const [categories, setCategories] = useState([]);
    const [filteredCategories, setFilteredCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editCategoryData, setEditCategoryData] = useState({ name: '', image: '', description: '' });
    const [isAdding, setIsAdding] = useState(false);
    const [newCategoryData, setNewCategoryData] = useState({ name: '', image: '', description: '' });
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchCategories = async () => {
            const categoriesCollection = collection(db, 'Categories');
            const categoriesSnapshot = await getDocs(categoriesCollection);
            const categoriesList = categoriesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setCategories(categoriesList);
            setFilteredCategories(categoriesList); // Initialize filtered categories
        };

        fetchCategories().then(() => console.log('Categories fetched')).catch(e => console.error('Error fetching categories:', e));
    }, []);

    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
        setFilteredCategories(
            categories.filter(category =>
                category.Name.toLowerCase().includes(term)
            )
        );
    };

    const handleDeleteCategory = async (categoryId, categoryName) => {
        if (window.confirm('Are you sure you want to delete this category and all its associated products?')) {
            const productsCollection = collection(db, 'Products');
            const q = query(productsCollection, where('Category', '==', `/Categories/${categoryName}`));
            const productsSnapshot = await getDocs(q);
            const batch = writeBatch(db);

            productsSnapshot.docs.forEach(doc => {
                batch.delete(doc.ref);
            });

            await batch.commit();
            await deleteDoc(doc(db, 'Categories', categoryId));
            setCategories(categories.filter(category => category.id !== categoryId));
            setFilteredCategories(filteredCategories.filter(category => category.id !== categoryId)); // Update filtered categories as well
        }
    };

    const handleEditCategory = (category) => {
        setIsEditing(true);
        setEditCategoryData({ id: category.id, name: category.Name, image: category.Image, description: category.Description });
    };

    const handleUpdateCategory = async () => {
        const { id, name, image, description } = editCategoryData;
        await updateDoc(doc(db, 'Categories', id), { Name: name, Image: image, Description: description });
        const updatedCategories = categories.map(category =>
            category.id === id ? { id, Name: name, Image: image, Description: description } : category
        );
        setCategories(updatedCategories);
        setFilteredCategories(updatedCategories); // Update filtered categories as well
        setIsEditing(false);
    };

    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
    };

    const closeModal = () => {
        setIsEditing(false);
        setIsAdding(false);
    };

    const handleAddCategory = async () => {
        const categoryID = `ID${doc(collection(db, 'Categories')).id}`;
        const newCategoryRef = await addDoc(collection(db, 'Categories'), {
            ID: categoryID,
            Name: newCategoryData.name,
            Image: newCategoryData.image,
            Description: newCategoryData.description,
        });

        // Fetch categories again to refresh the list
        const categoriesCollection = collection(db, 'Categories');
        const categoriesSnapshot = await getDocs(categoriesCollection);
        const categoriesList = categoriesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        setCategories(categoriesList);
        setFilteredCategories(categoriesList);

        setIsAdding(false);
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.heading}>Manage Categories</h2>

            {isEditing && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <h3>Edit Category</h3>
                        <input
                            type="text"
                            value={editCategoryData.name}
                            onChange={(e) => setEditCategoryData({ ...editCategoryData, name: e.target.value })}
                            placeholder="Category Name"
                            className={styles.inputField}
                        />
                        <input
                            type="text"
                            value={editCategoryData.image}
                            onChange={(e) => setEditCategoryData({ ...editCategoryData, image: e.target.value })}
                            placeholder="Image URL"
                            className={styles.inputField}
                        />
                        <textarea
                            value={editCategoryData.description}
                            onChange={(e) => setEditCategoryData({ ...editCategoryData, description: e.target.value })}
                            placeholder="Description"
                            className={styles.textarea}
                        />
                        <div className={styles.modalActions}>
                            <button onClick={handleUpdateCategory} className={styles.saveButton}>Save</button>
                            <button onClick={closeModal} className={styles.cancelButton}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
            {isAdding && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <h3>Add New Category</h3>
                        <input
                            type="text"
                            value={newCategoryData.name}
                            onChange={(e) => setNewCategoryData({ ...newCategoryData, name: e.target.value })}
                            placeholder="Category Name"
                            className={styles.inputField}
                        />
                        <input
                            type="text"
                            value={newCategoryData.image}
                            onChange={(e) => setNewCategoryData({ ...newCategoryData, image: e.target.value })}
                            placeholder="Image URL"
                            className={styles.inputField}
                        />
                        <textarea
                            value={newCategoryData.description}
                            onChange={(e) => setNewCategoryData({ ...newCategoryData, description: e.target.value })}
                            placeholder="Description"
                            className={styles.textarea}
                        />
                        <div className={styles.modalActions}>
                            <button onClick={handleAddCategory} className={styles.saveButton}>Add</button>
                            <button onClick={closeModal} className={styles.cancelButton}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
            {selectedCategory ? (
                <ManageProductsScreen category={selectedCategory} goBack={() => setSelectedCategory(null)} />
            ) : (
                // This part only renders when no category is selected
                <div className={styles.categoriesContainer}>
                    <input
                        type="text"
                        placeholder="Search Categories"
                        value={searchTerm}
                        onChange={handleSearch}
                        className={styles.searchInput}
                    />
                    <div className={styles.addCard} onClick={() => setIsAdding(true)}>
                        <span className={styles.plusSign}>+</span>
                        <p>Add New Category</p>
                    </div>
                    {filteredCategories.map(category => (
                        <div key={category.id} className={styles.categoryCard} onClick={() => handleCategoryClick(category)}>
                            <img src={category.Image} alt={category.Name} className={styles.categoryImage} />
                            <p>{category.Name}</p>
                            <div className={styles.options}>
                                <button onClick={(e) => { e.stopPropagation(); handleEditCategory(category); }} className={styles.editButton}>Edit</button>
                                <button onClick={(e) => { e.stopPropagation(); handleDeleteCategory(category.id, category.Name); }} className={styles.deleteButton}>Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ManageCategoriesScreen;
