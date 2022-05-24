import React, { useEffect } from 'react';
import { DeNFTContract } from '../../utils/etherIndex';
import Button from '@mui/material/Button';
import { withRouter } from 'react-router';
import { toast } from 'react-toastify';
import Dropzone from 'react-dropzone'
import BlockUI from 'react-block-ui';
import GoogleLoader from '../../shared/components/GoogleLoader';
import { showNotification } from '../../utils/Notifications';

const Mint = ({
  history,
  CurrentTokenID,
  setCurrentTokenID, loading, mintNFT,
  setImage, files, setFiles, onClearClick,
  lastMintedNFT,
}) => {
  useEffect(() => {
    const getToken = async () => {

      const tokens = await DeNFTContract.functions.totalTokens();
      setCurrentTokenID(Number(tokens));
    }
    getToken();

  }, [loading]);

  const onImageChange = (file) => {
    if (file.length > 0) {
      setImage(file[0]);

      setFiles(file.map(file => Object.assign(file, {
        preview: URL.createObjectURL(file)
      })));

    } else {
      showNotification("Please select file", "warning", 3000);
      return;
    }

  };

  return (
    <BlockUI
      tag="div"
      blocking={loading}
      className="full-height"
      loader={<GoogleLoader height={25} width={30} />}
    >
      <div className="mint-container">
        <div className="nft-mint-wrapper">
          <div className="nft-details-wrapper">
            <div className="nft-details">
              <div className="nft-title">DeNFT #{CurrentTokenID}</div>
              <div className="nft-description"></div>
              <div className="price-wrapper">
                <div className="price-label"></div>
                <div className="price-value"></div>
              </div>
              <div className="mint-btn-wrapper">
                <Button
                  onClick={mintNFT}
                  className="mint-btn"
                  variant='contained'
                >
                  <div>Mint</div>
                </Button>
              </div>
              <div className="buy-crypto-wrapper">
                <div
                  className="buy-crypto-link"
                  role="presentation"
                  onClick={() => history.push("/buy-crypto")}
                >
                  Don't have enough crypto? click here!
                </div>
              </div>
            </div>
          </div>
          <div className="imageUpload">
            <div className='image-View'>
              {
                files.length > 0 && files[0].preview ?
                  <img src={files[0].preview} alt="NFT" className='image-uploaded' />
                  :
                  ''
              }
            </div>
            <Dropzone
              onDrop={acceptedFiles => onImageChange(acceptedFiles)}
              accept={'image/*'}
              multiple={false}
            >

              {({ getRootProps, getInputProps }) => (
                <div className='button-view' {...getRootProps()}>
                  <input {...getInputProps()} />
                  {
                    files.length > 0 && files[0].preview ?
                      ''
                      :
                      <label className="upload-button" for="upload"><p className='instruction'>Drag 'n' drop some files here, or click to select files</p></label>
                  }
                </div>
              )}

            </Dropzone>
          </div>
        </div>
        {
          Object.keys(lastMintedNFT).length > 0 && (lastMintedNFT.tokenId || lastMintedNFT.ipfsURI) && (
            <div className="last-minted-nft">
              <div className="ipfs-header">
                <div className="ipfs-url-content">Previously Minted NFT Details</div>
                <div
                  className="clear-btn"
                  role="presentation"
                  onClick={() => onClearClick()}
                >
                  Clear
                </div>
              </div>
              <div className="last-minted-nft-wrapper">
                <div className="last-minted-content">
                  <div className="nft-key">Id: <label className="nft-value">{lastMintedNFT && lastMintedNFT.tokenId}</label></div>
                  <div className="nft-key">
                    IPFS hosted url: <a href={lastMintedNFT && lastMintedNFT.ipfsURI} target="_blank" className="nft-url">
                      {lastMintedNFT && lastMintedNFT.ipfsURI}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )
        }
      </div>
    </BlockUI>
  )
};

export default withRouter(Mint);