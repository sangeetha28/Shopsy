import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import Link from "next/link";
import { signIn } from "next-auth/react";

import classes from "./index.module.css";

function Register() {
  const router = useRouter();
  const [registerStatus, setRegisterStatus] = useState(false);
  const [mongoDBError, setMongoDBError] = useState("");
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const submitHandler = async ({ username, email, password }) => {
    try {
      const response = await fetch("/api/auth/signUp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json ",
        },
        body: JSON.stringify({
          username: username,
          email: email,
          password: password,
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      const signInresponse = await signIn("credentials", {
        redirect: false,
        email: email,
        password: password,
      });
      if (signInresponse.error) {
        setAuthError(
          "Problem Signing in... Please check your username and password"
        );
        return;
      }

      router.push("/");
    } catch (e) {
      setMongoDBError(
        "Sorry, MongoDB Server is not available at the moment. Please try again later"
      );
    }
  };

  return (
    <div className={classes.container}>
      <h1> Register</h1>
      {registerStatus && (
        <div
          style={{
            marginBottom: "20px",
            padding: "10px",
            backgroundColor: "lightgrey",
            color: "black",
          }}
        >
          "Registered Successfully! Please login"
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
            UserName
          </label>
          <input
            type="text"
            {...register("username", {
              required: "Please enter the username",
            })}
            id="username"
            className={classes.inputField}
            autoFocus
          ></input>
          {errors.email && (
            <div style={{ color: "red" }}>{errors.username.message}</div>
          )}
        </div>
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
          <button className={classes.addToCart}>Create An Account </button>
        </div>
        <p>
          Do you have an account with us? <Link href="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}

export default Register;
