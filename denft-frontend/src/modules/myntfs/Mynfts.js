import React, { useEffect } from 'react';
import { DeNFTContract } from '../../utils/etherIndex';
import { toast } from 'react-toastify';
import NFTContainer from '../../shared/components/NFTComponent/NFTContainer';

const Mynfts = (props) => {

  const {
    getdata,
    data,
    updateNFTs,
    updateAccount,
  } = props;

  useEffect(() => {
    
    const { ethereum } = window;

    if (!ethereum) {
      toast.warning("Please first install metamask");
      return;
    }

    ethereum.on('accountsChanged', async () => {
      const address = await ethereum.request({
        method: "eth_requestAccounts",
      });

      if (data.account !== address[0]) {
        getOwnerTokens();
        updateAccount(address[0]);
      }
    })

    
    getOwnerTokens();
  }, []);

  const getOwnerTokens = async () => {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    updateAccount(accounts[0]);

    try {
      const tokens = await DeNFTContract.functions.totalTokens();
      const tokensOfOwner = await DeNFTContract.functions.tokensOfOwnerBySize(window.ethereum.selectedAddress, 0, Number(tokens));
  
      const tokenIDs = tokensOfOwner[0].map(token => {
        return Number(token);
      });
  
      updateNFTs(tokenIDs);
    } catch(error) {
      console.log('error======', error);
    }
    
  }


  return (
    <div className='header-container'>
      <div className='main-container-mynft'>
        {
          getdata.NFTList.map(token => (
            <NFTContainer
              updateNFTs={updateNFTs}
              NFTID={token}
              getOwnerTokens={getOwnerTokens}
            />
          ))
        }
      </div>
    </div>
  )
}

export default Mynfts;