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