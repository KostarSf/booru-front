import Masonry from '@mui/lab/Masonry';
import React, { PropsWithChildren } from 'react'

type Props = {
  zoom?: number,
  fixedZoom?: boolean,
  spacing?: number,
}

const MasonryView = (props: PropsWithChildren<Props>) => {
  const { zoom = 0, fixedZoom = false, spacing = 1, children } = props;

  const applyZoom = (initial: number) => {
    const newZoom = initial + zoom;
    return newZoom < 1 ? 1 : newZoom;
  };

  return (
    <Masonry
      columns={
        fixedZoom
          ? { xs: applyZoom(1) }
          : {
              xs: applyZoom(1),
              sm: applyZoom(2),
              md: applyZoom(3),
              lg: applyZoom(4),
              xl: applyZoom(5),
            }
      }
      spacing={spacing}
    >
      <React.Fragment>{children}</React.Fragment>
    </Masonry>
  );
}

export default MasonryView
