import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { MovieURLContext } from '../index'
import Loading from "../Component/Loading";

const NewMovies = () => {
    const usenavigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [newMovies, setNewMovies] = useState([]);
    const url = useContext(MovieURLContext);

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
            if (movies == '') {
                toast.error('No Movies Found');
                return;
            }
            movies.forEach(movie => {
                axios.get(`${url.baseURL}/movie/${movie.movieId}?${url.apiKey}&language=en-US`)
                .then(res => {
                    setNewMovies(m => [...m, res.data]);
                });
            });
        }
        fetchMovies()
        setLoading(true);
    }, []);

    // authorized link for admin
    const AuthorizedLink = ({IsAdmin}) => {
        if (IsAdmin) {
            return (
                <>
                    <Link className="block text-gray-400 text-center hover:text-white rounded w-full px-2 py-1 tracking-wider select-none" to="/create-new-user">Create New User</Link>
                    <Link className="block text-gray-400 text-center hover:text-white rounded w-full px-2 py-1 tracking-wider select-none" to="/register-admin">Create New Admin</Link>
                    <Link className="block text-gray-400 text-center hover:text-white rounded w-full px-2 py-1 tracking-wider select-none" to="/settings">Settings</Link>
                </>
            )
        }
    }

    return (
        <>
            {/*NAVBAR*/}
            <nav className="bg-gray-900 h-16 flex text-white font-semibold px-10 justify-between items-center">
                <div className='flex items-center gap-4'>
                    <div>
                        <a className="font-extrabold text-xl text-transparent bg-clip-text bg-gradient-to-r from-red-200 to-yellow-400 select-none" >OMDB</a>
                    </div>
                    <div className="flex gap-4">
                        <Link className=" text-gray-400 hover:text-white rounded px-2 py-1 tracking-wider select-none" to="/">Home</Link>
                        <Link className=" text-gray-400 hover:text-white rounded px-2 py-1 tracking-wider select-none" to="/new-movies">New Movies</Link>
                    </div>
                </div>
                <div className="group rounded text-gray-400 relative inline-block w-[15rem] select-none">
                    <div className="group-hover:text-white text-center py-2">{sessionStorage.getItem('username')}</div>
                    <div className="group-hover:flex hidden absolute bg-gray-900 flex-col w-full rounded-md py-2">
                        <AuthorizedLink IsAdmin={sessionStorage.getItem('role')} />
                        <Link className= "text-gray-400 text-center hover:text-white rounded w-full px-3 py-1 tracking-wider select-none" to="/login">Logout</Link>
                    </div>
                </div>
            </nav>

            {/*MOVIES AREA*/}
            <main className="px-4 pb-6">
                <h1 className="mx-28 my-10 text-3xl font-bold text-white">New Movies</h1>
                <div className="flex justify-center flex-wrap">
                    {
                        loading ? newMovies && newMovies.map(movie => {
                            const { id, title, poster_path } = movie;
                            let imgURL = `${url.imgBaseURL + poster_path}`;
                            return (
                                <Link
                                    key={id}
                                    className="m-4 rounded"
                                    to={`/movie/${title}/${id}`}
                                >
                                    <div className="w-56 text-base rounded bg-black transition duration-300 ease-in-out hover:transform hover:scale-125">
                                        <img className="w-full" src={poster_path ? imgURL : "https://via.placeholder.com/1080x1580"} alt={title}></img>
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