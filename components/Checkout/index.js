import { useEffect, useContext } from "react";
import { useForm } from "react-hook-form";
import classes from "./index.module.css";
import Cookies from "js-cookie";
import Store from "../../context/index";
import { useRouter } from "next/router";

function Checkout() {
  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
  } = useForm();

  const { state, dispatch } = useContext(Store);
  const { cart } = state;
  const router = useRouter();
  const { shippingAddress } = cart;

  useEffect(() => {
    setValue("fullname", shippingAddress.fullname);
    setValue("address", shippingAddress.address);
    setValue("city", shippingAddress.city);
    setValue("postcode", shippingAddress.postcode);
    setValue("country", shippingAddress.country);
  }, [
    setValue,
    shippingAddress.fullname,
    shippingAddress.address,
    shippingAddress.city,
    shippingAddress.postcode,
    shippingAddress.country,
  ]);

  const onSubmitHandler = ({ fullname, address, city, postcode, country }) => {
    dispatch({
      type: "SAVE_SHIPPING_ADDRESS",
      payload: { fullname, address, city, postcode, country },
    });
    Cookies.set(
      "cart",
      JSON.stringify({
        ...cart,
        shippingAddress: {
          fullname,
          address,
          city,
          postcode,
          country,
        },
      })
    );
    router.push("/payment");
  };

  return (
    <div>
      <h1>Shiping Address</h1>
      <form
        className={classes.formContainer}
        onSubmit={handleSubmit(onSubmitHandler)}
      >
        <div className={classes.inputFieldContainer}>
          <label htmlFor="fullname">Full Name</label>
          <input
            className={classes.input}
            id="fullname"
            autoFocus
            {...register("fullname", {
              required: "Please enter your full name",
            })}
          />
          {errors.fullname && (
            <div style={{ color: "red" }}>{errors.fullname.message}</div>
          )}
        </div>
        <div className={classes.inputFieldContainer}>
          <label htmlFor="address">Address</label>
          <input
            className={classes.input}
            id="address"
            {...register("address", {
              required: "Please enter your address",
            })}
          />
          {errors.address && (
            <div style={{ color: "red" }}>{errors.address.message}</div>
          )}
        </div>
        <div className={classes.inputFieldContainer}>
          <label htmlFor="city">City</label>
          <input
            className={classes.input}
            id="city"
            {...register("city", {
              required: "Please enter your city",
            })}
          />
          {errors.city && (
            <div style={{ color: "red" }}>{errors.city.message}</div>
          )}
        </div>
        <div className={classes.inputFieldContainer}>
          <label htmlFor="postcode">Postcode</label>
          <input
            className={classes.input}
            id="postcode"
            {...register("postcode", {
              required: "Please enter your postcode",
            })}
          />
          {errors.postcode && (
            <div style={{ color: "red" }}>{errors.postcode.message}</div>
          )}
        </div>
        <div className={classes.inputFieldContainer}>
          <label htmlFor="country">Country</label>
          <input
            className={classes.input}
            id="country"
            {...register("country", {
              required: "Please enter your country",
            })}
          />
          {errors.country && (
            <div style={{ color: "red" }}>{errors.country.message}</div>
          )}
        </div>
        <div>
          <button className={classes.primaryButton}> Next</button>
        </div>
      </form>
    </div>
  );
}

export default Checkout;
