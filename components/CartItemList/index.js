import { useContext } from "react";
import Link from "next/link";
import Image from "next/image";
import Store from "../../context/index";
import { useRouter } from "next/router";

import classes from "./index.module.css";

function CartItemList() {
  const { state, dispatch } = useContext(Store);
  const { router } = useRouter();

  const updateHandler = (event, item) => {
    dispatch({
      type: "ADD_ITEM_TO_CART",
      payload: { ...item, quantity: Number(event.target.value) },
    });
  };

  const removeHandler = (item) => {
    dispatch({
      type: "REMOVE_ITEM",
      payload: item,
    });
  };

  return (
    <div className={classes.tableContainer}>
      <div className={classes.cartItemList}>
        <table className={classes.table}>
          <thead className={classes.trow}>
            <tr>
              <th className={classes.item}>Item</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Remove</th>
            </tr>
          </thead>
          <br />
          <tbody>
            {state.cart.cartItems.map((item) => (
              <tr className={classes.trow} key={item.slug}>
                <td className={classes.item}>
                  <Link href={`/products/${item.slug}`}>
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={50}
                      height={50}
                    />
                    &nbsp;<p>{item.name}</p>
                  </Link>
                </td>
                <td className={classes.item}>
                  <select
                    value={item.quantity}
                    onChange={(e) => updateHandler(e, item)}
                  >
                    {[...Array(item.countInStock).keys()].map((count) => (
                      <option key={count + 1} value={count + 1}>
                        {count + 1}
                      </option>
                    ))}
                  </select>
                </td>
                <td className={classes.item}>${item.price}</td>
                <td className={classes.item}>
                  <button
                    className={classes.removeButton}
                    onClick={() => removeHandler(item)}
                  >
                    <Image
                      src={"/images/delete-button.svg"}
                      alt="remove icon"
                      width={20}
                      height={20}
                    />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className={classes.card}>
        <div className={classes.cardItem}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <p>
              SubTotal (
              {state.cart.cartItems.reduce((a, i) => a + i.quantity, 0)})
            </p>
            <p>
              $
              {state.cart.cartItems.reduce(
                (a, i) => a + i.quantity * i.price,
                0
              )}
            </p>
          </div>{" "}
        </div>
        <button
          className={classes.addToCart}
          onClick={() => router.push("login?redirect=/shipping")}
        >
          Go to Checkout
        </button>
      </div>
    </div>
  );
}

export default CartItemList;
