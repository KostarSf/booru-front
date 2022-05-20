import React, { useRef } from 'react';
import Masonry from '@mui/lab/Masonry';
import Box from '@mui/material/Box';
import { useEffect, useState } from "react";
import ImageService from "../API/ImageService";
import { ImageDto } from "../API/Types";
import ImageTile from '../components/ImageTile';
import { useFetching } from "../hooks/useFetching";
import { getPageCount } from "../utils/pages";
import { useObserver } from '../hooks/useObservcer';
import { Divider, LinearProgress } from '@mui/material';
import SearchBar from '../components/SearchBar';

type ImagesPage = {
  page: number;
  images: ImageDto[];
}

const Images: React.FC = () => {
  const [imagePages, setImagePages] = useState<ImagesPage[]>([]);
  const [filter, setFilter] = useState({sort: 'wilson_score', query: 'safe'});
  const [searchFieldValue, setSearchFieldValue] = useState('first_seen_at.gt:1 days ago, safe');
  const [totalPages, setTotalPages] = useState(0);
  const [limit, setLimit] = useState(50);
  const [page, setPage] = useState(1);
  const lastElement = useRef(null);

  const [zoom, setZoom] = useState(0);

  useEffect(() => {
    window.dispatchEvent(new Event("resize"));
  }, [zoom])

  const [fetchImages, isImagesLoading, imageError] = useFetching(async (limit: number, page: number) => {
    const response = await ImageService.getAll({per_page: limit, page, q: filter.query, sf: filter.sort});
    setImagePages([...imagePages, { page, images: response.data.images }])
    const totalCount = response.data.total;
    setTotalPages(getPageCount(totalCount, limit));
  })

  useObserver(lastElement, page < totalPages, isImagesLoading, () => {
    setPage(page => page + 1);
  })

  useEffect(() => {
    fetchImages(limit, page);
  }, [page, limit])

  useEffect(() => {
    setImagePages([])
    setTotalPages(0)
    setPage(1)
  }, [filter])

  const handleSearchSubmit = () => {
    setFilter({...filter, query: searchFieldValue});
  }

  const applyZoom = (initial: number) => {
    const resultZoom = initial + zoom;
    return resultZoom < 1 ? 1 : resultZoom;
  }

  return (
    <>
      <Box sx={{ py: { xs: 0.5, md: 1 } }}></Box>
      <SearchBar />
      <Box sx={{ ml: 1, mt: { xs: 1, md: 2 } }} minHeight={1200}>
        {imagePages.map((ip, index, array) => (
          <div key={ip.page}>
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
              {ip.images.map((i) => (
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
    </>
  );
}

function addNewImages(imageList: ImageDto[], newImages: ImageDto[]) {
  return [...imageList, ...newImages.filter(img => !imageList.map(i => i.id).includes(img.id))];
}

export default Images;
