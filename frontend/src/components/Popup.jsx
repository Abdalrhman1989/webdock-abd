import React, { useState } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import "/./src/styles/Popup.scss";
import axios from "axios";

export default function BasicModal({
  id,
  title: initialTitle,
  description: initialDescription,
  status: initialStatus,
}) {

  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [status, setStatus] = useState(initialStatus);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const postData = { id, title, description, status };
    console.log(postData);
 
    try {
      await axios.put(`http://localhost:3306/post/${id}`, postData);
      alert("Post updated successfully");
      location.reload();
    } catch (error) {
      alert("An error occurred");
    }
  };

  const handleDelete = async (event) => {
    event.preventDefault();

    try {
      await axios.delete(`http://localhost:3306/post/${id}`);
      alert("Post deleted successfully");
      window.location.replace(window.location.origin);
    } catch (error) {
      alert("An error occurred");
    }
  };
  

  return (
    <div>
      <button className="edit-button" onClick={handleOpen}>
        Edit post
      </button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box>
          <form onSubmit={handleSubmit} id="edit-form">
            <h2>Edit Post</h2>
            <label htmlFor="title">Title:</label>
            <input
              name="title"
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <label htmlFor="desccription">Description:</label>
            <input
              name="description"
              id="description"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <label htmlFor="status">Status:</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              id="status"
              name="status"
            >
              <option value="Under Review">Under Review</option>
              <option value="Planned">Planned</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Closed">Closed</option>
            </select>

            <input
              id="submit"
              name="submit"
              type="submit"
              value="Confirm Changes"
            />
            <button id="deleteBtn" type="button" onClick={handleDelete}>
              Delete this post
            </button>
          </form>
        </Box>
      </Modal>
    </div>
  );
}
