import { Button, Dialog, DialogContent, DialogTitle, IconButton, TextField } from '@mui/material';
import React from 'react'
import { LEND_DIALOGUE } from './DialogNames';
import CloseIcon from '@material-ui/icons/Close';
import BlockUI from 'react-block-ui';
import GoogleLoader from '../../GoogleLoader';

const LendDialog = ({
  currentDialogNames,
  closeDialog,
  updateToken,
  ID,
  loading,
  handleCollatralPrice,
  lendNFT,
  handleIntrest,
  handleTime,
}) => {
  return (
    <Dialog
      open={currentDialogNames.includes(LEND_DIALOGUE)}
      onClose={() => {
        closeDialog(LEND_DIALOGUE);
        updateToken(undefined);
      }}
      className="custom-dialog custom-content-style sell-nft-container"
    >
      <DialogTitle className="dialog-title">
        <div className='heading-button'>
          Lend NFT#{ID}
          <IconButton
            onClick={() => {
              closeDialog(LEND_DIALOGUE);
              updateToken(undefined);
            }}
          >
            <CloseIcon />
          </IconButton>
        </div>
      </DialogTitle>
      <DialogContent>
        <BlockUI
          tag="div"
          blocking={loading}
          className="full-height"
          loader={<GoogleLoader height={25} width={30} />}
        >
          <div className="lend-nft-content">
            <TextField
              autoFocus
              margin="dense"
              id="price"
              label="Collatral Price (USDC)"
              type="number"
              fullWidth
              variant="standard"
              onChange={handleCollatralPrice}
            />
            <TextField
              margin="dense"
              id="interest"
              label="Interest Amount (USDC)"
              type="number"
              fullWidth
              variant="standard"
              onChange={handleIntrest}
            />
            <TextField
              margin="dense"
              id="time"
              label="Time ( in Days)"
              type="number"
              fullWidth
              variant="standard"
              onChange={handleTime}
            />
            <div className="lend-nft-dialog-actions">
              <Button onClick={() => {
                closeDialog(LEND_DIALOGUE);
                updateToken(undefined);
              }}>
                Cancel
              </Button>
              <Button
                onClick={() => lendNFT(ID)}
              >
                Lend
              </Button>
            </div>
          </div>
        </BlockUI>
      </DialogContent>
    </Dialog>
  )
}

export default LendDialog;