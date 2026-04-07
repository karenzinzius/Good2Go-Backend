import { Router } from 'express';
import {  register, login, logout, me, toggleFavourite, updateProfile } from '#controllers';
import { authenticate } from '#middlewares';

const authRouter = Router();

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.delete('/logout', logout);
authRouter.get('/me', me);
authRouter.post("/favourite", authenticate, toggleFavourite);
authRouter.put('/profile', authenticate, updateProfile);

export default authRouter;