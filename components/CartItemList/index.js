import { useContext } from "react";
import Link from "next/link";
import Image from "next/image";
import Store from "../../context/index";

import classes from "./index.module.css";

function CartItemList() {
  const { state } = useContext(Store);

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
              <tr className={classes.trow}>
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
                <td className={classes.item}>{item.quantity}</td>
                <td className={classes.item}>${item.price}</td>
                <td className={classes.item}>
                  <Image
                    src={"/images/delete-button.svg"}
                    alt="remove icon"
                    width={20}
                    height={20}
                  />
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
        <button className={classes.addToCart}>Go to Checkout</button>
      </div>
    </div>
  );
}

export default CartItemList;
