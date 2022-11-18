import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";
import Link from "next/link";

import classes from "./index.module.css";

function Login() {
  const router = useRouter();

  const { redirect } = router.query;

  const [authError, setAuthError] = useState("");
  const [mongoDBError, setMongoDBError] = useState("");
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const submitHandler = async ({ email, password }) => {
    try {
      const response = await signIn("credentials", {
        redirect: false,
        email: email,
        password: password,
      });
      if (response.error) {
        setAuthError(
          "Problem Signing in... Please check your username and password"
        );
        return;
      }
      router.push(redirect || "/");
    } catch (e) {
      setMongoDBError(
        "Sorry, MongoDB Server is not available at the moment. Please try again later"
      );
    }
  };

  return (
    <div className={classes.container}>
      <h1> Login </h1>
      {authError && (
        <div
          style={{
            marginBottom: "20px",
            padding: "10px",
            backgroundColor: "lightgrey",
            color: "black",
          }}
        >
          {authError}
        </div>
      )}
      {mongoDBError && (
        <div
          style={{
            marginBottom: "20px",
            padding: "10px",
            backgroundColor: "lightgrey",
            color: "black",
          }}
        >
          {mongoDBError}
        </div>
      )}
      <form onSubmit={handleSubmit(submitHandler)}>
        <div className={classes.inputFieldContainer}>
          <label style={{ textAlign: "left" }} htmlFor="email">
            {" "}
            Email
          </label>
          <input
            type="email"
            {...register("email", {
              required: "Please enter the email",
              pattern: {
                value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/i,
                message: "Please enter the valid email",
              },
            })}
            id="email"
            className={classes.inputField}
            autoFocus
          ></input>
          {errors.email && (
            <div style={{ color: "red" }}>{errors.email.message}</div>
          )}
        </div>
        <br />
        <div className={classes.inputFieldContainer}>
          <label style={{ textAlign: "left" }} htmlFor="password">
            Password
          </label>
          <input
            type="password"
            {...register("password", {
              required: "Please enter the password",
              minLength: {
                value: 6,
                message: "Password is short, it should be more than 5 chars",
              },
            })}
            className={classes.inputField}
            id="password"
            autoFocus
          ></input>
          {errors.password && (
            <div style={{ color: "red" }}>{errors.password.message}</div>
          )}
        </div>
        <div>
          <button className={classes.addToCart}> Login </button>
        </div>
        <p>
          Don't have an account? <Link href="/register">Register</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
