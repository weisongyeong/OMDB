import StarRating from './StarRating';
import AddToFavourites from './AddToFavourites';

const MovieDetail = ({movie}) => {
    const { tmdbId, title, genres, imgURL, description } = movie;

    const Genres = () => {
        return (
            <div className="flex gap-2">
                {
                    genres.split('|').map((genre, i) => {
                        return <div key={i} className="py-1 px-2 rounded bg-gray-800 text-sm"> {genre} </div>
                    })
                }
            </div>
        )
    }

    return (
        <div className="flex justify-center">
            <div className="relative flex gap-10 my-10 py-1 w-[60rem]">
                <AddToFavourites movie={movie}/>
                <img className="w-[20rem] object-cover rounded" src={imgURL} alt={title} />
                <div className="text-white grow flex flex-col gap-2">
                    <h1 className="font-bold text-3xl tracking-wider mb-5"> {title} </h1>
                    <Genres />
                    <StarRating movie={movie} />
                    <div> {description} </div>
                </div>
            </div >
        </div>
    )
}

export default MovieDetail;