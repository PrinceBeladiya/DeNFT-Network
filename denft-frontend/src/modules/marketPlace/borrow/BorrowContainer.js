import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { DeNFTContract, LendBorrowContract, web3Signer } from '../../../utils/etherIndex';
import { updateMenu } from '../redux/actions';
import Borrow from './Borrow';
import PropTypes from 'prop-types';
import { noop } from '../../../utils';

const BorrowContainer = ({
  menu,
  changeMenu,
}) => {

  const [lendTokens, setLendTokens] = useState();
  const [tokenDetails, setTokenDetails] = useState();

  useEffect(() => {
    getBorrowedTokens();

  }, []);

  const [getDataLoader, setGetDataLoader] = useState(false);

  const getBorrowedTokens = async () => {

    setGetDataLoader(true);
    const TotalTokens = await DeNFTContract.connect(web3Signer).totalTokens();

    if (Number(TotalTokens) > 0) {
      const ViewAskByCollection = await LendBorrowContract.connect(web3Signer).viewAsksByCollection(DeNFTContract.address, 0, Number(TotalTokens));

      const ViewAsksByCollectionAndTokenIds = await LendBorrowContract.connect(web3Signer).viewAsksByCollectionAndTokenIds(DeNFTContract.address, ViewAskByCollection[0]);

      console.log("ViewAsksByCollectionAndTokenIds -- ", ViewAsksByCollectionAndTokenIds.askInfo)
      setLendTokens(ViewAskByCollection.tokenIds);
      setTokenDetails(ViewAsksByCollectionAndTokenIds.askInfo);
    }

    setGetDataLoader(false);
  }

  return (
    <Borrow
      lendTokens={lendTokens}
      tokenDetails={tokenDetails}
      getBorrowedTokens={getBorrowedTokens}
      getDataLoader={getDataLoader}
    />
  )
}

BorrowContainer.propTypes = {
  // menu : PropTypes.string,
  // changeMenu : PropTypes.func,
};

BorrowContainer.defaultProps = {
  // menu : '',
  // changeMenu : noop
};

const mapStateToProps = state => ({
  // menu: state.home.menu,
});

const mapDispatchToProps = dispatch => ({
  // changeMenu: data => dispatch(updateMenu(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(BorrowContainer);