import React from "react";
import Box from "@mui/material/Box";
import Typograpy from "@mui/material/Typography";
import { SxProps, Theme } from "@mui/material/styles";
import { ImagesQuery } from "../API/Search";
import { useFetching } from "../hooks/useFetching";
import ImageService from "../API/ImageService";
import { getPageCount } from "../utils/pages";
import TileImagesPage from "./UI/TileImagesPage";
import { ImageDto } from "../API/Types";
import ImageTile from "./ImageTile";
import PageLoader from "./UI/PageLoader";
import PageDivider from "./UI/PageDivider";
import Divider from "@mui/material/Divider";
import BottomLoader from "./UI/BottomLoader";

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

  const [pageLimit, setPageLimit] = React.useState(50);
  const [imagesQuery, setImagesQuery] = React.useState<ImagesQuery | null>(
    null
  );

  const [fetchImagePage, isImagePageLoading] = useFetching(
    async (page: number, searchParams: SearchParams) => {
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
          totalCount: totalCount,
          totalPages: getPageCount(totalCount, pageLimit),
          queryString: queryString,
        });
        return;
      }

      if (page !== imagesQuery.lastLoadedPage + 1) {
        console.log(
          `Fetching: Wrong order (${page} instead of ${
            imagesQuery.lastLoadedPage + 1
          }). Abort`
        );
        return;
      }

      if (page > imagesQuery.totalPages) {
        console.log("Fetching: All pages is loaded. Nothig done");
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

  const handlePageOnSceen = (page: number) => {
    if (imagesQuery === null) return;

    console.log(
      `Page on screen: ${page}\n` +
        `Last lodaded page: ${imagesQuery.lastLoadedPage}\n` +
        `Pages total: ${imagesQuery.totalPages}`
    );

    const lastLoadedPage = page === imagesQuery.lastLoadedPage;
    const lastPageOfQuery = page >= imagesQuery.totalPages;

    if (lastPageOfQuery) {
      console.log(`This is the last page of query`);
      return;
    }

    if (lastLoadedPage) {
      console.log(`Last loaded page on screen. Load next...`);
      fetchImagePage(page + 1, searchParams);
    }
  }

  return (
    // Вставить bottomloader в TileImagesPage
    <React.Fragment>
      <Box sx={sx}>
        {imagesQuery && (
          <Divider textAlign="left" sx={{ mb: 2 }}>
            <Typograpy variant="overline" fontWeight={500}>
              Found {imagesQuery.totalCount} results on {imagesQuery.totalPages}{" "}
              pages
            </Typograpy>
          </Divider>
        )}
        {imagesQuery
          ? imagesQuery.pages.map((page) => (
              <TileImagesPage
                key={`${page.page}-${imagesQuery.queryString}`}
                total={imagesQuery.totalPages}
                page={page.page}
                onScreen={handlePageOnSceen}
              >
                {page.images.map((image) => (
                  <ImageTile image={image} key={image.id} />
                ))}
              </TileImagesPage>
            ))
          : isImagePageLoading && <PageLoader />}
        {imagesQuery && notLastPage(imagesQuery) && <BottomLoader />}
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
    q: params.query.length ? params.query : "first_seen_at.gt:3 days ago",
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
