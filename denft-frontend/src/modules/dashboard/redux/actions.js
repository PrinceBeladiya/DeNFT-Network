import * as actionTypes from './actionTypes';

export const openDialog = dialogName => ({
    type: actionTypes.OPEN_DIALOG,
    payload: dialogName,
});

export const closeDialog = dialogName => ({
    type: actionTypes.CLOSE_DIALOG,
    payload: dialogName,
});

export const setSelectedMenuItem = menuItem => ({
    type: actionTypes.SET_SELECTED_MENU_ITEM,
    payload: menuItem,
});

export const setMainMenu = menu => ({
    type: actionTypes.MENU_NAME,
    payload: menu,
});

export const setNetwork = network => ({
    type: actionTypes.NETWORK,
    payload: network,
});
