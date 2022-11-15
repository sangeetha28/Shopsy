import React from "react";

import ProductItem from '../../components/ProductItem/index'

import classes from "./index.module.css";

function ProductItemList({ products }) {
  return (
    <>
      <ul className={classes.list}>
        {products.map((product) => (
          <li key={product._id} style={{ listStyle: "none" }}>
            <ProductItem product={product} />
          </li>
        ))}
      </ul>
    </>
  );
}

export default ProductItemList;
