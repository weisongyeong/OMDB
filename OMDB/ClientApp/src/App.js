import Login from './Pages/Login'
import Home from './Pages/Outlet/Home'
import Register from './Pages/Register'
import Layout from './Pages/Layout'
import CreateNewAdmin from './Pages/CreateNewAdmin'
import CreateNewUser from './Pages/CreateNewUser'
import NoPage from './Pages/NoPage'
import React from 'react';
import { BrowserRouter, Routes, Route, useContext } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

const App = () => {

  return (
    <>
      <ToastContainer theme='colored' position='top-center'></ToastContainer>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />} >
            <Route index element={<Home />} />
          </Route>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="register-admin" element={<CreateNewAdmin />} />
          <Route path="create-new-user" element={<CreateNewUser />} />
          <Route path="*" element={<NoPage />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App;