import { Router } from 'express';
import {  register, login, logout, me, updateProfile, refresh } from '#controllers';
import { authenticate } from '#middlewares';

const authRouter = Router();

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/refresh', refresh);
authRouter.get('/me', me);
authRouter.put('/profile', authenticate, updateProfile);
authRouter.delete('/logout', logout);

export default authRouter;