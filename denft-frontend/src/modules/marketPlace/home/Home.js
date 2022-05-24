import React from 'react';
import BlockUi from 'react-block-ui';
import GoogleLoader from '../../../shared/components/GoogleLoader';
import NFTContainer from '../../../shared/components/NFTComponent/NFTContainer';

const Home = ({ data, getSellableNFTs, getDataLoader }) => {

  return (
    <div className="marketplace-home-container">
      {
        data.SellableNFTs.length > 0 ?
          <BlockUi
            tag="div"
            blocking={getDataLoader}
            className="full-height"
            loader={<GoogleLoader height={25} width={30} />}
          >
            {
              data.SellableNFTs.map((token, index) => (
                <NFTContainer
                  NFTID={token}
                  index={index}
                  getSellableNFTs={getSellableNFTs}
                  NFTSellable={data.SellableNFTs}
                  NFTSellableOwners={data.SellableNFTOwners}
                  NFTSellablePrice={data.SellableNFTPrice}
                />
              ))
            }
          </BlockUi>
          :
          <div className='No-data-label-home'>
            <h1>No data Found</h1>
          </div>
      }
    </div >
  )
}

export default Home;