import React from 'react';
import BlockUi from 'react-block-ui';
import GoogleLoader from '../../../shared/components/GoogleLoader';
import NFTContainer from '../../../shared/components/NFTComponent/NFTContainer';

const MyFractionalNFTs = ({
  FractionalNFT,
  FractionalNFTBalance,
  FractionalNFTOwner,
  menu,
  vaultID,
  totalSupply, getFractionalOwnerTokens,
  getDataLoader,
}) => (
  <div className="fractional-container">
    {
      FractionalNFT.length > 0 ?
        <BlockUi
          tag="div"
          blocking={getDataLoader}
          className="full-height"
          loader={<GoogleLoader height={25} width={30} />}
        >
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
        </BlockUi>
        :
        <div className='No-data-label-marketplace'>
          <h1>No data Found</h1>
        </div>
    }
  </div>
);

export default MyFractionalNFTs;
