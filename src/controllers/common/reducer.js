import * as types from './types';
import {
  palette as lightPalette,
  gradients as lightGradients,
  overlays as lightOverlays,
  buttonShadow as lightButtonShadow,
  shadows as lightShadows
} from '../../components/theme/light';
import {
  palette as darkPalette,
  gradients as darkGradients,
  overlays as darkOverlays,
  buttonShadow as darkButtonShadow,
  shadows as darkShadows
} from '../../components/theme/dark';

function getLightTheme() {
  return {
    palette: lightPalette,
    gradients: lightGradients,
    overlays: lightOverlays,
    buttonShadow: lightButtonShadow,
    shadows: lightShadows,
    container: lightPalette.white,
    title: lightPalette.black,
    label: lightPalette.grey1,
    buttonTitle: lightPalette.white,
    inputContainer: lightPalette.grey3,
    input: lightPalette.grey0,
    placeholder: lightPalette.grey1,
    card: lightPalette.white,
    tag: lightPalette.grey2,
    tagTitle: lightPalette.grey1
  };
}

function getDarkTheme() {
  return {
    palette: darkPalette,
    gradients: darkGradients,
    overlays: darkOverlays,
    buttonShadow: darkButtonShadow,
    shadows: darkShadows,
    container: darkPalette.black,
    title: darkPalette.grey0,
    label: darkPalette.grey2,
    buttonTitle: darkPalette.black,
    inputContainer: darkPalette.grey3,
    input: darkPalette.grey0,
    placeholder: darkPalette.grey1,
    card: darkPalette.grey3,
    tag: darkPalette.grey2,
    tagTitle: darkPalette.grey1
  };
}

const initialState = {
  loading: 0,
  theme: {
    name: 'light',
    ...getLightTheme()
  }
};

// const initialState = {
//   loading: 0,
//   theme: {
//     name: 'dark',
//     ...getDarkTheme()
//   }
// };

export default commonReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.SET_LOADING:
      return {
        ...state,
        loading: state.loading + 1
      };
    case types.CLEAR_LOADING:
      return {
        ...state,
        loading: state.loading - 1
      };
    case types.CHANGE_THEME:
      return {
        ...state,
        themeName: action.payload,
        theme: action.payload === 'dark' ? {
          name: action.payload,
          palette: darkPalette,
          gradients: darkGradients,
          overlays: darkOverlays,
          buttonShadow: darkButtonShadow,
          shadows: darkShadows
        } : {
          name: action.payload,
          palette: lightPalette,
          gradients: lightGradients,
          overlays: lightOverlays,
          buttonShadow: lightButtonShadow,
          shadows: lightShadows
        }
      };
    default:
      return state;
  }
};
