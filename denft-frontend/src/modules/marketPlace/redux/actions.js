import * as actions from './actionTypes';

export const updateSellableNFTs = (data) => ({
    type : actions.SELLABLE_NFT,
    payload : data,
});

export const updateSellableNFTOwners = (data) => ({
    type : actions.SELLABLE_NFT_OWNER,
    payload : data,
});

export const updateSellableNFTPrice = (data) => ({
    type : actions.SELLABLE_NFT_PRICE,
    payload : data,
});

export const updateMenu = (data) => ({
    type : actions.MENU,
    payload : data,
});