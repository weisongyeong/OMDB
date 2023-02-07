import Loading from "../Component/Loading";
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { toast } from "react-toastify";
import { MovieURLContext } from '../index'

const SimilarMoviesTag = () => {
    let { title, id } = useParams();
    const [loading, setLoading] = useState(false);
    const [similarMovies, setSimilarMovies] = useState([]);
    const url = useContext(MovieURLContext);
    const navigate=useNavigate();

    useEffect(() => {
        let token = sessionStorage.getItem('token');
        axios.get(`https://localhost:44376/api/Movies/reco/${id}`, {
            headers: {
                'Authorization': `bearer ${token}`
            }
        })
            .then(res => {
                let movies = res.data;
                if (movies == '') {
                    toast.error('No similar movies found');
                    navigate('/');
                }
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
            <div className="flex justify-center items-center py-10">
                <div className="relative shadow-2xl px-14 py-5 w-[70rem] bg-black rounded-md">
                    <h1 className="font-bold text-white text-3xl my-10 py-1 text-center tracking-wider">Similar Movies to '{title}'</h1>
                    <div className="py-5 flex flex-wrap justify-center">
                        {
                            loading ? similarMovies.map(movie => {
                                let imgURL = `${url.imgBaseURL + movie.poster_path}`;
                                return (
                                    <div key={movie.id} className="w-56 text-base m-2 rounded bg-black">
                                        <img className="w-full" src={movie.poster_path ? imgURL : "https://via.placeholder.com/1080x1580"} alt={movie.title}></img>
                                        <div className="flex justify-between items-center p-2 h-20">
                                            <div className="my-1 mx-2 font-bold text-white">{movie.title}</div>
                                        </div>
                                    </div>
                                )
                            }) :
                                <Loading />
                        }
                    </div>
                    <div className="flex justify-center">
                        <Link className="border rounded-lg px-4 py-1 mb-5 text-white bg-gradient-to-r from-red-300 to-yellow-500 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300 select-none" to={"/"}>Back to Home</Link>
                    </div>
                </div>
            </div>
    )
}

export default SimilarMoviesTag;