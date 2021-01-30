const initialState = {
  movies: [],
  genres: [],
  countPage: 1,
};

const moviesReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_MOVIES':
      return { // TODO
        ...state,
        movies: [
          ...state.movies,
          ...action.payload,
        ]
      };

    case 'SET_COUNT_PAGE':
      return { // TODO
        ...state,
        countPage: action.payload,
      };
    case 'SET_GENRES':
      return {
        ...state,
        genres: action.payload,
      };
    case 'SET_EMPTY_SEARCH_MOVIES':
      return {
        ...state,
        movies: action.payload,
      };
    default:
      return state;
  }
};

export default moviesReducer;

