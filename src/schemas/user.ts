import { z } from "zod";

export const userUpdateSchema = z.object({
  username: z.string().min(3).max(50).optional(),
  address: z.string().optional(),
  postalCode: z.string().optional(),
  profilePic: z.string().url().optional().or(z.literal("")),
});