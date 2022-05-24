import * as actionTypes from './actionTypes';

const INITIAL_STATE = {
  loading: false,
  data: {},
  open: false,
  sellOpen: false,
  receipientAddress: '',
  title: '',
  textLabel: '',
  account: '',
  uAuth: {},
};


export default (state = INITIAL_STATE, action) => { // eslint-disable-line
  switch (action.type) {
    case actionTypes.GET_DATA:
      return {
        ...state,
        data: action.payload,
      };
    case actionTypes.OPEN:
      return {
        ...state,
        open: action.payload,
      };
    case actionTypes.UPDATE_SELL_OPEN:
      return {
        ...state,
        sellOpen: action.payload,
      };
    case actionTypes.RECEIPIENT_ADDRESS:
      return {
        ...state,
        receipientAddress: action.payload
      };
    case actionTypes.TITLE:
      return {
        ...state,
        title: action.payload,
      };
    case actionTypes.TEXTFIELDLABEL:
      return {
        ...state,
        textLabel: action.payload,
      };
    case actionTypes.ACCOUNT:
      return {
        ...state,
        account: action.payload,
      };
    case actionTypes.SET_ACCOUNT:
      return {
        ...state,
        uAuth: action.payload,
      };
    default:
      return state;
  }
};
