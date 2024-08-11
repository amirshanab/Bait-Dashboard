import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import Modal from 'react-modal';
import { db } from '../../firebaseConfig';
import styles from './ManageUsersScreen.module.css';

const ManageUsersScreen = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [updatedUser, setUpdatedUser] = useState({});

    useEffect(() => {
        const fetchUsers = async () => {
            const usersCollection = collection(db, 'Users');
            const usersSnapshot = await getDocs(usersCollection);
            const usersList = usersSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setUsers(usersList);
            setLoading(false);
        };

        fetchUsers();
    }, []);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleDeleteUser = async (userId) => {
        const confirmed = window.confirm("Are you sure you want to delete this user?");
        if (confirmed) {
            await deleteDoc(doc(db, "Users", userId));
            setUsers(users.filter(user => user.id !== userId));
        }
    };

    const handleEditUser = (user) => {
        setSelectedUser(user);
        setUpdatedUser(user);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedUser(null);
    };

    const handleUpdateUser = async () => {
        if (selectedUser && updatedUser) {
            const userDocRef = doc(db, "Users", selectedUser.id);
            await updateDoc(userDocRef, updatedUser);
            setUsers(users.map(user => (user.id === selectedUser.id ? updatedUser : user)));
            handleCloseModal();
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUpdatedUser(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const filteredUsers = users.filter(user =>
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className={styles.container}>
            <h2 className={styles.heading}>Manage Users</h2>
            {loading ? (
                <p>Loading users...</p>
            ) : (
                <>
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className={styles.searchInput}
                    />
                    <div className={styles.tableWrapper}>
                        <table className={styles.table}>
                            <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone Number</th>
                                <th>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredUsers.map(user => (
                                <tr key={user.id}>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>{user.phoneNumber}</td>
                                    <td>
                                        <button
                                            onClick={() => handleEditUser(user)}
                                            className={styles.editButton}>
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDeleteUser(user.id)}
                                            className={styles.deleteButton}>
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Modal for editing user */}
                    <Modal
                        isOpen={isModalOpen}
                        onRequestClose={handleCloseModal}
                        contentLabel="Edit User"
                        className={styles.modal}
                        overlayClassName={styles.overlay}
                    >
                        <h2>Edit User</h2>
                        {selectedUser && (
                            <div className={styles.formGroup}>
                                <label>Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={updatedUser.name || ''}
                                    onChange={handleChange}
                                />
                                <label>Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={updatedUser.email || ''}
                                    onChange={handleChange}
                                />
                                <label>Phone Number</label>
                                <input
                                    type="text"
                                    name="phoneNumber"
                                    value={updatedUser.phoneNumber || ''}
                                    onChange={handleChange}
                                />
                                <div className={styles.buttonGroup}>
                                    <button onClick={handleUpdateUser} className={styles.saveButton}>
                                        Save Changes
                                    </button>
                                    <button onClick={handleCloseModal} className={styles.cancelButton}>
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}
                    </Modal>
                </>
            )}
        </div>
    );
};

export default ManageUsersScreen;
