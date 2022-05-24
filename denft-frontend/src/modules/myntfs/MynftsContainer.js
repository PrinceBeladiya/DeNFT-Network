import React, { useState } from 'react';
import Mynfts from './Mynfts';
import MyFractionalNFTs from './fractional/MyFractionalNFTsContainer';
import MainTemplateContainer from '../../shared/templates/MainTemplate/MainTemplateContainer';
import { connect } from 'react-redux';
import { updateNFT } from './redux/actions';
import { updateAccount } from '../landing/redux/actions';
import PropTypes from 'prop-types';
import RepayContainer from './repay/RepayContainer';
import { withRouter } from 'react-router';

const menuItems = [
    {
        title: 'My NFTs',
        key: 'my-nfts',
    },
    {
        title: 'My Fractional NFTs',
        key: 'my-fractional-nfts',
    },
    {
        title: 'Repay',
        key: 'repay',
    }
]


const MynftsContainer = (props) => {
    
    const [selectedMenuItem, setSelectedMenuItem] = useState(menuItems[0].key);
    const [mynftDataLoader, setMynftDataLoader] = useState(false);

    const onMenuClick = (key = menuItems[0].key) => {
        setSelectedMenuItem(key);
    }

    return (
        <MainTemplateContainer>
            <div className="my-nfts-container">
                <div className="menu-items-wrapper">
                    <div className="menu-items">
                        {
                            menuItems.map(menuItem => (
                                <div
                                    className={`menu-item ${menuItem.key === selectedMenuItem && "active"}`}
                                    key={menuItem.key}
                                    role="presentation"
                                    onClick={() => onMenuClick(menuItem.key)}
                                >
                                    {menuItem.title}
                                </div>
                            ))
                        }
                    </div>
                    <div className="buy-crypto-wrapper">
                        <div
                            className="buy-crypto-link"
                            role="presentation"
                            onClick={() => props.history.push("/buy-crypto")}
                        >
                            Don't have enough crypto? click here!
                        </div>
                    </div>
                </div>
                {
                    selectedMenuItem === menuItems[0].key && (
                        <Mynfts
                            getdata={props.data}
                            menu={menuItems[0].title}
                            data={props.getdata}
                            updateNFTs={props.updateList}
                            updateAccount={props.updateAccountAddress}
                            mynftDataLoader={mynftDataLoader}
                            setMynftDataLoader={setMynftDataLoader}
                        />
                    )
                }
                {
                    selectedMenuItem === menuItems[1].key && (
                        <MyFractionalNFTs
                            menu={menuItems[1].title}
                        />
                    )
                }
                {
                    selectedMenuItem === menuItems[2].key && (
                        <RepayContainer
                            menu={menuItems[2].title}
                        />
                    )
                }
            </div>
        </MainTemplateContainer>
    )
}

MynftsContainer.propTypes = {
    history: PropTypes.instanceOf(Object).isRequired,
    getdata: PropTypes.object,
    updateNFTs: PropTypes.func,
    updateAccount: PropTypes.func
};

MynftsContainer.defaultProps = {
    getdata: {
        NFTList: [],
        account: '',
        loading: false,
        receipientAddress: '',
        textlabel: '',
        title: '',
        transferableToken: ''
    }
};

const mapStateToProps = state => ({
    data: state.mynft,
    getdata: state.landing,
});

const mapDispatchToProps = dispatch => ({
    updateList: NFTList => dispatch(updateNFT(NFTList)),
    updateAccountAddress: account => dispatch(updateAccount(account)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(MynftsContainer));