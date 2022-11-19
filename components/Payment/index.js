import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import Store from "../../context/index";

import classes from "./index.module.css";
import Cookies from "js-cookie";

function Payment() {
  const router = useRouter();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState();
  const { state, dispatch } = useContext(Store);
  const { cart } = state;
  const { shippingAddress, paymentMethod } = cart;

  const submitHandler = (e) => {
    e.preventDefault();
    if (!selectedPaymentMethod) {
      throw new Error("Payment Method is Required...");
    }
    dispatch({ type: "SAVE_PAYMENT_METHOD", payload: selectedPaymentMethod });
    Cookies.set(
      "cart",
      JSON.stringify({
        ...cart,
        paymentMethod: selectedPaymentMethod,
      })
    );
  };

  useEffect(() => {
    if (!shippingAddress.address) {
      return router.push("/shipping");
    }
    setSelectedPaymentMethod(paymentMethod || "");
  }, [paymentMethod, router, shippingAddress.address]);

  return (
    <div className={classes.container}>
      <h1>Payments Method</h1>
      <form onSubmit={submitHandler}>
        {["PayPal", "Stripe", "CashOnDelivery"].map((payment) => (
          <div key={payment} style={{ cursor: "pointer" }}>
            <input
              id={payment}
              type="radio"
              checked={selectedPaymentMethod === payment}
              onChange={() => setSelectedPaymentMethod(payment)}
            />
            <label htmlFor={payment}>{payment}</label>
          </div>
        ))}{" "}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            margin: "20px 0",
          }}
        >
          <button
            onClick={() => router.push("/checkout")}
            className={classes.button}
          >
            Back
          </button>
          <button
            onClick={() => router.push("/placeOrder")}
            className={classes.button}
          >
            Next
          </button>
        </div>
      </form>
    </div>
  );
}

export default Payment;
