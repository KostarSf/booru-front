import div, { useRef } from 'react';
import Masonry from '@mui/lab/Masonry';
import Box from '@mui/material/Box';
import { useEffect, useState } from "react";
import ImageService from "../API/ImageService";
import { ImageDto, ImagesSearchDto } from "../API/Types";
import ImageTile from '../components/ImageTile';
import { useFetching } from "../hooks/useFetching";
import { getPageCount } from "../utils/pages";
import { useObserver } from '../hooks/useObservcer';
import { Divider, LinearProgress } from '@mui/material';

type ImagesPage = {
  page: number;
  images: ImageDto[];
}

const Images = () => {
  const [imagePages, setImagePages] = useState<ImagesPage[]>([]);
  const [filter, setFilter] = useState({sort: 'score', query: 'safe, first_seen_at.gt:30 days ago'})
  const [totalPages, setTotalPages] = useState(0);
  const [limit, setLimit] = useState(40);
  const [page, setPage] = useState(1);
  const lastElement = useRef(null);

  const [fetchImages, isImagesLoading, imageError] = useFetching(async (limit: number, page: number) => {
    const response = await ImageService.getAll({per_page: limit, page, q: filter.query, sf: filter.sort});
    setImagePages([...imagePages, { page, images: response.data.images }])
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
      {imagePages.map((ip, index, array) =>
        <div key={ip.page}>
          {ip.page > 1 &&
            <Divider sx={{my: 2}}>СТРАНИЦА {ip.page} ИЗ {totalPages}</Divider>
          }
          <Masonry columns={{xs: 2, sm: 2, md: 3, lg: 4, xl: 5}} spacing={1} key={ip.page}>
            {ip.images.map((i) =>
              <ImageTile image={i} key={i.id} />
            )}
          </Masonry>
          { (ip.page === totalPages) &&
            <Divider sx={{my: 2}}>КОНЕЦ ЛЕНТЫ</Divider>
          }
        </div>
      )}
      <div ref={lastElement}/>
      {imagePages.length < totalPages &&
        <LinearProgress />
      }
    </Box>
  );
}

function addNewImages(imageList: ImageDto[], newImages: ImageDto[]) {
  return [...imageList, ...newImages.filter(img => !imageList.map(i => i.id).includes(img.id))];
}

export default Images;
