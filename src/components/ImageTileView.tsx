import Skeleton from "@mui/material/Skeleton";
import React, { useEffect, useState } from "react";

type Props = {
  source: string;
  placeholder?: string;
  video?: boolean;
  alt: string;
  visible: boolean;
  onLoad: React.ReactEventHandler<HTMLImageElement>;
  onSourceLoad: () => void;
  unloadBlur?: boolean;
  loadSource?: boolean;
};

function ImageTileView({
  source,
  placeholder = source,
  onLoad,
  onSourceLoad,
  visible,
  alt,
  unloadBlur = true,
  loadSource = true,
}: Props) {
  const [sourceLoaded, setSourceLoaded] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    !sourceLoaded && checkImage(placeholder);
    !visible && setSourceLoaded(false);
    visible &&
      loadSource &&
      checkImage(source).then(() => {
        setSourceLoaded(true);
        onSourceLoad();
      });
  }, [visible, loadSource]);

  return visible ? (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        borderRadius: "5px",
      }}
    >
      <img
        src={sourceLoaded ? source : placeholder}
        alt={alt}
        onLoad={(e) => {
          setImageLoaded(true);
          onLoad(e);
        }}
        loading={"lazy"}
        style={{
          display: "block",
          width: "100%",
          borderRadius: "5px",
          filter: !sourceLoaded && unloadBlur ? "blur(5px)" : "blur(0)",
          // transition: "filter 0.3s ease",
        }}
      />
      {!sourceLoaded && loadSource && (
        <Skeleton
          variant="rectangular"
          width="100%"
          height="100%"
          animation="pulse"
          style={{
            position: "absolute",
            inset: 1,
            borderRadius: "5px",
          }}
        />
      )}
    </div>
  ) : (
    <Skeleton
      variant="rectangular"
      width="100%"
      height="100%"
      animation="pulse"
    />
  );
}

const checkImage = (path: string) =>
  new Promise((resolve: (path: string) => void, reject) => {
    const img = new Image();
    img.onload = () => resolve(path);
    img.onerror = () => reject();

    img.src = path;
  });

export default ImageTileView;
