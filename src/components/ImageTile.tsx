import { CSSProperties } from "react";
import ProgressiveImage, { ProgressiveImageProps } from "react-progressive-image";
import { ImageDto } from "../API/Types";

type ImageProps = {
  image: ImageDto
}

const ImageTile: React.FC<ImageProps> = ({image}) => {
  const defaultRepresentation = image.representations.thumb_tiny;

  const isVideo = image.format === "webm";

  const createTileView = () => {
    const props: Readonly<ProgressiveImageProps> = {
      src: image.representations.small,
      placeholder: image.representations.thumb_tiny,
      delay: isVideo ? 5000 : 3000,
    }

    const style: CSSProperties = {
      display: 'block',
      width: '100%',
    }

    return (
      <ProgressiveImage {...props}>
        {(src: string) => isVideo ?
          <video autoPlay loop muted style={style}>
            <source src={image.representations.thumb_small}/>
          </video> :
          <img src={src} alt={image.name} style={style}/>
        }
      </ProgressiveImage>
    );
  }

  return (
    <div>
      {createTileView()}
    </div>
  );
}

export default ImageTile;
