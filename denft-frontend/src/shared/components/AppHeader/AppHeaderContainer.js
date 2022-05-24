import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import AppHeader from './AppHeader';
import * as landingActions from '../../../modules/landing/redux/actions';
import * as dashboardActions from '../../../modules/dashboard/redux/actions';
import { uauth } from '../../../config';
import { showNotification } from '../../../utils/Notifications';
import { noop } from '../../../utils';
import { toast } from 'react-toastify';
import { setMainMenu } from '../../../modules/dashboard/redux/actions';
import { MUMBAI } from '../../../config/networks/Mumbai';
import { RINKEBY } from '../../../config/networks/Rinkeby';
import { METIS_STARDUST } from '../../../config/networks/MetisStardust';
import { BOBA_RINKEBY } from '../../../config/networks/BobaRinkeby';
import { METER_TESTNET } from '../../../config/networks/MeterTestnet';

const ListOfMenuItems = [
  {
    title: 'Mumbai Polygon',
    network: MUMBAI,
    value: MUMBAI.chainId,
  },
  {
    title: 'Metis Stardust',
    network: METIS_STARDUST,
    value: METIS_STARDUST.chainId,
  },
  {
    title: 'Boba Rinkeby',
    network: BOBA_RINKEBY,
    value: BOBA_RINKEBY.chainId,
  },
  {
    title: 'Meter Testnet',
    network: METER_TESTNET,
    value: METER_TESTNET.chainId,
  },
  {
    title: 'Rinkeby',
    network: RINKEBY,
    value: RINKEBY.chainId,
  },
]

class AppHeaderContainer extends Component {

  state = {
    login: '',
  }

  handleLogin = async (wallet) => {

    const { account, setAccount, updateNetworkDetails } = this.props;
    this.setState({ login: wallet });

    if (wallet === 'unstoppable') {
      if (account && Object.keys(account) && Object.keys(account).length > 0) {
        uauth
          .logout()
          .then(() => setAccount(undefined))
          .catch(error => showNotification(error.message, 'error', 3000))

        this.setState({ login: '' });

        // updateNetworkDetails({});
      } else {
        await uauth
          .loginWithPopup()
          .then(() => uauth.user().then(setUser => setAccount(setUser)))
          .catch(error => showNotification(error.message, 'error', 3000))

        updateNetworkDetails({
          title: ListOfMenuItems[0].title,
          network: ListOfMenuItems[0].network,
        });
      }
    } else if (wallet === 'metamask') {
      await window.ethereum.enable();
      const { ethereum } = window;

      if (!ethereum) {
        toast.warning("Please first install metamask");
        return;
      }

      if (account && Object.keys(account) && Object.keys(account).length > 0) {
        setAccount(undefined);
        this.setState({ login: '' });

        // updateNetworkDetails({});
      } else {
        setAccount({
          sub: ethereum.selectedAddress,
          wallet_address: ethereum.selectedAddress,
          metamask: true,
        });

        updateNetworkDetails({
          title: ListOfMenuItems[0].title,
          network: ListOfMenuItems[0].network,
        });
  
        const currentChainID = Number(window.ethereum.chainId);
  
        if (currentChainID === RINKEBY.chainId || currentChainID === MUMBAI.chainId ||
          currentChainID === METIS_STARDUST.chainId || currentChainID === BOBA_RINKEBY.chainId ||
          currentChainID === METER_TESTNET.chainId) {
          ListOfMenuItems.map(menuItem => {
            if (menuItem.value === currentChainID) {
              updateNetworkDetails({
                title: menuItem.title,
                network: menuItem.network
              })
            }
          })
        } else {
          showNotification("Please selected proper network", "error", 3000);
        }
      }
    }
  }

  onMenuItemClick = (selectedMenuItem) => {
    this.props.updateMainMenu(selectedMenuItem.menuTitle);
    const { history, setSelectedMenuItem } = this.props;
    history.push(selectedMenuItem && selectedMenuItem.path);
    setSelectedMenuItem(selectedMenuItem);
  }

  handleMenuChange = (e) => {
    const { updateNetworkDetails } = this.props;
    const currentChainID = Number(window.ethereum.chainId);
    
    if(currentChainID !== e.target.value) {
      showNotification("Please select appropriate network in wallet first", "error", 3000);
    }

    if (e.target.value === RINKEBY.chainId) {
      updateNetworkDetails({
        title: ListOfMenuItems[4].title,
        network: ListOfMenuItems[4].network,
      });
    } else if (e.target.value === MUMBAI.chainId) {
      updateNetworkDetails({
        title: ListOfMenuItems[0].title,
        network: ListOfMenuItems[0].network,
      });
    } else if (e.target.value === METIS_STARDUST.chainId) {
      updateNetworkDetails({
        title: ListOfMenuItems[1].title,
        network: ListOfMenuItems[1].network,
      });
    } else if (e.target.value === BOBA_RINKEBY.chainId) {
      updateNetworkDetails({
        title: ListOfMenuItems[2].title,
        network: ListOfMenuItems[2].network,
      });
    } else if (e.target.value === METER_TESTNET.chainId) {
      updateNetworkDetails({
        title: ListOfMenuItems[3].title,
        network: ListOfMenuItems[3].network,
      });
    }
  }

  render() {
    const { account, setAccount, network } = this.props;
    return (
      <AppHeader
        handleLogin={this.handleLogin}
        account={account}
        setAccount={setAccount}
        onMenuItemClick={this.onMenuItemClick}
        ListOfMenuItems={ListOfMenuItems}
        handleMenuChange={this.handleMenuChange}
        network={network}
      />
    )
  }
}

AppHeaderContainer.propTypes = {
  history: PropTypes.instanceOf(Object).isRequired,
  account: PropTypes.instanceOf(Object),
  setAccount: PropTypes.func,
  setSelectedMenuItem: PropTypes.func,
  network: PropTypes.instanceOf(Object),
};

AppHeaderContainer.defaultProps = {
  account: {},
  setAccount: noop,
  setSelectedMenuItem: noop,
  network: {}
};

const mapStateToProps = state => ({
  account: state.landing.uAuth,
  network: state.dashboard.network,
});

const mapDispatchToProps = dispatch => ({
  setAccount: account => dispatch(landingActions.setAccount(account)),
  setCurrentAccount: account => dispatch(landingActions.updateAccount(account)),
  setSelectedMenuItem: menuItem => dispatch(dashboardActions.setSelectedMenuItem(menuItem)),
  updateMainMenu: selectedMenu => dispatch(setMainMenu(selectedMenu)),
  updateNetworkDetails: network => dispatch(dashboardActions.setNetwork(network)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AppHeaderContainer));
