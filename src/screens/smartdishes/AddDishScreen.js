import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import ProductSelectionModal from '../../components/ProductSelectionModal/ProductSelectionModal';
import styles from './AddDishScreen.css';

const AddDishScreen = () => {
    const [regions, setRegions] = useState([]);
    const [selectedRegion, setSelectedRegion] = useState('');
    const [regionImage, setRegionImage] = useState('');
    const [dishName, setDishName] = useState('');
    const [dishImage, setDishImage] = useState('');
    const [description, setDescription] = useState(''); // New description field
    const [ingredients, setIngredients] = useState([]);
    const [showProductSelection, setShowProductSelection] = useState(false);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            const productsCollection = collection(db, 'Products');
            const productsSnapshot = await getDocs(productsCollection);
            const productsList = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setProducts(productsList);
        };
        fetchProducts();
    }, []);

    const handleAddDish = async () => {
        try {
            const regionDocRef = await addDoc(collection(db, 'Regions'), {
                name: selectedRegion,
                image: regionImage,
            });

            await addDoc(collection(db, `Regions/${regionDocRef.id}/Dishes`), {
                name: dishName,
                image: dishImage,
                description, // Include description in the document
                ingredients: ingredients.map(item => ({
                    id: item.id,
                    name: item.Name,
                    img: item.Image,
                    price: item.Price,
                    quantity: item.quantity // Include quantity in the document
                })),
            });

            alert('Dish added successfully!');
            // Reset form
            setSelectedRegion('');
            setRegionImage('');
            setDishName('');
            setDishImage('');
            setDescription(''); // Reset description field
            setIngredients([]);
        } catch (error) {
            console.error('Error adding dish:', error);
        }
    };

    const handleProductSelection = (selectedProducts) => {
        setIngredients(selectedProducts);
        setShowProductSelection(false);
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.heading}>Add New Dish</h2>
            <div className={styles.formGroup}>
                <label>Region Name</label>
                <input
                    type="text"
                    value={selectedRegion}
                    onChange={(e) => setSelectedRegion(e.target.value)}
                />
            </div>
            <div className={styles.formGroup}>
                <label>Region Image URL</label>
                <input
                    type="text"
                    value={regionImage}
                    onChange={(e) => setRegionImage(e.target.value)}
                />
            </div>
            <div className={styles.formGroup}>
                <label>Dish Name</label>
                <input
                    type="text"
                    value={dishName}
                    onChange={(e) => setDishName(e.target.value)}
                />
            </div>
            <div className={styles.formGroup}>
                <label>Dish Image URL</label>
                <input
                    type="text"
                    value={dishImage}
                    onChange={(e) => setDishImage(e.target.value)}
                />
            </div>
            <div className={styles.formGroup}>
                <label>Description</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className={styles.textarea}
                />
            </div>
            <div className={styles.formGroup}>
                <label>Ingredients</label>
                <button onClick={() => setShowProductSelection(true)}>Select Ingredients</button>
                <ul className={styles.ingredientList}>
                    {ingredients.map((item) => (
                        <li key={item.id}>
                            <img src={item.Image} alt={item.Name} className={'ingredientImage'} />
                            <p>{item.Name}</p>
                            <p>Quantity: {item.quantity}</p>
                        </li>
                    ))}
                </ul>
            </div>
            <button onClick={handleAddDish} className={styles.addButton}>Add Dish</button>
            {showProductSelection && (
                <ProductSelectionModal
                    products={products}
                    onClose={() => setShowProductSelection(false)}
                    onSelect={handleProductSelection}
                />
            )}
        </div>
    );
};

export default AddDishScreen;
