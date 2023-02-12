import Layout from './Layout/Layout'
import Home from './Pages/Home'
import NewMovies from './Pages/NewMoives'
import Search from './Pages/Search'
import MovieInfo from './Pages/MovieInfo'
import Favourites from './Pages/Favourites'
import Login from './ModalPages/Login'
import Register from './ModalPages/Register'
import CreateNewUser from './ModalPages/CreateNewUser'
import CreateNewAdmin from './ModalPages/CreateNewAdmin'
import ChangePassword from './ModalPages/ChangePassword'
import Settings from './ModalPages/Settings'
import NoPage from './Pages/NoPage'
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

const App = () => {

  return (
    <>
      <ToastContainer theme='colored' position='top-center'></ToastContainer>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={ <Layout /> }>
            <Route index element={ <Home /> } />
            <Route path="new-movies" element={ <NewMovies /> } />
            <Route path="search" element={ <Search /> } />
            <Route path="favourites" element={ <Favourites /> } />
            <Route path="movie/:tmdbId" element={ <MovieInfo /> } />
          </Route>
          <Route path="login" element={< Login /> } />
          <Route path="register" element={ <Register /> } />
          <Route path="register-admin" element={ <CreateNewAdmin /> } />
          <Route path="create-new-user" element={ <CreateNewUser /> } />
          <Route path="change-pass" element={ <ChangePassword /> } />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={ <NoPage /> } />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App;