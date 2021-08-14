const userRouter = require('express').Router();
const {
  getUsers, getOwner, getUserById, updateUser, updateUserAvatar,
} = require('../controllers/user');

userRouter.get('/', getUsers);
userRouter.get('/me', getOwner);
userRouter.get('/:userId', getUserById);
userRouter.patch('/me', updateUser);
userRouter.patch('/me/avatar', updateUserAvatar);

module.exports = userRouter;
