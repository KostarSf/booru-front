import * as React from "react";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import { alpha, styled } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import TuneIcon from "@mui/icons-material/Tune";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import FilterListOutlinedIcon from "@mui/icons-material/FilterListOutlined";
import { SortTypes, OrderTypes } from "../API/Types";
import ChooseMenu from "./ChooseMenu";
import Menu from "@mui/material/Menu";
import HideOnScroll from "./HideOnScroll";
import ElevationScroll from "./ElevationScroll";
import { Box } from "@mui/material";

type Props = {};

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  padding: theme.spacing(0),
  textAlign: "center",
  color: theme.palette.text.secondary,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}));

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("md")]: {
    marginLeft: theme.spacing(1),
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  paddingRight: theme.spacing(0.7),
  "& .MuiInputBase-input": {
    padding: theme.spacing(0.5, 1),
    // vertical padding + font size from searchIcon
    marginLeft: `calc(1em + ${theme.spacing(4)})`,
    width: "100%",
    // backgroundColor: "#eee",
    // borderRadius: theme.shape.borderRadius
  },
}));

const SearchBar = (props: Props) => {
  const [selectedSortIndex, setSelectedSortIndex] = React.useState(0);
  const [selectedOrderIndex, setSelectedOrderIndex] = React.useState(0);

  const [anchorFilterMenu, setAnchorFilterMenu] =
    React.useState<null | HTMLElement>(null);
  const openFilterMenu = Boolean(anchorFilterMenu);
  const handleFilterButtonClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorFilterMenu(event.currentTarget);
  };
  const handleFilterMenuClose = () => {
    setAnchorFilterMenu(null);
  };

  const theme = useTheme();
  const isMobileScreen = useMediaQuery(theme.breakpoints.down("md"));

  React.useEffect(() => {
    if (!isMobileScreen) {
      handleFilterMenuClose();
    }
  }, [isMobileScreen]);

  const filterSwitchers = (
    <Stack spacing={1} direction={{ xs: "column", sm: "row" }}>
      <Item elevation={isMobileScreen ? 2 : 0}>
        <ChooseMenu
          icon={<FilterAltOutlinedIcon />}
          menuId="sort-filter"
          value={SortTypes}
          selectedIndex={selectedSortIndex}
          onSelect={(item, index) => setSelectedSortIndex(index)}
        />
      </Item>
      <Item elevation={isMobileScreen ? 2 : 0}>
        <ChooseMenu
          icon={<FilterListOutlinedIcon />}
          menuId="order-filter"
          value={OrderTypes}
          selectedIndex={selectedOrderIndex}
          onSelect={(item, index) => setSelectedOrderIndex(index)}
        />
      </Item>
    </Stack>
  );

  return (
    <HideOnScroll canHide={isMobileScreen}>
      <Box position="sticky" top={-1} zIndex={1099}>
        <ElevationScroll canElevate={!isMobileScreen} useShadow>
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={1}
            p={1}
            sx={{
              backgroundColor: { xs: "transparent", md: "white" },
            }}
          >
            <Item
              elevation={0}
              sx={{ flexGrow: 1, backgroundColor: "transparent" }}
            >
              <Stack direction="row" spacing={1} flexGrow={1} height="100%">
                <ElevationScroll elevation={2} canElevate={isMobileScreen}>
                  <Item sx={{ flexGrow: 1 }}>
                    <Search>
                      <SearchIconWrapper>
                        <SearchIcon />
                      </SearchIconWrapper>
                      <StyledInputBase
                        placeholder="Search…"
                        inputProps={{ "aria-label": "search" }}
                      />
                    </Search>
                  </Item>
                </ElevationScroll>
                <ElevationScroll elevation={2}>
                  <Item sx={{ display: { xs: "flex", md: "none" } }}>
                    <IconButton
                      aria-label="search filters"
                      id="mobile-filter-button"
                      onClick={handleFilterButtonClick}
                    >
                      <TuneIcon
                        color={openFilterMenu ? "primary" : "inherit"}
                        sx={{
                          transform: "rotate(-90deg)",
                        }}
                      />
                    </IconButton>
                    <Menu
                      id="mobile-filter-menu"
                      aria-labelledby="mobile-filter-button"
                      anchorEl={anchorFilterMenu}
                      open={openFilterMenu}
                      onClose={handleFilterMenuClose}
                      anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "right",
                      }}
                      transformOrigin={{
                        vertical: "top",
                        horizontal: "right",
                      }}
                      PaperProps={{
                        sx: {
                          mt: 1,
                          boxShadow: "none",
                          backgroundColor: "transparent",
                        },
                      }}
                    >
                      {filterSwitchers}
                    </Menu>
                  </Item>
                </ElevationScroll>
              </Stack>
            </Item>
            <Item
              elevation={0}
              sx={{
                justifyContent: "flex-end",
                display: { xs: "none", md: "flex" },
                backgroundColor: "transparent",
              }}
            >
              {filterSwitchers}
            </Item>
          </Stack>
        </ElevationScroll>
      </Box>
    </HideOnScroll>
  );
};

export default SearchBar;
