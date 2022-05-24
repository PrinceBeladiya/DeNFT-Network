import { connect } from 'react-redux';
import NFTs from './NFT';
import PropTypes from 'prop-types';
import { updateNFT, updateTransferableToken } from '../../../modules/myntfs/redux/actions';
import { titleOfForm, labelOfForm, openForm } from '../../../modules/landing/redux/actions';
import { DeNFTContract, MarketPlaceContract, web3Signer, LendBorrowContract, USDCContract } from '../../../utils/etherIndex';
import { useEffect, useState } from 'react';
import { openDialog, setMainMenu } from '../../../modules/dashboard/redux/actions';
import { ethers } from 'ethers';
import { noop } from '../../../utils';
import { showNotification } from '../../../utils/Notifications';

const NFTContainer = ({
  NFTID, getBorrowalNfts,
  data, dashboard, updateMainMenu,
  index, getdata, openDialog,
  NFTSellable = [],
  updateToken, updateNFTs,
  getSellableNFTs, tokens,
  owners, price, getOwnerTokens,
  menu, FractionalNFTBalance,
  FractionalNFTOwner, vaultID,
  loader, ID, updateID,
  totalSupply,
  tokenDetails,
  lendTokenDetails,
  isBorrow,
  replayableTokensDetails,
  isRepay, getBorrowedTokens,
  getFractionalOwnerTokens,
}) => {

  useEffect(() => {
    imageURIs();
  }, []);

  const imageURIs = async () => {
    if (!isBorrow) {
      if (!isRepay) {
        if (dashboard.menu === "MarketPlace") {
          const img = await DeNFTContract.functions.tokenURI(NFTSellable[index]);
          setImage(img[0]);
        } else if (dashboard.menu === "My NFTs") {
          const img = await DeNFTContract.functions.tokenURI(NFTID);
          setImage(img[0]);
        } else {
          const url = window.location.href.split('/');
          const page = url[url.length - 1];
          let img;

          switch (page) {
            case "marketplace": updateMainMenu("MarketPlace");
              img = await DeNFTContract.functions.tokenURI(NFTSellable[index]);
              setImage(img[0]);
              break;
            case "my-nfts": updateMainMenu("My NFTs");
              img = await DeNFTContract.functions.tokenURI(NFTID);
              setImage(img[0]);
              break;
            default:
          }
        }
      } else {
        const img = await DeNFTContract.functions.tokenURI(NFTID);
        setImage(img[0]);
      }
    } else {
      const img = await DeNFTContract.functions.tokenURI(NFTID);
      setImage(img[0]);
    }
  }

  const [image, setImage] = useState();

  const sellForm = (ID = 0) => {
    updateToken(ID);
    openDialog("SELL_DIALOGUE");
  }

  const openForm = (ID = 0) => {
    updateToken(ID);
    openDialog("TRANSFER_DIALOGUE");
  }

  const fractionalForm = (ID = 0) => {
    updateToken(ID);
    openDialog("FRACTIONAL_DIALOGUE");
  }

  const LendForm = (ID = 0) => {
    updateToken(ID);
    openDialog("LEND_DIALOGUE");
  }

  const sendFractional = async (ID = 0) => {
    updateToken(ID);
    openDialog("SEND_FRACTIONAL_DIALOGUE");
  }

  const cancelSellableNFT = async (ID = 0) => {
    try {
      const cancelAskOrder = await MarketPlaceContract.connect(web3Signer).cancelAskOrder(DeNFTContract.address, ID);
      await cancelAskOrder.wait();
      getSellableNFTs();
    } catch (error) {
      console.log("Error -> ", error);
    }
  }

  const buySellableNFT = async (ID = 0, price) => {
    try {
      const buyTokenTx = await MarketPlaceContract.connect(web3Signer).buyTokenUsingETH(DeNFTContract.address, ID, { value: ethers.utils.parseEther(price) });
      await buyTokenTx.wait();
      getSellableNFTs();
      showNotification("Order excecuted successfully", "success", 3000);
    } catch (error) {
      console.log("Error -> ", error);
      showNotification("Order can not excecuted", "error", 3000);
    }
  }

  const cancelBorrowalNFT = async (ID = 0) => {
    try {
      const lendCancel = await LendBorrowContract.connect(web3Signer).cancelAskOrder(DeNFTContract.address, ID);
      await lendCancel.wait();
      getBorrowedTokens();
      showNotification("lend cancelled successfully", "success", 3000);
    } catch (error) {
      console.log("Error -> ", error);
      showNotification("Cancelation process not confirmed", "error", 30000);
    }
  }

  const buyBorrowalNFT = async (ID = 0, price) => {
    try {
      const appproval = await USDCContract.connect(web3Signer).approve(LendBorrowContract.address, ethers.utils.parseEther(price));
      await appproval.wait();

      const borrowingNFT = await LendBorrowContract.connect(web3Signer).acceptAsk(DeNFTContract.address, ID, ethers.utils.parseEther(price));
      await borrowingNFT.wait();
      
      getBorrowedTokens();
      showNotification("NFT is borrowed successfully", "success", 3000);
    } catch (error) {
      console.log("Error -> ", error);
      showNotification("Order not executed", "error", 3000);
    }
  }

  const repayborrowalNFT = async (ID = 0, price) => {
    try {
      const approve = await DeNFTContract.connect(web3Signer).approve(LendBorrowContract.address, ID);
      await approve.wait();

      const repay = await LendBorrowContract.connect(web3Signer).repayLoan(DeNFTContract.address, ID);
      await repay.wait();

      getBorrowalNfts();
      showNotification("NFT Repay successfully", "success", 3000);
    } catch (error) {
      console.log("Error -> ", error);
      showNotification("Operation Failed", "error", 3000);
    }
  } 

  return (
    <>
      <NFTs
        dashboard={dashboard}
        getdata={data}
        data={getdata}
        ID={NFTID}
        index={index}
        sellForm={sellForm}
        openForm={openForm}
        fractionalForm={fractionalForm}
        updateNFTs={updateNFTs}
        image={image}
        NFTSellable={tokens}
        NFTSellableOwners={owners}
        NFTSellablePrice={price}
        cancelSellableNFT={cancelSellableNFT}
        buySellableNFT={buySellableNFT}
        getOwnerTokens={getOwnerTokens}
        menu={menu}
        FractionalNFTBalance={FractionalNFTBalance}
        FractionalNFTOwner={FractionalNFTOwner}
        sendFractional={sendFractional}
        vaultID={vaultID}
        loader={loader}
        transactionalID={ID}
        totalSupply={totalSupply}
        LendForm={LendForm}
        tokenDetails={tokenDetails}
        lendTokenDetails={lendTokenDetails}
        isBorrow={isBorrow}
        cancelBorrowalNFT={cancelBorrowalNFT}
        buyBorrowalNFT={buyBorrowalNFT}
        replayableTokensDetails={replayableTokensDetails}
        isRepay={isRepay}
        repayborrowalNFT={repayborrowalNFT}
        getFractionalOwnerTokens={getFractionalOwnerTokens}
        imageURIs={imageURIs}
      />
    </>
  )
}

NFTContainer.propTypes = {
  NFTID: PropTypes.number,
  data: PropTypes.instanceOf(Object),
  getdata: PropTypes.instanceOf(Object),
  updateSellOpen: PropTypes.func,
  updateDialogue: PropTypes.func,
  updateTitle: PropTypes.func,
  updateTextLabel: PropTypes.func,
  updateToken: PropTypes.func,
  getOwnerTokens: PropTypes.func,
};

NFTContainer.defaultProps = {
  NFTID: 0,
  data: {
    NFTList: [],
    account: '',
    loading: false,
    transferableToken: '',
  },
  getdata: {
    loading: false,
    open: false,
    receipientAddress: '',
    sellOpen: false,
    textLabel: '',
    title: '',
    account: ''
  },
  getOwnerTokens: noop,
};

const mapStateToProps = state => ({
  data: state.mynft,
  loader: state.mynft.loading,
  ID: state.mynft.id,
  dashboard: state.dashboard,
  getdata: state.landing,
  tokens: state.home.SellableNFTs,
  owners: state.home.SellableNFTOwners,
  price: state.home.SellableNFTPrice,
});

const mapDispatchToProps = dispatch => ({
  updateToken: token => dispatch(updateTransferableToken(token)),
  updateTitle: title => dispatch(titleOfForm(title)),
  updateTextLabel: label => dispatch(labelOfForm(label)),
  updateDialogue: State => dispatch(openForm(State)),
  openDialog: name => dispatch(openDialog(name)),
  updateMainMenu: selectedMenu => dispatch(setMainMenu(selectedMenu)),
  updateNFTs: NFTList => dispatch(updateNFT(NFTList)),
});

export default connect(mapStateToProps, mapDispatchToProps)(NFTContainer);