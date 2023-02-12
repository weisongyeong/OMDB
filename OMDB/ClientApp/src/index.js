import './tailwind.css';
import './index.css';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import App from './App';

export const MovieURLContext = React.createContext();

const MovieURLProvider = props => {
  const apiKey = 'api_key=96f4f679b0cee46290970299c5656f9e';
  const baseURL = 'https://api.themoviedb.org/3';
  const genres = [
    {
      "id": 28,
      "name": "Action"
    },
    {
      "id": 12,
      "name": "Adventure"
    },
    {
      "id": 16,
      "name": "Animation"
    },
    {
      "id": 35,
      "name": "Comedy"
    },
    {
      "id": 80,
      "name": "Crime"
    },
    {
      "id": 99,
      "name": "Documentary"
    },
    {
      "id": 18,
      "name": "Drama"
    },
    {
      "id": 10751,
      "name": "Family"
    },
    {
      "id": 14,
      "name": "Fantasy"
    },
    {
      "id": 36,
      "name": "History"
    },
    {
      "id": 27,
      "name": "Horror"
    },
    {
      "id": 10402,
      "name": "Music"
    },
    {
      "id": 9648,
      "name": "Mystery"
    },
    {
      "id": 10749,
      "name": "Romance"
    },
    {
      "id": 878,
      "name": "Science Fiction"
    },
    {
      "id": 10770,
      "name": "TV Movie"
    },
    {
      "id": 53,
      "name": "Thriller"
    },
    {
      "id": 10752,
      "name": "War"
    },
    {
      "id": 37,
      "name": "Western"
    }
  ]

  const url = {
    baseURL : baseURL,
    apiKey : apiKey,
    popmovURL: `${baseURL}/discover/movie?sort_by=popularity.desc&${apiKey}`,
    searchURL: `${baseURL}/search/movie?${apiKey}`,
    genres: genres,
    imgBaseURL: 'https://image.tmdb.org/t/p/w500'
  };

  return (
    <MovieURLContext.Provider value={url}>
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