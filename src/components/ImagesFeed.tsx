import React from "react";
import Box from "@mui/material/Box";
import { SxProps, Theme } from "@mui/material/styles";
import { useObserver } from "../hooks/useObservcer";
import { ImagesQuery } from "../API/Search";
import { useFetching } from "../hooks/useFetching";
import ImageService from "../API/ImageService";
import { getPageCount } from "../utils/pages";
import TileImagesPage from "./UI/TileImagesPage";
import { ImageDto } from "../API/Types";
import ImageTile from "./ImageTile";
import PageLoader from "./UI/PageLoader";

type SearchParams = {
  q: string;
  sf: string;
  sd: string;
};

type Props = {
  sx?: SxProps<Theme> | undefined;
  searchParams: URLSearchParams;
};

const ImagesFeed = (props: Props) => {
  const { sx, searchParams: urlSearchParams } = props;

  const [imagesQuery, setImagesQuery] = React.useState<ImagesQuery | null>(
    null
  );

  const [fetchImagePage, isImagePageLoading] = useFetching(
    async (page: number, searchParams: SearchParams) => {
      const pageLimit = 50;

      const getResponse = async (page: number) => {
        return await ImageService.getAll({
          per_page: pageLimit,
          page,
          ...searchParams,
        });
      };

      const queryString = JSON.stringify(searchParams);

      console.log("Fetching: queryString: " + queryString);

      if (imagesQuery === null || imagesQuery.queryString !== queryString) {
        console.log("Fetching: Null worker...");
        setImagesQuery(null);

        const response = await getResponse(1);
        const totalCount = response.data.total;
        setImagesQuery({
          pages: [
            {
              page: 1,
              images: filterHiddenImages(response.data.images),
            },
          ],
          lastLoadedPage: 1,
          totalPages: getPageCount(totalCount, pageLimit),
          queryString: queryString,
        });
        return;
      }

      if (page !== imagesQuery.lastLoadedPage + 1) {
        return;
      }

      if (page >= imagesQuery.totalPages) {
        return;
      }

      console.log("Fetching: Next page worker " + page);

      const newImagesQuery: ImagesQuery = {
        ...imagesQuery,
        pages: [...imagesQuery.pages].sort((a, b) => a.page - b.page),
      };
      const response = await getResponse(page);
      newImagesQuery.lastLoadedPage = page;
      newImagesQuery.pages.push({
        page,
        images: filterHiddenImages(response.data.images),
      });

      setImagesQuery(newImagesQuery);
    }
  );

  const searchParams = React.useMemo(() => {
    const newSearchParams = createNewSearchParams(urlSearchParams);
    console.log("useMemo: queryString: " + JSON.stringify(newSearchParams));
    fetchImagePage(1, newSearchParams);
    return newSearchParams;
  }, [urlSearchParams]);

  const loadTriggerRef = React.useRef(null);

  useObserver(
    loadTriggerRef,
    notLastPage(imagesQuery),
    isImagePageLoading,
    () => {
      const fetchingPage = getNextUnloadedPage(imagesQuery);
      console.log(`Observer: Fetch image page ${fetchingPage}...`);
      fetchImagePage(fetchingPage, searchParams);
    }
  );

  return (
    // Вставить bottomloader в TileImagesPage
    // Передавать <div ref={loadTriggerRef} /> в TileImagesPage
    // чтоб он ставил его перед последней страницей в списке
    <React.Fragment>
      <Box sx={sx}>
        {imagesQuery ? (
          imagesQuery.pages.map(page => (
            <TileImagesPage
              key={page.page}
              total={imagesQuery.totalPages}
              page={page.page}
            >
              {page.images.map(image =>
                <ImageTile image={image} key={image.id} />
              )}
            </TileImagesPage>
          ))
        ) : (
          isImagePageLoading &&
          <PageLoader />
        )}
        <div ref={loadTriggerRef} />
      </Box>
    </React.Fragment>
  );
};

function createNewSearchParams(urlSearchParams: URLSearchParams) {
  const params = {
    query: urlSearchParams.get("q") || "",
    sort: urlSearchParams.get("sf") || "",
    order: urlSearchParams.get("sd") || "",
  };
  const newSearchParams: SearchParams = {
    q: params.query.length ? params.query : "first_seen_at.gt:5 days ago",
    sf: params.sort.length ? params.sort : "first_seen_at",
    sd: params.order.length ? params.order : "desc",
  };
  return newSearchParams;
}

function notLastPage(imagesQuery: ImagesQuery | null): boolean {
  if (imagesQuery === null) {
    return true;
  }

  return imagesQuery.lastLoadedPage < imagesQuery.totalPages;
}

function getNextUnloadedPage(imagesQuery: ImagesQuery | null): number {
  if (imagesQuery === null) {
    return 1;
  }

  return notLastPage(imagesQuery)
    ? imagesQuery.lastLoadedPage + 1
    : imagesQuery.lastLoadedPage;
}

function filterHiddenImages(images: ImageDto[]) {
  return images.filter(
    image => image.thumbnails_generated && !image.hidden_from_users
  );
}

export default ImagesFeed;
