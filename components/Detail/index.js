import React, { useState, useContext } from "react";
import Image from "next/image";
import Link from "next/link";
import Store from "../../context/index";

import classes from "./index.module.css";

function Details({ product }) {
  const [error, setError] = useState("");
  const { state, dispatch } = useContext(Store);

  const {
    slug,
    name,
    category,
    image,
    price,
    brand,
    description,
    rating,
    numReviews,
    countInStock,
  } = product;

  const onClickHandler = () => {
    const existItem = state.cart.cartItems.find((item) => item.slug === slug);
    const quantity = existItem ? existItem.quantity + 1 : 1;

    if (product.countInStock < quantity) {
      setError(
        "X Sorry Product Not Available...Please reduce the Item Quantity"
      );
      return;
    }
    dispatch({
      type: "ADD_ITEM_TO_CART",
      payload: { ...product, quantity },
    });
  };

  return (
    <div className={classes.container}>
      {error && <div className={classes.errorContainer}>{error}</div>}
      <div className={classes.productDetailContainer}>
        <div className={classes.imageContainer}>
          <Image
            className={classes.img}
            src={image}
            alt={name}
            width={640}
            height={640}
            layout="responsive"
          />
        </div>
        <div>
          <ul>
            <li className={classes.list}>{name}</li>
            <li className={classes.list}>Category: {brand}</li>
            <li className={classes.list}>Brand: {brand}</li>
            <li
              className={classes.list}
            >{`${rating} of ${numReviews} reviews`}</li>
            <li className={classes.list}>Description: {description}</li>
            <br />
            <Link style={{ textDecoration: "none" }} href="/">
              Back To Products Page
            </Link>
          </ul>
        </div>
        <div className={classes.card}>
          <div className={classes.cardItem}>
            <div>Price</div> <div>${price}</div>
          </div>
          <div className={classes.cardItem}>
            <div>Status</div>{" "}
            <div>{countInStock > 1 ? "In Stock" : "Unavailable"}</div>
          </div>
          <button onClick={onClickHandler} className={classes.addToCart}>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default Details;
