const User = require('../models/users');

const UserClass = {
  findByUsername: async (username) => {
    const user = await User.findOne({ username });
    if (!user) {
      return false;
    }
    return user;
  },
};

module.exports = UserClass;
