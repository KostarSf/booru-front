import React, { useRef, useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import Masonry from '@mui/lab/Masonry';
import Box from '@mui/material/Box';
import {
  Backdrop,
  Button,
  CircularProgress,
  Divider,
  IconButton,
  LinearProgress,
  Snackbar,
} from "@mui/material";
import { useSearchParams } from "react-router-dom";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import ImageService from "../API/ImageService";
import { ImageDto } from "../API/Types";
import ImageTile from '../components/ImageTile';
import { useFetching } from "../hooks/useFetching";
import { getPageCount } from "../utils/pages";
import { useObserver } from '../hooks/useObservcer';
import SearchBar from '../components/SearchBar';
import { getSearchParams } from "../API/Search";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

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

  const applyZoom = (initial: number) => {
    const resultZoom = initial + zoom;
    return resultZoom < 1 ? 1 : resultZoom;
  }

  const handleSnackClose = (
    event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackOpen(false);
  };

  return (
    <>
      <Box sx={{ py: { xs: 0.5, md: 1 } }}></Box>
      <SearchBar />
      <Box sx={{ py: { xs: 0.5, md: 1 } }}></Box>
      <Box sx={{ ml: 1 }}>
        {imagePages.map((ip, index, array) => (
          <div key={ip.page} id={`tile-page-${ip.page}`}>
            {ip.page > 1 && (
              <Divider sx={{ my: 2, color: "#bbb" }}>
                {ip.page} / {totalPages}
              </Divider>
            )}
            <Masonry
              columns={{
                xs: applyZoom(1),
                sm: applyZoom(2),
                md: applyZoom(3),
                lg: applyZoom(4),
                xl: applyZoom(5),
              }}
              spacing={1}
              key={ip.page}
            >
              {ip.images
                .filter((i) => i.thumbnails_generated && !i.hidden_from_users)
                .map((i) => (
                  <ImageTile image={i} key={i.id} />
                ))}
            </Masonry>
            {ip.page === totalPages && (
              <Divider sx={{ my: 2, color: "#bbb" }}>
                {ip.page} / {totalPages}
              </Divider>
            )}
          </div>
        ))}
        <div ref={lastElement} />
        {imagePages.length >= 1 && imagePages.length < totalPages && (
          <>
            <Box sx={{ height: "100px" }}></Box>
            <LinearProgress />
          </>
        )}
      </Box>
      {isImagesLoading && imagePages.length === 0 && (
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
      )}
      <Snackbar
        open={snackOpen}
        autoHideDuration={6000}
        onClose={handleSnackClose}
      >
        <Alert
          onClose={handleSnackClose}
          severity="error"
          sx={{ width: "100%" }}
        >
          {imageError}
        </Alert>
      </Snackbar>
    </>
  );
}

function addNewImages(imageList: ImageDto[], newImages: ImageDto[]) {
  return [...imageList, ...newImages.filter(img => !imageList.map(i => i.id).includes(img.id))];
}

export default Images;
