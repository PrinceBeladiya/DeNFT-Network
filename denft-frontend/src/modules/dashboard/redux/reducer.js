import * as actionTypes from './actionTypes';

const INITIAL_STATE = {
  currentDialogNames: [],
  selectedMenuItem: {},
  menu: '',
  network : {},
};


// eslint-disable-next-line import/no-anonymous-default-export
export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case actionTypes.OPEN_DIALOG:
      return {
        ...state,
        currentDialogNames: [
          ...state.currentDialogNames,
          action.payload,
        ],
      };
    case actionTypes.CLOSE_DIALOG:
      return {
        ...state,
        currentDialogNames: state.currentDialogNames
          .filter(dialogName => dialogName !== action.payload),
        selectedTab: {},
      };
    case actionTypes.SET_SELECTED_MENU_ITEM:
      return {
        ...state,
        selectedMenuItem: action.payload,
      };
    case actionTypes.MENU_NAME:
      return {
        ...state,
        menu: action.payload,
      };
    case actionTypes.NETWORK:
      return {
        ...state,
        network: action.payload,
      };
    default:
      return state;
  }
};
