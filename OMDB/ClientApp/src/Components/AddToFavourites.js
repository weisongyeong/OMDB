import axios from 'axios';
import { useState, useEffect } from 'react';
import { toast } from "react-toastify";
import BookmarkIcon from '@mui/icons-material/Bookmark';

const AddToFavourites = ({movie}) => {
    const [isFavourite, setIsFavourite] = useState(false);
    const { tmdbId, title, genres, imgURL, description } = movie;
    let token = sessionStorage.getItem('token');
    let userId = sessionStorage.getItem('user id');

    useEffect(() => {
        axios.get(`api/favourites/user-favourite/${tmdbId}/${userId}`, {
            headers: {
                'Authorization': `bearer ${token}`
            }
        })
            .then(res => {
                if (res.data.id != null) {
                    setIsFavourite(true);
                }
            })
            .catch((err) => {
                toast.error(err.message);
            });
    }, [])

    const UpdateFavourite = () => {
        axios.post("api/favourites/update-user-favourites", {
            TmdbId : tmdbId,
            UserId : userId,
            MovieTitle : title,
            MovieGenres : genres,
            MoviePosterUrl : imgURL,
            MovieDescription : description,
        }, {
            headers: {
                'Authorization': `bearer ${token}`
            }
        })
        .then(res => {
            if (res.data.id != null) {
                setIsFavourite(!isFavourite);
                isFavourite ?
                    toast.success(`You removed '${title}' from your favourites`)
                    : toast.success(`You added '${title}' to your favourites`);
            }
        })
        .catch((err) => {
            toast.error(err.message);
        });
    }

    return (
        <BookmarkIcon
            className="cursor-pointer absolute top-0 right-0"
            onClick={() => UpdateFavourite()}
            style={{ color: isFavourite ? "yellow" : "gray" }} />
    )
}

export default AddToFavourites;