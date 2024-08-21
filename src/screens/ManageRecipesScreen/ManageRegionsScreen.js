import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, deleteDoc, addDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import ManageDishesScreen from './ManageDishesScreen';
import PublicDishesScreen from './PublicDishesScreen'; // Import the Public Dishes screen
import styles from './ManageRegionsScreen.module.css';

const ManageRegionsScreen = () => {
    const [regions, setRegions] = useState([]);
    const [selectedRegion, setSelectedRegion] = useState(null);
    const [showPublicDishes, setShowPublicDishes] = useState(false); // State to handle the display of public dishes screen
    const [isEditing, setIsEditing] = useState(false);
    const [editRegionData, setEditRegionData] = useState({ name: '', image: '' });
    const [isAdding, setIsAdding] = useState(false);
    const [newRegionData, setNewRegionData] = useState({ name: '', image: '' });

    useEffect(() => {
        const fetchRegions = async () => {
            const regionsCollection = collection(db, 'Regions');
            const regionsSnapshot = await getDocs(regionsCollection);
            const regionsList = regionsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setRegions(regionsList);
        };

        fetchRegions();
    }, []);

    const handleDeleteRegion = async (regionId) => {
        if (window.confirm('Are you sure you want to delete this region?')) {
            await deleteDoc(doc(db, 'Regions', regionId));
            setRegions(regions.filter(region => region.id !== regionId));
        }
    };

    const handleEditRegion = (region) => {
        setIsEditing(true);
        setEditRegionData({ id: region.id, name: region.name, image: region.image });
    };

    const handleUpdateRegion = async () => {
        const { id, name, image } = editRegionData;
        await updateDoc(doc(db, 'Regions', id), { name, image });
        setRegions(regions.map(region => (region.id === id ? { id, name, image } : region)));
        setIsEditing(false);
    };

    const handleRegionClick = (region) => {
        setSelectedRegion(region);
    };

    const closeModal = () => {
        setIsEditing(false);
        setIsAdding(false);
    };

    const handleAddRegion = async () => {
        // Generate a new ID for the region
        const regionID = `ID${doc(collection(db, 'Regions')).id}`;

        const newRegionRef = await addDoc(collection(db, 'Regions'), {
            ID: regionID,
            name: newRegionData.name,
            image: newRegionData.image,
        });
        setRegions([...regions, { id: newRegionRef.id, ID: regionID, ...newRegionData }]);
        setIsAdding(false);
    };

    if (showPublicDishes) {
        // If the admin clicked on the Public Dishes card, show the PublicDishesScreen
        return <PublicDishesScreen goBack={() => setShowPublicDishes(false)} />;
    }

    return (
        <div className={styles.container}>
            <h2 className={styles.heading}>Manage Regions</h2>
            {isEditing && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <h3>Edit Region</h3>
                        <input
                            type="text"
                            value={editRegionData.name}
                            onChange={(e) => setEditRegionData({ ...editRegionData, name: e.target.value })}
                            placeholder="Region Name"
                            className={styles.inputField}
                        />
                        <input
                            type="text"
                            value={editRegionData.image}
                            onChange={(e) => setEditRegionData({ ...editRegionData, image: e.target.value })}
                            placeholder="Image URL"
                            className={styles.inputField}
                        />
                        <div className={styles.modalActions}>
                            <button onClick={handleUpdateRegion} className={styles.saveButton}>Save</button>
                            <button onClick={closeModal} className={styles.cancelButton}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
            {isAdding && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <h3>Add New Region</h3>
                        <input
                            type="text"
                            value={newRegionData.name}
                            onChange={(e) => setNewRegionData({ ...newRegionData, name: e.target.value })}
                            placeholder="Region Name"
                            className={styles.inputField}
                        />
                        <input
                            type="text"
                            value={newRegionData.image}
                            onChange={(e) => setNewRegionData({ ...newRegionData, image: e.target.value })}
                            placeholder="Image URL"
                            className={styles.inputField}
                        />
                        <div className={styles.modalActions}>
                            <button onClick={handleAddRegion} className={styles.saveButton}>Add</button>
                            <button onClick={closeModal} className={styles.cancelButton}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
            {selectedRegion ? (
                <ManageDishesScreen region={selectedRegion} goBack={() => setSelectedRegion(null)} />
            ) : (
                <div className={styles.regionsContainer}>
                    <div className={styles.addCard} onClick={() => setIsAdding(true)}>
                        <span className={styles.plusSign}>+</span>
                        <p>Add New Region</p>
                    </div>

                    {/* New card for Public Dishes */}
                    <div className={styles.regionCard} onClick={() => setShowPublicDishes(true)}>
                        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPfa137nNKsYDxkns5XRjxqQTzfYANMj6EoQ&s" alt="Public Dishes" className={styles.regionImage} />
                        <p>Public Dishes</p>
                    </div>

                    {regions.map(region => (
                        <div key={region.id} className={styles.regionCard} onClick={() => handleRegionClick(region)}>
                            <img src={region.image} alt={region.name} className={styles.regionImage} />
                            <p>{region.name}</p>
                            <div className={styles.options}>
                                <button onClick={(e) => { e.stopPropagation(); handleEditRegion(region); }} className={styles.editButton}>Edit</button>
                                <button onClick={(e) => { e.stopPropagation(); handleDeleteRegion(region.id); }} className={styles.deleteButton}>Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ManageRegionsScreen;
