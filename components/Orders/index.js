import { useRouter } from "next/router";
import { useEffect, useReducer, useContext, useState } from "react";
import Store from "../../context/index";
import classes from "./index.module.css";
import Image from "next/image";

function reducer(state, action) {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, order: action.payload, error: "" };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      state;
  }
}

function Orders() {
  const [isDelivered, setIsDelivered] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const { query } = useRouter();
  const orderId = query.id;
  const { state } = useContext(Store);

  const [{ loading, error, order }, dispatch] = useReducer(reducer, {
    loading: true,
    order: {},
    error: {},
  });

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const response = await fetch(`/api/orders/${orderId}`);
        const data = await response.json();
        const { order } = data;
        dispatch({ type: "FETCH_SUCCESS", payload: order });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: err });
      }
    };
    if (!order._id || (order._id && order._id !== orderId)) {
      fetchOrder();
    }
  }, [order, orderId]);

  const {
    shippingAddress,
    paymentMethod,
    itemPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
  } = order;
  return (
    <>
      <h1>{`Order ${orderId}`}</h1>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>{error[0]}</div>
      ) : (
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
                {isDelivered ? (
                  <div
                    style={{
                      marginBottom: "20px",
                      padding: "10px",
                      backgroundColor: "lightgrey",
                      color: "black",
                    }}
                  >
                    Delivered At
                  </div>
                ) : (
                  <div
                    style={{
                      marginBottom: "20px",
                      padding: "10px",
                      backgroundColor: "thistle",
                      color: "black",
                    }}
                  >
                    Not Delivered
                  </div>
                )}
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
                {isPaid ? (
                  <div
                    style={{
                      marginBottom: "20px",
                      padding: "10px",
                      backgroundColor: "lightgrey",
                      color: "black",
                    }}
                  >
                    Paid At
                  </div>
                ) : (
                  <div
                    style={{
                      marginBottom: "20px",
                      padding: "10px",
                      backgroundColor: "thistle",
                      color: "black",
                    }}
                  >
                    Not Paid
                  </div>
                )}
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
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Orders;
