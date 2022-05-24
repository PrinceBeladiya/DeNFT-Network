import { NATIVE_ADDRESS } from "../index";
import maticIcon from "../../assets/images/matic-icon.svg"

export const MUMBAI = {
  name: "Mumbai",
  image: maticIcon,
  chainId: 80001,
  rpcUrl: "https://polygon-mumbai.g.alchemy.com/v2/-B53i36HC0dwchxm586SE-0uuH3OKD7w",
  currency: "Test MATIC",
  nativeToken: NATIVE_ADDRESS,
  nativeDecimal: 18,
  nativeFaucetURL: "https://faucet.matic.network/",
  explorerUrl: "https://mumbai.polygonscan.com",
};
