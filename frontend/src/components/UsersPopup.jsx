import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';







const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function UsersModal({ open, setOpen, users }) {
  console.log("Users are");
  console.log("Users are");
  console.log(users);



  const handleClose = () => setOpen(false);

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Users
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            {users?.map((user) => {
              return (
                <>
                <div style={{display : "flex", alignItems : "center"}}>
                <img
                    style={{
                      width: "50px",
                      height: "50px",
                      objectFit: "cover",
                      borderRadius: "20px"
                    }}
                    src={user?.avatarUrl ? user?.avatarUrl : "data:image/png;base64,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"}
                    alt="Profile Image"
                  /> &nbsp; &nbsp; <span>{user?.name}</span>
                </div>


                </>
                
              )
            })}
          </Typography>
        </Box>
       
      </Modal>
    </div>
  );
}



