import React from 'react';
import NFTContainer from '../../../shared/components/NFTComponent/NFTContainer';

const MyFractionalNFTs = ({
  FractionalNFT,
  FractionalNFTBalance,
  FractionalNFTOwner,
  menu,
  vaultID,
  totalSupply, getFractionalOwnerTokens
}) => (
  <div className="marketplace-home-container">
      {
        FractionalNFT.map((token, index) => (
          <NFTContainer
            NFTID={token}
            index={index}
            FractionalNFTBalance={FractionalNFTBalance}
            FractionalNFTOwner={FractionalNFTOwner}
            menu={menu}
            vaultID={vaultID}
            totalSupply={totalSupply}
            getFractionalOwnerTokens={getFractionalOwnerTokens}
          />
        ))
      }
    </div>
);

export default MyFractionalNFTs;
