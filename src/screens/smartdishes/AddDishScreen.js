import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import ProductSelectionModal from '../../components/ProductSelectionModal/ProductSelectionModal';
import styles from './AddDishScreen.css';

const AddDishScreen = () => {
    const [regions, setRegions] = useState([]);
    const [selectedRegionId, setSelectedRegionId] = useState('');
    const [newRegionName, setNewRegionName] = useState('');
    const [newRegionImage, setNewRegionImage] = useState('');
    const [dishName, setDishName] = useState('');
    const [dishImage, setDishImage] = useState('');
    const [description, setDescription] = useState('');
    const [ingredients, setIngredients] = useState([]);
    const [showProductSelection, setShowProductSelection] = useState(false);
    const [products, setProducts] = useState([]);
    const [addNewRegion, setAddNewRegion] = useState(false);

    useEffect(() => {
        const fetchRegions = async () => {
            const regionsCollection = collection(db, 'Regions');
            const regionsSnapshot = await getDocs(regionsCollection);
            const regionsList = regionsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setRegions(regionsList);
        };

        const fetchProducts = async () => {
            const productsCollection = collection(db, 'Products');
            const productsSnapshot = await getDocs(productsCollection);
            const productsList = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setProducts(productsList);
        };

        fetchRegions();
        fetchProducts();
    }, []);

    const handleAddDish = async () => {
        let regionId = selectedRegionId;

        // Check if a new region is being added
        if (addNewRegion && newRegionName) {
            // Check if a region with the same name already exists
            const existingRegion = regions.find(region => region.name.toLowerCase() === newRegionName.toLowerCase());

            if (existingRegion) {
                regionId = existingRegion.id;
            } else {
                // Add the new region with name and image
                const newRegionRef = await addDoc(collection(db, 'Regions'), {
                    name: newRegionName,
                    image: newRegionImage
                });
                regionId = newRegionRef.id;

                // Update the local regions state
                setRegions([...regions, { id: regionId, name: newRegionName, image: newRegionImage }]);
            }
        }

        if (!regionId) {
            alert('Please select or add a region.');
            return;
        }

        try {
            await addDoc(collection(db, `Regions/${regionId}/Dishes`), {
                Name: dishName,
                Image: dishImage,
                description,
                ingredients: ingredients.map(item => ({
                    ID: item.id,
                    Name: item.Name,
                    Image: item.Image,
                    Price: item.Price,
                    quantity: item.quantity
                })),
            });

            alert('Dish added successfully!');
            // Reset form
            resetForm();
        } catch (error) {
            console.error('Error adding dish:', error);
        }
    };

    const resetForm = () => {
        setSelectedRegionId('');
        setNewRegionName('');
        setNewRegionImage('');
        setDishName('');
        setDishImage('');
        setDescription('');
        setIngredients([]);
        setAddNewRegion(false);
    };

    const handleProductSelection = (selectedProducts) => {
        setIngredients(selectedProducts);
        setShowProductSelection(false);
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.heading}>Add New Dish</h2>
            <div className={styles.formGroup}>
                <label>Region</label>
                <div>
                    <select
                        value={selectedRegionId}
                        onChange={(e) => setSelectedRegionId(e.target.value)}
                        disabled={addNewRegion}
                    >
                        <option value="">Select a region</option>
                        {regions.map(region => (
                            <option key={region.id} value={region.id}>{region.name}</option>
                        ))}
                    </select>
                    <div className={styles.checkboxContainer}>
                        <label>
                            <input type="checkbox" checked={addNewRegion} onChange={() => setAddNewRegion(!addNewRegion)} /> Add new region
                        </label>
                        {addNewRegion && (
                            <>
                                <input
                                    type="text"
                                    value={newRegionName}
                                    onChange={(e) => setNewRegionName(e.target.value)}
                                    placeholder="Enter new region name"
                                    className={styles.newRegionInput}
                                />
                                <input
                                    type="text"
                                    value={newRegionImage}
                                    onChange={(e) => setNewRegionImage(e.target.value)}
                                    placeholder="Enter new region image URL"
                                    className={styles.newRegionInput}
                                />
                            </>
                        )}
                    </div>
                </div>
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
                            <img src={item.Image} alt={item.Name} className={styles.ingredientImage} />
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
