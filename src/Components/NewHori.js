import { Box, IconButton, Menu, MenuItem, Typography } from "@material-ui/core";
import { MoreVert } from "@material-ui/icons";
import React from "react";
import ProductView from "./ProductView";

const NewHori = (props) => {
  ////Menu Edit & Delete

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  ////Menu Edit & Delete
  return (
    <>
      <div style={{ position: "absolute", right: 0 }}>
        <IconButton
          aria-label="more"
          aria-controls="long-menu"
          aria-haspopup="true"
          onClick={handleClick}
        >
          <MoreVert />
        </IconButton>
        <Menu
          id="long-menu"
          anchorEl={anchorEl}
          keepMounted
          open={open}
          onClose={handleClose}
          PaperProps={{
            style: {
              width: "20ch",
            },
          }}
        >
          <MenuItem
            onClick={() => {
              props.edit();
              handleClose();
            }}
          >
            Edit
          </MenuItem>

          <MenuItem
            onClick={() => {
              props.delete();
              handleClose();
            }}
          >
            Delete
          </MenuItem>
        </Menu>
      </div>
      <Box style={{ background: props.background }} p="16px">
        <Typography variant="h5">{props.horititle}</Typography>
        <Typography variant="subtitle2">{props.horisubbtitle}</Typography>

        <Box display="flex" overflow="auto">
          {props.products.map((item, index) => (
            <ProductView item={item} />
          ))}
        </Box>
      </Box>
    </>
  );
};

export default NewHori;
