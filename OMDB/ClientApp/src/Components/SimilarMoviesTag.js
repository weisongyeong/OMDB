import Loading from "./Loading";
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { MovieURLContext } from '../index';

const SimilarMoviesTag = ({tmdbId}) => {
    const [loading, setLoading] = useState(false);
    const [similarMovies, setSimilarMovies] = useState([]);
    const url = useContext(MovieURLContext);

    useEffect(() => {
        let token = sessionStorage.getItem('token');
        axios.get(`api/movies/reco/${tmdbId}`, {
            headers: {
                'Authorization': `bearer ${token}`
            }
        })
            .then(res => {
                let movies = res.data;
                movies.forEach(movie => {
                    axios.get(`${url.baseURL}/movie/${movie.movieId}?${url.apiKey}&language=en-US`)
                    .then(res => {
                        setSimilarMovies(m => [...m, res.data]);
                    });
                });
                setLoading(true);
            })
    }, [])

    return (
        <div className="flex justify-center items-center">
            <div className="w-[60rem] bg-black rounded-md">
                <h1 className="font-bold text-white text-xl mt-10 py-1 px-4 tracking-wider">Similar Movies</h1>
                <hr />
                <div className="py-5 flex flex-wrap justify-center my-5">
                    {
                        loading ? (similarMovies.length > 0 ? similarMovies.map(movie => {
                            const { id, title, poster_path } = movie;
                            let imgURL = `${url.imgBaseURL + poster_path}`;

                            return (
                                <div key={id} className="w-[10rem] text-base my-2 mx-4 rounded bg-black">
                                    <img className="w-full rounded" src={poster_path ? imgURL : "https://via.placeholder.com/1080x1580"} alt={title}></img>
                                    <div className="text-center font-bold text-white p-2">{title}</div>
                                </div>
                            )
                        })
                        : <div className="flex justify-center p-5">
                            <div className="rounded-2xl bg-gray-700 text-yellow-300 p-2">No Similar Movies Found</div>
                        </div>)
                         : <Loading />
                    }
                </div>
            </div>
        </div>
    )
}

export default SimilarMoviesTag;