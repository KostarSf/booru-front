import React, { PropsWithChildren } from 'react'
import MasonryView from './MasonryView';
import PageDivider from './PageDivider';

type Props = {
  page: number,
  total: number,
  showDividers?: boolean,
  variant?: 'masonry'
}

const TileImagesPage = (props: PropsWithChildren<Props>) => {
  const { page, total, showDividers = true, variant = 'masonry', children } = props;

  return (
    <div id={`tile-page-${page}`}>
      {showDividers && page > 1 && <PageDivider page={page} total={total} />}
      <MasonryView>{children}</MasonryView>
      {showDividers && page === total && (
        <PageDivider page={page} total={total} />
      )}
    </div>
  );
}

export default TileImagesPage
