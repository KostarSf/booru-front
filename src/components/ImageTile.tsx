import React, { useEffect, useRef, useState } from "react";
import { Chip, Paper, Typography, Box } from "@mui/material";
import { ImageDto, ImageRepresentations } from "../API/Types";
import useOnScreen from "../hooks/useOnScreen";
import ImageTileView from "./ImageTileView";

type ImageProps = {
  image: ImageDto
}

const ImageTile: React.FC<ImageProps> = ({image}) => {
  const [contentHeight, setContentHeight] = useState(0);
  const divRef = useRef<HTMLDivElement>(null);
  const isVisible = useOnScreen(divRef);
  const [loaded, setLoaded] = useState(false);
  const [canShowTileView, setCanShowTileView] = useState(false);
  const [hqThumbLoaded, setHqThumbLoaded] = useState(false);

  const [spoilered, setSpoilered] = useState(image.spoilered);

  const cuttedRatio = image.aspect_ratio < 0.4 ? 0.4 : image.aspect_ratio;
  const imageCutted = cuttedRatio !== image.aspect_ratio;
  const showRatio = false;

  const handleResizeTiles = () => {
    const height =
      (divRef.current ? divRef.current.offsetWidth : 0) / cuttedRatio;
    setContentHeight(height);
  }

  useEffect(() => {
    handleResizeTiles();
  }, [hqThumbLoaded]);

  useEffect(() => {
    setTimeout(() => {
      setCanShowTileView(true);
    }, 10);
    window.addEventListener("resize", handleResizeTiles);
    return () => window.removeEventListener("resize", handleResizeTiles);
  }, []);

  const isVideo = image.format === "webm";
  const representations = isVideo ? vidToGif(image.representations) : image.representations;

  const handleOnLoad = () => {
    setLoaded(true);
  }

  const viewCard = (
    <div
      onClick={() => console.log(image)}
      ref={divRef}
      style={{
        height: contentHeight + "px",
        borderRadius: "5px",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {canShowTileView && (
        <ImageTileView
          source={representations.thumb}
          placeholder={representations.thumb_tiny}
          alt={image.name}
          onLoad={handleOnLoad}
          visible={isVisible}
          onSourceLoad={() => setHqThumbLoaded(true)}
          unloadBlur={!spoilered}
          loadSource={!spoilered}
        />
      )}
      {imageCutted && image.aspect_ratio <= 0.35 && (
        <Box
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "5px",
            pointerEvents: "none",
            background:
              "linear-gradient(0deg, rgba(255,255,255,1) 5%, rgba(255,255,255,0) 50%, rgba(255,255,255,0) 100%)",
          }}
        />
      )}
      {showRatio && (
        <Chip
          label={
            imageCutted
              ? `${cuttedRatio.toFixed(2)} (${image.aspect_ratio.toFixed(2)})`
              : `${cuttedRatio.toFixed(2)}`
          }
          size="small"
          style={{
            position: "absolute",
            top: "0",
            left: "0",
            color: "white",
            backgroundColor: "#0006",
            borderRadius: "5px",
            margin: "5px",
          }}
        />
      )}
      {image.format === "webm" && (
        <Chip
          label="WEBM"
          size="small"
          style={{
            position: "absolute",
            bottom: "0",
            right: "0",
            color: "white",
            backgroundColor: "#0006",
            borderRadius: "5px",
            margin: "5px",
          }}
        />
      )}
    </div>
  );

  return (
    <Paper elevation={0} sx={{ position: "relative" }}>
      {viewCard}
      {spoilered && (
        <Box
          onClick={() => setSpoilered(false)}
          sx={{
            position: "absolute",
            inset: 0,
            backgroundColor: "#fffa",
            backdropFilter: "blur(35px)",
            borderRadius: "5px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            userSelect: "none",
          }}
        >
          <Typography variant="overline" fontSize={26} component="div">
            HIDDEN
          </Typography>
        </Box>
      )}
    </Paper>
  );
}

const vidToGif = (representations: ImageRepresentations) => {
  const newRepresentations = {...representations};
  let k: keyof typeof newRepresentations;
  for (k in newRepresentations) {
    newRepresentations[k] = newRepresentations[k].replace('.webm', '.gif');
  }
  return newRepresentations;
}

export default ImageTile;
