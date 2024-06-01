import React, { useState } from 'react';
import styles from './AddRecipeScreen.module.css'; // Ensure you have some basic styling

const AddRecipeScreen = () => {
    const [recipe, setRecipe] = useState({
        region: '',
        dishName: '',
        ingredients: [{ name: '', quantity: '' }]
    });

    const handleInputChange = (e, index) => {
        const { name, value } = e.target;
        const list = [...recipe.ingredients];
        list[index][name] = value;
        setRecipe({...recipe, ingredients: list});
    };

    const handleRemoveClick = index => {
        const list = [...recipe.ingredients];
        list.splice(index, 1);
        setRecipe({...recipe, ingredients: list});
    };

    const handleAddClick = () => {
        setRecipe({...recipe, ingredients: [...recipe.ingredients, { name: '', quantity: '' }]});
    };

    const handleSubmit = () => {
        console.log('Recipe Data:', recipe);
        // Here you would typically handle the submission to your backend
    };

    return (
        <div className={styles.formContainer}>
            <input
                type="text"
                name="region"
                value={recipe.region}
                onChange={e => setRecipe({...recipe, region: e.target.value})}
                placeholder="Region (e.g., Italian)"
                className={styles.input}
            />
            <input
                type="text"
                name="dishName"
                value={recipe.dishName}
                onChange={e => setRecipe({...recipe, dishName: e.target.value})}
                placeholder="Dish Name (e.g., Pizza Margarita)"
                className={styles.input}
            />
            {recipe.ingredients.map((x, i) => {
                return (
                    <div className={styles.box}>
                        <input
                            name="name"
                            placeholder="Ingredient Name"
                            value={x.name}
                            onChange={e => handleInputChange(e, i)}
                            className={styles.input}
                        />
                        <input
                            name="quantity"
                            placeholder="Quantity"
                            value={x.quantity}
                            onChange={e => handleInputChange(e, i)}
                            className={styles.input}
                        />
                        {recipe.ingredients.length !== 1 && (
                            <button
                                className={styles.removeBtn}
                                onClick={() => handleRemoveClick(i)}
                            >Remove</button>
                        )}
                        {recipe.ingredients.length - 1 === i && (
                            <button className={styles.addBtn} onClick={handleAddClick}>Add More</button>
                        )}
                    </div>
                );
            })}
            <button onClick={handleSubmit} className={styles.submitBtn}>Submit</button>
        </div>
    );
};

export default AddRecipeScreen;
