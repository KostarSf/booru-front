import LinearProgress from '@mui/material/LinearProgress';
import React from 'react'

type Props = {}

const BottomLoader = (props: Props) => {
  return (
    <div
      style={{
        paddingTop: "100px",
      }}
    >
      <LinearProgress />
    </div>
  );
}

export default BottomLoader
