import React from 'react';
import Button from '@mui/material/Button';
import BlockUI from 'react-block-ui';
import GoogleLoader from '../GoogleLoader';
import DialogueContainer from './NFT-Dialog/dialogueContainer';
import { Card, CardActionArea, CardContent, CardMedia, Typography } from '@material-ui/core';
import { ethers } from 'ethers';
import { contractInitialization } from '../../../utils/etherIndex';

const NFTs = ({
  getdata, imageURIs,
  data, getFractionalOwnerTokens,
  dashboard,
  NFTSellable = [],
  NFTSellableOwners = [],
  NFTSellablePrice = [],
  ID,
  menu = '',
  sellForm,
  openForm,
  fractionalForm,
  updateNFTs,
  image,
  index,
  cancelSellableNFT,
  buySellableNFT,
  getOwnerTokens,
  FractionalNFTBalance,
  FractionalNFTOwner,
  sendFractional,
  vaultID,
  LendForm,
  totalSupply = [],
  tokenDetails = [],
  lendTokenDetails,
  isBorrow,
  cancelBorrowalNFT,
  buyBorrowalNFT,
  replayableTokensDetails,
  isRepay,
  repayborrowalNFT,
}) => {

  return (
    <div className="main-wrapper">
      <BlockUI
        // blocking={getdata.transferableToken === ID}
        className="NFT-container"
        loader={<GoogleLoader height={20} width={20} />}
      >
        <div className="nft-container-content">
          <Card sx={{ maxWidth: 345 }} className="card-container">
            <CardActionArea className="card-child-container">
              <CardMedia
                component="img"
                height="140"
                image={image}
                className="card-image"
                alt="green iguana"
              />
              <CardContent className="description-container">
                <Typography gutterBottom variant="h5" component="div" className="nft-site">
                  DeNFT
                </Typography>
                {
                  (menu.length > 0 && menu === "My Fractional NFTs") ?
                    ''
                    :
                    <Typography gutterBottom variant="h5" component="div" className="nft-description">
                      {
                        !isBorrow ?
                          !isRepay ?
                            dashboard.menu === "MarketPlace" ?
                              'NFT #' + NFTSellable[index]
                              : dashboard.menu === "My NFTs" ?
                                'NFT #' + ID
                                : ''
                            :
                            'NFT #' + ID
                          :
                          <>
                            {'NFT #' + ID}
                            <hr />
                            <div className='borrow-nft-detail-container'>
                              <div>
                                Interest Amount<br />
                                Time<br />
                              </div>
                              <div>
                                {console.log("repayInterestAmount -- ", lendTokenDetails.timeInDays)}
                                {ethers.utils.formatEther(String(Number(lendTokenDetails.repayInterestAmount)))} USDC<br />
                                {Number(lendTokenDetails.timeInDays) / 60 / 60} Days<br />
                              </div>
                            </div>
                          </>
                      }
                    </Typography>
                }
                {
                  !isRepay ?
                    (menu.length > 0 && menu === "My Fractional NFTs") ?
                      <>
                        <Typography gutterBottom variant="h5" component="div" className="fractional-nft-details fractional-first-description">
                          <div>Fractional</div>
                          <div>
                            {
                              FractionalNFTBalance.length > 0 ?
                                <>
                                  {FractionalNFTBalance[index]}
                                </>
                                : ''
                            }
                          </div>
                        </Typography>
                        <Typography gutterBottom variant="h5" component="div" className="fractional-nft-details">
                          <div>Owner</div>
                          <div>
                            {
                              FractionalNFTOwner.length > 0 ?
                                <>
                                  {'0x' + FractionalNFTOwner[index].charAt(2) + FractionalNFTOwner[index].charAt(3) + FractionalNFTOwner[index].charAt(4) + '...' + FractionalNFTOwner[index].charAt(FractionalNFTOwner[index].length - 3) + FractionalNFTOwner[index].charAt(FractionalNFTOwner[index].length - 2) + FractionalNFTOwner[index].charAt(FractionalNFTOwner[index].length - 1)}
                                </>
                                : ''
                            }
                          </div>
                        </Typography>
                      </>
                      :
                      ''
                    :
                    <>
                      <Typography gutterBottom variant="h5" component="div" className="fractional-nft-details fractional-first-description">
                        <div>Collatral Price</div>
                        <div>
                          {
                            replayableTokensDetails[index].length > 0 && replayableTokensDetails[index].collateralPrice ?
                              Number(replayableTokensDetails[index].collateralPrice)
                              : ''
                          }
                        </div>
                      </Typography>
                      <Typography gutterBottom variant="h5" component="div" className="fractional-nft-details">
                        <div>Interest</div>
                        <div>
                          {
                            replayableTokensDetails[index].length > 0 && replayableTokensDetails[index].repayInterestAmount ?
                              Number(replayableTokensDetails[index].repayInterestAmount)
                              : ''
                          }
                        </div>
                      </Typography>
                    </>
                }
                <hr />
                {
                  menu.length > 0 && menu === "My Fractional NFTs" ?
                    <Typography gutterBottom variant="h5" component="div" className="nft-details">
                      <div className="totalSupply-label">TOTAL SUPPLY</div>
                      {
                        totalSupply && totalSupply.length > 0 ?
                          <div className="totalSupply">{totalSupply[index]}<br /></div>
                          : ''
                      }
                    </Typography>
                    : !isBorrow ?
                      dashboard.menu === "MarketPlace" ?
                        <Typography gutterBottom variant="h5" component="div" className="nft-details">
                          <div className="price-label">NFT PRICE</div>
                          {
                            NFTSellablePrice.length > 0 ?
                              <div className="price">{ethers.utils.formatEther(String(NFTSellablePrice[index]))} {contractInitialization().symbol}<br /></div>
                              : ''
                          }
                        </Typography>
                        : ''
                      : <Typography gutterBottom variant="h5" component="div" className="nft-details">
                        <div className="price-label">Collatral Price</div>
                        <div className="price">{ethers.utils.formatEther(String(lendTokenDetails.price))} USDC<br /></div>
                      </Typography>
                }
              </CardContent>
            </CardActionArea>
          </Card>
          <div className='all-buttons'>
            {
              !isBorrow ?
                !isRepay ?
                  menu.length > 0 && menu === "My Fractional NFTs" ?
                    <Button
                      variant="contained"
                      className="fractional-button"
                      name={ID}
                      onClick={() => sendFractional(ID)} >
                      Send Fractional
                    </Button>
                    :
                    dashboard.menu === "My NFTs" ?
                      <>
                        <Button
                          variant="contained"
                          className="mynft-button transfer-button"
                          name={ID}
                          onClick={() => openForm(ID)} >
                          Transfer
                        </Button>
                        <Button
                          variant="contained"
                          className="mynft-button sell-button"
                          name={ID}
                          onClick={() => sellForm(ID)}
                        >
                          Sell
                        </Button>
                        <Button
                          variant="contained"
                          className="mynft-button"
                          name={ID}
                          onClick={() => fractionalForm(ID)}
                        >
                          Fractional
                        </Button>
                        <Button
                          variant="contained"
                          className="mynft-button"
                          name={ID}
                          onClick={() => LendForm(ID)}
                        >
                          Lend
                        </Button>
                      </>
                      :
                      dashboard.menu === "MarketPlace" && NFTSellableOwners.length > 0 ?
                        data.uAuth !== null && data.uAuth !== undefined && Object.keys(data.uAuth).length > 0 ?
                          NFTSellableOwners[index].toLowerCase() === String(data.uAuth.sub) ?
                            <Button
                              variant="contained"
                              className="fractional-button"
                              name={NFTSellable[index]}
                              onClick={() => cancelSellableNFT(NFTSellable[index],)}
                            >
                              CANCEL
                            </Button>
                            :
                            <Button
                              variant="contained"
                              className="fractional-button"
                              name={NFTSellable[index]}
                              onClick={() => buySellableNFT(NFTSellable[index], ethers.utils.formatEther(String(NFTSellablePrice[index])))} >
                              BUY
                            </Button>
                          :
                          <>
                            {console.error('Please connect wallet first')}
                          </>
                        : ''
                  :
                  <Button
                    variant="contained"
                    className="fractional-button"
                    name={ID}
                    onClick={() => repayborrowalNFT(ID, replayableTokensDetails[index].collateralPrice)} >
                    Repay
                  </Button>
                :
                data.uAuth !== null && data.uAuth !== undefined && Object.keys(data.uAuth).length > 0 ?
                  lendTokenDetails.seller.toLowerCase() === String(data.uAuth.sub) ?
                    <Button
                      variant="contained"
                      className="fractional-button"
                      name={ID}
                      onClick={() => cancelBorrowalNFT(ID)}
                    >
                      CANCEL
                    </Button>
                    :
                    <Button
                      variant="contained"
                      className="fractional-button"
                      name={ID}
                      onClick={() => buyBorrowalNFT(ID, ethers.utils.formatEther(String(lendTokenDetails.price)))} >
                      BORROW
                    </Button>
                  :
                  <>
                    {console.error('Please connect wallet first')}
                  </>
            }

          </div>
        </div>
        <DialogueContainer
          data={getdata}
          ID={ID}
          menu={menu}
          sellForm={sellForm}
          openForm={openForm}
          updateNFTs={updateNFTs}
          getOwnerTokens={getOwnerTokens}
          vaultID={vaultID}
          index={index}
          getFractionalOwnerTokens={getFractionalOwnerTokens}
          imageURIs={imageURIs}
        />
      </BlockUI>
    </div >
  )
}

export default NFTs;