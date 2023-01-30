import './tailwind.css';
import React from 'react';
import { createRoot } from 'react-dom/client';
import 'react-toastify/dist/ReactToastify.css';
import App from './App';

export const MovieURLContext = React.createContext();

const MovieURLProvider = props => {
  const apiKey = 'api_key=96f4f679b0cee46290970299c5656f9e';
  const baseURL = 'https://api.themoviedb.org/3';

  const [url, setUrl] = React.useState({
    baseURL : baseURL,
    apiKey : apiKey,
    popmovURL: `${baseURL}/discover/movie?sort_by=popularity.desc&${apiKey}`,
    searchURL: `${baseURL}/search/movie?${apiKey}`,
    genreURL: `${baseURL}/genre/movie/list?${apiKey}`,
    imgBaseURL: 'https://image.tmdb.org/t/p/w500'
  });

  return (
    <MovieURLContext.Provider value={[url, setUrl]}>
      {props.children}
    </MovieURLContext.Provider>
  )
}


const root = createRoot(document.getElementById('root'));

root.render(
    <MovieURLProvider>
        <App />
    </MovieURLProvider>
)