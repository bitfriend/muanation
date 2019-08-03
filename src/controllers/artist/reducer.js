import * as types from './types';

const initialState = {
  artists: [],
  suggestedArtists: [],
  artistProfile: {},
  artistProducts: []
};

export default artistReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.GET_ARTISTS_SUCCESS:
      return {
        ...state,
        artists: action.payload
      };
    case types.GET_ARTISTS_FAILURE:
      return {
        ...state,
        artists: []
      };
    case types.GET_SUGGESTED_ARTISTS_SUCCESS:
      return {
        ...state,
        suggestedArtists: action.payload
      };
    case types.GET_SUGGESTED_ARTISTS_FAILURE:
      return {
        ...state,
        suggestedArtists: []
      };
    case types.GET_ARTIST_PROFILE_SUCCESS:
      return {
        ...state,
        artistProfile: action.payload
      };
    case types.GET_ARTIST_PROFILE_FAILURE:
      return {
        ...state,
        artistProfile: {}
      };
    case types.GET_ARTIST_PRODUCTS_SUCCESS:
      return {
        ...state,
        artistProducts: action.payload
      };
    case types.GET_ARTIST_PRODUCTS_FAILURE:
      return {
        ...state,
        artistProducts: []
      };
    default:
      return state;
  }
};
