import React, {useState} from 'react';
import classNames from "classnames";
import {setCountPage, setEmptyMovies, setIsFetchingMovies} from "../../redux/movies/moviesActionCreator";
import {setCheckedGenres, setCheckedYears, setIsFiltering} from "../../redux/filters/filtersActionCreator";
import {useDispatch, useSelector} from "react-redux";
import {useHistory} from "react-router";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import PropTypes from "prop-types";

const Button = ({name, copyCheckedFilters, setCopyChekedFilters, setIsShowAllActors}) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [buttonPosition, setButtonPosition] = useState(0);
  const checkedFilters = useSelector(({filters}) => filters.checkedFilters);

  const countTotalFilters = () => {
    const {checkedGenres, checkedYears} = copyCheckedFilters;
    return checkedGenres.length + checkedYears.length === 0;
  };

  const discardFilters = () => {
    setCopyChekedFilters({checkedGenres: [], checkedYears: []});
  };

  const findMoviesByFilters = () => {
    const {checkedGenres, checkedYears} = copyCheckedFilters
    dispatch(setIsFetchingMovies(true));
    dispatch(setEmptyMovies([]));
    dispatch(setCountPage(1));

    dispatch(setCheckedGenres(checkedGenres));
    dispatch(setCheckedYears(checkedYears));

    if (checkedGenres.length || checkedYears.length) {
      dispatch(setIsFiltering(true));
    } else {
      dispatch(setIsFiltering(false));
    }
    backToPrevPage();
    document.body.classList.remove('body__model--open');
  };

  const showAllCast = () => {
    setButtonPosition(window.scrollY);
    setIsShowAllActors(true);
  };

  const hideCast = () => {
    window.scrollTo({
      top: buttonPosition,
    });
    setIsShowAllActors(false);
  };

  const backToPrevPage = () => {
    history.goBack();
  };

  const buttonClickHandler = () => {
    switch (name) {
      case "Discard filters":
        discardFilters();
        break;
      case "Search results":
        findMoviesByFilters();
        break;
      case "Show actors":
        showAllCast();
        break;
      case "Hide actors":
        hideCast();
        break;
      case "Back to the movies":
        history.push('/');
        break;
      case "Back to the movie":
        backToPrevPage();
        break;
      default:
        alert("Try to choose again");
    }
  };

  const getBackBtnStructure = () => {
    return (
      <>
        <ArrowBackIosIcon className="back-button__icon"/>
        <span className="back-button__text">{name}</span>
      </>
    );
  };

  const checkBackBtnName = () => {
    return name === "Back to the movie" || name === "Back to the movies";
  };

  const isChangedFilters = () => {
    const {checkedGenres, checkedYears} = checkedFilters;
    const sortCheckedGenres = checkedGenres.sort((a, b) => a - b);
    const sortCopyCheckedGenres = copyCheckedFilters.checkedGenres.sort((a, b) => a - b);
    return JSON.stringify(sortCheckedGenres) === JSON.stringify(sortCopyCheckedGenres) &&
      JSON.stringify(checkedYears) === JSON.stringify(copyCheckedFilters.checkedYears);
  };

  const setDisableBtn = () => {
    return (name === "Discard filters" && countTotalFilters()) ||
    (name === "Search results" && isChangedFilters());
  };

  return (
    <>
      <button className={classNames({
        "pop-up__button": true,
        "back-button": checkBackBtnName(),
        "pop-up__button--filter": name === "Discard filters" || name === "Search results",
        "pop-up__button--disabled": setDisableBtn(),
      })} onClick={buttonClickHandler} disabled={setDisableBtn()}>
        {checkBackBtnName() ? getBackBtnStructure() : name}
      </button>
    </>
  );
};

Button.propTypes = {
  name: PropTypes.string.isRequired,
  copyCheckedFilters: PropTypes.shape({
    checkedGenres: PropTypes.array.isRequired,
    checkedYears: PropTypes.array.isRequired,
  }),
  setCopyChekedFilters: PropTypes.func,
  setIsShowAllActors: PropTypes.func,
};

export default Button;


