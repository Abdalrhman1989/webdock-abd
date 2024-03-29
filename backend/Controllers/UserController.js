const { User } = require("../models");

const userController = {
  getAllUsers: async (req, res) => {
    try {
      const users = await User.findAll();
      res.json(users);
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  },

  getUserById: async (req, res) => {
    try {
      const user = await User.findByPk(req.params.id);
      if (!user) {
        return res.status(404).send("User not found");
      }
      res.json(user);
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  },

  createUser: async (req, res) => {
    try {
    
      let user = await User.findOne({
        where: {
          email: req.body.email,
        },
      });
      if (user) {
        await user.update({
          role: req.body.role,
          name: req.body.name,
          avatarUrl: req.body.avatarUrl,
          ssoToken: req.body.ssoToken,
        });
      } else {
        user = await User.upsert({
          role: req.body.role,
          name: req.body.name,
          email: req.body.email,
          avatarUrl: req.body.avatarUrl,
          ssoToken: req.body.ssoToken,
        });
      }
     

      res.status(201).send({message : "User created successfully", id : user.id});
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  },
  loginUserWithSSO: async (req, res) => {
    try {
      // Extract the SSO token from the request body
      const ssoToken = req.body.ssoToken;

      // Validate the token (Verify it against the SSO provider's public key)
      const decodedToken = jwt.verify(ssoToken, process.env.PRIVATE_KEY);

      // Store the SSO token in the user's record
      const user = await User.findOne({ where: { email: req.body.email } });
      if (user) {
        user.ssoToken = ssoToken;
        await user.save();

        // Set the redirect URL to http://localhost:5173/
        const redirectUrl = "http://localhost:5173/";

        // Redirect the user back to our solution
        res.redirect(redirectUrl);

        console.log(process.env.PRIVATE_KEY);
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  },

  updateProfileImage: async (req, res) => {
    try {
      const user = await User.findByPk(req.userId);

      if (!user) {
        return res.status(404).send("User not found");
      }

      // Assuming you have a column named 'avatarUrl' in your User model
      user.avatarUrl = `/uploads/${req.file.filename}`;
      await user.save();

      res.status(200).send("User image updated successfully");
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  },
  updateUser: async (req, res) => {
    try {
      const user = await User.findByPk(req.params.id);

      if (!user) {
        return res.status(404).send("User not found");
      } else {
        await user.update({
          role: req.body.role,
        });
        return res.status(200).send("User updated successfully");
      }
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  },
};

module.exports = userController;
