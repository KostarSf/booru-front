import React from "react";
import useScrollTrigger from "@mui/material/useScrollTrigger";

interface Props {
  threshhold?: number;
  elevation?: number;
  canElevate?: boolean;
  useShadow?: boolean;
  children: React.ReactElement;
}

function ElevationScroll(props: Props) {
  const {
    threshhold = 0,
    elevation = 4,
    children,
    canElevate = true,
    useShadow = false,
  } = props;

  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: threshhold,
  });

  if (useShadow) {
    return React.cloneElement(children, {
      style: {
        filter:
          canElevate && trigger
            ? "drop-shadow(0px 4px 8px rgba(0,0,0,0.2))"
            : "drop-shadow(0px 0px 0px rgba(0,0,0,0.0))",
        transition: "filter 0.3s ease",
      },
    });
  }

  return React.cloneElement(children, {
    elevation: canElevate && trigger ? elevation : 0,
  });
}

export default ElevationScroll;
