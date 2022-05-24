import React from 'react';
import BlockUi from 'react-block-ui';
import GoogleLoader from '../../../shared/components/GoogleLoader';
import NFTContainer from '../../../shared/components/NFTComponent/NFTContainer';

const Borrow = ({
  lendTokens = [],
  tokenDetails = [],
  getBorrowedTokens,
  getDataLoader
}) => {
  return (
    <div className='borrow-header-container'>
      <div className='borrow-main-container-borrow'>
        {
          tokenDetails.length > 0 ?
            <BlockUi
              tag="div"
              blocking={getDataLoader}
              className="full-height"
              loader={<GoogleLoader height={25} width={30} />}
            >
              {
                tokenDetails.map((token, index) => (
                  <NFTContainer
                    NFTID={Number(token.tokenId)}
                    lendTokenDetails={token}
                    isBorrow
                    getBorrowedTokens={getBorrowedTokens}
                  />
                ))
              }
            </BlockUi>
            :
            <div className='No-data-label-borrow'>
              <h1>No data Found</h1>
            </div>
        }
      </div>
    </div>
  )
}

export default Borrow;