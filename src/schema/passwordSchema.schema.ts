import * as z from "zod";

export const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/

export const changePasswordSchema = z.object({
  password: z.string(),
  newPassword: z
    .string()
    .regex(passwordRegex, "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character"),
  confirmPassword: z.string().nonempty("Please confirm your password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
})

export type changePasswordSchemaType = z.infer<typeof changePasswordSchema>