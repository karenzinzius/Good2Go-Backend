import { z } from "zod/v4";
import { isValidObjectId, Types } from "mongoose";

const dbEntrySchema = z.strictObject({
  _id: z.instanceof(Types.ObjectId),
  createdAt: z.date(),
  updatedAt: z.date(),
  __v: z.int().nonnegative(),
});

export const userParamSchema = z.object({
  id: z
    .string()
    .refine((val) => isValidObjectId(val), "Invalid user ID format!"),
});

export const userInputSchema = z.strictObject({
  firstName: z
    .string()
    .min(1, "First Name can't be empty")
    .max(100, "First Name cant be longer that 100 characters!"),
  lastName: z
    .string()
    .min(1, "Last Name can't be empty")
    .max(100, "Last Name can't be longer that 100 characters!"),
  email: z.string().email("Invalid email format!"),
});

export const userSchema = z.object({
  ...dbEntrySchema.shape,
  ...userInputSchema.shape,
});
// Data transfer objects
export type UserParamDTO = z.infer<typeof userParamSchema>;
export type UserInputDTO = z.infer<typeof userInputSchema>;
export type UserDTO = z.infer<typeof userSchema>;
