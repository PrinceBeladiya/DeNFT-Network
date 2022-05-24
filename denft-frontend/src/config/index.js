import UAuth from '@uauth/js';

export const BASE_URL = 'base-url';

export const uauth = new UAuth({
  clientID: "83f18e3a-b7fe-473c-a85a-af778d67cb6b",
  scope: 'openid email wallet',
  redirectUri: window.location.href,
});

export const NATIVE_ADDRESS = "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee";
