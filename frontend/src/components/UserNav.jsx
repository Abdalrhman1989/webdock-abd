import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { decodeToken } from "react-jwt";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import SearchResults from "./SearchResults";
import axios from "axios";
import { IoMdNotificationsOutline } from "react-icons/io";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import Badge from "@mui/material/Badge";

const UserNav = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [anchorElNotifications, setAnchorElNotifications] =
    React.useState(null);
  const [notifications, setNotifications] = React.useState([]);
  const [newNotificationsCount, setNewNotificationsCount] = React.useState(0);

  const getNotifications = async () => {
    let response = await axios.get(
      `http://localhost:3306/user-notifications/${localStorage.getItem(
        "loggedInUserId"
      )}`
    );
    setNotifications(response?.data ? response?.data : []);
  };

  const handleOpenNotificationsMenu = (event) => {
    getNotifications();
    setAnchorElNotifications(event.currentTarget);
    setNewNotificationsCount(0);
  };



  const handleCloseNotificationsMenu = () => {
    setAnchorElNotifications(null);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSearch = async (event) => {
    event.preventDefault();
    console.log("Search Query:", searchQuery);

    try {
      const response = await fetch(
        `http://localhost:3306/post/search?query=${searchQuery}`
      );
      if (!response.ok) {
        throw new Error(`Request failed with status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Response data:", data);
      setSearchResults(data.searchResults);
      openModal();
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  useEffect(() => {
    if (
      localStorage.getItem("ssoToken") === null ||
      localStorage.getItem("ssoToken") === undefined
    ) {
      const params = new URLSearchParams(window.location.search);
      const jwt = params.get("ssoToken");
      const decodedToken = decodeToken(jwt);

      localStorage.setItem("ssoToken", jwt);
      localStorage.setItem("avatar", decodedToken.avatarURL);
      localStorage.setItem("user", decodedToken.name);
      localStorage.setItem("email", decodedToken.email);
      localStorage.setItem("id", decodedToken.id);
    }


  }, []);

  const getNewNotificationsCount = async () => {
    let response = await axios.get(
      `http://localhost:3306/user-new-notifications-count/${localStorage.getItem(
        "loggedInUserId"
      )}`
    );
    setNewNotificationsCount(response?.data ? response?.data : 0);
  };

  useEffect(() => {
    getNewNotificationsCount();
  }, []);

  return (
    <nav>
      <Link to="/">
        <img src="/src/assets/webdock-logo-positiv 3.png." alt="" />
      </Link>
      <div className="search-form">
        <form onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search posts..."
            id="search"
            name="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>
      </div>
      <Dialog open={isModalOpen} onClose={closeModal}>
        <DialogTitle>Search Results</DialogTitle>
        <DialogContent>
          {searchResults.length > 0 ? (
            <SearchResults searchResults={searchResults} />
          ) : (
            <DialogContentText>No results found.</DialogContentText>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeModal}>Close</Button>
        </DialogActions>
      </Dialog>
      <div className="buttons">
        <button>
          <a href="/./settings">Settings</a>
        </button>
        <button
          onClick={() => {
            localStorage.removeItem("ssoToken");
            localStorage.removeItem("user");
            localStorage.removeItem("id");
            localStorage.removeItem("avatar");
            localStorage.removeItem("email");
            localStorage.removeItem("loggedInUserId");
            sessionStorage.clear();
          }}
        >
          <a href="http://localhost:5173/">Log Out</a>
        </button>
        {/* <Box sx={{ flexGrow: 0 }}> */}
        <Tooltip title={"Open Notifications"}>
          <IconButton onClick={handleOpenNotificationsMenu} sx={{ pt: 1 }}>
            <Badge
              badgeContent={
                newNotificationsCount > 0 ? newNotificationsCount : null
              }
              color="error"
            >
              <IoMdNotificationsOutline />
            </Badge>
          </IconButton>
        </Tooltip>
        <Menu
          sx={{ mt: "35px" }}
          id="menu-appbar"
          anchorEl={anchorElNotifications}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          keepMounted
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          open={Boolean(anchorElNotifications)}
          onClose={handleCloseNotificationsMenu}
        >
          {notifications.map((notification) => (
            <MenuItem
              key={notification.id}
              onClick={handleCloseNotificationsMenu}
            >
              <Typography textAlign="center">
                {notification.description}
              </Typography>
            </MenuItem>
          ))}
        </Menu>
        {/* </Box> */}
      </div>
    </nav>
  );
};

export default UserNav;
