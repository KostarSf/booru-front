import { Chip, CircularProgress, Skeleton, Typography } from "@mui/material";
import React, { CSSProperties, useEffect, useRef, useState } from "react";
import ProgressiveImage, { ProgressiveImageProps } from "react-progressive-image";
import { ImageDto, ImageRepresentations } from "../API/Types";
import useOnScreen from "../hooks/useOnScreen";
import useRefDimensions from "../hooks/useRefDimensions";

type ImageProps = {
  image: ImageDto
}

const ImageTile: React.FC<ImageProps> = ({image}) => {
  const [contentHeight, setContentHeight] = useState(0);
  const divRef = useRef<HTMLDivElement>(null);
  const isVisible = useOnScreen(divRef);
  const [loaded, setLoaded] = useState(false);
  const [tileView, setTileView] = useState<JSX.Element | undefined>();
  const [hqThumbLoaded, setHqThumbLoaded] = useState(false);

  const handleResizeTiles = () => {
    const height =
      (divRef.current ? divRef.current.offsetWidth : 0) / image.aspect_ratio;
    setContentHeight(height);
  }

  useEffect(() => {
    handleResizeTiles();
  }, [hqThumbLoaded]);

  useEffect(() => {
    setTimeout(() => {
      setTileView(createTileView());
    }, 10);
    window.addEventListener("resize", handleResizeTiles);
    return () => window.removeEventListener("resize", handleResizeTiles);
  }, []);

  const isVideo = image.format === "webm";

  const handleOnLoad = () => {
    setLoaded(true);
  }

  const vidToGif = (representations: ImageRepresentations) => {
    const newRepresentations = {...representations};
    let k: keyof typeof newRepresentations;
    for (k in newRepresentations) {
      newRepresentations[k] = newRepresentations[k].replace('.webm', '.gif');
    }
    return newRepresentations;
  }

  const createTileView = () => {
    const representations = isVideo
      ? vidToGif(image.representations)
      : image.representations;

    const props: Readonly<ProgressiveImageProps> = {
      src: representations.thumb,
      placeholder: representations.thumb_small,
      delay: isVideo ? 5000 : 3000,
    };

    const style: CSSProperties = {
      display: 'block',
      width: '100%',
    }

    if (hqThumbLoaded) {
      return (
        <img
          src={props.src}
          alt={image.name}
          style={{
            ...style,
            borderRadius: "5px",
            filter: props.src === props.placeholder ? "blur(5px)" : "blur(0)",
            transition: "filter 0.3s ease",
          }}
          onLoad={handleOnLoad}
        />
      );
    }

    return (
      <ProgressiveImage {...props}>
        {(src: string) => {
          if (src === props.src) {
            setHqThumbLoaded(true);
          }

          return (
            <img
              src={src}
              alt={image.name}
              style={{
                ...style,
                borderRadius: "5px",
                filter: src === props.placeholder ? "blur(5px)" : "blur(0)",
                transition: "filter 0.3s ease",
              }}
              onLoad={handleOnLoad}
            />
          );
        }}
      </ProgressiveImage>
    );
  }

  return (
    <div
      onClick={() => console.log(image)}
      ref={divRef}
      style={{
        height: contentHeight + "px",
        backgroundColor: loaded ? "white" : "#ddd",
        borderRadius: "5px",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {isVisible && tileView}
      {image.format === "webm" && (
        <Chip
          label="WEBM"
          size="small"
          style={{
            position: "absolute",
            bottom: "0",
            right: "0",
            color: 'white',
            backgroundColor: '#0006',
            borderRadius: '5px',
            margin: '5px'
          }}
        />
      )}
    </div>
  );
}

export default ImageTile;
