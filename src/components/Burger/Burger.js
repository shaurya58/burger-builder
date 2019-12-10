import React from 'react';
import classes from './Burger.css';
import BurgerIngredient from './BurgerIngredient/BurgerIngredient';

const burger = (props) => {

/*  console.log('Props of burger component : ', props);
    console.log('props.ingredients = ', props.ingredients);
    console.log('Object.keys(props)', Object.keys(props));
    console.log('Object.keys(props.ingredients)', Object.keys(props.ingredients));  */

    let transformedIngredients = Object.keys(props.ingredients).map(igKey => {
/*      console.log('igKey = ', igKey);
        console.log('props.ingredients[igKey] = ', props.ingredients[igKey]);
        console.log('Array..', [...Array(props.ingredients[igKey])]);   */
        return [...Array(props.ingredients[igKey])].map((_, i) => {
            return <BurgerIngredient key = {igKey + i} type = {igKey} />;
        });
    }).reduce((arr, el) => {
        return arr.concat(el)
    }, []);

    if(transformedIngredients.length === 0) {
        transformedIngredients = <p>Please add some ingredients!</p>;
    }

//  console.log('transformedIngredients = ', transformedIngredients);
    
    return (
        <div className = {classes.Burger} >
            <BurgerIngredient type = "bread-top" />
            {transformedIngredients}
            <BurgerIngredient type = "bread-bottom" />
        </div>
    );
}

export default burger;