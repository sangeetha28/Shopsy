import Image from "next/image";
import Link from 'next/link';

import classes from "./index.module.css";

export default function ProductItem({ product }) {
  const { slug, name, category, image, price, brand, description } = product;
  return (
    <div className={classes.card}>
      <div className={classes.imageContainer}>
        <Link href={`/products/${slug}`}><img className={classes.img} src={image} alt={name}/></Link>
      </div>
      <p>{name}</p>
      <p>{brand}</p>
      <p>${price}</p>
      <button className={classes.addToCart}>Add to Cart</button>
    </div>
  );
}
