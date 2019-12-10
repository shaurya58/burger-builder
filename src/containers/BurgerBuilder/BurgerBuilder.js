import React, { Component } from 'react';
import Aux from '../../hoc/Aux/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import { connect } from 'react-redux';
import * as actionTypes from '../../store/actions';

class BurgerBuilder extends Component {
    state = {
        purchasing : false,
        loading : false,
        error : false
    }

    componentDidMount() {
        console.log(this.props);
        axios.get('https://react-my-burger-8469f.firebaseio.com/ingredients.json')
        .then(response => {
            this.setState({ ingredients : response.data });
        })
        .catch(error => {
            this.setState({ error : true });
        });
    }

    updatePurchaseState = (ingredients) => {
      //let sum = 0;
    /*  for (let key in ingredients) {
            sum = sum + ingredients[key];
        }      */
        const sum = Object.keys(ingredients).map(igKey => {
            return ingredients[igKey];
        })
        .reduce((sum, el) => {
            return sum + el;
        }, 0);  

        return sum > 0;
//        console.log('purchasable : ', this.state.purchasable);
    }

    // addIngredientHandler = (type) => {
    //     const oldCount = this.state.ingredients[type];
    //     const updatedCount = oldCount + 1;
    //     const updatedIngredients = { ...this.state.ingredients };
    //     updatedIngredients[type] = updatedCount;
    //     const curPrice = this.state.totalPrice;
    //     const updatedPrice = curPrice + INGREDIENTS_PRICES[type];
    //     this.setState({ ingredients : updatedIngredients, totalPrice : updatedPrice });
    //     this.updatePurchaseState(updatedIngredients);
    // }

    // removeIngredientHandler = (type) => {
    //     const oldCount = this.state.ingredients[type];
    //     if(oldCount < 0) {
    //         return;
    //     }
    //     const updatedCount = oldCount - 1;
    //     const updatedIngredients = {
    //         ...this.state.ingredients
    //     }
    //     updatedIngredients[type] = updatedCount;
    //     const curPrice = this.state.totalPrice;
    //     const updatedPrice = curPrice - INGREDIENTS_PRICES[type];
    //     this.setState({ ingredients : updatedIngredients, totalPrice : updatedPrice });
    //     this.updatePurchaseState(updatedIngredients);
    // }
    
    purchaseHandler = () => {
        this.setState({ purchasing : true });
    }

    purchaseCancelHandler = () => {
        this.setState({ purchasing : false });
    }

    purchaseContinueHandler = () => {
        this.props.history.push('/checkout');
    }

    render() {
        const disabledInfo = { ...this.props.ings };
        for (let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0
        }
        let orderSummary = null;
        let burger = this.state.error ? <p>Ingredients can't be loaded!</p> : <Spinner />;
        if (this.props.ings) {
            burger = (
                <Aux>
                    <Burger ingredients = {this.props.ings} />
                    <BuildControls
                        ingredientAdded = {this.props.onAddIngredient}
                        ingredientRemoved = {this.props.onRemoveIngredient}
                        disabled = {disabledInfo}
                        purchasable = {this.updatePurchaseState(this.props.ings)}
                        price = {this.props.price}
                        ordered = {this.purchaseHandler} />
                </Aux>
            );
            orderSummary = <OrderSummary
                                ingredients = {this.props.ings}
                                purchaseCancelled= {this.purchaseCancelHandler}
                                purchaseContinued = {this.purchaseContinueHandler}
                                price = {this.props.price} />;
        }
        if (this.state.loading) {
            orderSummary = <Spinner />;
        }
        //console.log('purchasable : ', this.state.purchasable);
        return (
            <Aux>
                <Modal
                    show = {this.state.purchasing}
                    modalClosed = {this.purchaseCancelHandler} >
                    {orderSummary}
                </Modal>
                {burger}
            </Aux>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        ings: state.ingredients,
        price: state.totalPrice
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onAddIngredient: (ingName) => dispatch({ type: actionTypes.ADD_INGREDIENT, ingredientName: ingName }),
        onRemoveIngredient: (ingName) => dispatch({ type: actionTypes.REMOVE_INGREDIENT, ingredientName: ingName })
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));