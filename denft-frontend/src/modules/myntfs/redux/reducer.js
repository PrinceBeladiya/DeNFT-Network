import * as actionTypes from './actionTypes';

const INITIAL_STATE = {
    NFTList: [],
    FractinonalNFTList: [],
    FractinonalNFTBalanceList: [],
    FractinonalNFTOwnerList: [],
    loading: false,
    transferableToken: '',
    id: '',
}

// eslint-disable-next-line import/no-anonymous-default-export
export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case actionTypes.UPDATE_NFT_LIST:
            return {
                ...state,
                NFTList: action.payload,
            };
        case actionTypes.TRANSACTION_ID:
            return {
                ...state,
                id: action.payload,
            };
        case actionTypes.LOADING:
            return {
                ...state,
                loading: action.payload,
            };
        case actionTypes.TRANSFERABLETOKEN:
            return {
                ...state,
                transferableToken: action.payload,
            };
            case actionTypes.UPDATE_SELL_OPEN:
            return {
                ...state,
                sellOpen: action.payload,
            };
            case actionTypes.UPDATE_FRACTIONAL_NFT_LIST:
            return {
                ...state,
                FractinonalNFTList: action.payload,
            };
            case actionTypes.UPDATE_FRACTIONAL_NFT_BALANCE:
            return {
                ...state,
                FractinonalNFTBalanceList: action.payload,
            };
            case actionTypes.UPDATE_FRACTIONAL_NFT_OWNERS:
            return {
                ...state,
                FractinonalNFTOwnerList: action.payload,
            };
        default:
            return state;
    }
};