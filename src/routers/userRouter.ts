import { Router } from "express"
import { getAllUsers, createUser, getUserById, updateUser, deleteUser } from "#controllers";
import { validateBody } from "#middlewares";
import { userInputSchema } from "#schemas"

const userRouter = Router();

userRouter.route("/").get(getAllUsers).post(validateBody(userInputSchema), createUser);

userRouter.route("/:id").get(getUserById).put(validateBody(userInputSchema), updateUser).delete(deleteUser);

export default userRouter
