import * as actionTypes from './actionTypes';

const INITIAL_STATE = {
  SellableNFTs : [],
  SellableNFTOwners: [],
  SellableNFTPrice: [],
  menu : '',
};


export default (state = INITIAL_STATE, action) => { // eslint-disable-line
  switch (action.type) {
    case actionTypes.SELLABLE_NFT:
      return {
        ...state,
        SellableNFTs: action.payload,
      };
    case actionTypes.SELLABLE_NFT_OWNER:
      return {
        ...state,
        SellableNFTOwners: action.payload,
      };
    case actionTypes.SELLABLE_NFT_PRICE:
      return {
        ...state,
        SellableNFTPrice: action.payload,
      };
    case actionTypes.MENU:
      return {
        ...state,
        menu: action.payload,
      };
    default:
      return state;
  }
};