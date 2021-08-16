const userRouter = require('express').Router();
const {
  getUsers,
  getOwner,
  getUserById,
  updateUser,
  updateUserAvatar,
} = require('../controllers/user');
const {
  validateId,
  validateUpdateUser,
  validateUserAvatar,
} = require('../middlewares/validation');

userRouter.get('/', getUsers);
userRouter.get('/me', getOwner);
userRouter.get('/:_id', validateId, getUserById);
userRouter.patch('/me', validateUpdateUser, updateUser);
userRouter.patch('/me/avatar', validateUserAvatar, updateUserAvatar);

module.exports = userRouter;
