import Loading from "../Component/Loading";
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from "react-toastify";

const MovieDetail = () => {
    let { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [similarMovies, setSimilarMovies] = useState();
    const navigate=useNavigate();

    useEffect(() => {
            axios.get(`https://localhost:44376/api/Movies/${id}`)
            .then(res => {
                let movies = res.data;
                if (movies == '') {
                    toast.error('No Similar Movies Found');
                    navigate('/');
                }
                setSimilarMovies(movies);
                setLoading(true);
            })
        }, [])

    return (
        <>
            <div className="flex justify-center items-center py-10">
                <div className="relative shadow-2xl w-[30rem] px-14 py-5 bg-gray-100 rounded-md">
                    <h1 className="font-bold text-3xl my-10 py-1 text-center tracking-wider select-none">Similar Movies</h1>
                    <ol className="text-lg my-5">
                        {
                            loading ? similarMovies.map(similarMovie => {
                                const { movieId, title } = similarMovie;
                                return (
                                    <li key={movieId} className='mb-2'>{title}</li>
                                )
                            }) :
                                <Loading />
                        }
                    </ol>
                    <div className="flex justify-center">
                        <Link className="border rounded-lg px-4 py-1 mb-5 text-white bg-gradient-to-r from-red-300 to-yellow-500 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300 select-none" to={"/"}>Back to Home</Link>
                    </div>
                </div>
            </div>
        </>
    )
}

export default MovieDetail;