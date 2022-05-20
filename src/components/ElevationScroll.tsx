import React from "react";
import useScrollTrigger from "@mui/material/useScrollTrigger";

interface Props {
  threshhold?: number;
  elevation?: number
  children: React.ReactElement;
}

function ElevationScroll(props: Props) {
  const { threshhold = 0, elevation = 4, children } = props;
  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: threshhold,
  });

  return React.cloneElement(children, {
    elevation: trigger ? elevation : 0,
  });
}

export default ElevationScroll;
