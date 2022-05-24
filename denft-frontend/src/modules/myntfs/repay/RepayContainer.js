import React, { useEffect, useState } from 'react';
import { DeNFTContract, LendBorrowContract, web3Signer } from '../../../utils/etherIndex';
import Repay from './Repay';

function RepayContainer() {

  const [replayableTokens, setReplayabletokens] = useState([]);
  const [replayableTokensDetails, setreplayableTokensDetails] = useState([]);

  const getBorrowalNfts = async () => {

    try {
      const TotalTokens = await DeNFTContract.connect(web3Signer).totalTokens();

      const ViewAskByCollection = await LendBorrowContract.connect(web3Signer).viewAsksByCollectionOfBorrower(DeNFTContract.address, 0, Number(TotalTokens));

      const ViewAsksByCollectionAndTokenIds = await LendBorrowContract.connect(web3Signer).viewAsksByCollectionAndTokenIdsOfBorrower(DeNFTContract.address, ViewAskByCollection[0]);

      setReplayabletokens(ViewAskByCollection.tokenIds);
      setreplayableTokensDetails(ViewAsksByCollectionAndTokenIds.askInfo);

    } catch (error) {
      console.log("Error -> ", error);
    }
  }

  useEffect(() => {
    getBorrowalNfts();
  }, []);

  return (
    <>
      <Repay
        replayableTokens={replayableTokens}
        replayableTokensDetails={replayableTokensDetails}
        getBorrowalNfts={getBorrowalNfts}
      />
    </>
  )
}

export default RepayContainer;