import React from "react";
import Box from '@mui/material/Box';
import { useSearchParams } from "react-router-dom";
import SearchBar from '../components/SearchBar';
import { createSearchParams, getSearchParams, SearchData } from "../API/Search";
import ImagesFeed from "../components/ImagesFeed";

const ImagesFeedPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const handleOnSearch = (searchData: SearchData) => {
    window.scroll(0, 0)
    setSearchParams(createSearchParams(searchData));
  };

  return (
    <Box sx={{ pt: { xs: 1, md: 2 } }}>
      <SearchBar
        initialValue={getSearchParams(searchParams)}
        onSubmit={handleOnSearch}
      />
      <ImagesFeed
        searchParams={searchParams}
        sx={{
          mt: { xs: 1, md: 2 },
        }}
      />
      {/* <Box sx={{ pt: { xs: 1, md: 2 } }}>
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
      /> */}
    </Box>
  );
}

export default ImagesFeedPage;
