import React from 'react';
import NFTContainer from '../../../shared/components/NFTComponent/NFTContainer';

const Borrow = ({
  lendTokens = [],
  tokenDetails = [],
  getBorrowedTokens,
}) => {
  return (
    <div className='borrow-header-container'>
      <div className='borrow-main-container-mynft'>
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
      </div>
    </div>
  )
}

export default Borrow;