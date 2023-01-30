import { useState, useEffect} from 'react';
import axios from 'axios';
import { Link, useNavigate } from "react-router-dom";
import { MovieURLContext } from '../index'
import { toast } from "react-toastify";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

import React from "react";


const ViewMovieDetailsModal = ({ id, title, poster_path, vote_average, imgURL, color, overview }) => {
    const [showModal, setShowModal] = React.useState(false);
    const [similarMovies, setSimilarMovies] = React.useState([]);
    const [url, setUrl] = React.useContext(MovieURLContext);


    // show movies recommendation
    async function handleSimilarMovies(e, id)
    {
        e.preventDefault();
        let tempUrl = `${url.baseURL}/movie/${id}/similar?${url.apiKey}`;
        const res = await axios.get(tempUrl);
        let movies = res.data.results;
        if (movies == '') {
            toast.error('No Movies Found');
            return;
        }
        setSimilarMovies(movies);
        
        setShowModal(true);
    }
    
    return (
        <>
            <button
                className="text-white font-bold uppercase text-sm rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="button"
                onClick={(e) => handleSimilarMovies(e, id)}
            >
                <div key={id} className="group m-4 w-56 text-base bg-black transition duration-300 ease-in-out hover:transform hover:scale-125">
                    <img className="w-full" src={poster_path ? imgURL : "http://via.placeholder.com/1080x1580"} alt={title}></img>
                    <div className="flex justify-between items-center p-2 h-20">
                        <div className="my-1 mx-2 font-bold text-white">{title}</div>
                        <div className="p-1 rounded font-bold" style={{ color: color }}>{vote_average}</div>
                    </div>
                </div>
            </button>
            {showModal ? (
                <>
                    <div
                        className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
                    >
                        <div className="relative w-auto my-6 mx-auto max-w-3xl">
                            {/*content*/}
                            <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                {/*header*/}
                                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                                    <h3 className="text-3xl font-semibold">
                                        Movies Recommendation for '{title}'
                                    </h3>
                                    <button
                                        className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                                        onClick={() => setShowModal(false)}
                                    >
                                        <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                                            ×
                                        </span>
                                    </button>
                                </div>
                                <div>
                                    <ul className="flex flex-col justify-center items-center my-4">
                                    {similarMovies && similarMovies.map(similarMovie =>
                                    {
                                        const { id, title} = similarMovie;
                                        return (
                                            <li key={id}>{title}</li>
                                        )
                                    })}
                                    </ul>
                                </div>
                                <div></div>
                                {/*footer*/}
                                <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                                    <button
                                        className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                </>
            ) : null}
        </>
    );
}


const Home = () => {
    const usenavigate = useNavigate();
    const [url, setUrl] = React.useContext(MovieURLContext);
    const [lastUrl, setLastUrl] = useState(url.popmovURL);
    const [movies, setMovies] = useState();
    const [pageData, setPageData] = useState();
    const [totalPages, setTotalPages] = useState();
    const [currPageNum, setCurrPageNum] = useState(1);
    const [nextPageNum, setNextPageNum] = useState();
    const [prevPageNum, setPrevPageNum] = useState();
    const [nextPageDisabled, setNextPageDisabled] = useState();
    const [prevPageDisabled, setPrevPageDisabled] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        let username = sessionStorage.getItem('username');
        if (username === '' || username === null) {
            usenavigate('/login');
        }

        // fetch movies data via tmdb api
        async function fetchMovies() {
            const res = await axios.get(lastUrl);
            let movies = res.data.results;
            if (movies == '') {
                toast.error('No Movies Found');
                return;
            }

            setMovies(res.data.results);
            setPageData(res.data);
        }
        fetchMovies()
    }, [lastUrl]);


    // update page number
    useEffect(() => {
        if (pageData != null) {
            let data = pageData;
            setCurrPageNum(data.page);
            setTotalPages(data.total_pages);
        }
    }, [pageData]);

    useEffect(() => {
        setNextPageNum(currPageNum + 1);
        setPrevPageNum(currPageNum - 1);
    }, [currPageNum]);

    useEffect(() => {
        setNextPageDisabled(nextPageNum > totalPages);
    }, [nextPageNum]);

    useEffect(() => {
        setPrevPageDisabled(prevPageNum < 1);
    }, [prevPageNum]);

    // search movie
    const SearchMovie = (e) => {
        e.preventDefault();
        searchTerm ? setLastUrl(url.searchURL + '&query=' + searchTerm) : setLastUrl(url.popmovURL);
    }

    // page button control
    const ToNextPage = (e) => {
        e.preventDefault();
        if (nextPageNum <= totalPages) {
            pageCall(nextPageNum);
        }
    }

    const ToPrevPage = (e) => {
        e.preventDefault();
        if (prevPageNum > 0) {
            pageCall(prevPageNum)
        }
    }

    function pageCall(page) {
        let urlSplit = lastUrl.split('?');
        let queryParams = urlSplit[1].split('&');
        let key = queryParams[queryParams.length - 1].split('=');
        if (key[0] != 'page') {
            let currUrl = lastUrl + '&page=' + page;
            setLastUrl(currUrl);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            key[1] = page.toString();
            let a = key.join('=');
            queryParams[queryParams.length - 1] = a;
            let b = queryParams.join('&');
            let currUrl = urlSplit[0] + '?' + b;
            setLastUrl(currUrl);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }


    // authorized admin functionality
    const Authorized = (props) => {
        const isAdmin = props.isAdmin;
        if (isAdmin) {
            return (
                <>
                    <div className="flex gap-4">
                        <Link className="hover:bg-gray-800 text-gray-400 hover:text-white rounded px-2 py-1 tracking-wider select-none" to="/create-new-user">Create New User</Link>
                    </div>
                    <div className="flex gap-4">
                        <Link className="hover:bg-gray-800 text-gray-400 hover:text-white rounded px-2 py-1 tracking-wider select-none" to="/register-admin">Create New Admin</Link>
                    </div>
                </>
            )
        }
    }


    return (
        <>
            <nav className="bg-gray-900 h-16 flex text-white font-semibold px-10 justify-between items-center">
                <div className='flex items-center gap-4'>
                    <div>
                        <a className="font-extrabold text-xl text-transparent bg-clip-text bg-gradient-to-r from-red-200 to-yellow-400 select-none" >OMDB</a>
                    </div>
                    <div className="flex gap-4">
                        <button className="hover:bg-gray-800 text-gray-400 hover:text-white rounded px-2 py-1 tracking-wider select-none" onClick={(e) => setLastUrl(url.popmovURL)}>Home</button>
                    </div>
                    <Authorized isAdmin={sessionStorage.getItem('role')} />
                    <form onSubmit={SearchMovie} >
                        <input type="text"
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search"
                            className="py-1 px-2 bg-gray-700 border rounded-xl border-[#333] text-[#999] placeholder-[#999] focus:outline-none focus:border-[#9ecaed] focus:shadow-[0_0_10px_#92caed]"
                        />
                    </form>
                </div>
                <div className='flex items-center gap-7'>
                    <div className="flex gap-4 items-center">
                        <div>Welcome back, {sessionStorage.getItem('username')}</div>
                        <Link className="hover:bg-gray-800 text-gray-400 hover:text-white rounded px-3 py-1 tracking-wider select-none" to="/login">Logout</Link>
                    </div>
                </div>
            </nav>

            <main className="px-4 pb-6">
                {
                    lastUrl.startsWith(url.popmovURL) ?
                        <h1 className="mx-28 my-10 text-3xl font-bold text-white">Popular Movies</h1>
                        :
                        <h1 className="mx-28 my-10 text-3xl font-bold text-white">Searching for '{searchTerm}'</h1>
                }
                <div className="flex justify-center flex-wrap">
                    {movies && movies.map(movie => {
                        const { id, title, poster_path, vote_average, overview } = movie;
                        let imgURL = `${url.imgBaseURL + poster_path}`;
                        let color = vote_average > 7 ? 'lightgreen' : (vote_average < 5 ? 'red' : 'orange');
                        return (
                            <div className="flex flex-col">
                                <ViewMovieDetailsModal id={id} title={title} poster_path={poster_path} vote_average={vote_average}
                                imgURL={imgURL} color={color} overview={overview}/>
                            </div>
                        )
                    })}
                </div>
            </main>

            <div className="flex justify-center bg-gray-900 p-[1rem] shadow-[0_-3px_5px_3px_rgba(0, 43, 91, .5)]">
                <button disabled={prevPageDisabled} onClick={ToPrevPage} className="flex justify-center items-center px-1 text-white rounded disabled:cursor-default disabled:text-gray-700 hover:bg-gray-800 disabled:hover:bg-transparent" type="button">
                    <ArrowBackIosNewIcon />
                </button>
                <div className="cursor-default select-none text-center text-[1.5rem] py-[0.2rem] px-[1rem] mx-[1rem] text-white">{currPageNum}</div>
                <button disabled={nextPageDisabled} onClick={ToNextPage} className="flex justify-center items-center px-1 text-white rounded disabled:cursor-default disabled:text-gray-700 hover:bg-gray-800 disabled:hover:bg-transparent" type="button">
                    <ArrowForwardIosIcon />
                </button>
            </div>
        </>
    )
}

export default Home;