import React, { useState } from "react";

import { Formik } from "formik";

import axios from "axios";
import { useNavigate } from "react-router-dom";
import routes from "../routes.js";

export default function Login() {
  const [validationError, setError] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="h-100" id="chat">
      <div className="d-flex flex-column h-100">
        <nav className="shadow-sm navbar navbar-expand-lg navbar-light bg-white">
          <div className="conteiner">
            <a className="navbar-brand" href="/">
              Hexlet chat
            </a>
          </div>
        </nav>
        <div className="container-fluid h-100">
          <div className="row justify-content-center align-content-center h-100">
            <div className="col-12 col-md-8 col-xxl-6">
              <div className="card shadow-sm">
                <div className="card-body row p-5 justify-content-center">
                  <Formik
                    initialValues={{
                      username: "",
                      password: "",
                    }}
                    onSubmit={(values, { setSubmitting }) => {
                      const path = routes.loginPath();
                      axios
                        .post(path, values)
                        .then((response) => {
                          const { data } = response;
                          const { token } = data;
                          localStorage.setItem("token", token);
                          localStorage.setItem("username", values.username);
                          setSubmitting(false);

                          if (localStorage.getItem("token")) {
                            setError(false);
                            navigate("/");
                          }
                        })
                        .catch((error) => {
                          setError(true);
                          console.log(error);
                          setSubmitting(false);
                        });
                    }}
                  >
                    {({
                      values,
                      errors,
                      touched,
                      handleChange,
                      handleBlur,
                      handleSubmit,
                      isSubmitting,
                    }) => (
                      <form
                        className="col-12 col-md-6 mt-3 mt-mb-0"
                        onSubmit={handleSubmit}
                      >
                        <h1 className="text-center mb-4">Log In</h1>
                        <div className="form-floating mb-3">
                          <input
                            type="text"
                            name="username"
                            id="username"
                            required
                            placeholder="your username"
                            className="form-control"
                            onChange={handleChange}
                            value={values.username}
                          ></input>
                          <label htmlFor="username">Your username</label>
                        </div>
                        <div className="form-floating mb-4">
                          <input
                            type="password"
                            name="password"
                            id="password"
                            required
                            placeholder="your password"
                            className="form-control"
                            onChange={handleChange}
                            value={values.password}
                          ></input>
                          <label htmlFor="password">Your password</label>
                        </div>

                        {validationError && (
                          <p className="text-danger">
                            the username or password is incorrect
                          </p>
                        )}
                        <button
                          type="submit"
                          className="w-100 mb-3 btn btn-outline-primary"
                          disabled={isSubmitting}
                        >
                          Login
                        </button>
                      </form>
                    )}
                  </Formik>
                </div>
                <div className="card-footer p-4">
                  <div className="text-center">
                    <span>Doesn't have an account? </span>
                    <a href="/signup">Sign Up</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
