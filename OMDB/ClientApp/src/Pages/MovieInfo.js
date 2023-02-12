import MovieDetail from "../Components/MovieDetail";
import SimilarMoviesTag from "../Components/SimilarMoviesTag";
import { useParams, useLocation } from 'react-router-dom';

const MovieInfo = () => {
    let { tmdbId } = useParams();
    const location = useLocation();
    const { title, genres, imgURL, description } = location.state;
    const movie = { tmdbId, title, genres, imgURL, description };

    return (
        <>
            <MovieDetail movie={movie} />
            <SimilarMoviesTag tmdbId={tmdbId} />
        </>
    )
}

export default MovieInfo;