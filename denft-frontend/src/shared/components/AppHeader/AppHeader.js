import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import Button from '@material-ui/core/Button';
import { noop } from "../../../utils";
import appIcon from '../../../assets/images/denft.png';
import UDIcon from '../../../assets/icons/UDIcon.png';
import MetamaskIcon from '../../../assets/icons/metamask.svg';
import { FormControl, MenuItem, Select } from '@material-ui/core';

const menuItems = [
  {
    menuTitle: "MarketPlace",
    path: "/"
  },
  {
    menuTitle: "Mint",
    path: "/mint"
  },
  {
    menuTitle: "My NFTs",
    path: "/my-nfts"
  },
  {
    menuTitle: "Buy Crypto",
    path: "/buy-crypto"
  }
];

const AppHeader = ({ account, handleLogin, history, onMenuItemClick, ListOfMenuItems, handleMenuChange, network }) => {

  const user = () => {
    let string = account.sub;
    let length = string.length;
    let userAccount1 = '', userAccount2 = '';

    if (Object.keys(account).length > 0 && !account.metamask) {
      return account.sub;
    }

    if (string !== undefined) {
      for (let i = 0; i < length; i++) {
        if (i < 5) {
          userAccount1 += string[i];
        } else if (i > (length - 4)) {
          userAccount2 += string[i];
        }
      }
    }

    if (userAccount1.length > 1)
      return userAccount1 + '...' + userAccount2;
  };

  return (
    <div className="app-header-container" id="app-header">
      <div className="app-name-wrapper">
        <div className="app-name" onClick={() => history.push('/')}>
          <img alt="icon" className='image' src={appIcon} />DeNFT</div>
      </div>
      <div className="menu-items">
        {
          menuItems.map(menuItem => (
            <div
              className={`menu-item ${menuItem.path === window.location.pathname ? 'active' : ''}`}
              role='presentation'
              onClick={() => onMenuItemClick(menuItem)}
            >
              {menuItem.menuTitle}
            </div>
          ))
        }
      </div>
      <div className="wallet-connection">
        <div className="wallet-address">
          {
            account && account.sub ? user() : ''
          }
        </div>
        {
          account && Object.keys(account).length > 0 ?
            (account.sub === account.wallet_address && account.sub.length > 0) ?
              <>
                <Button
                  basic
                  onClick={(event) => handleLogin('metamask')}
                  className="authorize-btn"
                >
                  <img src={MetamaskIcon} className="ud-icon" alt="udicon" />
                  <div>{account && Object.keys(account).length > 0 ? 'Disconnect' : 'Connect'}</div>
                </Button>
                {
                  account && Object.keys(account).length > 0 && Object.keys(network).length > 0 ?
                    <FormControl size="small" className='select-in-header'>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        className="select"
                        displayEmpty
                        label="Age"
                        defaultValue={ListOfMenuItems[0].value}
                        onChange={handleMenuChange}
                        value={network.network.chainId}
                      >
                        {
                          ListOfMenuItems.map(menu => (
                            <MenuItem value={menu.value}> { menu.title }</MenuItem>
                      ))
                        }
                    </Select>
                    </FormControl>

                    : ''
                }
              </>
              : (account.sub !== account.wallet_address && account.sub.length > 0) ?
                <>
                  <Button
                    basic
                    onClick={(event) => handleLogin('unstoppable')}
                    className="authorize-btn"
                  >
                    <img src={UDIcon} className="ud-icon" alt="udicon" />
                    <div>{account && Object.keys(account).length > 0 ? 'Disconnect' : 'Connect with Unstoppable'}</div>
                  </Button>
                  {
                    account && Object.keys(account).length > 0 ?
                      <FormControl size="small" className='select-in-header'>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          className="select"
                          label="Age"
                          onChange={handleMenuChange}
                        >
                          {
                            ListOfMenuItems.map(menu => (

                              <MenuItem value={menu.value}>{menu.title}</MenuItem>
                            ))
                          }
                        </Select>
                      </FormControl>
                      : ''
                  }
                </>
                :
                <>
                  <Button
                    basic
                    onClick={(event) => handleLogin('unstoppable')}
                    className="authorize-btn"
                  >
                    <img src={UDIcon} className="ud-icon" alt="udicon" />
                    <div>{account && Object.keys(account).length > 0 ? 'Disconnect' : 'Connect with Unstoppable'}</div>
                  </Button>
                  <Button
                    basic
                    onClick={(event) => handleLogin('metamask')}
                    className="authorize-btn"
                  >
                    <img src={MetamaskIcon} className="ud-icon" alt="udicon" />
                    <div>{account && Object.keys(account).length > 0 ? 'Disconnect' : 'Connect'}</div>
                  </Button>
                </>
            :
            <>
              <Button
                basic
                onClick={(event) => handleLogin('unstoppable')}
                className="authorize-btn"
              >
                <img src={UDIcon} className="ud-icon" alt="udicon" />
                <div>{account && Object.keys(account).length > 0 ? 'Disconnect' : 'Connect with Unstoppable'}</div>
              </Button>
              <Button
                basic
                onClick={(event) => handleLogin('metamask')}
                className="authorize-btn metamask-icon"
              >
                <img src={MetamaskIcon} className="ud-icon" alt="udicon" />
                <div>{account && Object.keys(account).length > 0 ? 'Disconnect' : 'Connect'}</div>
              </Button>
            </>
        }
      </div>
    </div >
  );
};

AppHeader.propTypes = {
  history: PropTypes.instanceOf(Object).isRequired,
  account: PropTypes.string,
  admin: PropTypes.string,
  onConnectClick: PropTypes.func,
  handleLogin: PropTypes.func,
}

AppHeader.defaultProps = {
  account: '',
  admin: '',
  onConnectClick: noop,
  handleLogin: noop,
}

export default withRouter(AppHeader);
