import axios, { AxiosRequestConfig } from "axios";
import { ImageSearchDto, ImagesSearchDto } from "./Types";

type GetAllParams = {
  /** Assuming the user can access the filter ID given by the parameter, overrides the current filter for this request. This is primarily useful for unauthenticated API access. */
  filter_id?: number,
  /** An optional authentication token. If omitted, no user will be authenticated. */
  key?: string,
  page?: number,
  per_page?: number,
  /** The current search query */
  q: string,
  /** The current sort direction */
  sd?: string,
  /** The current sort field */
  sf?: string,
}

type GetByIdParams = {
  /** Assuming the user can access the filter ID given by the parameter, overrides the current filter for this request. This is primarily useful for unauthenticated API access. */
  filter_id?: number,
  /** An optional authentication token. If omitted, no user will be authenticated. */
  key?: string,
}

export default class ImagesSearchService {
  static async getAll(searchParams: GetAllParams) {
    const requestConfig: AxiosRequestConfig = { params: { ...searchParams } }
    const response = await axios.get<ImagesSearchDto>(`https://derpibooru.org/api/v1/json/search/images`, requestConfig)
    return response;
  }

  static async getById(id: number, searchParams: GetByIdParams) {
    const requestConfig: AxiosRequestConfig = { params: { ...searchParams } }
    const response = await axios.get<ImageSearchDto>(`https://derpibooru.org/api/v1/json/images/${id}`, requestConfig)
    return response;
  }
}
