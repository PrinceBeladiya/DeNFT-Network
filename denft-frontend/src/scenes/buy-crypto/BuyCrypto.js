import React, { Component } from 'react';
import PropTypes from 'prop-types';
import BlockUI from 'react-block-ui';
import { connect } from 'react-redux';

import MainTemplate from '../../shared/templates/MainTemplate/MainTemplateContainer';
import BuyCryptoContainer from '../../modules/buy-crypto/BuyCryptoContainer';
import GoogleLoader from '../../shared/components/GoogleLoader';

class BuyCrypto extends Component {
  render() {
    return (
      <BlockUI
        tag="div"
        blocking={this.props.loading}
        className="full-height"
        loader={<GoogleLoader height={50} width={50} />}
      >
        <MainTemplate>
          <BuyCryptoContainer />
        </MainTemplate>
      </BlockUI>
    );
  }
}

BuyCrypto.propTypes = {
  loading: PropTypes.bool,
};

BuyCrypto.defaultProps = {
  loading: false,
};

const mapStateToProps = state => ({
  loading: state.landing.loading,
});

export default connect(mapStateToProps, null)(BuyCrypto);
