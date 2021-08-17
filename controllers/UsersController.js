const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../database/services/users');

function generateToken(user) { return jwt.sign(user.toJSON(), process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1w' }); }

const UsersController = {
  // login user
  login: async (req, res) => {
    try {
      if (!req.body.username || !req.body.password) {
        return res.status(400).send({
          success: false,
          message: 'username or password can not be empty',
        });
      }

      const findUser = await User.findByUsername(req.body.username);
      if (!findUser) {
        return res.status(400).send({
          success: false,
          message: 'Incorrect username or password',
        });
      }

      const confirmPassword = await bcrypt.compare(req.body.password, findUser.password);
      if (!confirmPassword) {
        return res.status(400).send({
          success: false,
          message: 'Incorrect username or password',
        });
      }

      const userDetails = {
        // eslint-disable-next-line no-underscore-dangle
        id: findUser._id,
        username: findUser.username,
      };

      const accessToken = generateToken(findUser);
      return res.status(200).send({
        accessToken,
        success: true,
        data: userDetails,
      });
    } catch (err) {
      return res.status(500).send({
        success: false,
        message: 'login failed.',
      });
    }
  },
};

module.exports = UsersController;
