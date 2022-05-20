import React, { useRef, useEffect, useState } from "react";
import Box from '@mui/material/Box';
import { useSearchParams } from "react-router-dom";
import ImageService from "../API/ImageService";
import { ImageDto } from "../API/Types";
import ImageTile from '../components/ImageTile';
import { useFetching } from "../hooks/useFetching";
import { getPageCount } from "../utils/pages";
import { useObserver } from '../hooks/useObservcer';
import SearchBar from '../components/SearchBar';
import { getSearchParams } from "../API/Search";
import BottomLoader from "../components/UI/BottomLoader";
import PageLoader from "../components/UI/PageLoader";
import AlertSnack from "../components/UI/AlertSnack";
import TileImagesPage from "../components/UI/TileImagesPage";

type ImagesPage = {
  page: number;
  images: ImageDto[];
}

const Images: React.FC = () => {
  const [imagePages, setImagePages] = useState<ImagesPage[]>([]);
  const [filter, setFilter] = useState({
    sort: "first_seen_at",
    query: "first_seen_at.gt:3 days ago",
    order: "desc"
  });
  const [totalPages, setTotalPages] = useState(0);
  const [limit, setLimit] = useState(50);
  const [page, setPage] = useState(1);
  const lastElement = useRef(null);
  const [snackOpen, setSnackOpen] = useState(false);
  const [zoom, setZoom] = useState(0);

  const [isSearchParamsLoaded, setIsSearchParamsLoaded] = useState(false);

  let [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const params = getSearchParams(searchParams);
    window.scrollTo(0, 0);
    setFilter({
      query: (params.q && params.q.length > 0) ? params.q : "(safe || !safe)",
      sort: params.sf || "first_seen_at",
      order: params.sd || "desc",
    });
    setIsSearchParamsLoaded(true);
  }, [searchParams]);

  useEffect(() => {
    window.dispatchEvent(new Event("resize"));
  }, [zoom])

  const [fetchImages, isImagesLoading, imageError] = useFetching(async (limit: number, page: number) => {
    if (!isSearchParamsLoaded) return;

    const response = await ImageService.getAll({per_page: limit, page, q: filter.query, sf: filter.sort});
    setImagePages([...imagePages, { page, images: response.data.images }])
    const totalCount = response.data.total;
    setTotalPages(getPageCount(totalCount, limit));
  })

  useEffect(() => {
    fetchImages(limit, page);
  }, [page, limit, isSearchParamsLoaded]);

  useObserver(lastElement, page < totalPages, isImagesLoading, () => {
    setPage(page => page + 1);
  })

  useEffect(() => {
    setImagePages([])
    setTotalPages(0)
    setPage(1)
  }, [filter])

  useEffect(() => {
    if (!isImagesLoading && imageError) {
      setSnackOpen(true);
    }
  }, [isImagesLoading]);

  return (
    <Box sx={{ pt: { xs: 1, md: 2 } }}>
      <SearchBar />
      <Box sx={{ ml: 1, pt: { xs: 1, md: 2 } }}>
        {imagePages.map((ip) => (
          <TileImagesPage page={ip.page} total={totalPages} showDividers>
            {ip.images
              .filter((i) => i.thumbnails_generated && !i.hidden_from_users)
              .map((i) => (
                <ImageTile image={i} key={i.id} />
              ))}
          </TileImagesPage>
        ))}
        <div ref={lastElement} />
        {imagePages.length >= 1 && imagePages.length < totalPages && (
          <BottomLoader />
        )}
      </Box>
      {isImagesLoading && imagePages.length === 0 && <PageLoader />}
      <AlertSnack
        open={snackOpen}
        onClose={() => setSnackOpen(false)}
        text={imageError}
      />
    </Box>
  );
}

export default Images;
