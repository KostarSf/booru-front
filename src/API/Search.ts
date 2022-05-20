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

export function getSearchParams(params: URLSearchParams) {
  return {
    q: params.get("q"),
    sf: params.get("sf"),
    sd: params.get("sd"),
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
  lastLoadedPage: number;
  totalPages: number;
};
