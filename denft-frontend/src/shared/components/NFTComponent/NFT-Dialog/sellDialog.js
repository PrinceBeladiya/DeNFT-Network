import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { submit } from 'redux-form';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

import { SELL_DIALOGUE } from './DialogNames';
import { closeDialog } from '../../../../modules/dashboard/redux/actions';
import { noop } from '../../../../utils';
import { Button, TextField } from '@mui/material';
import BlockUI from 'react-block-ui';
import GoogleLoader from '../../GoogleLoader';
import { contractInitialization } from '../../../../utils/etherIndex';

const SellDialog = props => (
  <Dialog
    open={props.currentDialogNames.includes(SELL_DIALOGUE)}
    onClose={() => {
      props.closeDialog(SELL_DIALOGUE);
      props.updateToken(undefined);
    }}
    className="custom-dialog custom-content-style sell-nft-container"
  >
    <DialogTitle className="dialog-title">
      <div className='heading-button'>
        Sell NFT#{props.ID}
        <IconButton
          onClick={() => {
            props.closeDialog(SELL_DIALOGUE);
            props.updateToken(undefined);
          }}
        >
          <CloseIcon />
        </IconButton>
      </div>
    </DialogTitle>
    <DialogContent>
      <BlockUI
        tag="div"
        blocking={props.loading}
        className="full-height"
        loader={<GoogleLoader height={25} width={30} />}
      >
          <div className="sell-nft-content">
            <TextField
              autoFocus
              margin="dense"
              id="address"
              label={`Amount of NFT (${contractInitialization().symbol})`}
              type="text"
              fullWidth
              variant="standard"
              onChange={props.handlePrice}
            />
            <div className="sell-nft-dialog-actions">
              <Button onClick={() => {
                props.closeDialog(SELL_DIALOGUE);
                props.updateToken(undefined);
              }}>
                Cancel
              </Button>
              <Button
                onClick={props.sellNFT}
              >
                Sell
              </Button>
          </div>
        </div>
      </BlockUI>
    </DialogContent>
  </Dialog>
);

SellDialog.propTypes = {
  currentDialogNames: PropTypes.arrayOf(PropTypes.string),
  closeDialog: PropTypes.func,
  loading: PropTypes.bool,
};

SellDialog.defaultProps = {
  currentDialogNames: [],
  closeDialog: noop,
  loading: false,
};

const mapStateToProps = state => ({
  currentDialogNames: state.dashboard.currentDialogNames,
  loading: state.mynft.loading,
});

const mapDispatchToProps = dispatch => ({
  submit: formName => dispatch(submit(formName)),
  closeDialog: dialogName => dispatch(closeDialog(dialogName)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SellDialog);
