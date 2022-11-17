import { useState } from "react";
import { useForm } from "react-hook-form";

import classes from "./index.module.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const submitHandler = ({ email, password }) => {
    event.preventDefault();
  };

  return (
    <div className={classes.container}>
      <h1> Login</h1>
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
              minLength: { value: 6, message: "Password is short, it should be more than 5 chars" },
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
          <button className={classes.addToCart}>Login </button>
        </div>
        <p>Don't have an account? Register</p>
      </form>
    </div>
  );
}

export default Login;
