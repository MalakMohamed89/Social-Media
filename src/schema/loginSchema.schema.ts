import * as z from "zod";
 
export const loginSchema=z.object({
  email:z.string().trim().nonempty("Email is required").regex( /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, "Please enter a valid email address"),
  password:z.string().regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character").nonempty("Password is required"),
})

export type loginSchemaType=z.infer<typeof loginSchema>; 