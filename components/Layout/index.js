import React, { useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { useState, useContext } from "react";
import Store from "../../context/index";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/router";

import classes from "./index.module.css";

function Layout({ children }) {
  const { status, data: session } = useSession();
  const router = useRouter();

  const {
    state: {
      cart: { cartItems },
    },
  } = useContext(Store);
  const [cartItemsCount, setCartItemsCount] = useState(0);

  useEffect(() => {
    setCartItemsCount(cartItems.reduce((a, c) => a + c.quantity, 0));
  }, [cartItems]);

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
                {cartItemsCount > 0 && (
                  <span className={classes.basketCount}>{cartItemsCount}</span>
                )}
              </div>
              {session && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginLeft: "10px",
                    color: "purple",
                    justifyContent: "space-between",
                  }}
                >
                  <div>{session.user.email}</div>
                  <div
                    style={{
                      border: "1px solid purple",
                      padding: "10px",
                      color: "purple",
                      cursor: "pointer",
                    }}
                  >
                    {" "}
                    <button
                      style={{
                        outline: "none",
                        border: "none",
                        background: "none",
                      }}
                      onClick={() => {
                        signOut();
                      }}
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
              {!session && status !== "loading" && (
                <div style={{ display: "flex", alignItems: "center" }}>
                  <div>
                    <Link
                      style={{
                        padding: "10px",
                        textDecoration: "none",
                        color: "purple",
                      }}
                      href="/login"
                    >
                      Sign In
                    </Link>
                  </div>
                  <div>/</div>
                  <div>
                    <Link
                      style={{
                        padding: "10px",
                        textDecoration: "none",
                        color: "purple",
                      }}
                      href="/register"
                    >
                      Sign Up
                    </Link>
                  </div>
                </div>
              )}
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
