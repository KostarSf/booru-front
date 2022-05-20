import React from 'react'
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from "@mui/material/Alert";

type Props = {
  open: boolean,
  onClose: () => void,
  text: string,
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const AlertSnack = (props: Props) => {
  const {open, onClose, text} = props;

  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    onClose();
  };

  return (
    <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
      <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
        {text}
      </Alert>
    </Snackbar>
  );
}

export default AlertSnack
