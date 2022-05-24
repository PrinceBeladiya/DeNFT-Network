import * as actionTypes from './actionTypes';

export const updateNFT = (data) => ({
    type : actionTypes.UPDATE_NFT_LIST,
    payload : data,
});

export const updateLoading = (data) => ({
    type : actionTypes.LOADING,
    payload : data,
});

export const updateTransactionID = (data) => ({
    type : actionTypes.TRANSACTION_ID,
    payload : data,
});

export const updateTransferableToken = (data) => ({
    type : actionTypes.TRANSFERABLETOKEN,
    payload : data,
});

export const updateFractionalNFT = (data) => ({
    type : actionTypes.UPDATE_FRACTIONAL_NFT_LIST,
    payload : data,
});

export const updateFractionalNFTBalance = (data) => ({
    type : actionTypes.UPDATE_FRACTIONAL_NFT_BALANCE,
    payload : data,
});

export const updateFractionalNFTOwners = (data) => ({
    type : actionTypes.UPDATE_FRACTIONAL_NFT_OWNERS,
    payload : data,
});
