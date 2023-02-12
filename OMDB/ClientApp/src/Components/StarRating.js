import { useState, useEffect } from 'react';
import { toast } from "react-toastify";
import axios from 'axios';
import StarIcon from '@mui/icons-material/Star';

const StarRating = ({movie}) => {
    const [rating, setRating] = useState(null);
    const [hover, setHover] = useState(null);
    const { tmdbId, title, genres, imgURL, description } = movie;
    let token = sessionStorage.getItem('token');
    let userId = sessionStorage.getItem('user id');

    useEffect(() => {
        axios.get(`api/movieratings/get-rating/${tmdbId}/${userId}`, {
            headers: {
                'Authorization': `bearer ${token}`
            }
        })
            .then(res => {
                if (res.data.id != null) {
                    setRating(res.data.rating);
                }
            })
            .catch((err) => {
                toast.error(err.message);
            });
    }, [])

    const UpdateRating = (ratingValue) => {
        axios.post("api/movieratings/give-rating", {
            TmdbId : tmdbId,
            UserId : userId,
            MovieTitle : title,
            MovieGenres : genres,
            MoviePosterUrl : imgURL,
            MovieDescription : description,
            Rating : ratingValue
        }, {
            headers: {
                'Authorization': `bearer ${token}`
            }
        })
        .then(res => {
            if (res.data.id != null) {
                setRating(res.data.rating);
                toast.success(`You rated '${title}' ${ratingValue} stars`);
            }
        })
        .catch((err) => {
            toast.error(err.message);
        });
    }

    return (
        <div>
                {
                    [...Array(5)].map((star, i) => {
                        const ratingValue = i + 1;
                        return (
                            <label key={i}>
                                <input
                                    type="radio"
                                    name="rating"
                                    className="hidden"
                                    value={ratingValue} 
                                    onClick={() => UpdateRating(ratingValue)}
                                />
                                <StarIcon
                                    className="cursor-pointer"
                                    onMouseEnter={() => setHover(ratingValue)}
                                    onMouseLeave={() => setHover(null)}
                                    style={{ color: ratingValue <= (hover || rating) ? "yellow" : "gray" }}
                                />
                            </label>
                        )
                    })
                }
        </div>
    )
}

export default StarRating;