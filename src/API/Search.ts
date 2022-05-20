import { ImageDto } from "./Types";

export type SearchData = {
  query: string;
  sort: string;
  order: string;
};

export function createSearchParams(data: SearchData) {
  return {
    q: data.query,
    sf: data.sort,
    sd: data.order,
  };
}

export function getSearchParams(params: URLSearchParams): SearchData {
  return {
    query: params.get("q") || BlankSearchData.query,
    sort: params.get("sf") || BlankSearchData.sort,
    order: params.get("sd") || BlankSearchData.order,
  };
}

export const BlankSearchData: SearchData = {
  query: "",
  sort: "first_seen_at",
  order: "desk",
};


export type ImagesPage = {
  page: number;
  images: ImageDto[];
};

export type ImagesQuery = {
  pages: ImagesPage[];
  queryString: string;
  lastLoadedPage: number;
  totalPages: number;
};
