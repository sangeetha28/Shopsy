import { createContext, useReducer } from "react";
import Cookies from "js-cookie";

const Store = createContext();

const initialValue = {
  cart: Cookies.get("cart")
    ? JSON.parse(Cookies.get("cart"))
    : { cartItems: [], shippingAddress: {} },
};

const reducer = (state, action) => {
  switch (action.type) {
    case "ADD_ITEM_TO_CART": {
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
      Cookies.set("cart", JSON.stringify({ ...state.cart, cartItems }));
      return { ...state, cart: { ...state.cart, cartItems } };
    }
    case "REMOVE_ITEM": {
      const cartItems = state.cart.cartItems.filter(
        (item) => item.slug !== action.payload.slug
      );
      Cookies.set("cart", JSON.stringify({ ...state.cart, cartItems }));
      return { ...state, cart: { ...state.cart, cartItems } };
    }
    case "CART_RESET": {
      return {
        ...state,
        cart: { cartItem: [], shippingAddress: {}, paymentMethod: "" },
      };
    }
    case "SAVE_SHIPPING_ADDRESS": {
      return {
        ...state,
        cart: {
          ...state.cart,
          shippingAddress: { ...state.cart.shippingAddress, ...action.payload },
        },
      };
    }
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
