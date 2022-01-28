import { Box, IconButton, Menu, MenuItem, Typography } from "@material-ui/core";
import { MoreVert } from "@material-ui/icons";
import React from "react";
import ProductView from "./ProductView";

const WordLay = (props) => {
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
      <Box style={{ whiteSpace: "nowrap" }} p="16px">
        <div>
          <img
            style={{
              height: "50px",
              width: "50px",
              display: "inline",
              objectFit: "scale-down",
            }}
            src={props.image}
          />
          <Typography style={{ display: "inline", margin: 10 }} variant="h5">
            {props.word}
          </Typography>
        </div>
      </Box>
    </>
  );
};

export default WordLay;
