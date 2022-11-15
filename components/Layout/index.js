import React from "react";
import Head from "next/head";
import Link from "next/link";

import classes from "./index.module.css";

function Layout({ children }) {
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
