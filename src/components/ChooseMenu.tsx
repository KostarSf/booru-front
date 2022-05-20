import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import React from 'react'
import { SortItem } from '../API/Types';

type Props = {
  icon: React.ReactNode;
  menuId: string;
  value: SortItem[];
  selectedIndex: number;
  onSelect: (item: SortItem, index: number) => void;
};

const ChooseMenu = ({
  value,
  selectedIndex,
  onSelect,
  menuId,
  icon,
}: Props) => {
  const [menuAnchor, setMenuAnchor] =
    React.useState<null | HTMLElement>(null);
  const menuOpen = Boolean(menuAnchor);
  const handleClickButton = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuItemClick = (
    event: React.MouseEvent<HTMLElement>,
    index: number
  ) => {
    onSelect(value[index], index);
    setMenuAnchor(null);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  return (
    <>
      <Button fullWidth
        id={`${menuId}-button`}
        variant="text"
        startIcon={icon}
        onClick={handleClickButton}
        sx={{ px: 2 }}
      >
        {value[selectedIndex].title}
      </Button>
      <Menu
        id={`${menuId}-menu`}
        anchorEl={menuAnchor}
        open={menuOpen}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            overflow: "visible",
            // filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.1))",
            mt: 1.5,
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        MenuListProps={{
          "aria-labelledby": `${menuId}-button`,
          role: "listbox",
        }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        {value.map((option, index) => (
          <MenuItem
            key={option.value}
            selected={index === selectedIndex}
            onClick={(event) => handleMenuItemClick(event, index)}
          >
            {"Sort by " + option.title}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default ChooseMenu
