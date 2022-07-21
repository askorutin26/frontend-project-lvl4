
import React from 'react';

import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { Provider } from 'react-redux';
function App(props) {
  const socket = props;
  console.log(socket);
  return (
    <Provider >
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Chat {...socket} />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          <Route
            path='*'
            element={
              <main style={{ padding: '1rem' }}>
                <p>There is nothing here!</p>
              </main>
            }
          />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}
export default App;
