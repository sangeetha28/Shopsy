import classes from "./index.module.css";
import { useState, useContext, useEffect } from "react";
import { useRouter } from "next/router";
import Store from "../../context/index";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import Cookies from "js-cookie";

function PlaceOrder() {
  const [loading, setLoading] = useState(false);
  const { state, dispatch } = useContext(Store);
  const router = useRouter();

  const { cart } = state;
  const { cartItems, shippingAddress, paymentMethod } = cart;

  const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100;

  const itemPrice = round2(
    cartItems.reduce((a, c) => a + c.quantity * c.price, 0)
  );

  const shippingPrice = itemPrice > 200 ? 0 : 15;

  const taxPrice = round2(itemPrice * 0.15);

  const totalPrice = round2(itemPrice + shippingPrice + taxPrice);

  useEffect(() => {
    if (!paymentMethod) {
      router.push("/payment");
    }
  }, [paymentMethod, router]);

  const placeOrderHandler = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "content-Type": "application/json",
        },
        body: JSON.stringify({
          orderItems: cartItems,
          shippingAddress,
          paymentMethod,
          itemPrice,
          shippingPrice,
          taxPrice,
          totalPrice,
        }),
      });
      const data = await response.json();

      setLoading(false);
      dispatch({ type: "CART_CLEAR_ITEMS" });
      Cookies.set("cart", JSON.stringify({ ...cart, cartItems: [] }));
      router.push(`/orders/${data._id}`);
    } catch (e) {
      setLoading(false);
      throw new Error("Something has gone while Placing Order", e);
    }
  };

  return (
    <div>
      <h1>Place Order</h1>
      <div className={classes.container}>
        <div className={classes.orderDetailsContainer}>
          <div className={classes.card}>
            <h2>Shipping Address</h2>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div>
                {shippingAddress.fullname},{shippingAddress.address},{" "}
                {shippingAddress.city},{shippingAddress.postcode},{" "}
                {shippingAddress.country}{" "}
              </div>
              <br />
              <div>
                <Link
                  style={{
                    textDecoration: "none",
                    color: "purple",
                    padding: "20px 0",
                  }}
                  href="/checkout"
                >
                  Edit
                </Link>
              </div>
            </div>
          </div>
          <div className={classes.card}>
            {" "}
            <h2>Payment Method</h2>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div>{paymentMethod}</div>
              <br />
              <div>
                <Link
                  style={{
                    textDecoration: "none",
                    color: "purple",
                    padding: "20px 0",
                  }}
                  href="/payment"
                >
                  Edit
                </Link>
              </div>
            </div>
          </div>
          <div className={classes.card}>
            <h2>Order Items</h2>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div className={classes.cartItemList}>
                <table className={classes.table}>
                  <thead className={classes.trow}>
                    <tr>
                      <th className={classes.item}>Item</th>
                      <th>Quantity</th>
                      <th>Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {state.cart.cartItems.map((item) => (
                      <tr className={classes.trow} key={item.slug}>
                        <td className={classes.item}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={50}
                            height={50}
                          />
                          &nbsp;<p>{item.name}</p>
                        </td>
                        <td className={classes.item}>{item.quantity}</td>
                        <td className={classes.item}>${item.price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <br />
                <div>
                  <Link
                    style={{
                      textDecoration: "none",
                      color: "purple",
                      padding: "20px 0",
                    }}
                    href="/cart"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={classes.orderSummaryContainer}>
          <div className={classes.card}>
            <h2>Order Summary</h2>
            <ul style={{ padding: "0px" }}>
              <li style={{ listStyle: "none" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "2px",
                  }}
                >
                  <div>Items</div>
                  <div>${itemPrice}</div>
                </div>
              </li>
              <li style={{ listStyle: "none" }}>
                {" "}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "2px",
                  }}
                >
                  <div>Tax</div>
                  <div>${taxPrice}</div>
                </div>
              </li>
              <li style={{ listStyle: "none" }}>
                {" "}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "2px",
                  }}
                >
                  <div>Shipping</div>
                  <div>${shippingPrice}</div>
                </div>
              </li>
              <li style={{ listStyle: "none" }}>
                {" "}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "2px",
                  }}
                >
                  <div>Total</div>
                  <div>${totalPrice}</div>
                </div>
              </li>
            </ul>
            <button
              className={classes.addToCart}
              disabled={loading}
              onClick={placeOrderHandler}
            >
              {loading ? "Loading..." : "Place Order"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default dynamic(() => Promise.resolve(PlaceOrder), { ssr: false });
