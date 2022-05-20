import React, { useEffect } from 'react'
import useOnScreen from '../../hooks/useOnScreen';
import MasonryView from './MasonryView';
import PageDivider from './PageDivider';

type Props = {
  page: number;
  total: number;
  showDividers?: boolean;
  variant?: "masonry";
  onScreen: (page: number) => void;
};

const TileImagesPage = (props: React.PropsWithChildren<Props>) => {
  const {
    page,
    total,
    showDividers = true,
    variant = "masonry",
    children,
    onScreen,
  } = props;

  const divRef = React.useRef<HTMLDivElement>(null);
  const isVisible = useOnScreen(divRef);

  useEffect(() => {
    if (isVisible) {
      onScreen(page);
    }
  }, [isVisible]);

  return (
    <div id={`tile-page-${page}`} ref={divRef}>
      {showDividers && page > 1 && <PageDivider page={page} total={total} />}
      <MasonryView>{children}</MasonryView>
    </div>
  );
};

export default TileImagesPage
