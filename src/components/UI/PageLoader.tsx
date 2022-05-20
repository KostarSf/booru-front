import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import React from 'react'

type Props = {}

const PageLoader = (props: Props) => {
  return (
    <Box
      sx={{
        position: "absolute",
        inset: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        pointerEvents: "none",
      }}
    >
      <CircularProgress />
    </Box>
  );
}

export default PageLoader
