import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link, useNavigate } from "react-router-dom";
import { MovieURLContext } from '../index'
import Loading from "../Components/Loading";
import AddIcon from '@mui/icons-material/Add';

const NewMovies = () => {
    const usenavigate = useNavigate();
    const url = useContext(MovieURLContext);
    const [loading, setLoading] = useState(false);
    const [newMovies, setNewMovies] = useState([]);

    useEffect(() => {
        let username = sessionStorage.getItem('username');
        if (username === '' || username === null) {
            usenavigate('/login');
        }

        // fetch new movies data via api
        async function fetchMovies() {
            let token = sessionStorage.getItem('token');
            const res =
                await axios.get('api/movies/get-movies',
                    {
                        headers: {
                            'Authorization': `bearer ${token}`
                        }
                    });
            let movies = res.data;
            movies.forEach(movie => {
                let { tmdbId, title, genres, posterPath, description} = movie;
                let isTmdbPoster = false;
                if (movie.tmdbId != null) {
                    axios.get(`${url.baseURL}/movie/${movie.tmdbId}?${url.apiKey}&language=en-US`)
                        .then(res => {
                            if (title == null)
                                title = res.data.title;
                            if (genres == null)
                            {
                                genres = res.data.genres.map(genre => {
                                    return genre.name;
                                }).join('|');
                            }
                            if (posterPath == null) {
                                posterPath = res.data.poster_path;
                                isTmdbPoster = true;
                            }
                            if (description == null)
                                description = res.data.overview;
                                
                            setNewMovies(m => [...m, { tmdbId, title, genres, posterPath, description, isTmdbPoster }]);
                        })
                }
                if (movie.tmdbId == null)
                    setNewMovies(m => [...m, { tmdbId, title, genres, posterPath, description, isTmdbPoster }]);
            });
        }
        fetchMovies()
        setLoading(true);
    }, []);

    return (
        <>
            {/*MOVIES AREA*/}
            <main className="px-4 pb-6">
                <h1 className="mx-28 my-10 text-3xl font-bold text-white">New Movies</h1>
                <div className="flex justify-center flex-wrap">
                    {
                        loading ? newMovies && newMovies.map(movie => {
                            const { tmdbId, title, genres, posterPath, description, isTmdbPoster } = movie;
                            let imgURL = isTmdbPoster? `${url.imgBaseURL + posterPath}` : require(`../../public/posters/${posterPath}`);
                            let movieInfo = { title, genres, imgURL, description };

                            return (
                                <Link
                                    key={tmdbId}
                                    className="m-4 rounded"
                                    to={`/movie/${tmdbId}`}
                                    state= { movieInfo }
                                >
                                    <div className="w-56 text-base rounded bg-black transition duration-300 ease-in-out hover:transform hover:scale-125">
                                        <img className="w-full rounded" src={posterPath ? imgURL : "https://via.placeholder.com/1080x1580"} alt={title}></img>
                                        <div className="flex justify-between items-center p-2 h-20">
                                            <div className="my-1 mx-2 font-bold text-white">{title}</div>
                                        </div>
                                    </div>
                                </Link>
                            )
                        }) :
                            < Loading />
                    }
                </div>
            </main>
        </>
    )
}

export default NewMovies;