import { useContext } from "react";
import Link from "next/link";
import Store from "../context/index";
import Layout from "../components/Layout/index";
import CartItemList from "../components/CartItemList/index";
import dynamic from "next/dynamic";

function CartPage() {
  const { state } = useContext(Store);
  return (
    <Layout>
      <div
        style={{
          minHeight: "100vh",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "center",
        }}
      >
        <h2>Shopping Cart</h2>
        {state.cart.cartItems.length > 0 ? (
          <CartItemList />
        ) : (
          <p>
            {" "}
            There are no items in the Cart.{" "}
            <Link href="/">Go Back to HomePage</Link>{" "}
          </p>
        )}
      </div>
    </Layout>
  );
}

//dynamic page rendered only on the client side

export default dynamic(() => Promise.resolve(CartPage), { ssr: false });
