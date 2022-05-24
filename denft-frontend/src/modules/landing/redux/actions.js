import * as actionTypes from './actionTypes';

export const getData = (data) => ({
  type: actionTypes.GET_DATA,
  payload: data,
});

export const openForm = (data) => ({
  type : actionTypes.OPEN,
  payload : data,
});

export const OpenSellForm = (data) => ({
  type : actionTypes.UPDATE_SELL_OPEN,
  payload : data,
});

export const titleOfForm = (data) => ({
  type : actionTypes.TITLE,
  payload : data,
});

export const labelOfForm = (data) => ({
  type : actionTypes.TEXTFIELDLABEL,
  payload : data,
});

export const inputText = (data) => ({
  type : actionTypes.RECEIPIENT_ADDRESS,
  payload : data,
});

export const updateAccount = (data) => ({
  type : actionTypes.ACCOUNT,
  payload : data,
});

export const setAccount = (account) => ({
  type: actionTypes.SET_ACCOUNT,
  payload: account,
});
