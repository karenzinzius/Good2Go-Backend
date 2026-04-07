import { Router } from 'express';
import { getUserProfile, toggleFavourite } from '#controllers';
import { authenticate } from '#middlewares';

const userRouter = Router();

// Get a public profile by ID
userRouter.get('/:id', authenticate, getUserProfile);

// Toggle a post in favourites
userRouter.post('/favourite', authenticate, toggleFavourite);

export default userRouter;