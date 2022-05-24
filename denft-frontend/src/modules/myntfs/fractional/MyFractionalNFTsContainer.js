import { ethers } from 'ethers';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { FractionalERC721FactoryContract, signer, web3Signer } from '../../../utils/etherIndex';
import { updateFractionalNFT, updateFractionalNFTBalance, updateFractionalNFTOwners } from '../redux/actions';
import FractionalERC20Vault from '../../../contracts/contracts/Fractional/FractionalERC20Vault.sol/FractionalERC20Vault.json';
import propTypes from 'prop-types';
import MyFractionalNFTs from './MyFractionalNFTs';
import { noop } from '../../../utils';

const MyFractionalNFTsContainer = ({
  FractionalNFT,
  FractionalNFTBalance,
  FractionalNFTOwner,
  updateList,
  updateBalanceList,
  updateOwnerList,
  menu,
}) => {

  const [vaultID, setVaultID] = useState('');
  const [totalSup, setTotalSup] = useState('');
  const [getDataLoader, setGetDataLoader] = useState(false);

  const getOwnerTokens = async () => {

    setGetDataLoader(true);
    
    const { ethereum } = window;
    let originalNFTs = [];
    let NFTs = [];
    let fractionalBalance = [];
    let NFTOwners = [];
    let NFTTotalSupply = [];
    let j = 0;
    
    const totalFractionalTokens = await FractionalERC721FactoryContract.connect(web3Signer).vaultCount();

    for (let i = 0; i < totalFractionalTokens; i++) {
      const vaultContractAddress = await FractionalERC721FactoryContract.connect(web3Signer).vaultToVaultContract(i);
      const vaultContract = new ethers.Contract(vaultContractAddress, FractionalERC20Vault.abi, signer);

      const balance = await vaultContract.connect(web3Signer).balanceOf(ethereum.selectedAddress);
      if (balance > 0) {
        const originalNFTID = await vaultContract.connect(web3Signer).nftId();
        originalNFTs[j] = Number(originalNFTID);

        const TotalSupply = await vaultContract.connect(web3Signer).totalSupply();
        NFTTotalSupply[j] = ethers.utils.formatEther(String(TotalSupply));

        NFTs[j] = i;

        const createdCurrencyName = await vaultContract.connect(web3Signer).name()
        fractionalBalance[j] = String(ethers.utils.formatEther(balance) + ' ' + createdCurrencyName);

        const ownerOfNFT = await vaultContract.connect(web3Signer).owner();
        NFTOwners[j] = ownerOfNFT;
        j++;
      }
    }
    updateList(originalNFTs);
    updateBalanceList(fractionalBalance);
    updateOwnerList(NFTOwners);
    setVaultID(NFTs);
    setTotalSup(NFTTotalSupply);

    setGetDataLoader(false);
  }

  useEffect(() => {
    getOwnerTokens();
  }, []);

  return (
    <MyFractionalNFTs
      FractionalNFT={FractionalNFT}
      FractionalNFTBalance={FractionalNFTBalance}
      FractionalNFTOwner={FractionalNFTOwner}
      menu={menu}
      vaultID={vaultID}
      totalSupply={totalSup}
      getFractionalOwnerTokens={getOwnerTokens}
      getDataLoader={getDataLoader}
    />
  )
}

MyFractionalNFTsContainer.propTypes = {
  updateList: propTypes.func,
  updateBalanceList: propTypes.func,
  updateOwnerList: propTypes.func,
  FractionalNFT: propTypes.array,
  FractionalNFTBalance: propTypes.array,
  FractionalNFTOwner: propTypes.array,
};

MyFractionalNFTsContainer.defaultProps = {
  FractionalNFT: [],
  FractionalNFTBalance: [],
  FractionalNFTOwner: [],
  updateList: noop,
  updateBalanceList: noop,
  updateOwnerList: noop,
};

const mapStateToProps = state => ({
  FractionalNFT: state.mynft.FractinonalNFTList,
  FractionalNFTBalance: state.mynft.FractinonalNFTBalanceList,
  FractionalNFTOwner: state.mynft.FractinonalNFTOwnerList,
});

const mapDispatchToProps = dispatch => ({
  updateList: NFTList => dispatch(updateFractionalNFT(NFTList)),
  updateBalanceList: NFTList => dispatch(updateFractionalNFTBalance(NFTList)),
  updateOwnerList: NFTList => dispatch(updateFractionalNFTOwners(NFTList)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MyFractionalNFTsContainer);
