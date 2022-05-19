import React, { useEffect, useRef, useState } from "react";
import { Chip, Paper, Typography, Box } from "@mui/material";
import ThumbUpRoundedIcon from "@mui/icons-material/ThumbUpRounded";
import ThumbDownRoundedIcon from "@mui/icons-material/ThumbDownRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import ForumRoundedIcon from "@mui/icons-material/ForumRounded";
import { ImageDto, ImageRepresentations } from "../API/Types";
import useOnScreen from "../hooks/useOnScreen";
import ImageTileView from "./ImageTileView";
import { green, pink } from "@mui/material/colors";

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
  )

  return (
    <Paper elevation={0}>
      {viewCard}
      {/* <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography
          variant="button"
          color="warning.light"
          mx={1}
          noWrap
        >
          <StarRoundedIcon sx={{ fontSize: 16 }} />
          {image.faves}
        </Typography>
        <Typography
          variant="button"
          mx={1}
          noWrap
        >
          <ThumbUpRoundedIcon sx={{ fontSize: 16, color: green[500] }} />
          {image.score}
          <ThumbDownRoundedIcon sx={{ fontSize: 16, color: pink[500] }} />
        </Typography>
        <Typography
          variant="button"
          color="secondary.light"
          mx={1}
          noWrap
        >
          <ForumRoundedIcon sx={{ fontSize: 16 }} />
          {image.comment_count}
        </Typography>
      </Box> */}
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
