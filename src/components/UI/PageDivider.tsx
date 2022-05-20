import Divider from '@mui/material/Divider';
import React from 'react'

type Props = {
  page: number,
  total: number,
}

const PageDivider = (props: Props) => {
  const { page, total } = props;

  return (
    <Divider sx={{ my: 2, color: "#bbb" }}>
      {page} / {total}
    </Divider>
  );
}

export default PageDivider
