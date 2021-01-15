import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Paper, { PaperProps } from "@material-ui/core/Paper";
import Draggable from "react-draggable";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import { IconButton, InputAdornment, TextField } from "@material-ui/core";
import { CopyToClipboard } from "react-copy-to-clipboard";

function PaperComponent(props) {
  return (
    <Draggable
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} />
    </Draggable>
  );
}
const SuccessModal = ({ open, onClose: handleClose, crawlId }) => {
  const handleCopyToClipboard = () => {
    console.log("here");
  };
  const value = `http://localhost:3000/crawl_links/${crawlId}`;
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperComponent={PaperComponent}
      aria-labelledby="draggable-dialog-title"
      fullWidth
    >
      <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
        Congratulation!
      </DialogTitle>
      <DialogContent>
        <TextField
          value={value}
          fullWidth
          label="Your url"
          variant="outlined"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <CopyToClipboard text={value}>
                  <IconButton onClick={handleCopyToClipboard}>
                    <FileCopyIcon />
                  </IconButton>
                </CopyToClipboard>
              </InputAdornment>
            ),
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SuccessModal;
