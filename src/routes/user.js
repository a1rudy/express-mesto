const userRouter = require('express').Router();
const {
  getUsers, getUserById, createUser, updateUser, updateUserAvatar,
} = require('../controllers/user');

userRouter.get('/', getUsers);
userRouter.get('/:userId', getUserById);
userRouter.post('/', createUser);
userRouter.patch('/me', updateUser);
userRouter.patch('/me/avatar', updateUserAvatar);

module.exports = userRouter;
