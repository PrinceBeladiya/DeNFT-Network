import React from 'react';
import BlockUi from 'react-block-ui';
import GoogleLoader from '../../../shared/components/GoogleLoader';
import NFTContainer from '../../../shared/components/NFTComponent/NFTContainer';

const Repay = ({
    repayableTokens,
    repayableTokensDetails,
    getBorrowalNfts, getDataLoader
}) => {
    return (
        <div className='repay-header-container'>
            <div className='repay-main-container-mynft'>
                {
                    repayableTokensDetails.length > 0 ?
                        <BlockUi
                            tag="div"
                            blocking={true}
                            className="full-height"
                            loader={<GoogleLoader height={25} width={30} />}
                        >
                            {
                                repayableTokensDetails.map((token, index) => (
                                    <NFTContainer
                                        NFTID={Number(token.tokenId)}
                                        repayableTokensDetails={repayableTokensDetails}
                                        isRepay={true}
                                        index={index}
                                        getBorrowalNfts={getBorrowalNfts}
                                    />
                                ))
                            }
                        </BlockUi>
                        :
                        <div className='No-data-label-repay'>
                            <h1>No data Found</h1>
                        </div>
                }
            </div>
        </div>
    )
}

export default Repay;