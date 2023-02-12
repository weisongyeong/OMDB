import { useState, useEffect, useContext} from 'react';
import axios from 'axios';
import { Link, useNavigate } from "react-router-dom";
import { MovieURLContext } from '../index'
import { toast } from "react-toastify";
import Loading from "../Components/Loading";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const Home = () => {
    const usenavigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const url = useContext(MovieURLContext);
    const [homeUrl, setHomeUrl] = useState(url.popmovURL);
    const [movies, setMovies] = useState([]);
    const [pageData, setPageData] = useState();
    const [totalPages, setTotalPages] = useState();
    const [currPageNum, setCurrPageNum] = useState(1);
    const [nextPageNum, setNextPageNum] = useState();
    const [prevPageNum, setPrevPageNum] = useState();
    const [nextPageDisabled, setNextPageDisabled] = useState();
    const [prevPageDisabled, setPrevPageDisabled] = useState(true);

    useEffect(() => {
        let username = sessionStorage.getItem('username');
        if (username === '' || username === null) {
            usenavigate('/login');
        }

        // fetch movies data via tmdb api
        async function fetchMovies() {
            const res = await axios.get(homeUrl);
            let movies = res.data.results;
            if (movies == '') {
                toast.error('No movies found');
                return;
            }

            setMovies(res.data.results);
            setPageData(res.data);
        }
        fetchMovies()
        setLoading(true);
    }, [homeUrl]);


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
        let urlSplit = homeUrl.split('?');
        let queryParams = urlSplit[1].split('&');
        let key = queryParams[queryParams.length - 1].split('=');
        if (key[0] != 'page') {
            let currUrl = homeUrl + '&page=' + page;
            setHomeUrl(currUrl);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            key[1] = page.toString();
            let a = key.join('=');
            queryParams[queryParams.length - 1] = a;
            let b = queryParams.join('&');
            let currUrl = urlSplit[0] + '?' + b;
            setHomeUrl(currUrl);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    return (
        <>
            {/*MOVIES AREA*/}
            <main className="px-4 pb-6">
                <h1 className="mx-28 my-10 text-3xl font-bold text-white">Popular Movies</h1>
                <div className="flex justify-center flex-wrap">
                    {
                        loading ? movies && movies.map(movie => {
                            const { id, title, genre_ids, overview, poster_path, vote_average} = movie;
                            let imgURL = `${url.imgBaseURL + poster_path}`;
                            let color = vote_average > 7 ? 'lightgreen' : (vote_average < 5 ? 'red' : 'orange');
                            let genres = genre_ids.map(id => {
                                let genre = url.genres.find(genre => genre.id === id);
                                return genre.name;
                            }).join('|');
                            let movieInfo = { title, genres, imgURL, description: overview };
                            
                            return (
                                <Link
                                    key={id}
                                    className="m-4 rounded"
                                    to={`/movie/${id}`}
                                    state={ movieInfo }
                                >
                                    <div className="w-56 text-base rounded bg-black transition duration-300 ease-in-out hover:transform hover:scale-125">
                                        <img className="w-full rounded" src={poster_path ? imgURL : "https://via.placeholder.com/1080x1580"} alt={title}></img>
                                        <div className="flex justify-between items-center p-2 h-20">
                                            <div className="my-1 mx-2 font-bold text-white">{title}</div>
                                            <div className="p-1 rounded font-bold" style={{ color: color }}>{vote_average}</div>
                                        </div>
                                    </div>
                                </Link>
                            )
                        }) :
                            < Loading />
                    }
                </div>
            </main>

            {/*PAGINATION*/}
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