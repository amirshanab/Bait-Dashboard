import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, deleteDoc, updateDoc, addDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import ProductSelectionModal from '../../components/ProductSelectionModal/ProductSelectionModal';
import styles from './ManageDishesScreen.module.css';

const ManageDishesScreen = ({ region, goBack }) => {
    const [dishes, setDishes] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [editDishData, setEditDishData] = useState({ name: '', image: '', ingredients: [], steps: [] });
    const [showProductModal, setShowProductModal] = useState(false);

    useEffect(() => {
        const fetchDishes = async () => {
            const dishesCollection = collection(db, `Regions/${region.id}/Dishes`);
            const dishesSnapshot = await getDocs(dishesCollection);
            const dishesList = dishesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setDishes(dishesList);
        };

        fetchDishes().then(() => console.log('Dishes fetched'));
    }, [region.id]);

    const handleDeleteDish = async (dishId) => {
        if (window.confirm('Are you sure you want to delete this dish?')) {
            await deleteDoc(doc(db, `Regions/${region.id}/Dishes`, dishId));
            setDishes(dishes.filter(dish => dish.id !== dishId));
        }
    };

    const handleEditDish = (dish) => {
        setIsEditing(true);
        setEditDishData({
            id: dish.id,
            name: dish.Name,
            image: dish.Image,
            ingredients: dish.ingredients || [],
            steps: dish.steps || []
        });
    };

    const handleUpdateDish = async () => {
        const { id, name, image, ingredients, steps } = editDishData;
        await updateDoc(doc(db, `Regions/${region.id}/Dishes`, id), {
            Name: name,
            Image: image,
            ingredients,
            steps
        });
        setDishes(dishes.map(dish => (dish.id === id ? { id, Name: name, Image: image, ingredients, steps } : dish)));
        setIsEditing(false);
    };

    const handleAddDish = async () => {
        const { name, image, ingredients, steps } = editDishData;
        const dishID = `ID${doc(collection(db, `Regions/${region.id}/Dishes`)).id}`;

        await addDoc(collection(db, `Regions/${region.id}/Dishes`), {
            ID: dishID,
            Name: name,
            Image: image,
            ingredients,
            steps
        });
        setDishes([...dishes, { id: dishID, Name: name, Image: image, ingredients, steps }]);
        setIsAdding(false);
        setEditDishData({ name: '', image: '', ingredients: [], steps: [] });
    };

    const handleSelectProducts = (selectedProducts) => {
        // Combine the existing ingredients with the new selected products
        const updatedIngredients = [...editDishData.ingredients, ...selectedProducts];

        // Remove any duplicate ingredients based on the product ID
        const uniqueIngredients = Array.from(new Set(updatedIngredients.map(item => item.id)))
            .map(id => {
                return updatedIngredients.find(item => item.id === id);
            });

        setEditDishData({
            ...editDishData,
            ingredients: uniqueIngredients,
        });
    };


    const handleAddStep = () => {
        setEditDishData({
            ...editDishData,
            steps: [...editDishData.steps, { ID: editDishData.steps.length + 1 }]
        });
    };

    const closeModal = () => {
        setIsEditing(false);
        setIsAdding(false);
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <button onClick={goBack} className={styles.backButton}>Back to Regions</button> {/* Back button */}
                <img src={region.image} alt={region.name} className={styles.regionImage} /> {/* Region Image */}
                <div className={styles.emptyDiv}></div>
            </div>
            <h2 className={styles.heading}>Manage Dishes in {region.name}</h2>
            {isEditing || isAdding ? (
                <div className={styles.editForm}>
                    <div className={styles.dishHeader}>
                        <img src={editDishData.image} alt={editDishData.name} className={styles.dishImageSmall}/>
                        <input
                            type="text"
                            value={editDishData.name}
                            onChange={(e) => setEditDishData({...editDishData, name: e.target.value})}
                            placeholder="Dish Name"
                            className={styles.inputField}
                        />
                    </div>
                    <input
                        type="text"
                        value={editDishData.image}
                        onChange={(e) => setEditDishData({...editDishData, image: e.target.value})}
                        placeholder="Image URL"
                        className={styles.inputField}
                    />
                    <button className={styles.addButton} onClick={() => setShowProductModal(true)}>Pick Ingredients
                    </button>

                    <h3>Ingredients</h3>
                    <ul className={styles.ingredientList}>
                        {editDishData.ingredients.map((ingredient, index) => (
                            <li key={index} className={styles.ingredientItem}>
                                <img src={ingredient.Image} alt={ingredient.Name}
                                     className={styles.ingredientImageSmall}/>
                                <span>{ingredient.Name}</span>
                                <span>Quantity: {ingredient.quantity}</span>
                                <button
                                    className={styles.removeButton}
                                    onClick={() => {
                                        setEditDishData({
                                            ...editDishData,
                                            ingredients: editDishData.ingredients.filter((_, i) => i !== index)
                                        });
                                    }}
                                >
                                    Remove
                                </button>
                            </li>
                        ))}
                    </ul>

                    <h3>Steps</h3>
                    <ul className={styles.stepList}>
                        {editDishData.steps.map((step, index) => (
                            <li key={index} className={styles.stepItem}>
                                <input
                                    type="text"
                                    value={step.description}
                                    onChange={(e) => {
                                        const updatedSteps = [...editDishData.steps];
                                        updatedSteps[index].description = e.target.value;
                                        setEditDishData({...editDishData, steps: updatedSteps});
                                    }}
                                    placeholder="Step Description"
                                    className={styles.inputField}
                                />
                                <button
                                    className={styles.removeButton}
                                    onClick={() => {
                                        setEditDishData({
                                            ...editDishData,
                                            steps: editDishData.steps.filter((_, i) => i !== index)
                                        });
                                    }}
                                >
                                    Remove
                                </button>
                            </li>
                        ))}
                    </ul>
                    <button className={styles.addButton} onClick={handleAddStep}>Add Step</button>

                    <div className={styles.modalActions}>
                        <button onClick={isEditing ? handleUpdateDish : handleAddDish} className={styles.saveButton}>
                            {isEditing ? 'Save' : 'Add Dish'}
                        </button>
                        <button onClick={closeModal} className={styles.cancelButton}>Cancel</button>
                    </div>
                </div>
            ) : (
                <div className={styles.dishesContainer}>
                    <div className={styles.addCard} onClick={() => setIsAdding(true)}>
                        <span className={styles.plusSign}>+</span>
                        <p>Add New Dish</p>
                    </div>
                    {dishes.map(dish => (
                        <div key={dish.id} className={styles.dishCard}>
                            <img src={dish.Image} alt={dish.Name} className={styles.dishImage} />
                            <p>{dish.Name}</p>
                            <div className={styles.options}>
                                <button onClick={() => handleEditDish(dish)} className={styles.editButton}>Edit</button>
                                <button onClick={() => handleDeleteDish(dish.id)} className={styles.deleteButton}>Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showProductModal && (
                <ProductSelectionModal
                    onClose={() => setShowProductModal(false)}
                    onSelect={handleSelectProducts}
                />
            )}
        </div>
    );
};

export default ManageDishesScreen;
