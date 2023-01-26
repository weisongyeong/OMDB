import Login from './Login'
import Main from './Main'
import Register from './Register'
import Navbar from './Navbar'
import React, {useState, useEffect} from 'react';

const App = () => {
    const apiKey = 'api_key=96f4f679b0cee46290970299c5656f9e';
    const baseURL = 'https://api.themoviedb.org/3';
  
    const [url, setUrl] = React.useState({
      popmovURL: `${baseURL}/discover/movie?sort_by=popularity.desc&${apiKey}`,
      genreURL: `${baseURL}/genre/movie/list?${apiKey}`,
      imgBaseURL: 'https://image.tmdb.org/t/p/w500'
    });

    return (<>
        <Navbar />
        {/* <Register /><Login /> */}
        <Main URL={[url, setUrl]} />
    </>)
}

export default App;