import React, { useEffect, useState } from 'react';
import { DeNFTContract, LendBorrowContract, web3Signer } from '../../../utils/etherIndex';
import Repay from './Repay';

function RepayContainer() {

  const [repayableTokens, setrepayableTokens] = useState([]);
  const [repayableTokensDetails, setrepayableTokensDetails] = useState([]);
  const [getDataLoader, setGetDataLoader] = useState(false);

  const getBorrowalNfts = async () => {

    setGetDataLoader(false);
    
    try {
      const TotalTokens = await DeNFTContract.connect(web3Signer).totalTokens();
      
      const ViewAskByCollection = await LendBorrowContract.connect(web3Signer).viewAsksByCollectionOfBorrower(DeNFTContract.address, 0, Number(TotalTokens));

      const ViewAsksByCollectionAndTokenIds = await LendBorrowContract.connect(web3Signer).viewAsksByCollectionAndTokenIdsOfBorrower(DeNFTContract.address, ViewAskByCollection[0]);
      
      setrepayableTokens(ViewAskByCollection.tokenIds);
      setrepayableTokensDetails(ViewAsksByCollectionAndTokenIds.askInfo);

    } catch (error) {
      console.log("Error -> ", error);
    }

    setGetDataLoader(true);
  }

  useEffect(() => {
    getBorrowalNfts();
  }, []);

  return (
    <>
      <Repay
        repayableTokens={repayableTokens}
        repayableTokensDetails={repayableTokensDetails}
        getBorrowalNfts={getBorrowalNfts}
        getDataLoader={getDataLoader}
      />
    </>
  )
}

export default RepayContainer;