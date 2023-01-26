import React, {useState, useEffect, useContext} from 'react';
import axios from 'axios';


const Main = ({URL}) => {
    const [url, setUrl] = URL;
    const [movies, setMovies] = useState();
  
    useEffect(() => {
      async function fetchMovies() {
        const res = await axios.get(url.popmovURL);
        setMovies(res.data.results);
      }
      fetchMovies()
    }, []);
  
    return (
      <main className="p-10">
        <h1 className="mx-20 text-3xl font-bold text-white">Popular Movies</h1>
        <div className="flex flex-wrap justify-center p-4">
        {movies && movies.map(movie => {
          const {id, title, poster_path, vote_average} = movie;
          let imgURL = `${url.imgBaseURL+poster_path}`;
          let color = vote_average > 7 ? 'lightgreen' : (vote_average < 5? 'red' : 'orange');
          return (
            <div key={id} className="m-4 w-72 text-base">
              <img className="w-full" src={poster_path ? imgURL : "http://via.placeholder.com/1080x1580"} alt={title}></img>
              <div className="flex justify-between items-center p-2">
                <div className="my-1 mx-2 font-bold text-white">{title}</div>
                <div className="p-1 rounded font-bold" style={{ color: color}}>{vote_average}</div>
              </div>
            </div>
          )
        })}
        </div>
      </main>
    )
}

export default Main;