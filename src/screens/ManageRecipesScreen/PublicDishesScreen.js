import React, { useState, useEffect } from 'react';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import styles from './PublicDishesScreen.module.css';

const PublicDishesScreen = ({ goBack }) => {
    const [dishes, setDishes] = useState([]);
    const [selectedDish, setSelectedDish] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDishes = async () => {
            setLoading(true);
            try {
                const dishesCollection = collection(db, 'PublicDishes');
                const dishesSnapshot = await getDocs(dishesCollection);
                const dishesList = dishesSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setDishes(dishesList);
            } catch (err) {
                console.error('Failed to fetch dishes:', err);
                setError('Failed to load dishes.');
            } finally {
                setLoading(false);
            }
        };

        fetchDishes();
    }, []);

    const handleApproveDish = async (dishId) => {
        try {
            const dishRef = doc(db, 'PublicDishes', dishId);
            await updateDoc(dishRef, { isApproved: true });
            setDishes(dishes.map(dish => (dish.id === dishId ? { ...dish, isApproved: true } : dish)));
        } catch (err) {
            console.error('Failed to approve dish:', err);
        }
    };

    const handleRejectDish = async (dishId) => {
        try {
            const dishRef = doc(db, 'PublicDishes', dishId);
            await updateDoc(dishRef, { isApproved: false });
            setDishes(dishes.map(dish => (dish.id === dishId ? { ...dish, isApproved: false } : dish)));
        } catch (err) {
            console.error('Failed to reject dish:', err);
        }
    };

    const handleDishClick = (dish) => {
        setSelectedDish(dish);
    };

    const handleCloseModal = () => {
        setSelectedDish(null);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div className={styles.error}>{error}</div>;
    }

    return (
        <div className={styles.container}>
            <button className={styles.backButton} onClick={goBack}>Back to Region</button>
            <h2 className={styles.heading}>Manage Public Dishes</h2>
            <div className={styles.dishesContainer}>
                {dishes.map((dish) => (
                    <div key={dish.id} className={styles.dishCard} onClick={() => handleDishClick(dish)}>
                        <img src={dish.Image} alt={dish.Name} className={styles.dishImage} />
                        <h3>{dish.Name}</h3>
                        <p>Created by: {dish.User}</p>
                        <p>Status: {dish.isApproved ? 'Approved' : 'Pending Approval'}</p>
                        <div className={styles.actions}>
                            {!dish.isApproved && (
                                <button
                                    className={styles.approveButton}
                                    onClick={(e) => { e.stopPropagation(); handleApproveDish(dish.id); }}
                                >
                                    Approve
                                </button>
                            )}
                            {dish.isApproved && (
                                <button
                                    className={styles.rejectButton}
                                    onClick={(e) => { e.stopPropagation(); handleRejectDish(dish.id); }}
                                >
                                    Reject
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {selectedDish && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <button className={styles.closeButton} onClick={handleCloseModal}>X</button>
                        <img src={selectedDish.Image} alt={selectedDish.Name} className={styles.modalImage} />
                        <h2>{selectedDish.Name}</h2>
                        <p><strong>Created by:</strong> {selectedDish.User}</p>
                        <p><strong>Status:</strong> {selectedDish.isApproved ? 'Approved' : 'Pending Approval'}</p>
                        <h3>Ingredients:</h3>
                        <ul>
                            {selectedDish.ingredients.map((ingredient, index) => (
                                <li key={index}>
                                    {ingredient.Name} - {ingredient.quantity}
                                </li>
                            ))}
                        </ul>
                        <h3>Steps:</h3>
                        <ol>
                            {selectedDish.steps.map((step, index) => (
                                <li key={index}>{step.description}</li>
                            ))}
                        </ol>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PublicDishesScreen;
