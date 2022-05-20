export type ImagesSearchDto = {
  images: ImageDto[],
  interactions: any[],
  total: number
}

export type ImageSearchDto = {
  image: ImageDto[],
  interactions: any[],
}

export type ImageDto = {
  id: number;
  /** The current source URL of the image. */
  source_url: string;
  /** The image's view URL, including tags. */
  view_url: string;
  /** The image's width divided by its height. */
  aspect_ratio: number;
  /** A mapping of representation names to their respective URLs. Contains the keys "full", "large", "medium", "small", "tall", "thumb", "thumb_small", "thumb_tiny". */
  representations: ImageRepresentations;
  /** Whether the image has finished thumbnail generation. Do not attempt to load images from view_url or representations if this is false. */
  thumbnails_generated: boolean;
  /** The filename that the image was uploaded with. */
  name: string;
  /** The file extension of the image. One of "gif", "jpg", "jpeg", "png", "svg", "webm". */
  format: ImageFormat;
  animated: boolean;
  /** The MIME type of this image. One of "image/gif", "image/jpeg", "image/png", "image/svg+xml", "video/webm". */
  mime_type: string;
  faves: number;
  score: number;
  upvotes: number;
  downvotes: number;
  wilson_score: number;
  comment_count: number;
};

export type ImageFormat = "gif" | "jpg" | "jpeg" | "png" | "svg" | "webm"

export type ImageRepresentations = {
  full: string,
  large: string,
  medium: string,
  small: string,
  tall: string,
  thumb: string,
  thumb_small: string,
  thumb_tiny: string,
}

export type SortItem = {value: string, title: string};

export const SortTypes: SortItem[] = [
  { value: "first_seen_at", title: "initial post date" },
  { value: "score", title: "score" },
  { value: "wilson_score", title: "Wilson score" },
  { value: "_score", title: "relevance" },
  { value: "id", title: "image ID" },
  {
    value: "updated_at",
    title: "last modification date",
  },
];

export const OrderTypes: SortItem[] = [
  { value: "desc", title: "descending" },
  { value: "asc", title: "ascending" },
];
