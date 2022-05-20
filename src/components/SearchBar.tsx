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
import { SortTypes, OrderTypes, getSortTypeIndex, getOrderTypeIndex, SortItem } from "../API/Types";
import ChooseMenu from "./ChooseMenu";
import Menu from "@mui/material/Menu";
import HideOnScroll from "./HideOnScroll";
import ElevationScroll from "./ElevationScroll";
import { Box } from "@mui/material";
import { useSearchParams } from "react-router-dom";
import { createSearchParams, getSearchParams, SearchData } from "../API/Search";

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
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  paddingRight: theme.spacing(1),
  "& .MuiInputBase-input": {
    padding: theme.spacing(0.5, 1),
    width: "100%",
  },
}));

type Props = {
  value: SearchData;
  onChange: (value: SearchData) => void;
  onSubmit: () => void;
};

const SearchBar = (props: Props) => {
  const {value, onChange, onSubmit} = props;

  const selectedSortIndex = getSortTypeIndex(value.sort);
  const selectedOrderIndex = getOrderTypeIndex(value.order);

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

  const handleSearch = () => {
    onSubmit();
  }

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
          onSelect={(item) =>
            onChange({
              ...value,
              sort: item.value,
            })
          }
        />
      </Item>
      <Item elevation={isMobileScreen ? 2 : 0}>
        <ChooseMenu
          icon={<FilterListOutlinedIcon />}
          menuId="order-filter"
          value={OrderTypes}
          selectedIndex={selectedOrderIndex}
          onSelect={(item) =>
            onChange({
              ...value,
              order: item.value,
            })
          }
        />
      </Item>
    </Stack>
  );

  return (
    <HideOnScroll canHide={isMobileScreen}>
      <Box position="sticky" top={-1} zIndex={1099}>
        <ElevationScroll useShadow>
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={1}
            p={1}
            sx={{
              backgroundColor: "white",
            }}
          >
            <Item
              elevation={0}
              sx={{ flexGrow: 1, backgroundColor: "transparent" }}
            >
              <Stack direction="row" spacing={1} flexGrow={1} height="100%">
                <Item sx={{ flexGrow: 1 }} elevation={0}>
                  <IconButton onClick={handleSearch}>
                    <SearchIcon />
                  </IconButton>
                  <Search>
                    <StyledInputBase
                      // type='search'
                      placeholder="Search…"
                      inputProps={{ "aria-label": "search" }}
                      value={value.query}
                      onChange={(e) => onChange({
                        ...value,
                        query: e.target.value
                      })}
                      onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    />
                  </Search>
                </Item>
                <Item
                  sx={{ display: { xs: "flex", md: "none" } }}
                  elevation={0}
                >
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
