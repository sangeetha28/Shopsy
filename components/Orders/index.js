import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { useRouter } from "next/router";
import { useEffect, useReducer, useContext, useState } from "react";
import Store from "../../context/index";
import classes from "./index.module.css";
import Image from "next/image";
import dynamic from "next/dynamic";
import axios from "axios";
import toast from "react-toastify";

function reducer(state, action) {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, order: action.payload, error: "" };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "PAY_REQUEST":
      return { ...state, loadingPay: true };
    case "PAY_SUCCESS":
      return { ...state, loadingPay: false, successPay: true };
    case "PAY_FAIL":
      return { ...state, loadingPay: false, errorPay: action.payload };
    case "PAY_RESET":
      return { ...state, loadingPay: false, successPay: false, errorPay: "" };
    default:
      state;
  }
}

function Orders() {
  const [isDelivered, setIsDelivered] = useState(false);
  const { query } = useRouter();
  const orderId = query.id;
  const { state } = useContext(Store);

  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

  const [{ loading, error, order, successPay, loadingPay }, dispatch] =
    useReducer(reducer, {
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
    // fetch data when success to update the UI
    if (!order._id || successPay || (order._id && order._id !== orderId)) {
      fetchOrder();
      if (successPay) {
        dispatch({ type: "PAY_RESET" });
      }
    } else {
      const loadPaypalScript = async () => {
        const response = await fetch("/api/keys/paypal");
        const { clientId } = await response.json();
        paypalDispatch({
          type: "resetOptions",
          value: {
            "client-id": clientId,
            currency: "USD",
          },
        });
        paypalDispatch({ type: "setLoadingStatus", value: "pending" });
      };

      loadPaypalScript();
    }
  }, [order, orderId, successPay, paypalDispatch]);

  const {
    shippingAddress,
    paymentMethod,
    itemPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    isPaid,
    paidAt
  } = order;

  const createOrder = async (data, actions) => {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: { value: totalPrice },
          },
        ],
      })
      .then((orderId) => {
        return orderId;
      });
  };

  //capture and confirm the payment
  const onApprove = async (_, actions) => {
    return actions.order.capture().then(async function (details) {
      try {
        dispatch({ type: "PAY_REQUEST" });
        const { data } = await axios.put(
          `/api/orders/${order._id}/pay`,
          details
        );

        dispatch({ type: "PAY_SUCCESS", payload: data });
        toast.success("Order is Paid Successfully...");
      } catch (err) {
        dispatch({ type: "PAY_FAIL", payload: err });
        toast.error(err);
      }
    });
  };

  const onError = (err) => {
    alert("Something is wrong.", err);
  };

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
                      backgroundColor: "#b5d3b5",
                      color: "black",
                    }}
                  >
                    Paid At {paidAt}
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
                {!isPaid && (
                  <li style={{ listStyle: "none" }}>
                    {" "}
                    {/* {isPending && <div>Loading...</div>} */}
                    <div>
                      <PayPalButtons
                        createOrder={createOrder}
                        onApprove={onApprove}
                        onError={onError}
                      ></PayPalButtons>
                    </div>
                    {loadingPay && <div>Loading...</div>}
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default dynamic(() => Promise.resolve(Orders), { ssr: false });
