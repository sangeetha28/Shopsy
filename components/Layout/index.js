import React from "react";
import Head from "next/head";
import Link from "next/link";
import { useContext } from "react";
import Store from "../../context/index";

import classes from "./index.module.css";

function Layout({ children }) {
  const { state } = useContext(Store);
  return (
    <>
      <Head>
        <title>Shopsy</title>
        <meta name="description" content="Ecommerce site" />
      </Head>
      <div className={classes.container}>
        <header className={classes.header}>
          <nav className={classes.nav}>
            <Link style={{ fontSize: "30px" }} href="/">
              Shopsy
            </Link>
            <div className={classes.navLink}>
              <div style={{ display: "flex" }}>
                <Link
                  style={{
                    padding: "10px",
                    textDecoration: "none",
                    color: "purple",
                  }}
                  href="/cart"
                >
                  Cart
                </Link>
                {state.cart.cartItems.length > 0 && (
                  <span className={classes.basketCount}>
                    {state.cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
                  </span>
                )}
              </div>
              <Link
                style={{
                  padding: "10px",
                  textDecoration: "none",
                  color: "purple",
                }}
                href="/login"
              >
                Login
              </Link>
            </div>
          </nav>
        </header>
        <main className={classes.mainContainer}>{children}</main>
        <footer className={classes.footer}>
          <p>copyright @ 2022 Shopsy</p>
        </footer>
      </div>
    </>
  );
}

export default Layout;
