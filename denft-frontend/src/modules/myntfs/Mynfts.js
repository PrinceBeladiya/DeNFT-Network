import React, { useEffect } from 'react';
import { DeNFTContract } from '../../utils/etherIndex';
import { toast } from 'react-toastify';
import NFTContainer from '../../shared/components/NFTComponent/NFTContainer';
import BlockUi from 'react-block-ui';
import GoogleLoader from '../../shared/components/GoogleLoader';

const Mynfts = (props) => {

  const {
    getdata,
    data,
    updateNFTs,
    updateAccount,
    mynftDataLoader,
    setMynftDataLoader,
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

    setMynftDataLoader(true);

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
    } catch (error) {
      console.log('error======', error);
    }

    setMynftDataLoader(false);
  }


  return (
    <div className='header-container'>
      <div className='main-container-mynft'>
        {
          getdata.NFTList.length > 0 ?
            <BlockUi
              tag="div"
              blocking={mynftDataLoader}
              className="full-height"
              loader={<GoogleLoader height={25} width={30} />}
            >
              {
                getdata.NFTList.map(token => (
                  <NFTContainer
                    updateNFTs={updateNFTs}
                    NFTID={token}
                    getOwnerTokens={getOwnerTokens}
                  />
                ))
              }
            </BlockUi>
            :
            <div className='No-data-label-mynft'>
              <h1>No data Found</h1>
            </div>
        }
      </div>
    </div>
  )
}

export default Mynfts;