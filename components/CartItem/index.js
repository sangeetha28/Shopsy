function CartItem(props) {
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
    quantity,
  } = props.product;
  return <p>{name}</p>;
}

export default CartItem;
