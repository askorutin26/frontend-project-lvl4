import React, { useState } from 'react';
import * as yup from 'yup';
import { Formik } from 'formik';

import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import routes from './routes.js';

export default function Signup() {
  console.log('SIGNUP WAS RENDERED');

  const [validationError, setError] = useState(false);
  const [errorName, setErrName] = useState('');

  const navigate = useNavigate();
  const validationSchema = yup.object({
    username: yup
      .string()
      .required('Please, enter your username')
      .min(3, 'username too short: minimum 3 symbols')
      .max(20, 'username is too long: maximum 20 symbols'),
    password: yup
      .string()
      .required('Please, enter your password')
      .min(6, 'password is too short: minimun 6 symbols')
      .matches(),
  });

  return (
    <div className='h-100' id='chat'>
      <div className='d-flex flex-column h-100'>
        <nav className='shadow-sm navbar navbar-expand-lg navbar-light bg-white'>
          <div className='conteiner'>
            <a className='navbar-brand' href='/'>
              Hexlet chat
            </a>
          </div>
        </nav>
        <div className='container-fluid h-100'>
          <div className='row justify-content-center align-content-center h-100'>
            <div className='col-12 col-md-8 col-xxl-6'>
              <div className='card shadow-sm'>
                <div className='card-body row p-5 justify-content-center'>
                  <Formik
                    initialValues={{
                      username: '',
                      password: '',
                      repeatedPassword: '',
                    }}
                    validationSchema={validationSchema}
                    onSubmit={(values, { setSubmitting }) => {
                      const { password, repeatedPassword, username } = values;
                      if (password !== repeatedPassword) {
                        setError(true);
                        setErrName('password do not match');
                      } else {
                        const path = routes.signupPath();

                        axios
                          .post(path, {
                            username,
                            password,
                          })
                          .then((response) => {
                            const { data } = response;
                            const { token } = data;
                            localStorage.setItem('token', token);
                            setError(false);
                            navigate('/');
                          })
                          .catch((error) => {
                            setError(true);
                            const errCode = error.response.status;
                            if (errCode === 409) {
                              setErrName('the user already exists');
                            } else {
                              setErrName('password or login incorrect');
                            }
                          });
                      }
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
                        className='col-12 col-md-6 mt-3 mt-mb-0'
                        onSubmit={handleSubmit}
                      >
                        <h1 className='text-center mb-4'>Enter</h1>
                        <div className='form-floating mb-3'>
                          <input
                            type='text'
                            name='username'
                            id='username'
                            required
                            placeholder='your username'
                            className='form-control'
                            onChange={handleChange}
                            value={values.username}
                          ></input>
                          <label htmlFor='username'>Your username</label>
                          {errors.username && (
                            <p className='text-danger'>{errors.username}</p>
                          )}
                        </div>
                        <div className='form-floating mb-4'>
                          <input
                            type='password'
                            name='password'
                            id='password'
                            required
                            placeholder='your password'
                            className='form-control'
                            onChange={handleChange}
                            value={values.password}
                          ></input>
                          <label htmlFor='password'>Your password</label>
                          {errors.password && (
                            <p className='text-danger'>{errors.password}</p>
                          )}
                        </div>
                        <div className='form-floating mb-4'>
                          <input
                            type='password'
                            name='repeatedPassword'
                            id='repeatedPassword'
                            required
                            placeholder='repeat password'
                            className='form-control'
                            onChange={handleChange}
                            value={values.repeatedPassword}
                          ></input>
                          <label htmlFor='repeatedPassword'>
                            Repeat your password
                          </label>
                        </div>
                        {validationError && (
                          <p className='text-danger'>{errorName}</p>
                        )}
                        <button
                          //disabled={isSubmitting}
                          type='submit'
                          className='w-100 mb-3 btn btn-outline-primary'
                        >
                          Sign Up
                        </button>
                      </form>
                    )}
                  </Formik>
                </div>
                <div className='card-footer p-4'>
                  <div className='text-center'>
                    <span>Doesn't have an account? </span>
                    <a href='/signup'>Sign Up</a>
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
