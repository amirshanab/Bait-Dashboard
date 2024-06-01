import React from 'react';

const categories = [
    'Bakery', 'Beauty and Baby', 'Beverages', 'Cereal and Breakfast',
    'Cleaning', 'Dairy', 'Deli and Salads', 'Frozen', 'Fruits', 'Grocery',
    'Health and Special', 'Houseware', 'Meats', 'Pets', 'Sweets and Snacks',
    'Vegetables', 'Personal Hygiene'
];

const CategorySelector = ({ onSelectCategory }) => {
    return (
        <select onChange={(e) => onSelectCategory(e.target.value)}>
            <option value="">Select a Category</option>
            {categories.map((category, index) => (
                <option key={index} value={category}>{category}</option>
            ))}
        </select>
    );
};

export default CategorySelector;
