import React from 'react';
import NFTContainer from '../../../shared/components/NFTComponent/NFTContainer';

const Repay = ({
    replayableTokens,
    replayableTokensDetails,
    getBorrowalNfts,
}) => {
    return (
        <div className='repay-header-container'>
            <div className='repay-main-container-mynft'>
                {
                    replayableTokensDetails.map((token, index) => (
                        <NFTContainer
                            NFTID={Number(token.tokenId)}
                            replayableTokensDetails={replayableTokensDetails}
                            isRepay={true}
                            index={index}
                            getBorrowalNfts={getBorrowalNfts}
                        />
                    ))
                }
            </div>
        </div>
    )
}

export default Repay;