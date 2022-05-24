import { ethers } from 'ethers';

import NFT from '../contracts/contracts/DeNFT.sol/DeNFT.json';
import MarketPlace from '../contracts/contracts/MarketPlace.sol/MarketPlace.json';
import FractionalERC721Factory from '../contracts/contracts/Fractional/FractionalERC721Factory.sol/FractionalERC721Factory.json';
import USDC from '../contracts/contracts/mock/USDC.sol/USDC.json';
import LendBorrow from '../contracts/contracts/LendBorrow/LendBorrow.sol/LendBorrow.json';
import { MUMBAI } from '../config/networks/Mumbai';
import { RINKEBY } from '../config/networks/Rinkeby';
import { METIS_STARDUST } from '../config/networks/MetisStardust';
import { BOBA_RINKEBY } from '../config/networks/BobaRinkeby';
import { METER_TESTNET } from '../config/networks/MeterTestnet';

const getCurrentChainId = () => {
  return Number(window && window.ethereum && window.ethereum.chainId)
};

export const Addresses = {
  [MUMBAI.chainId]: {
    deNFT: "0x06E13336da2DDe074762b9192c411e3d5790c610",
    MarketPlace: "0x8443E9b88736273dE08D57555254AFe3dC9EC962",
    fractionalERC721Factory: "0x836beBbC9a94Cabd57478DF22498863737c43a15",
    usdc: "0x9cD67aea8505773baD2A418A643AA1652c3a5703",
    lendBorrow: "0xB0f77d2113c612A69CbB0E0B10762A3B09F32Eb6",
    rpcUrl: "https://polygon-mumbai.g.alchemy.com/v2/-B53i36HC0dwchxm586SE-0uuH3OKD7w",
    decimal: 18,
    symbol: "MATIC",
  },
  [METIS_STARDUST.chainId]: {
    deNFT: "0xe6327338c5901bb6FfeB5c733601729683E8b6e5",
    MarketPlace: "0xA4FFEB0fF0c487f66f502668dDbCe8e3226BD1F9",
    fractionalERC721Factory: "0x8F952AaBCd86B1fAee1e6D11509e0C07Fae5173C",
    usdc: "0x615C1cd7729bCE1fD68f07c2B4eb2cA5aeEC1f7f",
    lendBorrow: "0x563Ea99f57072B443f669185509d0e734367772d",
    decimal: 18,
    symbol: "METIS",
  },
  [BOBA_RINKEBY.chainId]: {
    deNFT: "0x88aF30fB5C4b35ae3f038462e00cF97b306e4d6F",
    MarketPlace: "0x9030cd0360448306cc5b02EBd3B52E87DA2673b7",
    fractionalERC721Factory: "0xaC28ff29342f0Da8a31eC36dE966a59788beECdD",
    usdc: "0x62B7583165A401D18Aa78a2d9446208eCF1527C3",
    lendBorrow: "0x79319110b54a281267e8f68a1c8dc3107af01373",
    decimal: 18,
    symbol: "BETH",
  },
  [METER_TESTNET.chainId]: {
    deNFT: "0x37041e6370c151Ff2BC15B4234Dd52732249eF79",
    MarketPlace: "0xbd63179EE02Bd57D5CFe21275605F4ccEE30EC8a",
    fractionalERC721Factory: "0x9523b48Cc2AC4b5e4659d2314abe98B6A0C3FD36",
    usdc: "0xe9f85D839bE3c05DdAb4F2Be3397F1Ce10292E66",
    lendBorrow: "0xa493C6118D09466288b3c0706Fb3d1f26b6FE43B",
    decimal: 18,
    symbol: "MTR",
  },
  [RINKEBY.chainId]: {
    deNFT: "0x096296D845C644C1F0E28Faa5857E8Da44F2939B",
    MarketPlace: "0x9cd45437BA040EDB1aaF4e62b310D7ea3826d327",
    fractionalERC721Factory: "0xD2FCA4248d9997311ccA5Ab87c99C6e207300fD1",
    usdc: "0x85467601037cD20084c6b5a2fBACA190e118f5cD",
    lendBorrow: "0x4aad9541F2bF4F12dd80637172A56E1129493cAA",
    rpcUrl: "https://rinkeby.infura.io/v3/1bb06d6c96b94a678f902858aa99025b",
    decimal: 18,
    symbol: "ETH",
  },
}

export const contractInitialization = () => {
  if (!Addresses[getCurrentChainId()]) {
    return Addresses[MUMBAI.chainId];
  };
  return Addresses[getCurrentChainId()];
}

// export const provider = new ethers.providers.JsonRpcProvider(contractInitialization().rpcUrl);
export const provider = new ethers.providers.Web3Provider(window.ethereum)
export const signer = provider.getSigner();

export const Web3Provider = new ethers.providers.Web3Provider(window.ethereum)
export const web3Signer = Web3Provider.getSigner();

export const DeNFTDeployedAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
export const MarketPlaceDeployedAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
export const FractionalERC721FactoryDeployedAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
export const USDCDeployedAddress = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";
export const LendBorrowDeployedAddress = "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9";


export const DeNFTContract = new ethers.Contract(contractInitialization().deNFT, NFT.abi, signer);
export const MarketPlaceContract = new ethers.Contract(contractInitialization().MarketPlace, MarketPlace.abi, signer);
export const FractionalERC721FactoryContract = new ethers.Contract(contractInitialization().fractionalERC721Factory, FractionalERC721Factory.abi, signer);
export const USDCContract = new ethers.Contract(contractInitialization().usdc, USDC.abi, signer);
export const LendBorrowContract = new ethers.Contract(contractInitialization().lendBorrow, LendBorrow.abi, signer);