import React, { useEffect, useReducer, useState } from 'react'
import axios from 'axios';
import "../css/movie.css"
import Loader from './Loader';

function Movie() {

    let initialstates = {
        movies: [],
        loading: false,
        error: false,
        searchedMovie: "avengers"
    }

    let [search, setSearch] = useState(""); // ^ For searching purpose

    let movieReducer = (currentState, action) => {
        switch (action.type) {
            case 'Movies':
                return { ...currentState, movies: action.newdata, loading: false, error: false };
            case 'Loading':
                return { ...currentState, loading: true };
            case 'Error':
                return { ...currentState, error: true, loading: false };
            case 'Search_Movie':
                return { ...currentState, searchedMovie: action.newdata };
            default:
                return currentState;
        }
    };
    let [state, dispatch] = useReducer(movieReducer, initialstates);

    // let fetchMovies = async () => {
    //     try {
    //         dispatch({ type: 'Loading' });
    //         let response = await fetch(`https://www.omdbapi.com/?s=${state.searchedMovie}&apikey=ed3eea1e`);
    //         let data = await response.json();
    //         if (data.Response === 'True') {
    //             if (data.Search.length === 0) {
    //                 dispatch({ type: 'Error' }); // ! Handle if no movies are returned
    //             } else {
    //                 dispatch({ type: 'Movies', newdata: data.Search });
    //             }
    //         } else {
    //             dispatch({ type: 'Error' }); // ! Handle case when API response is not successful
    //         }
    //     } catch (error) {
    //         dispatch({ type: 'Error' }); // ! Handle network errors or API issues
    //     }
    // };

    let fetchMovies = async () => {
        if (!state.searchedMovie.trim()) {
            dispatch({ type: "Movies", newdata: [] });
            return;
        }

        try {
            dispatch({ type: "Loading" });
            let { data } = await axios.get(
                `https://www.omdbapi.com/?s=${state.searchedMovie}&apikey=ed3eea1e`
            );

            if (data.Response === "True") {
                dispatch({ type: "Movies", newdata: data.Search });
            } else {
                dispatch({ type: "Movies", newdata: [] });
            }
        } catch {
            dispatch({ type: "Error" });
        }
    };

    useEffect(() => {
        fetchMovies();
    }, [state.searchedMovie]);

    let handleSearch = (e) => {
        setSearch(e.target.value);
    };

    let searchMovie = () => {
        dispatch({ type: 'Search_Movie', newdata: search });
    };

    return (
        <section className='omdb'>
            <div className='search'>
                <input
                    type="search"
                    placeholder='Movie Name'
                    onChange={handleSearch}
                    value={search}
                />
                <button onClick={searchMovie}>Search</button>
            </div>
            {state.loading && <Loader />}
            {state.error && <h1 style={{ color: "Red", fontSize: "40px" }}>API Error</h1>}
            {!state.loading && !state.error && state.movies.length === 0 && (
                <h1 style={{ color: "white" }}>No Movie Found</h1>
            )}
            <div className='movie-list'>
                {!state.error && state.movies && state.movies.length > 0 && state.movies.map((movie) => (
                    <div key={movie.imdbID} className='movie'>
                        <img
                            src={movie.Poster !== "N/A" ? movie.Poster : "noimage.png"}
                            alt="Movie Poster"
                        />
                        <div className='ttle'>
                            <h1>{movie.Title}</h1>
                        </div>
                        <div className='rlsd'>
                            <h1>{movie.Year}</h1>
                        </div>
                        <div className='typ'>
                            <h1>{movie.Type}</h1>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default Movie