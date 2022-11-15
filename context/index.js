import { createContext, useReducer } from "react";

const Store = createContext();

const initialValue = {
  cart: {
    cartItems: [],
  },
};

const reducer = (state, action) => {
  switch (action.type) {
    case "ADD_ITEM_TO_CART":
      const newItem = action.payload;
      const existItem = state.cart.cartItems.find(
        (item) => item.slug === newItem.slug
      );
      // If item exist then replace with the newItem(It is with quantity) for other items, return as they are
      const cartItems = existItem
        ? state.cart.cartItems.map((item) =>
            item.name === existItem.name ? newItem : item
          )
        : //when item doesn't exist already then just return the newItem
          [...state.cart.cartItems, newItem];

      return { ...state, cart: { ...state.cart, cartItems } };
    default:
      return state;
  }
};

export function StoreProvider(props) {
  const [state, dispatch] = useReducer(reducer, initialValue);
  const value = { state, dispatch };
  return <Store.Provider value={value}>{props.children}</Store.Provider>;
}

export default Store;
