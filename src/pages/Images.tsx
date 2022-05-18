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

const Images = () => {
  const [images, setImages] = useState<ImageDto[]>([]);
  const [filter, setFilter] = useState({sort: 'score', query: 'safe, first_seen_at.gt:30 days ago'})
  const [totalPages, setTotalPages] = useState(0);
  const [limit, setLimit] = useState(40);
  const [page, setPage] = useState(1);
  const lastElement = useRef(null);

  const [fetchImages, isImagesLoading, imageError] = useFetching(async (limit: number, page: number) => {
    const response = await ImageService.getAll({per_page: limit, page, q: filter.query, sf: filter.sort});
    setImages([...images, ...response.data.images])
    const totalCount = response.data.total;
    setTotalPages(getPageCount(totalCount, limit));
  })

  useObserver(lastElement, page < totalPages, isImagesLoading, () => {
    setPage(page + 1);
  })

  useEffect(() => {
    fetchImages(limit, page);
  }, [page, limit])

  return (
    <Box>
      <Masonry columns={{xs: 2, sm: 2, md: 3, lg: 4, xl: 5}} spacing={1}>
        {images.map((i) =>
          <ImageTile image={i} key={i.id} />
        )}
      </Masonry>
      <div ref={lastElement} style={{height: 20, background: 'red'}}/>
    </Box>
  );
}

function addNewImages(imageList: ImageDto[], newImages: ImageDto[]) {
  return [...imageList, ...newImages.filter(img => !imageList.map(i => i.id).includes(img.id))];
}

export default Images;
