import { Router } from 'express';
import { getUserProfile, toggleFavourite } from '#controllers';
import { authenticate, validateBody } from '#middlewares';
import { toggleFavSchema } from '#schemas'

const userRouter = Router();

// Get a public profile by ID
userRouter.get('/:id', authenticate, getUserProfile);

// Toggle a post in favourites
userRouter.post('/favourite', authenticate, validateBody(toggleFavSchema), toggleFavourite);

export default userRouter;