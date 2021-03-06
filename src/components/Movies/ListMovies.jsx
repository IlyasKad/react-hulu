import React, {useEffect} from "react";
import Movie from "./Movie/Movie";
import {useDispatch, useSelector} from "react-redux";
import {fetchMovies, setIsFetchingMovies} from "../../redux/movies/moviesActionCreator";
import {API_GET_MOVIES, API_GET_SEARCH_MOVIES} from "../../api/api";
import {setCurrentLocationPath} from "../../redux/movieInfo/movieInfoActionCreator";
import {Loader} from "./index";

const ListMovies = () => {
  const dispatch = useDispatch();
  let {
    movies, isFetchingMovies, countPage, lastHomePositionByY,
  } = useSelector(({movies}) => movies);
  let {
    searchMovies, isSearching, queryValue, totalMovies, isSearchLoaderActive, countSearchPage
  } = useSelector(({search}) => search);
  const sortByKey = useSelector(({filters}) => Object.keys(filters.currentSortBy)[0]);
  const {checkedFilters, isFiltering} = useSelector(({filters}) => filters);
  const {currentLocationPath} = useSelector(({movieInfo}) => movieInfo);

  useEffect(() => {
    if (isFetchingMovies) {
      if (isSearching) {
        dispatch(fetchMovies(`${API_GET_SEARCH_MOVIES}&page=${countSearchPage}&query=${queryValue.trim().toLowerCase()}`));
      } else {
        dispatch(fetchMovies(`${API_GET_MOVIES}&page=${countPage}&sort_by=${sortByKey}${filterGenresURL()}${filterYearsURL()}`));
      }
    }
  }, [isFetchingMovies]);

  useEffect(() => {
    let timeout;
    if (currentLocationPath !== window.location.pathname) {
      window.scrollTo({
        top: lastHomePositionByY
      });
      timeout = setTimeout(() => {
        dispatch(setCurrentLocationPath(window.location.pathname));
      });
    }
    return () => {
      clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isFetchingMovies, totalMovies, isSearching, currentLocationPath]);

  useEffect(() => {
    window.onbeforeunload = function () {
      window.scrollTo(0, 0);
    }
  });

  useEffect(() => {
    document.title = 'Hulu';
  }, []);

  const isNotLastMovies = () => {
    const currentCountMovies = isSearching ? searchMovies.length : movies.length;
    return currentCountMovies < totalMovies;
  };

  const handleScroll = () => {
    const viewportHeight = window.innerHeight;
    const scrollHeight = document.documentElement.scrollTop;
    const documentHeight = document.documentElement.offsetHeight;
    const totalHeight = viewportHeight + scrollHeight + 50;
    if (isNotLastMovies() && totalHeight >= documentHeight
      && documentHeight + 60 >= totalHeight
      && currentLocationPath === window.location.pathname) {
      dispatch(setIsFetchingMovies(true));
    }
  };

  const filterGenresURL = () => {
    const {checkedGenres} = checkedFilters;
    if (!checkedGenres.length) {
      return '';
    }
    return '&with_genres=' + checkedGenres.join((' ').replaceAll(' ', ','));
  };

  const filterYearsURL = () => {
    const {checkedYears} = checkedFilters;
    const [selectedYears] = checkedYears;
    if (!selectedYears) return '';
    if (typeof selectedYears === 'string') {
      if (selectedYears.indexOf('-') === -1) return `&year=1950`;
      const [beginYear, endYear] = selectedYears.split('-');
      return `&primary_release_date.gte=${beginYear}-01-01&primary_release_date.lte=${endYear}-12-31`;
    }
    return '&primary_release_year=' + selectedYears;
  };

  const showNotFoundMessage = () => {
    return <div className="movies__message">Nothing found</div>;
  };

  const resultMovies = (movies) => {
    return movies && movies.map((movie, index) => <Movie movie={movie} key={index}/>);
  };

  return (
    <section className="movies">
      {!searchMovies.length && !isSearchLoaderActive && isSearching && showNotFoundMessage()}
      {!movies.length && isFiltering && !isFetchingMovies && showNotFoundMessage()}
      <div className="movies__list">
        {!isSearching ? resultMovies(movies) : resultMovies(searchMovies)}
      </div>
      {isFetchingMovies && <Loader/>}
    </section>
  )
};

export default ListMovies;



